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

Each reservation gets an id `R-YYYYMMDD-NNNN`. Bottle numbers (n/50) are assigned by hand in the reply.
