import React from 'react';
import { CheckCircle2, Info, Moon, Sun } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { ROLE_CONFIGS } from '../lib/auth';
import type { Theme } from '../lib/theme';
import type { User } from '../types';

interface HeaderProps {
  onOpenConfig: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  currentUser?: User | null;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConfig,
  theme,
  onToggleTheme,
  currentUser,
  onOpenProfile,
}) => {
  const roleCfg = currentUser ? ROLE_CONFIGS[currentUser.role] : null;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* App Branding */}
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Cashflow Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Cashflow
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30">
                Mobile
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Arus Kas &amp; Bukti Transfer</p>
          </div>
        </div>

        {/* Right Actions: User Role Chip + Theme Toggle + Backend Status */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* User Profile & Role Chip */}
          {currentUser && onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
              title={`Login sebagai ${currentUser.name} (${roleCfg?.label})`}
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-brand-500/40 shrink-0"
              />
              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border ${roleCfg?.badgeBg} ${roleCfg?.badgeText} ${roleCfg?.badgeBorder}`}
              >
                {roleCfg?.label}
              </span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all active:scale-90"
            title={theme === 'dark' ? 'Ganti ke Mode Terang (Light)' : 'Ganti ke Mode Gelap (Dark)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Backend Status Badge */}
          <button
            onClick={onOpenConfig}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
            title="Status Koneksi Database"
          >
            {isSupabaseConfigured ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold hidden sm:inline">Supabase</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-amber-700 dark:text-amber-300 text-[10px] font-semibold hidden sm:inline">Demo</span>
                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
