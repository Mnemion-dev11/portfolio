export default async function handler(req, res) {
  // Hanya terima POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ambil token dari environment variable (aman, tidak terekspos ke browser)
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ error: 'Server config missing' });
  }

  try {
    const body = req.body;

    const message = `
🔔 *VISITOR BARU — Portfolio Dwi Agung*

🕐 *Waktu:* ${body.time || 'Unknown'} WIB
🌐 *URL:* ${body.url || 'Unknown'}
📎 *Referrer:* ${body.referrer || 'Direct / No referrer'}

📍 *Lokasi:*
• IP: \`${body.ip || 'Unknown'}\`
• Kota: ${body.city || 'Unknown'}, ${body.region || 'Unknown'}
• Negara: ${body.country || 'Unknown'}
• ISP: ${body.isp || 'Unknown'}

💻 *Device Info:*
• Platform: ${body.platform || 'Unknown'}
• Bahasa: ${body.language || 'Unknown'}
• Resolusi: ${body.resolution || 'Unknown'}

🌍 *Browser:*
\`${body.userAgent || 'Unknown'}\`
    `.trim();

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      }
    );

    if (!response.ok) {
      throw new Error('Telegram API error');
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send notification' });
  }
}
