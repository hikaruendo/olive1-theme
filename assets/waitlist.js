if (!customElements.get('ol1-waitlist')) {
  class Ol1Waitlist extends HTMLElement {
    constructor() {
      super();

      this.onSubmit = this.onSubmit.bind(this);
      this.onReasonChange = this.onReasonChange.bind(this);
      this.onEmailInput = this.onEmailInput.bind(this);
      this.onFormFocus = this.onFormFocus.bind(this);
    }

    connectedCallback() {
      this.setupElements();
      this.syncReasonMetadata();
    }

    setupElements() {
      this.form = this.querySelector('form');
      this.formPanel = this.querySelector('[data-waitlist-form-panel]');
      this.statusMessage = this.querySelector('[data-waitlist-status-message]');
      this.submitButton = this.querySelector('[data-waitlist-submit]');
      this.tagsInput = this.querySelector('[data-waitlist-tags-input]');
      this.reasonNoteInput = this.querySelector('[data-waitlist-reason-note-input]');
      this.reasonInputs = Array.from(this.querySelectorAll('input[name="waitlist_reason"]'));
      this.emailInput = this.querySelector('input[name="contact[email]"]');

      if (!this.form || this.dataset.bound === 'true') return;

      this.form.addEventListener('submit', this.onSubmit);
      this.form.addEventListener('focusin', this.onFormFocus);
      this.reasonInputs.forEach((input) => input.addEventListener('change', this.onReasonChange));
      this.emailInput?.addEventListener('input', this.onEmailInput);
      this.dataset.bound = 'true';
    }

    disconnectedCallback() {
      if (!this.form) return;

      this.form.removeEventListener('submit', this.onSubmit);
      this.form.removeEventListener('focusin', this.onFormFocus);
      this.reasonInputs?.forEach((input) => input.removeEventListener('change', this.onReasonChange));
      this.emailInput?.removeEventListener('input', this.onEmailInput);
      this.dataset.bound = 'false';
    }

    onFormFocus() {
      if (!this.form) return;

      this.form.removeEventListener('focusin', this.onFormFocus);
      void this.ensureCaptchaReady().catch(() => {});
    }

    onReasonChange() {
      this.syncReasonMetadata();
      this.clearStatus();
    }

    onEmailInput() {
      this.clearStatus();
    }

    syncReasonMetadata() {
      if (!this.tagsInput || !this.reasonNoteInput) return;

      const selectedReason = this.reasonInputs.find((input) => input.checked);
      const tagValue = selectedReason?.dataset.tagValue;
      const reasonValue = selectedReason?.value || '';

      this.tagsInput.value = tagValue ? `waitlist,${tagValue}` : 'waitlist';
      this.reasonNoteInput.value = reasonValue;
    }

    validate() {
      if (!this.emailInput?.value.trim()) {
        this.showStatus('error', this.dataset.emailRequiredMessage);
        this.emailInput?.focus();
        return false;
      }

      if (!this.emailInput.checkValidity()) {
        this.showStatus('error', this.dataset.emailInvalidMessage);
        this.emailInput.focus();
        return false;
      }

      if (!this.reasonInputs.some((input) => input.checked)) {
        this.showStatus('error', this.dataset.reasonRequiredMessage);
        this.reasonInputs[0]?.focus();
        return false;
      }

      return true;
    }

    async onSubmit(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (!this.form || this.isSubmitting) return;

      this.syncReasonMetadata();

      if (!this.validate()) return;

      if (this.isKnownDuplicate()) {
        this.showStatus('duplicate', this.dataset.duplicateMessage);
        if (this.formPanel) this.formPanel.hidden = true;
        return;
      }

      this.isSubmitting = true;
      this.setLoadingState(true);

      try {
        const captchaToken = await this.requestCaptchaToken();
        const response = await this.submitForm(captchaToken);
        const parsedResponse = this.parseResponse(response.html);

        if (!parsedResponse.state && !response.ok) {
          throw new Error(`Waitlist request failed with status ${response.status}`);
        }

        const nextState = parsedResponse.state || 'error';
        const nextMessage = parsedResponse.message || this.dataset.networkErrorMessage;

        this.showStatus(nextState, nextMessage);

        if (nextState === 'success' || nextState === 'duplicate') {
          if (this.formPanel) this.formPanel.hidden = true;

          if (nextState === 'success') {
            this.rememberSubmittedEmail();
            this.form.reset();
            this.syncReasonMetadata();
          }
        } else if (this.formPanel) {
          this.formPanel.hidden = false;
        }
      } catch (error) {
        console.error('Waitlist submission failed', error);
        this.showStatus('error', this.dataset.captchaErrorMessage || this.dataset.networkErrorMessage);
        if (this.formPanel) this.formPanel.hidden = false;
      } finally {
        this.resetCaptcha();
        this.isSubmitting = false;
        this.setLoadingState(false);
      }
    }

    async ensureCaptchaReady() {
      if (this.captchaPromise) return this.captchaPromise;

      const protect = window.Shopify?.captcha?.protect;

      if (typeof protect !== 'function' || !this.form) {
        throw new Error('Shopify captcha is unavailable');
      }

      this.captchaPromise = (async () => {
        protect(this.form);
        const widgetId = await this.waitForCaptchaWidget();
        this.captchaWidgetId = widgetId;
        return widgetId;
      })();

      try {
        return await this.captchaPromise;
      } catch (error) {
        this.captchaPromise = null;
        throw error;
      }
    }

    waitForCaptchaWidget() {
      return new Promise((resolve, reject) => {
        const startedAt = Date.now();

        const poll = () => {
          const widgetId = this.form?.querySelector('.h-captcha iframe')?.dataset.hcaptchaWidgetId;

          if (window.hcaptcha && widgetId) {
            resolve(widgetId);
            return;
          }

          if (Date.now() - startedAt > 15000) {
            reject(new Error('Timed out waiting for hCaptcha'));
            return;
          }

          window.setTimeout(poll, 100);
        };

        poll();
      });
    }

    async requestCaptchaToken() {
      const widgetId = this.captchaWidgetId || (await this.ensureCaptchaReady());
      const captcha = window.hcaptcha;

      if (!captcha || !widgetId) {
        throw new Error('hCaptcha is unavailable');
      }

      const result = await captcha.execute(widgetId, { async: true });
      const token =
        result?.response ||
        captcha.getResponse(widgetId) ||
        this.form?.querySelector('textarea[name="h-captcha-response"]')?.value ||
        '';

      if (!token) {
        throw new Error('Missing hCaptcha token');
      }

      this.setCaptchaToken(token);
      return token;
    }

    setCaptchaToken(token) {
      if (!this.form) return;

      const textarea = this.form.querySelector('textarea[name="h-captcha-response"]');

      if (textarea) {
        textarea.value = token;
        return;
      }

      let input = this.form.querySelector('input[name="h-captcha-response"]');

      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'h-captcha-response';
        this.form.appendChild(input);
      }

      input.value = token;
    }

    resetCaptcha() {
      if (window.hcaptcha && this.captchaWidgetId) {
        try {
          window.hcaptcha.reset(this.captchaWidgetId);
        } catch (error) {
          console.error('Failed to reset hCaptcha', error);
        }
      }

      this.setCaptchaToken('');
    }

    async submitForm(captchaToken) {
      const formData = new FormData(this.form);
      formData.set('h-captcha-response', captchaToken);

      const response = await fetch(this.form.action, {
        method: 'POST',
        headers: {
          Accept: 'text/html',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
        credentials: 'same-origin',
      });

      return {
        html: await response.text(),
        ok: response.ok,
        status: response.status,
      };
    }

    parseResponse(html) {
      const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
      const responseRoot = parsedDocument.querySelector(`ol1-waitlist[data-section-id="${this.dataset.sectionId}"]`);
      const responseStatus = responseRoot?.querySelector('[data-waitlist-state]');
      const responseMessage = responseRoot?.querySelector('[data-waitlist-status-message]');

      return {
        message: responseMessage?.textContent?.trim() || '',
        state: responseStatus?.dataset.waitlistState || '',
      };
    }

    setLoadingState(isLoading) {
      if (!this.submitButton) return;

      this.submitButton.disabled = isLoading;
      this.submitButton.setAttribute('aria-busy', isLoading ? 'true' : 'false');
    }

    clearStatus() {
      if (!this.statusMessage || this.statusMessage.dataset.state === 'success') {
        return;
      }

      if (this.formPanel) this.formPanel.hidden = false;
      this.statusMessage.hidden = true;
      this.statusMessage.textContent = '';
      this.statusMessage.dataset.state = 'idle';
      this.statusMessage.removeAttribute('role');
      this.statusMessage.removeAttribute('aria-live');
    }

    showStatus(state, message) {
      if (!this.statusMessage) return;

      this.statusMessage.hidden = false;
      this.statusMessage.dataset.state = state;
      this.statusMessage.textContent = message;

      if (state === 'error') {
        this.statusMessage.setAttribute('role', 'alert');
        this.statusMessage.setAttribute('aria-live', 'assertive');
      } else {
        this.statusMessage.setAttribute('role', 'status');
        this.statusMessage.setAttribute('aria-live', 'polite');
      }

      this.statusMessage.focus();
    }

    storageKey() {
      return `ol1-waitlist:${window.location.host}`;
    }

    submittedEmails() {
      try {
        return JSON.parse(window.localStorage.getItem(this.storageKey()) || '[]');
      } catch (error) {
        return [];
      }
    }

    normalizeEmail(value) {
      return value.trim().toLowerCase();
    }

    isKnownDuplicate() {
      if (!this.emailInput) return false;

      const email = this.normalizeEmail(this.emailInput.value);
      return this.submittedEmails().includes(email);
    }

    rememberSubmittedEmail() {
      if (!this.emailInput) return;

      const email = this.normalizeEmail(this.emailInput.value);
      const emails = this.submittedEmails();

      if (!email || emails.includes(email)) return;

      emails.push(email);
      window.localStorage.setItem(this.storageKey(), JSON.stringify(emails.slice(-20)));
    }
  }

  customElements.define('ol1-waitlist', Ol1Waitlist);
}
