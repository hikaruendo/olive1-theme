"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const reason = String(formData.get("reason") ?? "");

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
      event.currentTarget.reset();
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
        <legend>クラブで知りたいこと</legend>
        <div className="reason-grid">
          {["味が気になる", "選び方を知りたい", "料理に使いたい", "ギフトにしたい"].map(
            (reason) => (
              <label className="reason-option" key={reason}>
                <input name="reason" type="radio" value={reason} required />
                <span>{reason}</span>
              </label>
            ),
          )}
        </div>
      </fieldset>
      <div className="form-row">
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "送信中" : "クラブに参加する"}
        </button>
      </div>
      <p className={`form-message ${status === "error" ? "is-error" : ""}`}>
        {message || "旅の記録と先行案内にのみ使用します。"}
      </p>
    </form>
  );
}
