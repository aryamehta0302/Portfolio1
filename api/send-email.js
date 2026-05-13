module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const subject = (body.subject || 'Contact message').trim();
    const message = (body.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Hardcoded EmailJS configuration (as requested)
    const EMAILJS_SERVICE_ID = 'service_3hlmvdp';
    const EMAILJS_TEMPLATE_ID = 'template_a2ebc8a';
    const EMAILJS_PUBLIC_KEY = 'tC7H9CsmDu6d6eTpG';
    const EMAILJS_PRIVATE_KEY = '-aVP_MnYh1XJ90m5gv2Ir';

    const payload = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: name,
        from_email: email,
        subject,
        message,
        to_email: 'mehtarya60@gmail.com'
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
      return res.status(emailResp.status).json({ success: false, error: 'EmailJS API failed', detail: raw });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error', detail: String(error) });
  }
};
