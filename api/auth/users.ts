import { SEED_USERS } from './_auth.ts';

export default async function handler(req: any, res: any) {
  const users = SEED_USERS.map(({ passwordHash, ...safeUser }) => safeUser);
  return res.status(200).json({ users });
}
