import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;

  if (!webhookUrl) {
    console.info("[waitlist]", { email, configured: false });
    return NextResponse.json({
      message: "登録を受け付けました。保存先はまだ未設定です。",
    });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      source: "olive1-lp",
      submittedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "登録先への送信に失敗しました。" },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "登録しました。案内をお待ちください。" });
}
