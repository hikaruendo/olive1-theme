"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { maxQty, product, yen } from "@/lib/reserve";

type Status = "idle" | "loading" | "error";

type Props = {
  cardAvailable: boolean;
  bankAvailable: boolean;
};

export function ReserveForm({ cardAvailable, bankAvailable }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [qty, setQty] = useState(1);
  const [receive, setReceive] = useState<"event" | "ship">("event");
  const [payment, setPayment] = useState<"bank" | "card">(bankAvailable ? "bank" : "card");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      qty,
      receive,
      address: String(fd.get("address") ?? ""),
      payment,
      note: String(fd.get("note") ?? ""),
      referrer: String(fd.get("referrer") ?? ""),
    };

    try {
      const response = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        message?: string;
        id?: string;
        cardUrl?: string | null;
      };
      if (!response.ok || !data.id) {
        throw new Error(data.message ?? "予約できませんでした。");
      }

      if (payment === "card" && data.cardUrl) {
        // 決済ページへ。戻ってきた時のために完了ページも用意してある
        window.location.href = data.cardUrl;
        return;
      }
      router.push(`/reserve/thanks?id=${encodeURIComponent(data.id)}&qty=${qty}&receive=${receive}&method=${payment}`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "予約できませんでした。");
    }
  }

  const subtotal = product.price * qty;

  return (
    <form className="waitlist-form reserve-form" onSubmit={handleSubmit}>
      <p className="form-title">予約する</p>

      <div className="form-field">
        <label htmlFor="name">お名前</label>
        <input id="name" name="name" type="text" autoComplete="name" required maxLength={80} />
      </div>

      <div className="form-field">
        <label htmlFor="email">メールアドレス</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="name@example.com" required />
      </div>

      <div className="form-field">
        <label htmlFor="qty">本数</label>
        <select id="qty" name="qty" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
          {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}本（{yen(product.price * n)}）
            </option>
          ))}
        </select>
      </div>

      <fieldset className="reason-fieldset">
        <legend>受け取り</legend>
        <div className="radio-list">
          <label className="radio-option">
            <input type="radio" name="receive" value="event" checked={receive === "event"} onChange={() => setReceive("event")} />
            <span>
              <b>12月の会で受け取る</b>
              <small>{product.event}。本番号を付けて手渡しします。</small>
            </span>
          </label>
          <label className="radio-option">
            <input type="radio" name="receive" value="ship" checked={receive === "ship"} onChange={() => setReceive("ship")} />
            <span>
              <b>発送</b>
              <small>12月に発送します。送料は別途ご案内します。</small>
            </span>
          </label>
        </div>
      </fieldset>

      {receive === "ship" && (
        <div className="form-field">
          <label htmlFor="address">発送先（郵便番号・住所・宛名）</label>
          <textarea id="address" name="address" rows={3} required maxLength={400} autoComplete="street-address" />
        </div>
      )}

      <fieldset className="reason-fieldset">
        <legend>お支払い</legend>
        <div className="radio-list">
          <label className={`radio-option${bankAvailable ? "" : " is-disabled"}`}>
            <input type="radio" name="payment" value="bank" disabled={!bankAvailable} checked={payment === "bank"} onChange={() => setPayment("bank")} />
            <span>
              <b>銀行振込</b>
              <small>予約後に振込先をメールでお送りします。</small>
            </span>
          </label>
          <label className={`radio-option${cardAvailable ? "" : " is-disabled"}`}>
            <input type="radio" name="payment" value="card" disabled={!cardAvailable} checked={payment === "card"} onChange={() => setPayment("card")} />
            <span>
              <b>カード（Stripe）</b>
              <small>このあと決済ページに進みます。</small>
            </span>
          </label>
        </div>
      </fieldset>

      <div className="form-field">
        <label htmlFor="referrer">紹介してくれた人（任意）</label>
        <input id="referrer" name="referrer" type="text" maxLength={80} placeholder="例：〇〇さん" />
      </div>

      <div className="form-field">
        <label htmlFor="note">メモ（任意）</label>
        <textarea id="note" name="note" rows={2} maxLength={600} />
      </div>

      <div className="reserve-total">
        <span>小計</span>
        <b>{yen(subtotal)}</b>
        <small>税込・送料別</small>
      </div>

      <div className="form-row">
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "送信中" : payment === "card" ? "予約して決済に進む" : "予約する"}
        </button>
      </div>
      {message && <p className={`form-message ${status === "error" ? "is-error" : ""}`}>{message}</p>}
    </form>
  );
}
