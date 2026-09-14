import React from 'react';
import { WalletCards, CheckCircle2, Info } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface HeaderProps {
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConfig }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* App Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold">
            <WalletCards className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              Cashflow
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                Mobile
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Pencatat Arus Kas & Bukti</p>
          </div>
        </div>

        {/* Backend Status Badge */}
        <button
          onClick={onOpenConfig}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all active:scale-95"
          title="Status Koneksi Database"
        >
          {isSupabaseConfigured ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-[11px]">Supabase Online</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-300 text-[11px]">Mode Demo / Lokal</span>
              <Info className="w-3.5 h-3.5 text-amber-400" />
            </>
          )}
        </button>
      </div>
    </header>
  );
};
