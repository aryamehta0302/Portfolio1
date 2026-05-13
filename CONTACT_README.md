Contact form — Vercel direct send setup

- This project now uses a Vercel Serverless Function at `/api/send-email` to send mail directly via EmailJS API.
- No Outlook/mailto fallback is used anymore.

- EmailJS keys and IDs are hardcoded directly in `api/send-email.js`.
- No Vercel environment variables are required for this setup.

- Important: ensure your EmailJS template `template_a2ebc8a` has variables:
  - `from_name`
  - `from_email`
  - `subject`
  - `message`
  - `to_email`

- Deploy/redeploy on Vercel after code changes.

- Local test note:
  - `/api/send-email` works on Vercel runtime. If you test locally with plain HTML file open, API route is unavailable.
