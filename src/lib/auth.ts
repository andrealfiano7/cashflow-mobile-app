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
  admin: {
    label: 'Admin',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    badgeText: 'text-rose-600 dark:text-rose-400',
    badgeBorder: 'border-rose-500/30',
    description: 'Akses penuh: Tambah, hapus semua transaksi, dan verifikasi bukti bayar',
  },
  finance: {
    label: 'Finance',
    badgeBg: 'bg-brand-500/10 dark:bg-brand-500/20',
    badgeText: 'text-brand-600 dark:text-brand-400',
    badgeBorder: 'border-brand-500/30',
    description: 'Pengelola kas: Catat transaksi, analisa laporan, dan verifikasi bukti bayar',
  },
  member: {
    label: 'Staff / Member',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    badgeText: 'text-blue-600 dark:text-blue-400',
    badgeBorder: 'border-blue-500/30',
    description: 'Pencatat mutasi: Dapat menambah transaksi & bukti bayar milik sendiri',
  },
  viewer: {
    label: 'Auditor / Viewer',
    badgeBg: 'bg-slate-500/10 dark:bg-slate-500/20',
    badgeText: 'text-slate-600 dark:text-slate-400',
    badgeBorder: 'border-slate-500/30',
    description: 'Hanya baca: Dapat memantau laporan dan transaksi tanpa hak ubah',
  },
};

export const DEMO_ACCOUNTS = [
  { email: 'admin@cashflow.com', password: 'admin123', role: 'admin' as UserRole, name: 'Ahmad Pratama' },
  { email: 'finance@cashflow.com', password: 'finance123', role: 'finance' as UserRole, name: 'Siti Rahma' },
  { email: 'budi@cashflow.com', password: 'user123', role: 'member' as UserRole, name: 'Budi Santoso' },
  { email: 'viewer@cashflow.com', password: 'viewer123', role: 'viewer' as UserRole, name: 'Rina Melati' },
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

export function canPerformAction(user: User | null, action: AuthAction, targetTx?: Transaction): boolean {
  if (!user) return false;

  switch (action) {
    case 'add_transaction':
      // Admin, Finance, Member can add; Viewer cannot
      return user.role !== 'viewer';

    case 'delete_transaction':
      // Admin can delete any transaction
      if (user.role === 'admin') return true;
      // Member can only delete if it is their own transaction
      if (user.role === 'member' && targetTx?.user_id === user.id) return true;
      // Finance can delete own transactions
      if (user.role === 'finance' && (!targetTx?.user_id || targetTx.user_id === user.id)) return true;
      return false;

    case 'verify_proof':
      // Only Admin and Finance can approve / reject proofs
      return user.role === 'admin' || user.role === 'finance';

    case 'view_reports':
      return true;

    case 'manage_users':
      return user.role === 'admin';

    default:
      return false;
  }
}
