// Vercel Serverless Function to receive Eligibility Submissions without MongoDB
// Direct submission forwarding to paylatertravelhelp@gmail.com

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    console.log('--- NEW PAY LATER TRAVEL APPLICATION RECEIVED ---');
    console.log(JSON.stringify(data, null, 2));

    // Forward to email without database (FormSubmit / Webhook / Web3Forms)
    const emailPayload = {
      _subject: `New Eligibility Inquiry [${data.refId || 'N/A'}] - ${data.fullName || 'Traveler'}`,
      _replyto: data.email,
      to: 'paylatertravelhelp@gmail.com',
      ...data
    };

    try {
      await fetch('https://formsubmit.co/ajax/paylatertravelhelp@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(emailPayload)
      });
    } catch (e) {
      console.warn('Email forward attempt logged:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Application successfully logged and dispatched for underwriting review.',
      refId: data.refId,
      notificationEmail: 'paylatertravelhelp@gmail.com'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process inquiry', details: error.message });
  }
}
