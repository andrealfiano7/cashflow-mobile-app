import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import type { User, UserRole } from '../types/index.ts';

export interface UserAccount extends User {
  passwordHash: string; // plain for demo seed, in real apps hashed
}

export const JWT_SECRET = process.env.JWT_SECRET || 'cashflow-jwt-super-secret-key-2026-auth-token';
export const COOKIE_NAME = 'auth_token';

// Pre-seeded multi-user accounts representing different RBAC roles
export const SEED_USERS: UserAccount[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@cashflow.com',
    name: 'Ahmad Pratama',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    passwordHash: 'admin123',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-finance-1',
    email: 'finance@cashflow.com',
    name: 'Siti Rahma',
    role: 'finance',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    passwordHash: 'finance123',
    created_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'usr-member-1',
    email: 'budi@cashflow.com',
    name: 'Budi Santoso',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    passwordHash: 'user123',
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'usr-viewer-1',
    email: 'viewer@cashflow.com',
    name: 'Rina Melati',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    passwordHash: 'viewer123',
    created_at: '2026-01-15T00:00:00Z',
  },
];

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  iat?: number;
  exp?: number;
}

export function signToken(user: User): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    return null;
  }
}

export function createAuthCookie(token: string): string {
  return cookie.stringifySetCookie({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAuthCookie(): string {
  return cookie.stringifySetCookie({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export function extractTokenFromCookies(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;
  const parsed = cookie.parseCookie(cookieHeader);
  return parsed[COOKIE_NAME] || null;
}

export function authenticateUser(email: string, password: string):User | null {
  const user = SEED_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
  );
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function getUserById(id: string): User | null {
  const user = SEED_USERS.find(u => u.id === id);
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
