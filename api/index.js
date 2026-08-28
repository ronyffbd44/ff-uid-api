export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({
      status: false,
      message: "UID প্রয়োজন! উদাহরণ: /api?uid=12345678"
    });
  }

  try {
    // TopUp BD / Regional Player Info Endpoint
    const response = await fetch(`https://shop2game.com/api/auth/player_id_login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://shop2game.com/'
      },
      body: JSON.stringify({
        app_id: 100067,
        login_id: uid,
        app_server_id: 0
      })
    });

    const data = await response.json();

    // DataDome Captcha ধরা পড়লে
    if (data.url && data.url.includes('captcha')) {
      return res.status(429).json({
        status: false,
        message: "Garena-এর Captcha সিকিউরিটি ধরা পড়েছে।",
        solution: "Proxy/Cookies ব্যবহার করতে হবে অথবা প্রস্তুতকৃত API Provider Gateway ব্যবহার করতে হবে।"
      });
    }

    if (data && data.nickname) {
      return res.status(200).json({
        status: true,
        uid: uid,
        nickname: data.nickname,
        region: data.region || 'BD/SG'
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Invalid UID or Player Not Found",
        raw: data
      });
    }

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message
    });
  }
}
