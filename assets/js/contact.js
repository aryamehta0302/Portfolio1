// contact.js — handles sending contact form via Vercel API first, then EmailJS client fallback
(function () {
  async function sendEmail(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // 1) Try Vercel serverless API endpoint (direct send)
    let apiErrorMessage = '';
    try {
      const resp = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await resp.json().catch(() => ({}));
      if (resp.ok && data.success) {
        alert('Message sent successfully — thank you!');
        document.querySelector('form').reset();
        return;
      }
      apiErrorMessage = (data && (data.error || data.detail)) ? `${data.error || 'API error'}${data.detail ? `: ${data.detail}` : ''}` : 'Unknown API error';
      console.warn('Server API send failed:', data);
    } catch (err) {
      apiErrorMessage = String(err && err.message ? err.message : err);
      console.warn('Vercel API endpoint not available or failed:', err);
    }

    // 2) Try EmailJS client fallback
    if (typeof USE_EMAILJS !== 'undefined' && USE_EMAILJS && EMAILJS_USER_ID && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
      try {
        if (window.emailjs && !window.emailjs.__initialized) {
          emailjs.init(EMAILJS_USER_ID);
          window.emailjs.__initialized = true;
        }

        const templateParams = {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
          to_email: 'mehtarya60@gmail.com'
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        alert('Message sent — thank you!');
        document.querySelector('form').reset();
        return;
      } catch (err) {
        console.error('EmailJS error:', err);
        const fallbackErr = String(err && err.text ? err.text : (err && err.message ? err.message : err));
        alert(`Could not send message right now. API: ${apiErrorMessage || 'failed'}. EmailJS: ${fallbackErr}`);
      }
    }
    alert(`Unable to send message right now. API error: ${apiErrorMessage || 'No details available'}`);
  }

  // Expose sendEmail to global scope for inline form handler
  window.sendEmail = sendEmail;
})();
