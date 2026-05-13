Contact form — setup notes

- This project includes a client-side EmailJS integration and a simple PHP fallback.

- Client-side (recommended for static hosting):
  1. Create a free account at https://www.emailjs.com/ and create a service + template.
  2. Copy your `user ID`, `service ID`, and `template ID` into `assets/js/email-config.js`.
  3. Set `USE_EMAILJS = true` in `assets/js/email-config.js`.
  4. The template should expect parameters: `from_name`, `from_email`, `subject`, `message`.

- Quick setup using values provided in this workspace:
  - `EMAILJS_USER_ID` is set to `tC7H9CsmDu6d6eTpG` (public key).
  - `EMAILJS_SERVICE_ID` is set to `service_3hlmvdp`.
  - `EMAILJS_TEMPLATE_ID` is set to `template_a2ebc8a` in this workspace — ensure a template with that ID exists in your EmailJS dashboard or change the value in `assets/js/email-config.js`.

- To test EmailJS from your browser:
  1. Create a template in EmailJS named `template_contact` (or use your real template id).
  2. Open `contact.html` in a browser on a host that allows network requests.
  3. Submit the form; the site will first try the PHP endpoint, then EmailJS.
  4. Check the EmailJS dashboard for sent events and your inbox (`mehtarya60@gmail.com`).

- Server-side (optional):
  - If you host on a PHP-enabled server you can POST the form to `assets/php/send_mail.php`.
  - Ensure your server's mail() is configured (or replace with an SMTP library).

- Behavior: If EmailJS is configured the form will send without opening a mail client. Otherwise it falls back to opening the user's mail client (mailto).
