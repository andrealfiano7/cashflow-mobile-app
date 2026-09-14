import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { Transaction, ActiveTab } from '../types';
import { formatRupiah, formatDateIndo } from '../lib/utils';
import { CategoryIcon } from './CategoryIcon';

interface DashboardViewProps {
  transactions: Transaction[];
  onOpenAddModal?: () => void;
  onSelectProof: (tx: Transaction) => void;
  onChangeTab: (tab: ActiveTab) => void;
}

const DONUT_COLORS = [
  '#f43f5e', // rose
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#64748b', // slate
];

interface SummaryData {
  income: number;
  expense: number;
  balance: number;
  topCategory: {
    name: string;
    amount: number;
    percentage: number;
  } | null;
  expenseByCat: Record<string, number>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  onOpenAddModal,
  onSelectProof,
  onChangeTab,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month' | 'week'>('all');

  // Filter transactions based on selected period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    if (filterPeriod === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return transactions.filter(t => new Date(t.date) >= oneWeekAgo);
    }
    if (filterPeriod === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return transactions.filter(t => new Date(t.date) >= oneMonthAgo);
    }
    return transactions;
  }, [transactions, filterPeriod]);

  // Financial summary
  const summary = useMemo<SummaryData>(() => {
    let income = 0;
    let expense = 0;
    const expenseByCat: Record<string, number> = {};

    filteredTransactions.forEach(tx => {
      const amt = Number(tx.amount);
      if (tx.type === 'income') {
        income += amt;
      } else {
        expense += amt;
        expenseByCat[tx.category_name] = (expenseByCat[tx.category_name] || 0) + amt;
      }
    });

    let topCategory: { name: string; amount: number; percentage: number } | null = null;
    let maxExpense = 0;
    Object.entries(expenseByCat).forEach(([name, amt]) => {
      if (amt > maxExpense) {
        maxExpense = amt;
        topCategory = {
          name,
          amount: amt,
          percentage: expense > 0 ? Math.round((amt / expense) * 100) : 0,
        };
      }
    });

    return {
      income,
      expense,
      balance: income - expense,
      topCategory,
      expenseByCat,
    };
  }, [filteredTransactions]);

  // Bar chart data (Grouped by date)
  const barChartData = useMemo(() => {
    const mapByDate: Record<string, { date: string; displayDate: string; masuk: number; keluar: number }> = {};

    // Sort chronologically
    const sorted = [...filteredTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach(tx => {
      const dateKey = tx.date;
      if (!mapByDate[dateKey]) {
        const d = new Date(dateKey);
        mapByDate[dateKey] = {
          date: dateKey,
          displayDate: `${d.getDate()}/${d.getMonth() + 1}`,
          masuk: 0,
          keluar: 0,
        };
      }
      if (tx.type === 'income') {
        mapByDate[dateKey].masuk += Number(tx.amount);
      } else {
        mapByDate[dateKey].keluar += Number(tx.amount);
      }
    });

    // Return the last 7 distinct dates for mobile readability
    return Object.values(mapByDate).slice(-7);
  }, [filteredTransactions]);

  // Donut chart data (Expenses by category)
  const donutData = useMemo(() => {
    return Object.entries(summary.expenseByCat).map(([name, value]) => ({
      name,
      value,
    })).sort((a, b) => b.value - a.value);
  }, [summary.expenseByCat]);

  // Recent 5 transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="space-y-4 pb-20">
      {/* Saldo Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-850 via-slate-900 to-slate-950 p-5 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-36 h-36 rounded-full bg-brand-500/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-brand-400" />
            <span>Sisa Saldo Kas</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            Realtime
          </span>
        </div>

        <div className="flex items-center justify-between my-2">
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {formatRupiah(summary.balance)}
          </div>
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 flex items-center gap-1 active:scale-95 transition-all"
            >
              <span>+ Catat</span>
            </button>
          )}
        </div>

        {/* Total Masuk & Keluar Pill */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Total Masuk</p>
              <p className="text-xs font-bold text-emerald-400">{formatRupiah(summary.income)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Total Keluar</p>
              <p className="text-xs font-bold text-rose-400">{formatRupiah(summary.expense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Largest Expense Category Card */}
      {summary.topCategory && (
        <div className="bg-slate-850/80 rounded-xl p-3.5 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <CategoryIcon name={summary.topCategory.name} className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Pengeluaran Terbesar</p>
              <p className="text-sm font-bold text-white">{summary.topCategory.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-rose-400">{formatRupiah(summary.topCategory.amount)}</p>
            <p className="text-[10px] text-slate-400">{summary.topCategory.percentage}% dari total keluar</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 px-1">
        <h2 className="text-sm font-bold text-slate-200">Arus Kas & Distribusi</h2>
        <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs">
          <button
            onClick={() => setFilterPeriod('week')}
            className={`px-2 py-1 rounded-md text-[11px] transition-all ${
              filterPeriod === 'week' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            7 Hari
          </button>
          <button
            onClick={() => setFilterPeriod('month')}
            className={`px-2 py-1 rounded-md text-[11px] transition-all ${
              filterPeriod === 'month' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            30 Hari
          </button>
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-2 py-1 rounded-md text-[11px] transition-all ${
              filterPeriod === 'all' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            Semua
          </button>
        </div>
      </div>

      {/* Bar Chart: Cash Inflow vs Outflow */}
      <div className="bg-slate-850/60 rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-200">Arus Masuk vs Keluar</h3>
            <p className="text-[10px] text-slate-400">Perbandingan per tanggal transaksi</p>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Masuk
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Keluar
            </span>
          </div>
        </div>

        {barChartData.length > 0 ? (
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={val => `${val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'k'}`}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [formatRupiah(Number(val)), '']}
                  labelFormatter={(label) => `Tanggal: ${label}`}
                />
                <Bar dataKey="masuk" fill="#10b981" radius={[4, 4, 0, 0]} name="Dana Masuk" />
                <Bar dataKey="keluar" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Total Keluar" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-slate-500 text-xs">
            Belum ada data pada periode ini
          </div>
        )}
      </div>

      {/* Donut Chart: Expense by Category */}
      <div className="bg-slate-850/60 rounded-2xl p-4 border border-slate-800">
        <div className="mb-2">
          <h3 className="text-xs font-semibold text-slate-200">Distribusi Kategori Pengeluaran</h3>
          <p className="text-[10px] text-slate-400">Persentase pengeluaran berdasarkan pos dana</p>
        </div>

        {donutData.length > 0 ? (
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="h-44 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [formatRupiah(Number(val)), 'Nominal']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Compact Legend */}
            <div className="w-full sm:w-1/2 grid grid-cols-2 gap-2 text-[11px]">
              {donutData.slice(0, 6).map((item, idx) => (
                <div key={item.name} className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                  />
                  <span className="text-slate-300 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-slate-500 text-xs">
            Tidak ada pengeluaran pada periode ini
          </div>
        )}
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-slate-850/60 rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-200">Transaksi Terkini</h3>
            <p className="text-[10px] text-slate-400">Aktivitas cashflow terbaru</p>
          </div>
          <button
            onClick={() => onChangeTab('transactions')}
            className="text-[11px] text-brand-400 font-semibold flex items-center gap-1 hover:underline"
          >
            Lihat Semua <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {recentTransactions.map(tx => (
            <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  <CategoryIcon name={tx.category_name} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{tx.description || tx.category_name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{formatDateIndo(tx.date)}</span>
                    <span>•</span>
                    <span className="truncate">{tx.category_name}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p
                  className={`text-xs font-bold ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                </p>
                {tx.proof_url ? (
                  <button
                    onClick={() => onSelectProof(tx)}
                    className="inline-flex items-center gap-1 text-[10px] text-brand-400 hover:text-brand-300 font-medium mt-0.5"
                  >
                    <FileCheck2 className="w-3 h-3" />
                    <span>Bukti</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500">Tanpa bukti</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
