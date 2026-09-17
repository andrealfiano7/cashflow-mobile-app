import React from 'react';
import { X, LogOut, Shield, CheckCircle2, RefreshCw } from 'lucide-react';
import { ROLE_CONFIGS, DEMO_ACCOUNTS } from '../lib/auth';
import type { User } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onLogout: () => void;
  onSwitchUser: (user: User) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onSwitchUser,
}) => {
  if (!isOpen) return null;

  const currentRoleCfg = ROLE_CONFIGS[currentUser.role];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm">
            <Shield className="w-4 h-4 text-brand-500" />
            <span>Profil &amp; Hak Akses</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-brand-500/30 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</h3>
                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${currentRoleCfg.badgeBg} ${currentRoleCfg.badgeText} ${currentRoleCfg.badgeBorder}`}
                >
                  {currentRoleCfg.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
            </div>
          </div>

          {/* Role Description Card */}
          <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/15 text-[11px] text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">Wewenang Role:</p>
            <p>{currentRoleCfg.description}</p>
          </div>

          {/* Switch Account (Multi-user & RBAC Testing) */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-brand-500" />
              Beralih Akun (Uji RBAC):
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => {
                const isCurrent = acc.email === currentUser.email;
                const cfg = ROLE_CONFIGS[acc.role];
                return (
                  <button
                    key={acc.role}
                    disabled={isCurrent}
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/auth/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify({ email: acc.email, password: acc.password }),
                        });
                        const data = await res.json();
                        if (data.user) {
                          onSwitchUser(data.user);
                          onClose();
                        }
                      } catch (err) {
                        console.error('Failed to switch user:', err);
                      }
                    }}
                    className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                      isCurrent
                        ? 'bg-brand-500/10 border-brand-500/30 text-brand-600 dark:text-brand-400 font-bold opacity-80 cursor-default'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 active:scale-95'
                    }`}
                  >
                    <div>
                      <p className="text-[11px] font-bold truncate">{acc.name.split(' ')[0]}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{cfg.label}</p>
                    </div>
                    {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
