import { NextResponse } from "next/server";
import { Resend } from "resend";

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
  } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { message: "メールアドレスを確認してください。" },
      { status: 400 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendSegmentId = process.env.RESEND_SEGMENT_ID;
  const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

  if (!resendApiKey) {
    console.error("[waitlist]", { configured: false });
    return NextResponse.json(
      { message: "登録先の設定がまだです。" },
      { status: 503 },
    );
  }

  const resend = new Resend(resendApiKey);
  const properties = {
    source,
    submitted_at: new Date().toISOString(),
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
      { message: "登録先への送信に失敗しました。" },
      { status: 502 },
    );
  }

  if (error) {
    console.info("[waitlist]", {
      email,
      status: "already_registered",
    });
  }

  return NextResponse.json({ message: "登録しました。案内をお待ちください。" });
}
