import React from 'react';
import {
  X,
  Sparkles,
  Zap,
  Download,
  Camera,
  TrendingUp,
  Infinity,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type UpgradeReason = 'transaction_limit' | 'export_csv' | 'hd_upload' | 'savings_ratio';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: UpgradeReason | string;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  reason,
  onUpgrade,
}) => {
  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
    onUpgrade();
    onClose();
  };

  const renderReasonAlert = () => {
    switch (reason) {
      case 'transaction_limit':
        return (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5">
            <Zap className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-bold">Kuota Transaksi Basic Penuh (15/15)</p>
              <p className="text-[11px] opacity-90">Tingkatkan ke Pro untuk terus mencatat transaksi tanpa batas kuota.</p>
            </div>
          </div>
        );
      case 'export_csv':
        return (
          <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/25 text-brand-700 dark:text-brand-300 text-xs flex items-start gap-2.5">
            <Download className="w-4 h-4 shrink-0 text-brand-500 mt-0.5" />
            <div>
              <p className="font-bold">Export CSV Khusus Akun Pro 💎</p>
              <p className="text-[11px] opacity-90">Unduh data pembukuan ke format CSV/Excel kapan saja untuk rekonsiliasi kas.</p>
            </div>
          </div>
        );
      case 'hd_upload':
        return (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
            <Camera className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div>
              <p className="font-bold">Upload Bukti HD Khusus Akun Pro 💎</p>
              <p className="text-[11px] opacity-90">Akun Basic dibatasi hingga 2MB. Buka upload file struk resolusi tinggi hingga 10MB.</p>
            </div>
          </div>
        );
      case 'savings_ratio':
        return (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5">
            <TrendingUp className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
            <div>
              <p className="font-bold">Analisa Rasio Tabungan Khusus Pro 💎</p>
              <p className="text-[11px] opacity-90">Buka evaluasi kesehatan finansial, savings rate bulanan, dan rasio ideal 50/30/20.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in flex flex-col max-h-[92vh]">
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white border border-white/30">
              <Sparkles className="w-3 h-3 text-amber-200" />
              Paket Komersial
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            Tingkatkan ke Pro 💎
          </h2>
          <p className="text-xs text-amber-100/90 mt-1">
            Buka seluruh kapabilitas terbaik untuk pencatatan dan analisa finansial tanpa batas.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {renderReasonAlert()}

          {/* Feature Comparison List */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Keunggulan Akun Pro vs Basic:
            </p>

            <div className="space-y-2">
              {/* Feature 1: Quota */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Infinity className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Kuota Transaksi</p>
                    <p className="text-[10px] text-slate-400">Basic: Maks 15 transaksi</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 whitespace-nowrap">
                  Tanpa Batas 💎
                </span>
              </div>

              {/* Feature 2: Export CSV */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Export CSV &amp; Excel</p>
                    <p className="text-[10px] text-slate-400">Basic: Terkunci</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 whitespace-nowrap">
                  1-Klik Download
                </span>
              </div>

              {/* Feature 3: Savings Ratio */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Analisa Rasio Tabungan</p>
                    <p className="text-[10px] text-slate-400">Basic: Terkunci</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                  Buka 50/30/20 📈
                </span>
              </div>

              {/* Feature 4: HD Proof Upload */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Upload Bukti Struk HD</p>
                    <p className="text-[10px] text-slate-400">Basic: Maks 2MB</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 whitespace-nowrap">
                  HD Hingga 10MB
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Aktif selamanya • Tanpa biaya tersembunyi</span>
          </div>

          {/* Action Button */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleUpgradeClick}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-black text-xs shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-95 hover:opacity-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Upgrade ke Akun Pro Sekarang</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold transition-colors"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
