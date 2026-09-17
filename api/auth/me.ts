import { extractTokenFromCookies, verifyToken, getUserById } from '../../src/server/authHandler';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const cookieHeader = req.headers.cookie;
    const token = extractTokenFromCookies(cookieHeader);

    if (!token) {
      return res.status(401).json({ authenticated: false, error: 'Sesi login tidak ditemukan' });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.sub) {
      return res.status(401).json({ authenticated: false, error: 'Token JWT tidak valid atau telah kedaluwarsa' });
    }

    const user = getUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ authenticated: false, error: 'Pengguna tidak ditemukan' });
    }

    return res.status(200).json({
      authenticated: true,
      user,
    });
  } catch (err: any) {
    console.error('Me error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}
