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
} from 'lucide-react';
import type { Transaction } from '../types';
import { formatRupiah, formatDateIndo } from '../lib/utils';
import { CategoryIcon } from './CategoryIcon';

interface TransactionListViewProps {
  transactions: Transaction[];
  onOpenAddModal: () => void;
  onSelectProof: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionListView: React.FC<TransactionListViewProps> = ({
  transactions,
  onOpenAddModal,
  onSelectProof,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
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
          <h2 className="text-base font-bold text-white">Buku Kas (Cashflow)</h2>
          <p className="text-xs text-slate-400">Daftar transaksi & saldo berjalan</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-brand-400" />
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
            className="w-full bg-slate-850 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* Type Filter */}
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700/60 shrink-0 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                typeFilter === 'all' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1 ${
                typeFilter === 'income' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <ArrowDownCircle className="w-3 h-3" /> Masuk
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1 ${
                typeFilter === 'expense' ? 'bg-rose-500/20 text-rose-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <ArrowUpCircle className="w-3 h-3" /> Keluar
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 shrink-0 focus:outline-none"
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
          <div className="bg-slate-850/60 border border-slate-800 rounded-2xl p-8 text-center">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Tidak ada transaksi ditemukan</p>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci atau filter pencarian</p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Transaksi
            </button>
          </div>
        ) : (
          filteredList.map(tx => (
            <div
              key={tx.id}
              className="bg-slate-850/80 rounded-2xl p-3.5 border border-slate-800 hover:border-slate-700/80 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Icon & Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      tx.type === 'income'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    <CategoryIcon name={tx.category_name} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {tx.description || tx.category_name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <span className="font-medium text-slate-300">{tx.category_name}</span>
                      <span>•</span>
                      <span>{formatDateIndo(tx.date)}</span>
                    </p>

                    {/* Running balance indicator */}
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      Saldo: <span className="text-slate-400 font-semibold">{formatRupiah(runningBalances[tx.id] || 0)}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="text-right shrink-0">
                  <div
                    className={`text-xs font-extrabold ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-2">
                    {tx.proof_url && (
                      <button
                        onClick={() => onSelectProof(tx)}
                        className="px-2 py-0.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-400 hover:bg-brand-500/25 text-[10px] font-semibold flex items-center gap-1 transition-all"
                        title="Lihat Bukti Transfer"
                      >
                        <FileCheck2 className="w-3 h-3" />
                        <span>Bukti</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Hapus transaksi "${tx.description || tx.category_name}"?`)) {
                          onDeleteTransaction(tx.id);
                        }
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
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
