// contact.js — handles sending contact form via Vercel API
(function () {
  async function sendEmail(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // 1) Try Vercel serverless API endpoint (direct send)
    let apiErrorMessage = '';
    let apiStatus = 'n/a';
    try {
      const resp = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await resp.json().catch(() => ({}));
      apiStatus = String(resp.status);
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

    alert(`[Contact v3] Send failed. API status: ${apiStatus}. API error: ${apiErrorMessage || 'No details available'}`);
  }

  // Expose sendEmail to global scope for inline form handler
  window.sendEmail = sendEmail;
})();
