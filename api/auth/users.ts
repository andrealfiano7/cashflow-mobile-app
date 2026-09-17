import { SEED_USERS } from '../../src/server/authHandler';

export default async function handler(req: any, res: any) {
  const users = SEED_USERS.map(({ passwordHash, ...safeUser }) => safeUser);
  return res.status(200).json({ users });
}
