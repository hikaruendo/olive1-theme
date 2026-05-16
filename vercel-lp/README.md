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

Set `WAITLIST_WEBHOOK_URL` in Vercel Environment Variables to forward signups to a no-code endpoint such as Make, Zapier, Formspark, or a small database API.

Payload sent to the webhook:

```json
{
  "email": "customer@example.com",
  "source": "olive1-lp",
  "submittedAt": "2026-05-16T00:00:00.000Z"
}
```

Without `WAITLIST_WEBHOOK_URL`, local submissions are accepted but only logged by the Vercel function.
