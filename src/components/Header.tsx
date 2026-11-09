import React from 'react';
import { CheckCircle2, HardDrive, Moon, Sparkles, Sun } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Theme } from '../lib/theme';
import type { AppTier } from '../types';

interface HeaderProps {
  onOpenConfig: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  tier?: AppTier;
  onToggleTier?: () => void;
  onOpenUpgrade?: (reason?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConfig,
  theme,
  onToggleTheme,
  tier = 'pro',
  onToggleTier,
  onOpenUpgrade,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3.5 py-2.5 sm:px-4 sm:py-3 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* App Branding */}
        <div className="flex items-center gap-2 min-w-0">
          <img src="/logo.png" alt="Cashflow Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
              Cashflow
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30 shrink-0">
                Mobile
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Arus Kas &amp; Bukti Transfer (Lokal)</p>
          </div>
        </div>

        {/* Right Actions: Tier Badge + Theme Toggle + Local Storage Status */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Tier Switcher / Upgrade Badge */}
          {tier === 'pro' ? (
            <button
              onClick={onToggleTier}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] active:scale-95 transition-all shadow-sm shrink-0"
              title="Paket Pro Aktif (Klik untuk beralih ke Basic untuk testing)"
            >
              <span>💎 Pro</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenUpgrade?.('general')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold text-[10px] active:scale-95 transition-all shadow-sm shrink-0"
              title="Paket Basic (Klik untuk upgrade ke Pro)"
            >
              <span>Basic</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all active:scale-90 shrink-0"
            title={theme === 'dark' ? 'Ganti ke Mode Terang (Light)' : 'Ganti ke Mode Gelap (Dark)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
            )}
          </button>

          {/* Storage / Backend Status Badge */}
          <button
            onClick={onOpenConfig}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 shrink-0"
            title="Penyimpanan Data Lokal"
          >
            {isSupabaseConfigured ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold hidden sm:inline">Cloud</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-700 dark:text-slate-300 text-[10px] font-semibold hidden sm:inline">Lokal</span>
                <HardDrive className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
