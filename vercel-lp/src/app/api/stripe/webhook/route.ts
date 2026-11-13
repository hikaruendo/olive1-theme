import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { product, yen } from "@/lib/reserve";
import { sheetConfigured, sheetPaid } from "@/lib/sheet";

// Stripe の決済完了（Payment Link）を受けて、台帳の行を「入金済み」にする。
// 署名は STRIPE_WEBHOOK_SECRET（whsec_…）で確かめる。SDK は入れず、公式の手順どおり HMAC を自前で計算する。

const TOLERANCE_SEC = 300;

function verify(payload: string, header: string | null, secret: string) {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const [k, ...v] = kv.split("=");
      return [k, v.join("=")];
    }),
  );
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > TOLERANCE_SEC) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  const signatures = header
    .split(",")
    .filter((kv) => kv.startsWith("v1="))
    .map((kv) => kv.slice(3));
  return signatures.some((sig) => {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

type Address = { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postal_code?: string | null; country?: string | null };
type Session = {
  id: string;
  client_reference_id?: string | null;
  amount_total?: number | null;
  payment_status?: string;
  customer_details?: { email?: string | null; name?: string | null } | null;
  shipping_details?: { name?: string | null; address?: Address | null } | null;
  collected_information?: { shipping_details?: { name?: string | null; address?: Address | null } | null } | null;
};

function formatAddress(s: Session) {
  const ship = s.collected_information?.shipping_details ?? s.shipping_details;
  const a = ship?.address;
  if (!a) return "";
  return [a.postal_code ? `〒${a.postal_code}` : "", a.state, a.city, a.line1, a.line2, ship?.name ? `（${ship.name}）` : ""]
    .filter(Boolean)
    .join(" ");
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ message: "not configured" }, { status: 503 });

  const payload = await request.text();
  if (!verify(payload, request.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ message: "bad signature" }, { status: 400 });
  }

  const event = JSON.parse(payload) as { type: string; data: { object: Session } };
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
    return NextResponse.json({ received: true });
  }
  const s = event.data.object;
  if (s.payment_status !== "paid") return NextResponse.json({ received: true });

  const amount = s.amount_total ?? 0; // JPY は小数なし
  const qty = Math.round(amount / product.price);
  const id = s.client_reference_id ?? null;
  const email = s.customer_details?.email ?? "";
  const name = s.customer_details?.name ?? s.collected_information?.shipping_details?.name ?? "";
  const address = formatAddress(s);

  if (sheetConfigured()) {
    const result = await sheetPaid({ id, sessionId: s.id, qty, amount, email, name, address }).catch((error) => {
      console.error("[stripe-webhook] sheet", error);
      return { ok: false, error: "network" };
    });
    // 台帳に書けなければ 500 を返して Stripe に再送させる
    if (!result.ok) return NextResponse.json({ message: "sheet failed" }, { status: 500 });
  }

  // 自分への入金通知（落ちても決済の記録は台帳と Stripe にある）
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.RESERVE_NOTIFY_EMAIL;
  if (key && from && to) {
    const r = await new Resend(key).emails.send({
      from,
      to,
      replyTo: email || undefined,
      subject: `[入金・カード] ${id ?? "予約番号なし"} ${name} ${qty}本 ${yen(amount)}`,
      text: [
        `予約番号: ${id ?? "なし（決済リンクから直接）"}`,
        `お名前: ${name}`,
        `メール: ${email}`,
        `本数: ${qty}本`,
        `金額: ${yen(amount)}`,
        ...(address ? [`発送先: ${address}`] : []),
        `Stripe: ${s.id}`,
        "",
        "台帳で本番号を振って、お客さんに返信してください。",
      ].join("\n"),
    });
    if (r.error) console.error("[stripe-webhook] notify", r.error);
  }

  return NextResponse.json({ received: true });
}
