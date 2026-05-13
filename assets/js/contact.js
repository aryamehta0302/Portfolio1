// contact.js — handles sending contact form via EmailJS or fallback to mailto
(function () {
  async function sendEmail(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // 1) Try server-side PHP endpoint (direct send) if available
    try {
      const resp = await fetch('assets/php/send_mail.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ name, email, subject, message })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          alert('Message sent successfully — thank you!');
          document.querySelector('form').reset();
          return;
        }
      }
      // If server responded but not ok, fall through to other methods
    } catch (err) {
      // Network error or PHP not available — continue to EmailJS or mailto
      console.warn('PHP endpoint not available or failed:', err);
    }

    // 2) Try EmailJS if configured
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
          message: message
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        alert('Message sent — thank you!');
        document.querySelector('form').reset();
        return;
      } catch (err) {
        console.error('EmailJS error:', err);
        alert('Could not send message via EmailJS. Falling back to mail client.');
      }
    }

    // 3) Final fallback: open mail client (mailto)
    fallbackMail(name, email, subject, message);
  }

  function fallbackMail(name, email, subject, message) {
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:mehtarya60@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }

  // Expose sendEmail to global scope for inline form handler
  window.sendEmail = sendEmail;
})();
