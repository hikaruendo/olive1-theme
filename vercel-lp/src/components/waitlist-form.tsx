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
        throw new Error(data.message ?? "登録できませんでした。");
      }

      setStatus("success");
      setMessage(data.message ?? "登録しました。");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "登録できませんでした。");
    }
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <p className="form-title">発売案内を受け取る</p>
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
        <legend>気になっていること</legend>
        <div className="reason-grid">
          {["味が気になる", "健康のため", "料理に使いたい", "ギフトにしたい"].map(
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
          {status === "loading" ? "送信中" : "入荷案内に登録する"}
        </button>
      </div>
      <p className={`form-message ${status === "error" ? "is-error" : ""}`}>
        {message || "入荷のお知らせにのみ使用します。"}
      </p>
    </form>
  );
}
