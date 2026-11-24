// 予約（最初の商品）の定数と、環境変数から読む設定。
// 数字はラベル・Pressing Report と同じものだけを書く。未確定のものは env に逃がす。

export const product = {
  name: process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "Hikaru's Olive",
  size: "105g", // 2026-11-03 Hikaru：首のある濃緑の角瓶。内容量は105g（岬工房の既存ラベルで確認）
  price: 5000, // 税込・送料別（2026-11-13 に 4,800 から変更）
  shipping: 600, // 発送の送料・全国一律（2026-11-16 Hikaru。レターパックプラス）。会での手渡しは0円
  freeShippingFrom: 10000, // 商品代金の合計がこの額以上なら送料なし（2026-11-19 Hikaru）。5,000円なら2本から
  bottles: 36, // 詰める本数・本番号 n/36（2026-11-19 Hikaru：48本から36本に変更）。売るのは33本（台帳の TOTAL・会の試飲に3本）
  // 特定商取引法の表示に使う条件（2026-11-16 Hikaru）。変える時は /legal と予約フォームの確認欄も同じ値を読む
  payDays: 7, // 銀行振込の期限＝予約から7日以内。過ぎたら予約は取り消し
  shipWindow: "2026年12月中旬から順次、12月20日までに発送します",
  shipWindowEn: "Ships from mid-December 2026, all sent by December 20",
  eventWindow: "12月上旬〜中旬の日曜、東京都内。日時と場所は12月1日までにメールでお知らせします",
  eventWindowEn: "A Sunday in early to mid December, in Tokyo. Date and venue are emailed by December 1",
  claimDays: 7, // 破損・不良の連絡期限＝到着から7日以内
  harvest: "2026年10〜11月、小豆島で収穫・搾油",
  // 瓶詰め（充填）は 2026-11-18（Hikaru 確認 11/24）。env で上書きできる
  bottlingDate: process.env.NEXT_PUBLIC_BOTTLING_DATE ?? "2026年11月18日",
  bottlingLabel: process.env.NEXT_PUBLIC_BOTTLING_LABEL ?? "11月18日",
  event: process.env.NEXT_PUBLIC_EVENT_NOTE ?? "12月上旬〜中旬、東京で「今年の油を開ける会」",
  // 英語版（/en）。日が決まったら NEXT_PUBLIC_BOTTLING_DATE_EN / LABEL_EN も入れる
  harvestEn: "Picked and pressed on Shodoshima, October to November 2026",
  bottlingDateEn: process.env.NEXT_PUBLIC_BOTTLING_DATE_EN ?? "November 18, 2026",
  bottlingLabelEn: process.env.NEXT_PUBLIC_BOTTLING_LABEL_EN ?? "November 18",
  eventEn: process.env.NEXT_PUBLIC_EVENT_NOTE_EN ?? "Early to mid December, Tokyo: the gathering to open this year's oil",
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

// 決済リンクは3本。手渡し用／発送・送料あり（1本だけ）／発送・送料なし（2本から）。
// 発送用が無ければ手渡し用のリンクに落とす
export function getStripePaymentLink(receive: "event" | "ship" = "event", qty = 1): string | null {
  const base = process.env.STRIPE_PAYMENT_LINK_URL;
  const ship = shippingFee(receive, qty) > 0 ? process.env.STRIPE_PAYMENT_LINK_URL_SHIP : process.env.STRIPE_PAYMENT_LINK_URL_SHIP_FREE;
  const url = receive === "ship" && ship && ship.startsWith("https://") ? ship : base;
  return url && url.startsWith("https://") ? url : null;
}

// 発送の送料。商品代金の合計が freeShippingFrom 以上なら0円
export function shippingFee(receive: "event" | "ship", qty = 1) {
  if (receive !== "ship") return 0;
  return product.price * qty >= product.freeShippingFrom ? 0 : product.shipping;
}

// 送料なしになる本数（5,000円・10,000円以上なら2）
export const freeShippingQty = Math.ceil(product.freeShippingFrom / product.price);

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

// 特定商取引法に基づく表記（/legal）に出す販売者の情報。住所は裏ラベルの販売者と同じ
export const seller = {
  company: "kando1合同会社",
  companyEn: "kando1 LLC (kando1合同会社)",
  person: "遠藤 光",
  personEn: "Hikaru Endo",
  address: "〒150-0044 東京都渋谷区円山町5番3号 MIEUX渋谷ビル8階",
  addressEn: "MIEUX Shibuya Bldg. 8F, 5-3 Maruyamacho, Shibuya-ku, Tokyo 150-0044, Japan",
  email: "contact@kando1.com",
};

// 振込の期限の日付（日本時間）。確認メールに書く
export function payDeadline(from: Date, lang: "ja" | "en" = "ja") {
  const d = new Date(from.getTime() + product.payDays * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString(lang === "en" ? "en-US" : "ja-JP", { timeZone: "Asia/Tokyo", month: "long", day: "numeric" });
}
