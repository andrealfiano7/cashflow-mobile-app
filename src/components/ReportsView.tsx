import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Sparkles, ChevronDown } from 'lucide-react';
import type { Transaction } from '../types';
import { formatRupiah } from '../lib/utils';
import { CategoryIcon } from './CategoryIcon';

interface ReportsViewProps {
  transactions: Transaction[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  transactions,
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
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Analisis Finansial</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-0.5 truncate">Rasio tabungan &amp; rincian alokasi dana</p>
        </div>
        <div className="relative shrink-0">
          <div className="h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-between gap-2 shadow-sm">
            <span>{selectedMonth === 'all' ? 'Semua Waktu' : formatMonth(selectedMonth)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          </div>
          <select
            aria-label="Filter Periode Laporan"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option value="all">Semua Waktu</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>{formatMonth(m)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Health / Savings Ratio Section */}
      <div className="bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-850 dark:to-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Tingkat Tabungan (Savings Rate)</p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums leading-snug mt-0.5">{analysis.savingsRate}%</h3>
            </div>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold shrink-0 ${
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
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              analysis.savingsRate >= 20 ? 'bg-brand-500' : analysis.savingsRate > 0 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, analysis.savingsRate))}%` }}
          />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Dari total pemasukan <span className="text-slate-900 dark:text-slate-200 font-bold tabular-nums">{formatRupiah(analysis.totalIncome)}</span>,
          tersisa kas bersih sebesar <span className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">{formatRupiah(analysis.netSavings)}</span>.
        </p>

        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Rekomendasi Rasio 50/30/20:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Target Tabungan min. 20%</span>
        </div>
      </div>

      {/* Expense Allocation Breakdown */}
      <div className="bg-white dark:bg-slate-850/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3.5 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Rincian Pengeluaran per Kategori
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                Alokasi penggunaan dana keluar
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
            {analysis.expenseCategories.length} Pos
          </span>
        </div>

        <div className="space-y-3 pt-0.5">
          {analysis.expenseCategories.map(cat => (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <CategoryIcon name={cat.name} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 tabular-nums w-10 text-center">
                    {cat.percentage}%
                  </span>
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-bold tabular-nums w-[92px] text-right">
                    {formatRupiah(cat.amount)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Income Allocation Breakdown */}
      <div className="bg-white dark:bg-slate-850/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3.5 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Sumber Pemasukan
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                Proporsi arus kas masuk per sumber
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
            {analysis.incomeCategories.length} Pos
          </span>
        </div>

        <div className="space-y-3 pt-0.5">
          {analysis.incomeCategories.map(cat => (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CategoryIcon name={cat.name} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 tabular-nums w-10 text-center">
                    {cat.percentage}%
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold tabular-nums w-[92px] text-right">
                    {formatRupiah(cat.amount)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-500 h-full rounded-full"
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
