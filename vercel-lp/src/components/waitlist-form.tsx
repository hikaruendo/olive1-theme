"use client";

import { FormEvent, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { ui } from "@/content/ui";

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistForm({ lang }: { lang: Lang }) {
  const t = ui[lang].waitlist;
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const reason = formData.getAll("reason").map(String).join("・");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason, lang }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? t.failed);
      }

      setStatus("success");
      setMessage(data.message ?? t.joined);
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : t.failed);
    }
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <p className="form-title">{t.title}</p>
      <div className="form-field">
        <label htmlFor="email">{t.email}</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          required
        />
      </div>
      <fieldset className="reason-fieldset">
        <legend>{t.interestsLegend}</legend>
        <div className="reason-grid">
          {t.interests.map((reason, i) => (
            <label className="reason-option" key={reason}>
              <input name="reason" type="checkbox" value={reason} defaultChecked={i === 0} />
              <span>{reason}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="form-row">
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? t.sending : t.submit}
        </button>
      </div>
      {message && (
        <p
          className={`form-message ${status === "error" ? "is-error" : ""}`}
          style={status === "success" ? { color: "var(--green)", fontWeight: 600 } : undefined}
        >
          {message}
        </p>
      )}
    </form>
  );
}
