import React from 'react';
import {
  X,
  Database,
  CheckCircle2,
  RotateCcw,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onResetData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-colors">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Status Penyimpanan</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Pengelolaan data arus kas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {isSupabaseConfigured ? (
            <>
              {/* Connected Status Card */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Supabase Cloud Aktif</h4>
                <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/80 mt-1 leading-relaxed">
                  Data transaksi dan bukti pembayaran tersinkronisasi dengan database cloud.
                </p>
              </div>

              {/* Status Details */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Database className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <span className="font-medium text-[11px]">Database Transaksi</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    PostgreSQL Online
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <HardDrive className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <span className="font-medium text-[11px]">Penyimpanan Bukti</span>
                  </div>
                  <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                    transfer-proofs
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium text-[11px]">Keamanan &amp; Sync</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Terenkripsi SSL
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-center flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
                  <HardDrive className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Penyimpanan Lokal Aktif</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Seluruh transaksi dan berkas bukti pembayaran disimpan langsung di perangkat ini tanpa memerlukan akun.
                </p>
              </div>

              <button
                onClick={() => {
                  if (confirm('Kembalikan transaksi ke data contoh awal?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="w-full h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Reset ke Data Contoh Awal</span>
              </button>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md transition-all active:scale-[0.98]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
