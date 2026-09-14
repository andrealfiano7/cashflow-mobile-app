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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <nav className="relative bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55)] px-2 py-1.5 flex items-center justify-around transition-all">
          {/* Tab 1: Dashboard */}
          <button
            onClick={() => onChangeTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-90 ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <LayoutDashboard
              className={`w-[22px] h-[22px] transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'scale-110 stroke-[2.4]'
                  : 'stroke-[1.8]'
              }`}
            />
            <span className="text-[10px] mt-0.5 tracking-tight">Dashboard</span>
            {activeTab === 'dashboard' && (
              <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)] mt-0.5" />
            )}
          </button>

          {/* Tab 2: Transaksi */}
          <button
            onClick={() => onChangeTab('transactions')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-90 ${
              activeTab === 'transactions'
                ? 'bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <ReceiptText
              className={`w-[22px] h-[22px] transition-all duration-200 ${
                activeTab === 'transactions'
                  ? 'scale-110 stroke-[2.4]'
                  : 'stroke-[1.8]'
              }`}
            />
            <span className="text-[10px] mt-0.5 tracking-tight">Transaksi</span>
            {activeTab === 'transactions' && (
              <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)] mt-0.5" />
            )}
          </button>

          {/* Floating Center Action Button (+) */}
          <div className="flex-1 flex justify-center -mt-8 px-1">
            <button
              onClick={onOpenAddModal}
              className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-[0_10px_25px_rgba(16,185,129,0.45)] hover:shadow-[0_14px_30px_rgba(16,185,129,0.6)] ring-4 ring-slate-100 dark:ring-slate-900 active:scale-90 transition-all duration-300 focus:outline-none"
              title="Tambah Transaksi Baru"
            >
              <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 group-active:scale-90 transition-transform duration-300 drop-shadow-sm" />
            </button>
          </div>

          {/* Tab 3: Bukti Bayar */}
          <button
            onClick={() => onChangeTab('proofs')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl relative transition-all duration-200 active:scale-90 ${
              activeTab === 'proofs'
                ? 'bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <FileCheck2
                className={`w-[22px] h-[22px] transition-all duration-200 ${
                  activeTab === 'proofs'
                    ? 'scale-110 stroke-[2.4]'
                    : 'stroke-[1.8]'
                }`}
              />
              {pendingProofsCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[9px] min-w-[17px] h-[17px] px-1 rounded-full shadow-md shadow-orange-500/30 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center animate-pulse">
                  {pendingProofsCount > 9 ? '9+' : pendingProofsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Bukti Bayar</span>
            {activeTab === 'proofs' && (
              <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)] mt-0.5" />
            )}
          </button>

          {/* Tab 4: Laporan */}
          <button
            onClick={() => onChangeTab('reports')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-90 ${
              activeTab === 'reports'
                ? 'bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <BarChart3
              className={`w-[22px] h-[22px] transition-all duration-200 ${
                activeTab === 'reports'
                  ? 'scale-110 stroke-[2.4]'
                  : 'stroke-[1.8]'
              }`}
            />
            <span className="text-[10px] mt-0.5 tracking-tight">Laporan</span>
            {activeTab === 'reports' && (
              <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)] mt-0.5" />
            )}
          </button>
        </nav>
      </div>
    </div>
  );
};
