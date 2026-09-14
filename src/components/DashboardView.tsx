import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  FileCheck2,
  ArrowRight,
  BarChart3,
  PieChart as PieIcon,
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
  CartesianGrid,
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-5 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-36 h-36 rounded-full bg-brand-500/15 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between text-slate-300 text-xs font-medium mb-1">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-brand-400" />
            <span>Sisa Saldo Kas</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-slate-200">
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
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Total Masuk</p>
              <p className="text-xs font-bold text-emerald-400">{formatRupiah(summary.income)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
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
        <div className="bg-white dark:bg-slate-850/80 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-soft flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 dark:border-rose-500/30 text-rose-500 dark:text-rose-400 flex items-center justify-center">
              <CategoryIcon name={summary.topCategory.name} className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Pengeluaran Terbesar</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{summary.topCategory.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-rose-500 dark:text-rose-400">{formatRupiah(summary.topCategory.amount)}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{summary.topCategory.percentage}% dari total keluar</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 px-1">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Arus Kas & Distribusi</h2>
        <div className="flex bg-slate-200/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-300/80 dark:border-slate-700/60 text-xs">
          <button
            onClick={() => setFilterPeriod('week')}
            className={`px-2 py-1 rounded-lg text-[11px] transition-all ${
              filterPeriod === 'week'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            7 Hari
          </button>
          <button
            onClick={() => setFilterPeriod('month')}
            className={`px-2 py-1 rounded-lg text-[11px] transition-all ${
              filterPeriod === 'month'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            30 Hari
          </button>
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-2 py-1 rounded-lg text-[11px] transition-all ${
              filterPeriod === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Semua
          </button>
        </div>
      </div>

      {/* Bar Chart: Cash Inflow vs Outflow */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/90 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Arus Masuk vs Keluar</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Perbandingan per tanggal transaksi</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Masuk</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Keluar</span>
            </div>
          </div>
        </div>

        {barChartData.length > 0 ? (
          <div className="h-48 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 12, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="barMasukGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="barKeluarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800/80" />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  dy={6}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  dx={-2}
                  tickFormatter={val => (val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${Math.round(val / 1000)}k`)}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(148, 163, 184, 0.08)', radius: 8 }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const masukVal = Number(payload.find(p => p.dataKey === 'masuk')?.value || 0);
                    const keluarVal = Number(payload.find(p => p.dataKey === 'keluar')?.value || 0);
                    const net = masukVal - keluarVal;
                    return (
                      <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/80 text-white rounded-2xl p-3 shadow-2xl text-[11px] min-w-[170px] space-y-1.5 animate-scale-in">
                        <div className="font-bold text-slate-300 pb-1.5 border-b border-slate-800 flex items-center justify-between">
                          <span>Tgl: {label}</span>
                          <span className={`text-[10px] font-extrabold ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {net >= 0 ? '+' : ''}{formatRupiah(net)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-400 font-medium">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Masuk
                          </span>
                          <span className="font-bold">{formatRupiah(masukVal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-rose-400 font-medium">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-400" /> Keluar
                          </span>
                          <span className="font-bold">{formatRupiah(keluarVal)}</span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="masuk" fill="url(#barMasukGrad)" radius={[6, 6, 2, 2]} barSize={12} maxBarSize={16} name="Dana Masuk" />
                <Bar dataKey="keluar" fill="url(#barKeluarGrad)" radius={[6, 6, 2, 2]} barSize={12} maxBarSize={16} name="Total Keluar" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-36 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-1">
            <BarChart3 className="w-6 h-6 stroke-[1.5] text-slate-300 dark:text-slate-600" />
            <span>Belum ada data transaksi di periode ini</span>
          </div>
        )}
      </div>

      {/* Donut Chart: Expense by Category */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/90 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Distribusi Kategori Pengeluaran</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Persentase pengeluaran berdasarkan pos dana</p>
            </div>
          </div>
          {summary.expense > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {donutData.length} Kategori
            </span>
          )}
        </div>

        {donutData.length > 0 ? (
          <div className="space-y-4">
            {/* Donut Chart with Center Metric */}
            <div className="relative w-full flex items-center justify-center pt-2">
              <div className="h-48 w-48 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={74}
                      paddingAngle={3}
                      cornerRadius={4}
                      dataKey="value"
                    >
                      {donutData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = payload[0];
                        const pct = summary.expense > 0 ? Math.round((Number(data.value) / summary.expense) * 100) : 0;
                        return (
                          <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/80 text-white rounded-xl px-3 py-2 shadow-2xl text-xs flex items-center gap-2 animate-scale-in">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.payload.fill }} />
                            <span className="font-semibold text-slate-200">{data.name}:</span>
                            <span className="font-bold text-emerald-400">{formatRupiah(Number(data.value))}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({pct}%)</span>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Total Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                    Total Keluar
                  </span>
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight px-2 text-center">
                    {formatRupiah(summary.expense)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modern Breakdown Category List */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              {donutData.slice(0, 5).map((item, idx) => {
                const pct = summary.expense > 0 ? Math.round((item.value / summary.expense) * 100) : 0;
                const color = DONUT_COLORS[idx % DONUT_COLORS.length];
                return (
                  <div
                    key={item.name}
                    className="p-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="w-14 bg-slate-200/80 dark:bg-slate-700/80 rounded-full h-1.5 overflow-hidden hidden xs:block">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 font-mono">
                        {pct}%
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] min-w-[70px] text-right">
                        {formatRupiah(item.value)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-36 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-1">
            <PieIcon className="w-6 h-6 stroke-[1.5] text-slate-300 dark:text-slate-600" />
            <span>Tidak ada pengeluaran pada periode ini</span>
          </div>
        )}
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white dark:bg-slate-850/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-soft transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Transaksi Terkini</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Aktivitas cashflow terbaru</p>
          </div>
          <button
            onClick={() => onChangeTab('transactions')}
            className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1 hover:underline"
          >
            Lihat Semua <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {recentTransactions.map(tx => (
            <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}
                >
                  <CategoryIcon name={tx.category_name} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{tx.description || tx.category_name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{formatDateIndo(tx.date)}</span>
                    <span>•</span>
                    <span className="truncate">{tx.category_name}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p
                  className={`text-xs font-bold ${
                    tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                </p>
                {tx.proof_url ? (
                  <button
                    onClick={() => onSelectProof(tx)}
                    className="inline-flex items-center gap-1 text-[10px] text-brand-600 dark:text-brand-400 hover:underline font-semibold mt-0.5"
                  >
                    <FileCheck2 className="w-3 h-3" />
                    <span>Bukti</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Tanpa bukti</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
