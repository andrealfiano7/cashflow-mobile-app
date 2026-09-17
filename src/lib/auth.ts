import type { User, UserRole, Transaction } from '../types';

export type AuthAction =
  | 'add_transaction'
  | 'delete_transaction'
  | 'verify_proof'
  | 'view_reports'
  | 'manage_users';

export interface RoleConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  pro: {
    label: '💎 Pro',
    badgeBg: 'bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15',
    badgeText: 'text-amber-600 dark:text-amber-400',
    badgeBorder: 'border-amber-500/30',
    description: 'Akses Penuh Tanpa Batas: Export CSV, Laporan Rasio Keuangan, & Arsip Bukti HD',
  },
  basic: {
    label: 'Basic',
    badgeBg: 'bg-slate-500/10 dark:bg-slate-500/20',
    badgeText: 'text-slate-600 dark:text-slate-400',
    badgeBorder: 'border-slate-500/30',
    description: 'Paket Standar: Pencatatan arus kas, kontrol saldo, & verifikasi bukti bayar',
  },
};

export const DEMO_ACCOUNTS = [
  { email: 'pro@cashflow.com', password: 'pro123', role: 'pro' as UserRole, name: 'Ahmad Pratama' },
  { email: 'basic@cashflow.com', password: 'basic123', role: 'basic' as UserRole, name: 'Budi Santoso' },
];

export async function loginUser(email: string, password: string): Promise<User> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Ensure HttpOnly cookie is accepted
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal login');
  }

  // Backup active user in localStorage for fast UI hydration/offline
  localStorage.setItem('cashflow_active_user', JSON.stringify(data.user));
  return data.user as User;
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.warn('Logout request failed:', err);
  } finally {
    localStorage.removeItem('cashflow_active_user');
  }
}

export async function checkCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      // Fallback check: if serverless endpoint is starting up, check cached user
      const cached = localStorage.getItem('cashflow_active_user');
      return cached ? JSON.parse(cached) : null;
    }

    const data = await res.json();
    if (data.authenticated && data.user) {
      localStorage.setItem('cashflow_active_user', JSON.stringify(data.user));
      return data.user as User;
    }
  } catch (err) {
    const cached = localStorage.getItem('cashflow_active_user');
    return cached ? JSON.parse(cached) : null;
  }
  return null;
}

export function canPerformAction(user: User | null, action: AuthAction, _targetTx?: Transaction): boolean {
  if (!user) return false;

  switch (action) {
    case 'add_transaction':
    case 'delete_transaction':
    case 'verify_proof':
    case 'view_reports':
    case 'manage_users':
      return true;

    default:
      return true;
  }
}
