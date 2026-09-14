import React from 'react';
import { LayoutDashboard, ReceiptText, Plus, FileCheck2, BarChart3 } from 'lucide-react';
import type { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  pendingProofsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenAddModal,
  pendingProofsCount,
}) => {
  const tabClass = (tab: ActiveTab) =>
    `relative flex flex-col items-center justify-center flex-1 py-2 px-1 transition-all duration-300 ease-out group outline-none select-none ${
      activeTab === tab
        ? 'text-brand-500 dark:text-brand-400'
        : 'text-slate-400 dark:text-slate-500 active:text-slate-600 dark:active:text-slate-300'
    }`;

  const iconClass = (tab: ActiveTab) =>
    `w-[22px] h-[22px] transition-all duration-300 ease-out ${
      activeTab === tab
        ? 'scale-110 stroke-[2.5] drop-shadow-[0_0_6px_rgba(1,147,165,0.5)]'
        : 'stroke-[1.8] group-active:scale-90'
    }`;

  const labelClass = (tab: ActiveTab) =>
    `text-[10px] mt-1 tracking-tight transition-all duration-300 ${
      activeTab === tab ? 'font-bold' : 'font-medium'
    }`;

  const indicator = (tab: ActiveTab) =>
    activeTab === tab ? (
      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-brand-500 dark:bg-brand-400 shadow-[0_0_8px_rgba(1,147,165,0.7)] transition-all duration-300" />
    ) : null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/60 shadow-[0_-4px_30px_rgba(0,0,0,0.3)] pb-safe transition-colors">
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-around relative">
        {/* Tab 1: Dashboard */}
        <button onClick={() => onChangeTab('dashboard')} className={tabClass('dashboard')}>
          <LayoutDashboard className={iconClass('dashboard')} />
          <span className={labelClass('dashboard')}>Dashboard</span>
          {indicator('dashboard')}
        </button>

        {/* Tab 2: Transaksi */}
        <button onClick={() => onChangeTab('transactions')} className={tabClass('transactions')}>
          <ReceiptText className={iconClass('transactions')} />
          <span className={labelClass('transactions')}>Transaksi</span>
          {indicator('transactions')}
        </button>

        {/* Floating Center Action Button (+) */}
        <div className="flex-1 flex justify-center -mt-7 px-1">
          <button
            onClick={onOpenAddModal}
            className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-400 text-white flex items-center justify-center shadow-[0_8px_24px_rgba(1,147,165,0.5)] hover:shadow-[0_12px_32px_rgba(1,147,165,0.65)] ring-[3px] ring-slate-900 dark:ring-slate-950 active:scale-[0.88] transition-all duration-300 ease-out focus:outline-none"
            title="Tambah Transaksi Baru"
          >
            <span className="absolute inset-0 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-500 ease-out drop-shadow-sm" />
          </button>
        </div>

        {/* Tab 3: Bukti Bayar */}
        <button onClick={() => onChangeTab('proofs')} className={tabClass('proofs')}>
          <div className="relative">
            <FileCheck2 className={iconClass('proofs')} />
            {pendingProofsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-rose-500 to-rose-400 text-white font-extrabold text-[9px] min-w-[17px] h-[17px] px-1 rounded-full shadow-md shadow-rose-500/40 ring-2 ring-slate-900 dark:ring-slate-950 flex items-center justify-center animate-pulse">
                {pendingProofsCount > 9 ? '9+' : pendingProofsCount}
              </span>
            )}
          </div>
          <span className={labelClass('proofs')}>Bukti Bayar</span>
          {indicator('proofs')}
        </button>

        {/* Tab 4: Laporan */}
        <button onClick={() => onChangeTab('reports')} className={tabClass('reports')}>
          <BarChart3 className={iconClass('reports')} />
          <span className={labelClass('reports')}>Laporan</span>
          {indicator('reports')}
        </button>
      </div>
    </nav>
  );
};
