export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const correctPassword = process.env.DASHBOARD_PASSWORD;

  if (!correctPassword) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (password === correctPassword) {
    // Create a simple session token (you could use JWT for more security)
    const sessionToken = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
    
    // Set httpOnly cookie for session
    res.setHeader('Set-Cookie', `dashboard_session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);
    
    return res.status(200).json({ success: true, token: sessionToken });
  } else {
    return res.status(401).json({ error: 'Invalid password' });
  }
}