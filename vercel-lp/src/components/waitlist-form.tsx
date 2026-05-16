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

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
      <label htmlFor="email">発売案内を受け取る</label>
      <div className="form-row">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="email@example.com"
          required
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "送信中" : "登録"}
        </button>
      </div>
      <p className={`form-message ${status === "error" ? "is-error" : ""}`}>
        {message || "広告メールの配信停止リンクは各メールに記載します。"}
      </p>
    </form>
  );
}
