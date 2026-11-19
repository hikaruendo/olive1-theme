import type { Lang } from "@/lib/i18n";
import { product, seller, yen } from "@/lib/reserve";

// 特定商取引法に基づく表記（/legal）。数字と日付は lib/reserve の product から読む。
// 予約フォームの確認欄（content/reserve.ts の form.confirm）と同じ条件を書く。
const price = yen(product.price);
const shipping = yen(product.shipping);
const free = yen(product.freeShippingFrom);

const ja = {
  meta: {
    title: "特定商取引法に基づく表記｜Olive1",
    description: "Olive1（kando1合同会社）の通信販売についての表記です。販売者、価格、送料、お支払い、お渡しの時期、キャンセルと返品の条件。",
  },
  label: "Legal ／ 表記",
  h1: "特定商取引法に基づく表記",
  lead: "Olive1 の通信販売についての表記です。予約の前にご確認ください。",
  crumb: "特定商取引法に基づく表記",
  rows: [
    { k: "販売業者", v: seller.company },
    { k: "運営責任者", v: seller.person },
    { k: "所在地", v: seller.address },
    { k: "電話番号", v: "ご請求があれば、遅れずにお知らせします。下のメールアドレスまでご連絡ください。" },
    { k: "メールアドレス", v: seller.email },
    { k: "屋号", v: "Olive1" },
    { k: "販売価格", v: `${product.name} ${product.size}　1本 ${price}（税込）` },
    {
      k: "商品代金以外に必要な料金",
      v: `送料：発送の場合、全国一律 ${shipping}（1回の発送につき）。商品代金の合計が ${free} 以上の場合は、送料がかかりません。会での手渡しも送料がかかりません。\n振込手数料：銀行振込の場合、お客様のご負担です。`,
    },
    { k: "お支払い方法", v: "銀行振込、クレジットカード（Stripe）" },
    {
      k: "お支払いの時期",
      v: `銀行振込：予約から${product.payDays}日以内。期限までに入金を確認できない場合、予約は取り消しになります。\nクレジットカード：予約のあとに進む決済ページで、その場で決済されます。`,
    },
    {
      k: "お渡しの時期",
      v: `発送：${product.shipWindow}。発送は日本国内のみです。\n会での手渡し：${product.eventWindow}。来られなくなった場合は発送に切り替えられます（送料 ${shipping}。${free}以上は送料なし）。`,
    },
    { k: "販売数量", v: "数に限りがあります。なくなり次第、受付を終えます。" },
    {
      k: "キャンセル",
      v: `ご入金の前は、メールでご連絡いただければ取り消せます。ご入金のあとは、お客様のご都合によるキャンセルはお受けできません。\nこちらの都合で上の時期までにお渡しできない場合は、ご希望に応じて全額を返金します。`,
    },
    {
      k: "返品・交換",
      v: `食品のため、お客様のご都合による返品・交換はお受けできません。\n破損、品質の不良、内容の違いがあった場合は、到着から${product.claimDays}日以内にメールでご連絡ください。交換または返金をします。その際の送料はこちらで負担します。交換できる在庫がない場合は返金になります。`,
    },
  ],
  updated: "2026年11月16日 制定",
  back: "予約ページへ",
};

const en: typeof ja = {
  meta: {
    title: "Legal notice｜Olive1",
    description: "Seller details and terms for Olive1 (kando1 LLC) mail-order sales in Japan: price, shipping, payment, delivery, cancellation and returns.",
  },
  label: "Legal",
  h1: "Legal notice",
  lead: "Notice required by Japan's Act on Specified Commercial Transactions. Please read it before you reserve.",
  crumb: "Legal notice",
  rows: [
    { k: "Seller", v: seller.companyEn },
    { k: "Person responsible", v: seller.personEn },
    { k: "Address", v: seller.addressEn },
    { k: "Phone", v: "Provided without delay on request. Please email the address below." },
    { k: "Email", v: seller.email },
    { k: "Trading name", v: "Olive1" },
    { k: "Price", v: `${product.name} ${product.size}: ${price} per bottle (tax included)` },
    {
      k: "Other charges",
      v: `Shipping: a flat ${shipping} within Japan per shipment. Orders of ${free} or more ship free. No shipping charge if you collect at the gathering.\nBank transfer fees: paid by the customer.`,
    },
    { k: "Payment methods", v: "Bank transfer (Japanese bank), card (Stripe)" },
    {
      k: "When you pay",
      v: `Bank transfer: within ${product.payDays} days of reserving. If the payment is not confirmed by then, the reservation is cancelled.\nCard: charged on the payment page that follows the reservation.`,
    },
    {
      k: "Delivery",
      v: `Shipping: ${product.shipWindowEn}. Shipping is within Japan only.\nCollection at the gathering: ${product.eventWindowEn}. If you cannot come, you can switch to shipping (${shipping}, free from ${free}).`,
    },
    { k: "Quantity", v: "Limited. Reservations close when the bottles are gone." },
    {
      k: "Cancellation",
      v: `Before you pay, you can cancel by email. After payment, cancellations for your own reasons are not accepted.\nIf the oil cannot be delivered by the dates above for reasons on the seller's side, you can ask for a full refund.`,
    },
    {
      k: "Returns and exchanges",
      v: `This is food, so returns and exchanges for your own reasons are not accepted.\nIf a bottle arrives broken, faulty or not what you ordered, email within ${product.claimDays} days of arrival. It is replaced or refunded, and the seller covers the shipping for that. If no replacement is in stock, it is refunded.`,
    },
  ],
  updated: "Effective November 16, 2026",
  back: "Back to reservations",
};

export const legalText: Record<Lang, typeof ja> = { ja, en };
