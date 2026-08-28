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

  // Network Tab -> Request Headers -> cookie থেকে পাওয়া সম্পূর্ণ স্ট্রিংটি এখানে বসান
  const sessionCookie = "
region=SG; language=en; mspid2=deaf89dd856917bdd5d8061728b1e2a0; _ga=GA1.1.816287696.1779698736; source=pc; datadome=1FUxrGGfsilF3GSg5HmEaMe1cNc9sQJ1WtMqpMo0jWbpLcSfsR9Qcbx~lPcMgx_yK1Nqauji96WS8yXovTMOk~mtvP~X4JtDeYdYsIW_MGhCYpMZguFrGZgNmV9gdBmH; _ga_PMR65LMTYY=GS2.1.s1787907230$o10$g1$t1787907535$j21$l0$h0";

  try {
    const response = await fetch('https://shop.garena.sg/api/auth/player_id_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        'Referer': 'https://shop.garena.sg/',
        'Origin': 'https://shop.garena.sg',
        'Cookie': sessionCookie
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
