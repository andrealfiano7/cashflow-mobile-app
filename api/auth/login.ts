import { authenticateUser, signToken, createAuthCookie } from '../../src/server/authHandler';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    const user = authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const token = signToken(user);
    const cookieHeader = createAuthCookie(token);

    res.setHeader('Set-Cookie', cookieHeader);
    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      user,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}
