# Portfolio Deployment Guide (Vercel)

This guide is for deploying this portfolio on Vercel with a working contact form that sends emails directly.

## Project Setup Used

- Frontend form: `contact.html`
- Frontend submit script: `assets/js/contact.js`
- Vercel serverless API route: `api/send-email.js`
- Email provider: EmailJS API

## Before Deploy

1. Confirm these files exist:
- `contact.html`
- `assets/js/contact.js`
- `api/send-email.js`

2. Confirm form submission in `contact.html` uses:
- `onsubmit="sendEmail(event)"`

3. Confirm `assets/js/contact.js` sends request to:
- `/api/send-email`

## Deploy to Vercel

1. Push this project to GitHub.
2. Open Vercel dashboard.
3. Click **Add New Project**.
4. Import your GitHub repository.
5. Framework preset: **Other** (or static).
6. Keep default build settings (no custom build command needed for this project).
7. Click **Deploy**.

## Why This Works on Vercel

- Vercel serves your static files (`.html`, CSS, JS).
- Vercel runs `api/send-email.js` as a serverless function.
- The contact form calls `/api/send-email`.
- The serverless function sends the email through EmailJS API.

## Verify After Deploy

1. Open deployed site URL.
2. Go to `contact.html`.
3. Fill out and submit the form.
4. Expected result:
- Alert shows success message.
- Message is delivered to `mehtarya60@gmail.com`.

## If Email Is Not Sending

1. Check browser DevTools -> Network -> `/api/send-email`.
2. If status is not 200, inspect response JSON.
3. Verify EmailJS IDs in `api/send-email.js`:
- service id
- template id
- public key
- private key
4. Verify EmailJS template variables include:
- `from_name`
- `from_email`
- `subject`
- `message`
- `to_email`

## Notes

- This setup currently keeps EmailJS keys in files as requested.
- If repository is public, move private key to Vercel environment variables for security.
