import React from 'react';
import { CheckCircle2, HardDrive, Moon, Sun } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Theme } from '../lib/theme';

interface HeaderProps {
  onOpenConfig: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConfig,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3.5 py-2.5 sm:px-4 sm:py-3 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* App Branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img src="/logo.png" alt="Cashflow Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm shrink-0" />
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate leading-tight">
              Cashflow
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">Arus Kas &amp; Bukti Transfer</p>
          </div>
        </div>

        {/* Right Actions: Theme Toggle + Local Storage Status */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all active:scale-90 shrink-0"
            title={theme === 'dark' ? 'Ganti ke Mode Terang (Light)' : 'Ganti ke Mode Gelap (Dark)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Storage / Backend Status Badge */}
          <button
            onClick={onOpenConfig}
            className="flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 shrink-0"
            title="Status Penyimpanan Data"
          >
            {isSupabaseConfigured ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">Cloud</span>
              </>
            ) : (
              <>
                <HardDrive className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="text-slate-700 dark:text-slate-200 text-[11px] font-semibold">Lokal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
