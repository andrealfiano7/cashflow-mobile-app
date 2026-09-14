import React from 'react';
import {
  X,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  FileText,
} from 'lucide-react';
import type { Transaction, VerificationStatus } from '../types';
import { formatRupiah, formatDateIndo, formatBytes } from '../lib/utils';

interface ProofLightboxModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: VerificationStatus) => void;
}

export const ProofLightboxModal: React.FC<ProofLightboxModalProps> = ({
  transaction,
  onClose,
  onUpdateStatus,
}) => {
  if (!transaction || !transaction.proof_url) return null;

  const isPdf = transaction.proof_file_type === 'application/pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <h3 className="text-sm font-bold text-white truncate">
              {transaction.proof_file_name || 'Bukti Transfer'}
            </h3>
            <p className="text-[10px] text-slate-400">
              {formatBytes(transaction.proof_file_size)} • {formatDateIndo(transaction.date)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={transaction.proof_url}
              target="_blank"
              rel="noopener noreferrer"
              download={transaction.proof_file_name || 'bukti-transfer'}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              title="Unduh Berkas"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content / Preview */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950/60 flex items-center justify-center min-h-[260px] max-h-[55vh]">
          {isPdf ? (
            <div className="text-center p-6 space-y-3">
              <FileText className="w-16 h-16 text-rose-400 mx-auto" />
              <p className="text-xs font-semibold text-white">Dokumen PDF Terlampir</p>
              <a
                href={transaction.proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Buka PDF di Tab Baru
              </a>
            </div>
          ) : (
            <img
              src={transaction.proof_url}
              alt={transaction.proof_file_name || 'Bukti Transfer'}
              className="max-h-[50vh] w-auto max-w-full object-contain rounded-xl shadow-lg border border-slate-800"
            />
          )}
        </div>

        {/* Linked Transaction Info & Verification Action */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400">Transaksi Terkait</p>
              <h4 className="text-xs font-bold text-white">
                {transaction.description || transaction.category_name}
              </h4>
              <p className="text-xs font-extrabold text-brand-400 mt-0.5">
                {formatRupiah(transaction.amount)} ({transaction.type === 'income' ? 'Masuk' : 'Keluar'})
              </p>
            </div>

            {/* Current Status Badge */}
            <div className="text-right">
              <p className="text-[10px] text-slate-400 mb-1">Status Verifikasi</p>
              {transaction.verification_status === 'verified' && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                </span>
              )}
              {transaction.verification_status === 'pending' && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Menunggu
                </span>
              )}
              {transaction.verification_status === 'rejected' && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Ditolak
                </span>
              )}
            </div>
          </div>

          {/* Verification Status Buttons */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
            <button
              onClick={() => onUpdateStatus(transaction.id, 'verified')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                transaction.verification_status === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-emerald-600/30 hover:text-emerald-300 border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verifikasi Valid</span>
            </button>

            <button
              onClick={() => onUpdateStatus(transaction.id, 'rejected')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                transaction.verification_status === 'rejected'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-rose-600/30 hover:text-rose-300 border border-slate-700'
              }`}
            >
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Tolak Bukti</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
