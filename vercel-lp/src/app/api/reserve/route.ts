import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  getBankInfo,
  getReserveStatus,
  getStripePaymentLink,
  makeReservationId,
  maxQty,
  paymentLabel,
  product,
  receiveLabel,
  yen,
  type PaymentMethod,
  type ReceiveMethod,
} from "@/lib/reserve";
import { isLang, type Lang } from "@/lib/i18n";

// 入力エラー・状態のメッセージ。フォームの言語で返す
const msg = {
  ja: {
    closed: "予約の受付はまだ始まっていません。",
    soldout: "今年の分は、すべて予約が入りました。",
    name: "お名前を入力してください。",
    email: "メールアドレスを確認してください。",
    qty: (max: number) => `本数は1〜${max}本で選んでください。`,
    receive: "受け取り方法を選んでください。",
    address: "発送先の住所を入力してください。",
    payment: "お支払い方法を選んでください。",
    noCard: "カード決済の準備がまだです。銀行振込を選んでください。",
    noBank: "振込先の設定がまだです。",
    notConfigured: "予約受付の設定がまだです。",
    sendFailed: "予約の送信に失敗しました。時間をおいてもう一度お試しください。",
  },
  en: {
    closed: "Reservations have not opened yet.",
    soldout: "This year's bottles are all reserved.",
    name: "Please enter your name.",
    email: "Please check your email address.",
    qty: (max: number) => `Please choose between 1 and ${max} bottles.`,
    receive: "Please choose how to receive your bottles.",
    address: "Please enter a shipping address.",
    payment: "Please choose a payment method.",
    noCard: "Card payment is not ready yet. Please choose bank transfer.",
    noBank: "Bank transfer details are not set up yet.",
    notConfigured: "Reservations are not set up yet.",
    sendFailed: "The reservation could not be sent. Please try again in a moment.",
  },
} satisfies Record<Lang, unknown>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: unknown;
  email?: unknown;
  qty?: unknown;
  receive?: unknown;
  address?: unknown;
  payment?: unknown;
  note?: unknown;
  referrer?: unknown;
  lang?: unknown;
};

function str(v: unknown, max = 500) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function bad(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const lang: Lang = typeof body?.lang === "string" && isLang(body.lang) ? body.lang : "ja";
  const m = msg[lang];

  const status = getReserveStatus();
  if (status === "closed") return bad(m.closed, 403);
  if (status === "soldout") return bad(m.soldout, 403);

  const name = str(body?.name, 80);
  const email = str(body?.email, 200);
  const qty = Number(body?.qty);
  const receive = str(body?.receive) as ReceiveMethod;
  const address = str(body?.address, 400);
  const payment = str(body?.payment) as PaymentMethod;
  const note = str(body?.note, 600);
  const referrer = str(body?.referrer, 80);

  if (!name) return bad(m.name);
  if (!emailPattern.test(email)) return bad(m.email);
  if (!Number.isInteger(qty) || qty < 1 || qty > maxQty) return bad(m.qty(maxQty));
  if (receive !== "event" && receive !== "ship") return bad(m.receive);
  if (receive === "ship" && !address) return bad(m.address);
  if (payment !== "bank" && payment !== "card") return bad(m.payment);

  const stripeUrl = getStripePaymentLink();
  if (payment === "card" && !stripeUrl) return bad(m.noCard, 503);

  const bank = getBankInfo();
  if (payment === "bank" && !bank) return bad(m.noBank, 503);

  const id = makeReservationId();
  const subtotal = product.price * qty;
  const submittedAt = new Date().toISOString();

  const summary = [
    `予約番号: ${id}`,
    `お名前: ${name}`,
    `メール: ${email}`,
    `商品: ${product.name} ${product.size}（瓶詰め ${product.bottlingDate}）`,
    `本数: ${qty}本`,
    `小計: ${yen(subtotal)}（税込・送料別）`,
    `受け取り: ${receiveLabel(receive)}`,
    ...(receive === "ship" ? [`発送先: ${address}`] : []),
    `お支払い: ${paymentLabel(payment)}`,
    ...(referrer ? [`紹介: ${referrer}`] : []),
    ...(note ? [`メモ: ${note}`] : []),
    ...(lang === "en" ? ["言語: 英語ページから"] : []),
    `受付: ${submittedAt}`,
  ].join("\n");

  const cardUrl =
    payment === "card" && stripeUrl
      ? `${stripeUrl}${stripeUrl.includes("?") ? "&" : "?"}prefilled_email=${encodeURIComponent(email)}&client_reference_id=${encodeURIComponent(id)}&locale=${lang}`
      : null;

  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const notifyTo = process.env.RESERVE_NOTIFY_EMAIL;
  const dryRun = process.env.RESERVE_DRY_RUN === "1";

  if (!dryRun && (!resendApiKey || !from || !notifyTo)) {
    console.error("[reserve]", { configured: false, hasKey: !!resendApiKey, hasFrom: !!from, hasNotify: !!notifyTo });
    return bad(m.notConfigured, 503);
  }

  const customerText = [
    `${name} 様`,
    "",
    `Olive1の予約を受け付けました。予約番号は ${id} です。`,
    "",
    summary,
    "",
    ...(payment === "bank" && bank
      ? [
          "【お振込先】",
          `${bank.bank} ${bank.branch}`,
          `${bank.type} ${bank.number}`,
          `名義: ${bank.holder}`,
          `金額: ${yen(subtotal)}${receive === "ship" ? "（送料は別途ご案内します）" : ""}`,
          "振込名義の先頭に予約番号の下4桁を入れていただけると照合が早いです。",
          "入金を確認したら、本番号（n/50）をお知らせします。",
        ]
      : [
          "【カード決済】",
          "下のリンクから決済に進んでください。決済ページでは同じ本数を選んでください。",
          cardUrl ?? "",
          "決済を確認したら、本番号（n/50）をお知らせします。",
        ]),
    "",
    receive === "event"
      ? `受け取りは ${product.event} です。日時と場所は改めてご案内します。`
      : "発送は12月を予定しています。日程が決まり次第ご案内します。",
    "",
    "Olive1",
    "https://olive.kando1.com",
  ].join("\n");
  const customerTextEn = [
    `Dear ${name},`,
    "",
    `Your Olive1 reservation is in. Your reservation number is ${id}.`,
    "",
    `Reservation: ${id}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Product: ${product.name} ${product.size} (bottled ${product.bottlingDateEn})`,
    `Bottles: ${qty}`,
    `Subtotal: ${yen(subtotal)} (tax included, shipping extra)`,
    `Collection: ${receiveLabel(receive, "en")}`,
    ...(receive === "ship" ? [`Shipping address: ${address}`] : []),
    `Payment: ${paymentLabel(payment, "en")}`,
    ...(referrer ? [`Referred by: ${referrer}`] : []),
    ...(note ? [`Notes: ${note}`] : []),
    "",
    ...(payment === "bank" && bank
      ? [
          "[Bank transfer]",
          `${bank.bank} ${bank.branch}`,
          `${bank.type} ${bank.number}`,
          `Account name: ${bank.holder}`,
          `Amount: ${yen(subtotal)}${receive === "ship" ? " (shipping cost will be sent separately)" : ""}`,
          "Please put the last four digits of your reservation number at the start of the transfer name.",
          "Once the payment is confirmed, your bottle number (n/50) will be sent by email.",
        ]
      : [
          "[Card payment]",
          "Please continue to the payment page below and choose the same number of bottles.",
          cardUrl ?? "",
          "Once the payment is confirmed, your bottle number (n/50) will be sent by email.",
        ]),
    "",
    receive === "event"
      ? `Collection: ${product.eventEn}. Date and venue will follow.`
      : "Shipping is planned for December. The date will follow.",
    "",
    "Olive1",
    "https://olive.kando1.com/en",
  ].join("\n");

  if (dryRun) {
    console.info("[reserve:dry-run]", { id, summary, cardUrl });
    return NextResponse.json({ ok: true, id, qty, payment, cardUrl });
  }

  const resend = new Resend(resendApiKey);

  // 1) 自分への通知（これが落ちたら予約を受け付けない）
  const notify = await resend.emails.send({
    from: from!,
    to: notifyTo!,
    replyTo: email,
    subject: `[予約] ${id} ${name} ${qty}本 ${paymentLabel(payment)}`,
    text: summary,
  });
  if (notify.error) {
    console.error("[reserve]", { step: "notify", error: notify.error });
    return bad(m.sendFailed, 502);
  }

  // 2) お客さんへの確認メール（落ちてもログだけ。予約は成立）
  const confirm = await resend.emails.send({
    from: from!,
    to: email,
    subject: lang === "en" ? `Olive1: your reservation is in (${id})` : `Olive1 予約を受け付けました（${id}）`,
    text: lang === "en" ? customerTextEn : customerText,
  });
  if (confirm.error) console.error("[reserve]", { step: "confirm", error: confirm.error });

  // 3) クラブの名簿にも入れる（任意）
  const segmentId = process.env.RESEND_SEGMENT_ID;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const properties = { source: "olive1-reserve", reservation_id: id, qty: String(qty), submitted_at: submittedAt, lang };
  const contact = await resend.contacts.create(
    segmentId
      ? { email, unsubscribed: false, properties, segments: [{ id: segmentId }] }
      : { email, unsubscribed: false, properties, ...(audienceId ? { audienceId } : {}) },
  );
  if (contact.error) console.info("[reserve]", { step: "contact", error: contact.error });

  return NextResponse.json({ ok: true, id, qty, payment, cardUrl });
}
