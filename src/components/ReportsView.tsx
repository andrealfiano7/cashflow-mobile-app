import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import type { Transaction } from '../types';
import { formatRupiah } from '../lib/utils';
import { CategoryIcon } from './CategoryIcon';

interface ReportsViewProps {
  transactions: Transaction[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ transactions }) => {
  const analysis = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, { type: 'income' | 'expense'; amount: number }> = {};

    transactions.forEach(tx => {
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
  }, [transactions]);

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white">Analisis Finansial</h2>
        <p className="text-xs text-slate-400">Rasio tabungan dan rincian alokasi dana</p>
      </div>

      {/* Financial Health Summary */}
      <div className="bg-gradient-to-br from-slate-850 to-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Tingkat Tabungan (Savings Rate)</p>
              <h3 className="text-lg font-extrabold text-white">{analysis.savingsRate}%</h3>
            </div>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              analysis.savingsRate >= 20
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : analysis.savingsRate > 0
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}
          >
            {analysis.savingsRate >= 20 ? 'Sangat Sehat' : analysis.savingsRate > 0 ? 'Cukup' : 'Defisit'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              analysis.savingsRate >= 20 ? 'bg-emerald-500' : analysis.savingsRate > 0 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, analysis.savingsRate))}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400">
          Dari total pemasukan <span className="text-slate-200 font-semibold">{formatRupiah(analysis.totalIncome)}</span>,
          tersisa kas bersih sebesar <span className="text-emerald-400 font-semibold">{formatRupiah(analysis.netSavings)}</span>.
        </p>
      </div>

      {/* Expense Allocation Breakdown */}
      <div className="bg-slate-850/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <TrendingDown className="w-4 h-4 text-rose-400" />
          Rincian Pengeluaran per Kategori
        </h3>

        <div className="space-y-3 pt-1">
          {analysis.expenseCategories.map(cat => (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <CategoryIcon name={cat.name} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-200 font-medium">{cat.name}</span>
                </div>
                <div className="text-right font-medium">
                  <span className="text-rose-400 font-bold">{formatRupiah(cat.amount)}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({cat.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
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
      <div className="bg-slate-850/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Sumber Pemasukan
        </h3>

        <div className="space-y-3 pt-1">
          {analysis.incomeCategories.map(cat => (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CategoryIcon name={cat.name} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-200 font-medium">{cat.name}</span>
                </div>
                <div className="text-right font-medium">
                  <span className="text-emerald-400 font-bold">{formatRupiah(cat.amount)}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({cat.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
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
