import React, { useState, useMemo } from 'react';
import {
  FolderArchive,
  FileCheck2,
  Clock,
  XCircle,
  Eye,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import type { Transaction, VerificationStatus } from '../types';
import { formatRupiah, formatDateIndo, formatBytes } from '../lib/utils';

interface ProofDatabaseViewProps {
  transactions: Transaction[];
  onSelectProof: (tx: Transaction) => void;
  onUpdateStatus: (id: string, status: VerificationStatus) => void;
}

export const ProofDatabaseView: React.FC<ProofDatabaseViewProps> = ({
  transactions,
  onSelectProof,
  onUpdateStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | VerificationStatus>('all');

  // Filter only transactions that have proof files
  const transactionsWithProof = useMemo(() => {
    return transactions.filter(t => Boolean(t.proof_url));
  }, [transactions]);

  // Apply status filter
  const filteredProofs = useMemo(() => {
    if (statusFilter === 'all') return transactionsWithProof;
    return transactionsWithProof.filter(t => t.verification_status === statusFilter);
  }, [transactionsWithProof, statusFilter]);

  // Count by status
  const counts = useMemo(() => {
    return {
      all: transactionsWithProof.length,
      verified: transactionsWithProof.filter(t => t.verification_status === 'verified').length,
      pending: transactionsWithProof.filter(t => t.verification_status === 'pending').length,
      rejected: transactionsWithProof.filter(t => t.verification_status === 'rejected').length,
    };
  }, [transactionsWithProof]);

  return (
    <div className="space-y-4 pb-24">
      {/* Header section matching Google Sheet DB Bukti Pembayaran */}
      <div className="bg-white dark:bg-slate-850/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-soft transition-colors">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <FolderArchive className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Database Bukti Pembayaran</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Arsip berkas transfer & verifikasi keuangan</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs by Verification Status */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all shadow-sm flex items-center gap-1.5 ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
              : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-slate-800'
          }`}
        >
          <span>Semua</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            statusFilter === 'all'
              ? 'bg-white/20 dark:bg-slate-900/15'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all shadow-sm flex items-center gap-1.5 ${
            statusFilter === 'pending'
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold'
              : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 border border-slate-200/90 dark:border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
          <span>Menunggu</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
            {counts.pending}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('verified')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all shadow-sm flex items-center gap-1.5 ${
            statusFilter === 'verified'
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 font-bold'
              : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 border border-slate-200/90 dark:border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Terverifikasi</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            {counts.verified}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('rejected')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all shadow-sm flex items-center gap-1.5 ${
            statusFilter === 'rejected'
              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40 font-bold'
              : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 border border-slate-200/90 dark:border-slate-800'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
          <span>Ditolak</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300">
            {counts.rejected}
          </span>
        </button>
      </div>

      {/* Proof List Cards */}
      <div className="space-y-3">
        {filteredProofs.length === 0 ? (
          <div className="bg-white dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-soft">
            <FileCheck2 className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">Belum ada bukti pembayaran</p>
            <p className="text-xs text-slate-500 mt-1">
              Setiap kali mencatat transaksi baru, lampirkan foto/struk transfer untuk disimpan di sini.
            </p>
          </div>
        ) : (
          filteredProofs.map((tx, idx) => (
            <div
              key={tx.id}
              className="bg-white dark:bg-slate-850/80 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-soft"
            >
              <div className="flex gap-3">
                {/* Thumbnail Image */}
                <div
                  onClick={() => onSelectProof(tx)}
                  className="w-16 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shrink-0 cursor-pointer relative group flex items-center justify-center"
                >
                  {tx.proof_file_type === 'application/pdf' ? (
                    <div className="flex flex-col items-center justify-center p-2 text-rose-500 text-center">
                      <FileText className="w-6 h-6 mb-1" />
                      <span className="text-[9px] font-bold">PDF</span>
                    </div>
                  ) : (
                    <img
                      src={tx.proof_url || ''}
                      alt={tx.proof_file_name || 'Bukti Transfer'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Metadata & Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">#{idx + 1}</span>
                      {/* Status Badge */}
                      {tx.verification_status === 'verified' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                        </span>
                      )}
                      {tx.verification_status === 'pending' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Menunggu
                        </span>
                      )}
                      {tx.verification_status === 'rejected' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Ditolak
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">
                      {tx.proof_file_name || 'bukti_transfer.jpg'}
                    </h4>

                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold mt-0.5">
                      {formatRupiah(tx.amount)} • <span className="text-slate-500 dark:text-slate-400 font-normal">{tx.category_name}</span>
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      <span>{formatDateIndo(tx.date)}</span>
                      <span>•</span>
                      <span>{formatBytes(tx.proof_file_size)}</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onSelectProof(tx)}
                      className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Eye className="w-3 h-3" /> Lihat Berkas
                    </button>

                    {/* Status Toggles */}
                    <div className="flex items-center gap-1">
                      {tx.verification_status !== 'verified' && (
                        <button
                          onClick={() => onUpdateStatus(tx.id, 'verified')}
                          className="px-2 py-0.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 transition-all"
                        >
                          Verifikasi
                        </button>
                      )}
                      {tx.verification_status !== 'rejected' && (
                        <button
                          onClick={() => onUpdateStatus(tx.id, 'rejected')}
                          className="px-2 py-0.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-700 dark:text-rose-300 text-[10px] font-semibold border border-rose-500/30 transition-all"
                        >
                          Tolak
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
