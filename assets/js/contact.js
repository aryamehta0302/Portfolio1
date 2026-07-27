// contact.js — handles sending contact form via EmailJS REST API (Bypasses CDN adblocker issues)

(function () {
  async function sendEmail(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const submitBtn = document.querySelector('form button[type="submit"]');

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
    if (submitBtn) submitBtn.innerHTML = 'Sending...';

    const data = {
      service_id: window.EMAILJS_SERVICE_ID || 'service_3hlmvdp',
      template_id: window.EMAILJS_TEMPLATE_ID || 'template_a2ebc8a',
      user_id: window.EMAILJS_USER_ID || 'tC7H9CsmDu6d6eTpG',
      template_params: {
        from_name: name,
        from_email: email,
        reply_to: email,
        to_email: 'mehtarya60@gmail.com',
        email: 'mehtarya60@gmail.com', // Added this to satisfy the {{email}} field in dashboard
        to_name: 'Arya Mehta',
        subject: subject,
        message: message
      }
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Message sent successfully — thank you!');
        document.querySelector('form').reset();
        if (submitBtn) submitBtn.innerHTML = originalBtnText;
      } else {
        const errorText = await response.text();
        console.warn('EmailJS API Error:', errorText);
        alert(`Email sending failed. Error: ${errorText}\nPlease check your EmailJS Template settings.`);
        if (submitBtn) submitBtn.innerHTML = originalBtnText;
      }
    } catch (err) {
      console.warn('Network Error:', err);
      alert('Network error. Your browser or adblocker might be blocking the request. Please contact me directly via LinkedIn.');
      if (submitBtn) submitBtn.innerHTML = originalBtnText;
    }
  }

  window.sendEmail = sendEmail;
})();
