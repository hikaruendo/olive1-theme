"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { maxQty, product, yen } from "@/lib/reserve";
import { href, type Lang } from "@/lib/i18n";
import { reserveText } from "@/content/reserve";

type Status = "idle" | "loading" | "error";

type Props = {
  lang: Lang;
  cardAvailable: boolean;
  bankAvailable: boolean;
  maxSelectable?: number; // 残り本数が上限より少ない時はそこまで
};

export function ReserveForm({ lang, cardAvailable, bankAvailable, maxSelectable = maxQty }: Props) {
  const t = reserveText[lang].form;
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
      lang,
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
        throw new Error(data.message ?? t.failed);
      }

      if (payment === "card" && data.cardUrl) {
        // 決済ページへ。戻ってきた時のために完了ページも用意してある
        window.location.href = data.cardUrl;
        return;
      }
      router.push(
        `${href(lang, "/reserve/thanks")}?id=${encodeURIComponent(data.id)}&qty=${qty}&receive=${receive}&method=${payment}`,
      );
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : t.failed);
    }
  }

  const subtotal = product.price * qty;

  return (
    <form className="waitlist-form reserve-form" onSubmit={handleSubmit}>
      <p className="form-title">{t.title}</p>

      <div className="form-field">
        <label htmlFor="name">{t.name}</label>
        <input id="name" name="name" type="text" autoComplete="name" required maxLength={80} />
      </div>

      <div className="form-field">
        <label htmlFor="email">{t.email}</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="name@example.com" required />
      </div>

      <div className="form-field">
        <label htmlFor="qty">{t.qty}</label>
        <select id="qty" name="qty" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
          {Array.from({ length: Math.max(1, maxSelectable) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {t.qtyOption(n, yen(product.price * n))}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="reason-fieldset">
        <legend>{t.receiveLegend}</legend>
        <div className="radio-list">
          <label className="radio-option">
            <input type="radio" name="receive" value="event" checked={receive === "event"} onChange={() => setReceive("event")} />
            <span>
              <b>{t.receiveEvent}</b>
              <small>{t.receiveEventSub}</small>
            </span>
          </label>
          <label className="radio-option">
            <input type="radio" name="receive" value="ship" checked={receive === "ship"} onChange={() => setReceive("ship")} />
            <span>
              <b>{t.receiveShip}</b>
              <small>{t.receiveShipSub}</small>
            </span>
          </label>
        </div>
      </fieldset>

      {receive === "ship" && (
        <div className="form-field">
          <label htmlFor="address">{t.address}</label>
          <textarea id="address" name="address" rows={3} required maxLength={400} autoComplete="street-address" />
        </div>
      )}

      <fieldset className="reason-fieldset">
        <legend>{t.paymentLegend}</legend>
        <div className="radio-list">
          <label className={`radio-option${bankAvailable ? "" : " is-disabled"}`}>
            <input type="radio" name="payment" value="bank" disabled={!bankAvailable} checked={payment === "bank"} onChange={() => setPayment("bank")} />
            <span>
              <b>{t.bank}</b>
              <small>{t.bankSub}</small>
            </span>
          </label>
          <label className={`radio-option${cardAvailable ? "" : " is-disabled"}`}>
            <input type="radio" name="payment" value="card" disabled={!cardAvailable} checked={payment === "card"} onChange={() => setPayment("card")} />
            <span>
              <b>{t.card}</b>
              <small>{t.cardSub}</small>
            </span>
          </label>
        </div>
      </fieldset>

      <div className="form-field">
        <label htmlFor="referrer">{t.referrer}</label>
        <input id="referrer" name="referrer" type="text" maxLength={80} placeholder={t.referrerPlaceholder} />
      </div>

      <div className="form-field">
        <label htmlFor="note">{t.note}</label>
        <textarea id="note" name="note" rows={2} maxLength={600} placeholder={t.notePlaceholder} />
      </div>

      <div className="reserve-total">
        <span>{t.subtotal}</span>
        <b>{yen(subtotal)}</b>
        <small>{t.subtotalSub}</small>
      </div>

      <div className="form-row">
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? t.sending : payment === "card" ? t.submitCard : t.submit}
        </button>
      </div>
      {message && <p className={`form-message ${status === "error" ? "is-error" : ""}`}>{message}</p>}
    </form>
  );
}
