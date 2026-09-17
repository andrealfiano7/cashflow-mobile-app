import { clearAuthCookie } from './_auth.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Set-Cookie', clearAuthCookie());
  return res.status(200).json({ success: true, message: 'Logout berhasil' });
}
