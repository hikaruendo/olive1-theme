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
