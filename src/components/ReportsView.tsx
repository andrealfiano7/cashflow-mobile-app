import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Sparkles, Lock } from 'lucide-react';
import type { Transaction, User } from '../types';
import { formatRupiah } from '../lib/utils';
import { CategoryIcon } from './CategoryIcon';

interface ReportsViewProps {
  transactions: Transaction[];
  currentUser?: User | null;
  onOpenUpgrade?: (reason?: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  transactions,
  currentUser = null,
  onOpenUpgrade,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      months.add(`${year}-${month}`);
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const formatMonth = (yyyyMm: string) => {
    const [y, m] = yyyyMm.split('-');
    const date = new Date(Number(y), Number(m) - 1, 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const filteredTransactions = useMemo(() => {
    if (selectedMonth === 'all') return transactions;
    return transactions.filter(t => {
      const d = new Date(t.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}` === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  const analysis = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, { type: 'income' | 'expense'; amount: number }> = {};

    filteredTransactions.forEach(tx => {
      const amt = Number(tx.amount);
      if (tx.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
      }

      if (!categoryTotals[tx.category_name]) {
        categoryTotals[tx.category_name] = { type: tx.type, amount: 0 };
      }
      categoryTotals[tx.category_name].amount += amt;
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    const expenseCategories = Object.entries(categoryTotals)
      .filter(([_, data]) => data.type === 'expense')
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        percentage: totalExpense > 0 ? Math.round((data.amount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const incomeCategories = Object.entries(categoryTotals)
      .filter(([_, data]) => data.type === 'income')
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        percentage: totalIncome > 0 ? Math.round((data.amount / totalIncome) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      expenseCategories,
      incomeCategories,
    };
  }, [filteredTransactions]);

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Analisis Finansial</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Rasio tabungan dan rincian alokasi dana</p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 appearance-none font-semibold"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/200.0/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' class='w-3 h-3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`, backgroundPosition: 'right 0.35rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em', paddingRight: '1.5rem' }}
        >
          <option value="all">Semua Waktu</option>
          {availableMonths.map(m => (
            <option key={m} value={m}>{formatMonth(m)}</option>
          ))}
        </select>
      </div>

      {/* Financial Health / Savings Ratio Section */}
      {currentUser?.role === 'basic' ? (
        <div className="relative rounded-2xl border border-amber-500/30 overflow-hidden shadow-soft bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-slate-100 dark:to-slate-850 p-5">
          {/* Blurred preview mock behind */}
          <div className="filter blur-sm select-none pointer-events-none opacity-40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20" />
                <div className="space-y-1">
                  <div className="h-3 w-32 bg-slate-300 dark:bg-slate-700 rounded" />
                  <div className="h-5 w-16 bg-slate-400 dark:bg-slate-600 rounded" />
                </div>
              </div>
              <div className="h-6 w-20 bg-emerald-500/20 rounded-full" />
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full" />
            <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>

          {/* Lock overlay content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-white/80 dark:bg-slate-900/85 backdrop-blur-[2px]">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Analisa Rasio Tabungan Terkunci</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Pro 💎
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mt-1 mb-3">
              Ketahui persentase rasio tabungan, evaluasi kesehatan finansial, dan rekomendasi alokasi 50/30/20 dengan Akun Pro.
            </p>
            <button
              type="button"
              onClick={() => onOpenUpgrade?.('savings_ratio')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-100" />
              <span>Buka Analisa Rasio Tabungan</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-850 dark:to-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Tingkat Tabungan (Savings Rate)</p>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    💎 Pro Analytics
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{analysis.savingsRate}%</h3>
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                analysis.savingsRate >= 20
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  : analysis.savingsRate > 0
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
              }`}
            >
              {analysis.savingsRate >= 20 ? 'Sangat Sehat' : analysis.savingsRate > 0 ? 'Cukup' : 'Defisit'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                analysis.savingsRate >= 20 ? 'bg-emerald-500' : analysis.savingsRate > 0 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, analysis.savingsRate))}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Dari total pemasukan <span className="text-slate-900 dark:text-slate-200 font-semibold">{formatRupiah(analysis.totalIncome)}</span>,
            tersisa kas bersih sebesar <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatRupiah(analysis.netSavings)}</span>.
          </p>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
            <span>Rekomendasi Rasio 50/30/20:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Target Tabungan ideal minimal 20%</span>
          </div>
        </div>
      )}

      {/* Expense Allocation Breakdown */}
      <div className="bg-white dark:bg-slate-850/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3 transition-colors">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <TrendingDown className="w-4 h-4 text-rose-500" />
          Rincian Pengeluaran per Kategori
        </h3>

        <div className="space-y-3 pt-1">
          {analysis.expenseCategories.map(cat => (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <CategoryIcon name={cat.name} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{cat.name}</span>
                </div>
                <div className="text-right font-medium">
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{formatRupiah(cat.amount)}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1.5 font-mono">({cat.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Income Allocation Breakdown */}
      <div className="bg-white dark:bg-slate-850/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3 transition-colors">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          Sumber Pemasukan
        </h3>

        <div className="space-y-3 pt-1">
          {analysis.incomeCategories.map(cat => (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <CategoryIcon name={cat.name} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{cat.name}</span>
                </div>
                <div className="text-right font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatRupiah(cat.amount)}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1.5 font-mono">({cat.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
