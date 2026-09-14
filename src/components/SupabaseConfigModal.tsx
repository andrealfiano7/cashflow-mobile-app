import React from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
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
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-colors">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Status Database</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Penyimpanan Cloud Supabase</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {isSupabaseConfigured ? (
            <>
              {/* Connected Status Card */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Supabase Terhubung!</h4>
                <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/80 mt-1 leading-relaxed">
                  Aplikasi kas Anda aktif dan tersinkronisasi langsung dengan database server cloud.
                </p>
              </div>

              {/* Status Details */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Database className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <span className="font-medium text-[11px]">Database Transaksi</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    PostgreSQL Online
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <HardDrive className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-[11px]">Penyimpanan Bukti</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    transfer-proofs
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium text-[11px]">Keamanan & Sync</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                    Terenkripsi SSL
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm">Mode Demo Aktif</h4>
              <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 mt-1 leading-relaxed">
                Supabase belum terhubung. Transaksi saat ini disimpan di penyimpanan lokal browser.
              </p>
              <button
                onClick={() => {
                  if (confirm('Kembalikan transaksi ke data demo awal?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="mt-4 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs font-semibold"
              >
                Reset Data Demo
              </button>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md transition-all active:scale-[0.98]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
