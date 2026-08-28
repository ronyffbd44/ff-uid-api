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
    // shop.garena.sg Endpoint
    const response = await fetch('https://shop.garena.sg/api/auth/player_id_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://shop.garena.sg/'
      },
      body: JSON.stringify({
        app_id: 100067,
        login_id: uid,
        app_server_id: 0
      })
    });

    const data = await response.json();

    if (data && data.nickname) {
      return res.status(200).json({
        status: true,
        uid: uid,
        nickname: data.nickname,
        region: data.region || 'SG/BD'
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
