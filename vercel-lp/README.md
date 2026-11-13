# Olive1 Vercel LP

Next.js App Router app for the Olive1 waitlist landing page.

## Local development

```bash
npm run dev
```

Open http://localhost:3000.

## Deploy on Vercel

When importing the Git repository into Vercel, set:

- Framework Preset: `Next.js`
- Root Directory: `vercel-lp`
- Build Command: `npm run build`
- Output Directory: leave empty

## Waitlist endpoint

The form posts to `/api/waitlist`.

Set `RESEND_API_KEY` in Vercel Environment Variables to save signups as Resend contacts.

Optional list routing:

- `RESEND_SEGMENT_ID`: recommended. Adds the contact to a Resend Segment.
- `RESEND_AUDIENCE_ID`: legacy fallback if the account still uses Audiences.

Each contact is created with:

```json
{
  "email": "customer@example.com",
  "unsubscribed": false,
  "properties": {
    "source": "olive1-lp",
    "submitted_at": "2026-05-16T00:00:00.000Z"
  }
}
```

Without `RESEND_API_KEY`, submissions return a setup error so leads are not silently lost.

## Reserve endpoint (/reserve)

`/reserve` is the pre-order page for the first lot. The form posts to `/api/reserve`.

- `RESERVE_STATUS`: `closed` (default) shows "11/26から", `open` shows the form, `soldout` shows the sold-out card.
- `RESERVE_NOTIFY_EMAIL`: where each reservation is emailed (required in `open`).
- `RESEND_FROM`: sender for the notification and the customer confirmation. Must be a verified domain in Resend.
- `BANK_*`: all five must be set for "銀行振込" to be selectable. The account appears on `/reserve/thanks` and in the confirmation email only.
- `STRIPE_PAYMENT_LINK_URL`: a Stripe Payment Link. The customer is redirected with `prefilled_email` and `client_reference_id=<reservation id>`. Enable adjustable quantity on the link; the form cannot pass quantity to a Payment Link.
- `RESERVE_DRY_RUN=1`: log instead of sending email (local only).

Each reservation gets an id `R-YYYYMMDD-NNNN`. Bottle numbers (n/48) are assigned by hand in the reply.

## 日英切り替え（/en）

- 日本語は接頭辞なし（`/`, `/reserve`, `/journal/x`）、英語は `/en` 付き（`/en`, `/en/reserve`, `/en/journal/x`）。`src/proxy.ts` が接頭辞なしのパスを内部的に `/ja/...` へ書き換える（`/ja/...` を直接開くと接頭辞なしへ308）。
- ページは `src/app/[lang]/` の下。文言は `src/content/`（`ui.ts` ヘッダー・フッター・フォーム／`home.ts` トップ／`reserve.ts` 予約／`journal-en.ts` 英語の読み物）。日本語の読み物は `src/lib/journal.ts` のまま。英語は直訳にせず、同じ事実を同じ順で書く。
- ヘッダー右の「English／日本語」で同じページの別言語へ。`<html lang>` と `hreflang` も言語ごとに出る。
- 予約フォームと会員登録は `lang` をAPIに送る。英語から予約すると、お客さんへの確認メールは英語、自分への通知メールは日本語のまま（末尾に「言語: 英語ページから」）。
- 瓶詰め日を確定したら `NEXT_PUBLIC_BOTTLING_DATE_EN` / `NEXT_PUBLIC_BOTTLING_LABEL_EN` も入れる。

## 予約台帳（Google スプレッドシート）

- 予約は Apps Script の Web アプリ経由でスプレッドシート「Olive1 予約台帳 2026」に1行ずつ入る。追加の前にロックをかけて残り本数を数えるので、同時に予約が来ても 50 本を超えない（超える分は「残りは◯本です」で断る）
- 予約ページは受付中だけ台帳から残り本数を読み「残り◯本」を出す。0 になると売り切れ表示に自動で切り替わる
- カード決済は Stripe の webhook（`/api/stripe/webhook`、`checkout.session.completed`）で台帳の行を「入金済み」にし、入金通知メールを送る。署名は `STRIPE_WEBHOOK_SECRET` で確認
- env：`SHEET_WEBHOOK_URL`（Web アプリの URL）、`SHEET_SECRET`（Apps Script の SECRET と同じ値）、`STRIPE_WEBHOOK_SECRET`。`SHEET_*` が無ければ台帳なし（メールだけ）で動く
- 設定と毎日の使い方は `apps-script/README.md`
