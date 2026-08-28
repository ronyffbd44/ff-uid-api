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
      message: "5930993272"
    });
  }

  try {
    const garenaApiUrl = `https://shop.garena.my/api/auth/player_id_login`;
    
    const response = await fetch(garenaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
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
        nickname: data.nickname
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Invalid UID or Player Not Found"
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
