async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string' && req.body.trim()) {
    return JSON.parse(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = await parseJsonBody(req);
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const subject = (body.subject || 'Contact message').trim();
    const message = (body.message || '').trim();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    if (!emailOk) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    // Hardcoded EmailJS configuration (as requested)
    const EMAILJS_SERVICE_ID = 'service_3hlmvdp';
    const EMAILJS_TEMPLATE_ID = 'template_a2ebc8a';
    const EMAILJS_PUBLIC_KEY = 'tC7H9CsmDu6d6eTpG';
    const EMAILJS_PRIVATE_KEY = '-aVP_MnYh1XJ90m5gv2Ir';

    const fixedRecipient = 'mehtarya60@gmail.com';

    const payload = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: name,
        from_email: email,
        reply_to: email,
        subject,
        message,
        // Recipient aliases to support different EmailJS template variable names.
        to_email: fixedRecipient,
        to: fixedRecipient,
        email: fixedRecipient,
        recipient_email: fixedRecipient,
        recipient: fixedRecipient
      },
      accessToken: EMAILJS_PRIVATE_KEY
    };

    const emailResp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const raw = await emailResp.text();
    if (!emailResp.ok) {
      return res.status(emailResp.status).json({ success: false, error: 'EmailJS API failed', detail: raw || 'No response body from EmailJS' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error', detail: String(error && error.message ? error.message : error) });
  }
};
