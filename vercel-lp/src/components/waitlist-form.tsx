"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const interests = ["毎日使い", "ギフト", "飲む健康", "レシピ"];

export function WaitlistForm() {
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
        body: JSON.stringify({ email, reason }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "参加できませんでした。");
      }

      setStatus("success");
      setMessage(data.message ?? "クラブに参加しました。");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "参加できませんでした。");
    }
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <p className="form-title">Olive1クラブに参加する</p>
      <div className="form-field">
        <label htmlFor="email">メールアドレス</label>
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
        <legend>興味のあること（任意・複数可）</legend>
        <div className="reason-grid">
          {interests.map((reason) => (
            <label className="reason-option" key={reason}>
              <input
                name="reason"
                type="checkbox"
                value={reason}
                defaultChecked={reason === "毎日使い"}
              />
              <span>{reason}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="form-row">
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "送信中" : "クラブに入る"}
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
