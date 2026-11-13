// 予約（最初の商品）の定数と、環境変数から読む設定。
// 数字はラベル・Pressing Report と同じものだけを書く。未確定のものは env に逃がす。

export const product = {
  name: process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "Hatsu",
  size: "100g", // 2026-11-01 Hikaru：瓶は首のある濃緑の角瓶100gに変更（112gではない）。105g表記の可能性あり＝要確認
  price: 4800, // 税込・送料別
  bottles: 48, // 詰める本数（24本×2ケース）・本番号 n/48。売るのは45本（台帳の TOTAL）
  harvest: "2026年10〜11月、小豆島で収穫・搾油",
  // 瓶詰め（充填）は11月末（10/31ではない・2026-11-01 Hikaru訂正）。日が決まったら env で上書き
  bottlingDate: process.env.NEXT_PUBLIC_BOTTLING_DATE ?? "2026年11月末（予定）",
  bottlingLabel: process.env.NEXT_PUBLIC_BOTTLING_LABEL ?? "11月末",
  event: process.env.NEXT_PUBLIC_EVENT_NOTE ?? "12月上旬、東京で「今年の油を開ける会」",
  // 英語版（/en）。日が決まったら NEXT_PUBLIC_BOTTLING_DATE_EN / LABEL_EN も入れる
  harvestEn: "Picked and pressed on Shodoshima, October to November 2026",
  bottlingDateEn: process.env.NEXT_PUBLIC_BOTTLING_DATE_EN ?? "end of November 2026 (planned)",
  bottlingLabelEn: process.env.NEXT_PUBLIC_BOTTLING_LABEL_EN ?? "end of November",
  eventEn: process.env.NEXT_PUBLIC_EVENT_NOTE_EN ?? "Early December, Tokyo: the gathering to open this year's oil",
};

export const maxQty = 6;

export type ReserveStatus = "closed" | "open" | "soldout";

export function getReserveStatus(): ReserveStatus {
  const v = process.env.RESERVE_STATUS;
  if (v === "open" || v === "soldout") return v;
  return "closed";
}

export type BankInfo = {
  bank: string;
  branch: string;
  type: string;
  number: string;
  holder: string;
};

// 振込先は env にだけ置く（リポジトリに口座番号を入れない）
export function getBankInfo(): BankInfo | null {
  const bank = process.env.BANK_NAME;
  const branch = process.env.BANK_BRANCH;
  const type = process.env.BANK_ACCOUNT_TYPE;
  const number = process.env.BANK_ACCOUNT_NUMBER;
  const holder = process.env.BANK_ACCOUNT_HOLDER;
  if (!bank || !branch || !type || !number || !holder) return null;
  return { bank, branch, type, number, holder };
}

export function getStripePaymentLink(): string | null {
  const url = process.env.STRIPE_PAYMENT_LINK_URL;
  return url && url.startsWith("https://") ? url : null;
}

export function yen(n: number) {
  return `¥${n.toLocaleString("ja-JP")}`;
}

export type ReceiveMethod = "event" | "ship";
export type PaymentMethod = "bank" | "card";

export function receiveLabel(r: ReceiveMethod, lang: "ja" | "en" = "ja") {
  if (lang === "en") return r === "event" ? "Collect at the December gathering" : "Shipping";
  return r === "event" ? "12月の会で受け取る" : "発送";
}

export function paymentLabel(p: PaymentMethod, lang: "ja" | "en" = "ja") {
  if (lang === "en") return p === "bank" ? "Bank transfer" : "Card (Stripe)";
  return p === "bank" ? "銀行振込" : "カード（Stripe）";
}

// 予約番号。振込の名義・照合用。R-日付-4桁
export function makeReservationId(now = new Date()) {
  const d = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `R-${d}-${rand}`;
}
