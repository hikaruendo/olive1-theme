import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isLang, type Lang } from "@/lib/i18n";

const msg = {
  ja: {
    email: "メールアドレスを確認してください。",
    notConfigured: "クラブ受付の設定がまだです。",
    failed: "クラブ受付への送信に失敗しました。",
    joined: "Olive1クラブに参加しました。次の案内をお待ちください。",
  },
  en: {
    email: "Please check your email address.",
    notConfigured: "The club sign-up is not set up yet.",
    failed: "Could not send your sign-up. Please try again.",
    joined: "You are in the Olive1 Club. The next update will come by email.",
  },
} satisfies Record<Lang, unknown>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const source = "olive1-lp";

function isAlreadyRegisteredError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const values = Object.values(error)
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();

  return values.includes("already") || values.includes("exist");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    reason?: unknown;
    lang?: unknown;
  } | null;
  const lang: Lang = typeof body?.lang === "string" && isLang(body.lang) ? body.lang : "ja";
  const m = msg[lang];
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { message: m.email },
      { status: 400 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendSegmentId = process.env.RESEND_SEGMENT_ID;
  const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

  if (!resendApiKey) {
    console.error("[waitlist]", { configured: false });
    return NextResponse.json(
      { message: m.notConfigured },
      { status: 503 },
    );
  }

  const resend = new Resend(resendApiKey);
  const properties = {
    source,
    lang,
    submitted_at: new Date().toISOString(),
    ...(reason ? { reason } : {}),
  };

  const { error } = await resend.contacts.create(
    resendSegmentId
      ? {
          email,
          unsubscribed: false,
          properties,
          segments: [{ id: resendSegmentId }],
        }
      : {
          email,
          unsubscribed: false,
          properties,
          ...(resendAudienceId ? { audienceId: resendAudienceId } : {}),
        },
  );

  if (error && !isAlreadyRegisteredError(error)) {
    console.error("[waitlist]", { error });
    return NextResponse.json(
      { message: m.failed },
      { status: 502 },
    );
  }

  if (error) {
    console.info("[waitlist]", {
      email,
      status: "already_registered",
    });
  }

  return NextResponse.json({ message: m.joined });
}
