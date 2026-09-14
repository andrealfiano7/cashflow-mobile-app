import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Trash2,
  FileCheck2,
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Upload,
  Loader2,
} from 'lucide-react';
import type { Transaction } from '../types';
import { formatRupiah, formatDateIndo } from '../lib/utils';
import { CategoryIcon } from './CategoryIcon';

interface TransactionListViewProps {
  transactions: Transaction[];
  onOpenAddModal: () => void;
  onSelectProof: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onUploadProof: (id: string, file: File) => Promise<void>;
}

export const TransactionListView: React.FC<TransactionListViewProps> = ({
  transactions,
  onOpenAddModal,
  onSelectProof,
  onDeleteTransaction,
  onUploadProof,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Compute Running Balance for all sorted transactions (oldest to newest)
  const sortedChronological = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (timeA !== timeB) return timeA - timeB;
      return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
    });
  }, [transactions]);

  // Map of tx ID to running balance
  const runningBalances = useMemo(() => {
    const balances: Record<string, number> = {};
    let current = 0;
    sortedChronological.forEach(tx => {
      if (tx.type === 'income') {
        current += Number(tx.amount);
      } else {
        current -= Number(tx.amount);
      }
      balances[tx.id] = current;
    });
    return balances;
  }, [sortedChronological]);

  // Unique categories for filter dropdown
  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map(t => t.category_name))).sort();
  }, [transactions]);

  // Filtered transactions (displayed newest first)
  const filteredList = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(tx => {
        const matchesSearch =
          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.category_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || tx.type === typeFilter;
        const matchesCategory = categoryFilter === 'all' || tx.category_name === categoryFilter;
        return matchesSearch && matchesType && matchesCategory;
      });
  }, [transactions, searchTerm, typeFilter, categoryFilter]);

  // Export to CSV function (mirrors Google Sheet CSV export)
  const handleExportCSV = () => {
    const headers = ['No', 'Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Nominal', 'Saldo Berjalan', 'Ada Bukti?'];
    const rows = filteredList.map((tx, idx) => [
      idx + 1,
      tx.date,
      tx.type === 'income' ? 'Dana Masuk' : 'Dana Keluar',
      `"${tx.category_name.replace(/"/g, '""')}"`,
      `"${(tx.description || '').replace(/"/g, '""')}"`,
      tx.amount,
      runningBalances[tx.id] || 0,
      tx.proof_url ? 'Ya' : 'Tidak',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cashflow_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header & Export Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Buku Kas (Cashflow)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Daftar transaksi & saldo berjalan</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium active:scale-95 transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2.5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari transaksi atau keterangan..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* Type Filter */}
          <div className="flex bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-300/80 dark:border-slate-700/60 shrink-0 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-all flex items-center gap-1 ${
                typeFilter === 'income'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowDownCircle className="w-3 h-3" /> Masuk
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-all flex items-center gap-1 ${
                typeFilter === 'expense'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowUpCircle className="w-3 h-3" /> Keluar
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-2.5 py-1.5 shrink-0 focus:outline-none shadow-sm"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="bg-white dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-soft">
            <Calendar className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">Tidak ada transaksi ditemukan</p>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci atau filter pencarian</p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 shadow-md shadow-brand-600/30"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Transaksi
            </button>
          </div>
        ) : (
          filteredList.map(tx => (
            <div
              key={tx.id}
              className="bg-white dark:bg-slate-850/80 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Icon & Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      tx.type === 'income'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    <CategoryIcon name={tx.category_name} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tx.description || tx.category_name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{tx.category_name}</span>
                      <span>•</span>
                      <span>{formatDateIndo(tx.date)}</span>
                    </p>

                    {/* Running balance indicator */}
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                      Saldo: <span className="text-slate-700 dark:text-slate-300 font-semibold">{formatRupiah(runningBalances[tx.id] || 0)}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="text-right shrink-0">
                  <div
                    className={`text-xs font-extrabold ${
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-2">
                    {tx.proof_url ? (
                      <button
                        onClick={() => onSelectProof(tx)}
                        className="px-2 py-0.5 rounded-lg bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/30 text-brand-600 dark:text-brand-400 hover:bg-brand-500/25 text-[10px] font-semibold flex items-center gap-1 transition-all"
                        title="Lihat Bukti Transfer"
                      >
                        <FileCheck2 className="w-3 h-3" />
                        <span>Bukti</span>
                      </button>
                    ) : (
                      <button
                        disabled={uploadingId === tx.id}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*,application/pdf';
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              setUploadingId(tx.id);
                              try {
                                await onUploadProof(tx.id, file);
                              } finally {
                                setUploadingId(null);
                              }
                            }
                          };
                          input.click();
                        }}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 text-[10px] font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
                        title="Upload Bukti Susulan"
                      >
                        {uploadingId === tx.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3" />
                        )}
                        <span>Susulan</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Hapus transaksi "${tx.description || tx.category_name}"?`)) {
                          onDeleteTransaction(tx.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 rounded-lg transition-colors"
                      title="Hapus Transaksi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
