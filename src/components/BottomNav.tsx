import React from 'react';
import { LayoutDashboard, ReceiptText, Plus, FileCheck, PieChart } from 'lucide-react';
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
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe transition-colors">
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around relative">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => onChangeTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'dashboard'
              ? 'text-brand-600 dark:text-brand-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 transition-transform ${activeTab === 'dashboard' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1">Dashboard</span>
        </button>

        {/* Tab 2: Transaksi */}
        <button
          onClick={() => onChangeTab('transactions')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'transactions'
              ? 'text-brand-600 dark:text-brand-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ReceiptText className={`w-5 h-5 transition-transform ${activeTab === 'transactions' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1">Transaksi</span>
        </button>

        {/* Floating Quick Action Button (+) */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenAddModal}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-4 border-slate-100 dark:border-slate-900 focus:outline-none"
            title="Tambah Transaksi Baru"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: DB Bukti Pembayaran */}
        <button
          onClick={() => onChangeTab('proofs')}
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all ${
            activeTab === 'proofs'
              ? 'text-brand-600 dark:text-brand-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <FileCheck className={`w-5 h-5 transition-transform ${activeTab === 'proofs' ? 'scale-110' : ''}`} />
            {pendingProofsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 font-bold text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                {pendingProofsCount > 9 ? '9+' : pendingProofsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Bukti Bayar</span>
        </button>

        {/* Tab 4: Laporan / Statistik */}
        <button
          onClick={() => onChangeTab('reports')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'reports'
              ? 'text-brand-600 dark:text-brand-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <PieChart className={`w-5 h-5 transition-transform ${activeTab === 'reports' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1">Laporan</span>
        </button>
      </div>
    </nav>
  );
};
