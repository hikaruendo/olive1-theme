import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  getBankInfo,
  getReserveStatus,
  getStripePaymentLink,
  shippingFee,
  makeReservationId,
  maxQty,
  payDeadline,
  paymentLabel,
  product,
  receiveLabel,
  yen,
  type PaymentMethod,
  type ReceiveMethod,
} from "@/lib/reserve";
import { isLang, type Lang } from "@/lib/i18n";
import { sheetConfigured, sheetReserve } from "@/lib/sheet";

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
    soldout2: "今年の分は、すべて予約が入りました。",
    notEnough: (n: number) => `残りは${n}本です。本数を減らしてもう一度お試しください。`,
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
    soldout2: "This year's bottles are all reserved.",
    notEnough: (n: number) => `Only ${n} ${n === 1 ? "bottle is" : "bottles are"} left. Please choose fewer and try again.`,
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

  const stripeUrl = getStripePaymentLink(receive);
  if (payment === "card" && !stripeUrl) return bad(m.noCard, 503);

  const bank = getBankInfo();
  if (payment === "bank" && !bank) return bad(m.noBank, 503);

  const id = makeReservationId();
  const subtotal = product.price * qty;
  const shipping = shippingFee(receive);
  const total = subtotal + shipping;
  const now = new Date();
  const submittedAt = now.toISOString();

  const summary = [
    `予約番号: ${id}`,
    `お名前: ${name}`,
    `メール: ${email}`,
    `商品: ${product.name} ${product.size}（瓶詰め ${product.bottlingDate}）`,
    `本数: ${qty}本`,
    `小計: ${yen(subtotal)}（税込）`,
    ...(shipping ? [`送料: ${yen(shipping)}（全国一律）`] : []),
    `合計: ${yen(total)}`,
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
          `金額: ${yen(total)}${shipping ? `（送料 ${yen(shipping)} を含む）` : ""}`,
          `お振込みは ${payDeadline(now)} まで（予約から${product.payDays}日以内）にお願いします。振込手数料はご負担ください。`,
          "期限までに入金を確認できない場合、予約は取り消しになります。",
          "振込名義の先頭に予約番号の下4桁を入れていただけると照合が早いです。",
          `入金を確認したら、本番号（n/${product.bottles}）をお知らせします。`,
        ]
      : [
          "【カード決済】",
          "下のリンクから決済に進んでください。決済ページでは同じ本数を選んでください。",
          cardUrl ?? "",
          `決済を確認したら、本番号（n/${product.bottles}）をお知らせします。`,
        ]),
    "",
    receive === "event"
      ? `受け取りは「今年の油を開ける会」です。${product.eventWindow}。来られなくなった場合は発送に切り替えられます（送料 ${yen(product.shipping)}）。`
      : `${product.shipWindow}。`,
    "",
    `ご入金の前は、このメールへの返信で取り消せます。ご入金のあとは、お客様のご都合によるキャンセル・返品はお受けできません。破損や品質の不良があった場合は、到着から${product.claimDays}日以内にご連絡ください。交換または返金をします。`,
    "特定商取引法に基づく表記: https://olive.kando1.com/legal",
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
    `Subtotal: ${yen(subtotal)} (tax included)`,
    ...(shipping ? [`Shipping: ${yen(shipping)} (flat rate within Japan)`] : []),
    `Total: ${yen(total)}`,
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
          `Amount: ${yen(total)}${shipping ? ` (includes ${yen(shipping)} shipping)` : ""}`,
          `Please pay by ${payDeadline(now, "en")} (within ${product.payDays} days of reserving). Transfer fees are yours to cover.`,
          "If the payment is not confirmed by then, the reservation is cancelled.",
          "Please put the last four digits of your reservation number at the start of the transfer name.",
          `Once the payment is confirmed, your bottle number (n/${product.bottles}) will be sent by email.`,
        ]
      : [
          "[Card payment]",
          "Please continue to the payment page below and choose the same number of bottles.",
          cardUrl ?? "",
          `Once the payment is confirmed, your bottle number (n/${product.bottles}) will be sent by email.`,
        ]),
    "",
    receive === "event"
      ? `Collection is at the gathering to open this year's oil. ${product.eventWindowEn}. If you cannot come, you can switch to shipping (${yen(product.shipping)}).`
      : `${product.shipWindowEn}.`,
    "",
    `Before you pay, you can cancel by replying to this email. After payment, cancellations and returns for your own reasons are not accepted. If a bottle arrives broken or faulty, email within ${product.claimDays} days of arrival and it is replaced or refunded.`,
    "Legal notice: https://olive.kando1.com/en/legal",
    "",
    "Olive1",
    "https://olive.kando1.com/en",
  ].join("\n");

  // 0) 台帳に書く。ここで残り本数を確かめるので、売る本数（台帳の TOTAL）を超える予約はここで止まる
  const useSheet = sheetConfigured();
  if (useSheet) {
    // 台帳は人が読むので、受け取りと支払いは日本語の表示名で入れる
    const sheet = await sheetReserve({
      id, name, email, qty, receive: receiveLabel(receive), address, payment: paymentLabel(payment), referrer, note, lang,
    }).catch((error) => {
      console.error("[reserve]", { step: "sheet", error });
      return { ok: false, error: "network" } as const;
    });
    if (!sheet.ok) {
      if (sheet.error === "soldout") return bad(m.soldout2, 409);
      if (sheet.error === "not_enough" && "remaining" in sheet && typeof sheet.remaining === "number")
        return bad(m.notEnough(sheet.remaining), 409);
      console.error("[reserve]", { step: "sheet", error: sheet.error });
      return bad(m.sendFailed, 502);
    }
  }

  if (dryRun) {
    console.info("[reserve:dry-run]", { id, summary, cardUrl, sheet: useSheet });
    return NextResponse.json({ ok: true, id, qty, payment, cardUrl });
  }

  const resend = new Resend(resendApiKey);

  // 1) 自分への通知。台帳がある時は記録は残っているので、落ちてもログだけ。台帳が無い時は受け付けない
  const notify = await resend.emails.send({
    from: from!,
    to: notifyTo!,
    replyTo: email,
    subject: `[予約] ${id} ${name} ${qty}本 ${paymentLabel(payment)}`,
    text: summary,
  });
  if (notify.error) {
    console.error("[reserve]", { step: "notify", error: notify.error });
    if (!useSheet) return bad(m.sendFailed, 502);
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
