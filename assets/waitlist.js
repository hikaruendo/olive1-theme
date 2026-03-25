if (!customElements.get('ol1-waitlist')) {
  class Ol1Waitlist extends HTMLElement {
    constructor() {
      super();

      this.onSubmit = this.onSubmit.bind(this);
      this.onReasonChange = this.onReasonChange.bind(this);
      this.onEmailInput = this.onEmailInput.bind(this);
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
      this.reasonInputs.forEach((input) => input.addEventListener('change', this.onReasonChange));
      this.emailInput?.addEventListener('input', this.onEmailInput);
      this.dataset.bound = 'true';
    }

    disconnectedCallback() {
      if (!this.form) return;

      this.form.removeEventListener('submit', this.onSubmit);
      this.reasonInputs?.forEach((input) => input.removeEventListener('change', this.onReasonChange));
      this.emailInput?.removeEventListener('input', this.onEmailInput);
      this.dataset.bound = 'false';
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

      if (!this.form || this.isSubmitting) return;

      this.syncReasonMetadata();

      if (!this.validate()) return;

      this.isSubmitting = true;
      this.setLoadingState(true);

      try {
        const response = await fetch(this.form.action, {
          method: 'POST',
          headers: {
            Accept: 'text/html',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: new FormData(this.form),
        });

        const html = await response.text();
        const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
        const responseRoot = parsedDocument.querySelector(`ol1-waitlist[data-section-id="${this.dataset.sectionId}"]`);
        const responseStatus = responseRoot?.querySelector('[data-waitlist-state]');

        if (!responseStatus) {
          this.showStatus('error', this.dataset.networkErrorMessage);
          return;
        }

        const nextState = responseStatus.dataset.waitlistState || 'error';
        const nextMessage = responseRoot.querySelector('[data-waitlist-status-message]')?.textContent?.trim();

        this.showStatus(nextState, nextMessage || this.dataset.networkErrorMessage);

        if (nextState === 'success' || nextState === 'duplicate') {
          if (this.formPanel) this.formPanel.hidden = true;
          if (nextState === 'success') {
            this.form.reset();
            this.syncReasonMetadata();
          }
        } else if (this.formPanel) {
          this.formPanel.hidden = false;
        }
      } catch (error) {
        this.showStatus('error', this.dataset.networkErrorMessage);
      } finally {
        this.isSubmitting = false;
        this.setLoadingState(false);
      }
    }

    setLoadingState(isLoading) {
      if (!this.submitButton) return;

      this.submitButton.disabled = isLoading;
      this.submitButton.setAttribute('aria-busy', isLoading ? 'true' : 'false');
    }

    clearStatus() {
      if (!this.statusMessage || this.statusMessage.dataset.state === 'success' || this.statusMessage.dataset.state === 'duplicate') {
        return;
      }

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
  }

  customElements.define('ol1-waitlist', Ol1Waitlist);
}
