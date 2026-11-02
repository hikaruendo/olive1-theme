// 予約台帳（Google スプレッドシート＋Apps Script の Web アプリ）との通信。
// SHEET_WEBHOOK_URL と SHEET_SECRET が無ければ「台帳なし」として動く（メールだけの旧動作）。

export function sheetConfigured() {
  return !!process.env.SHEET_WEBHOOK_URL && !!process.env.SHEET_SECRET;
}

type SheetResult = { ok: boolean; error?: string; remaining?: number; matched?: boolean; duplicate?: boolean };

async function post(action: "reserve" | "paid", data: Record<string, unknown>): Promise<SheetResult> {
  const url = process.env.SHEET_WEBHOOK_URL!;
  // Apps Script は 302 で googleusercontent に飛ばして結果を返す。fetch の既定（follow）で受け取れる
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret: process.env.SHEET_SECRET, action, data }),
    cache: "no-store",
    signal: AbortSignal.timeout(25000),
  });
  const text = await res.text();
  try {
    return JSON.parse(text) as SheetResult;
  } catch {
    return { ok: false, error: `bad_response_${res.status}` };
  }
}

export type SheetReservation = {
  id: string;
  name: string;
  email: string;
  qty: number;
  receive: string;
  address: string;
  payment: string;
  referrer: string;
  note: string;
  lang: string;
};

export function sheetReserve(data: SheetReservation) {
  return post("reserve", data);
}

export type SheetPayment = {
  id: string | null;
  sessionId: string;
  qty: number;
  amount: number;
  email: string;
  name: string;
  address: string;
};

export function sheetPaid(data: SheetPayment) {
  return post("paid", data);
}

// 残り本数。取れなければ null（ページは本数を出さずに通常表示）
export async function sheetRemaining(): Promise<number | null> {
  if (!sheetConfigured()) return null;
  try {
    const res = await fetch(process.env.SHEET_WEBHOOK_URL!, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { ok?: boolean; remaining?: number };
    return data.ok && typeof data.remaining === "number" ? data.remaining : null;
  } catch (error) {
    console.error("[sheet] remaining", error);
    return null;
  }
}
