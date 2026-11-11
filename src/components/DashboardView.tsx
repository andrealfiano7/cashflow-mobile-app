import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  FileCheck2,
  ArrowRight,
  BarChart3,
  PieChart as PieIcon,
  ChevronDown,
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
  '#C73618',
  '#F16744',
  '#F6A278',
  '#004A59',
  '#027184',
  '#0193A5',
  '#9e2d16',
  '#025a6b',
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

  // Format YYYY-MM to Indonesian e.g. "September 2026"
  const formatMonth = (yyyyMm: string) => {
    const [y, m] = yyyyMm.split('-');
    const date = new Date(Number(y), Number(m) - 1, 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  // Filter transactions based on selected month
  const filteredTransactions = useMemo(() => {
    if (selectedMonth === 'all') return transactions;
    return transactions.filter(t => {
      const d = new Date(t.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}` === selectedMonth;
    });
  }, [transactions, selectedMonth]);

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
    for (const [name, amt] of Object.entries(expenseByCat)) {
      if (amt > maxExpense) {
        maxExpense = amt;
        topCategory = { name, amount: amt, percentage: 0 };
      }
    }

    if (topCategory && expense > 0) {
      topCategory.percentage = Math.round((topCategory.amount / expense) * 100);
    }

    return {
      income,
      expense,
      balance: income - expense,
      topCategory,
      expenseByCat,
    };
  }, [filteredTransactions]);

  // Bar chart data (Grouped by month if 'all', else by date)
  const barChartData = useMemo(() => {
    const mapData: Record<string, { date: string; displayDate: string; masuk: number; keluar: number }> = {};
    const sorted = [...filteredTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach(tx => {
      const d = new Date(tx.date);
      let key = '';
      let display = '';

      if (selectedMonth === 'all') {
        // Group by Month
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        key = `${year}-${month}`;
        display = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
      } else {
        // Group by Day
        key = tx.date;
        display = `${d.getDate()}/${d.getMonth() + 1}`;
      }

      if (!mapData[key]) {
        mapData[key] = { date: key, displayDate: display, masuk: 0, keluar: 0 };
      }

      if (tx.type === 'income') {
        mapData[key].masuk += Number(tx.amount);
      } else {
        mapData[key].keluar += Number(tx.amount);
      }
    });

    const values = Object.values(mapData);
    return selectedMonth === 'all' ? values : values; 
  }, [filteredTransactions, selectedMonth]);

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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-5 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-36 h-36 rounded-full bg-brand-500/15 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between text-slate-300 text-xs font-medium mb-1">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-brand-400" />
            <span>Sisa Saldo Kas</span>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-slate-200">
            {selectedMonth === 'all' ? 'Semua Waktu' : formatMonth(selectedMonth)}
          </span>
        </div>

        <div className="flex items-center justify-between my-2">
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
            {formatRupiah(summary.balance)}
          </div>
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="px-3.5 h-9 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 flex items-center gap-1 active:scale-95 transition-all shrink-0"
            >
              <span>+ Catat</span>
            </button>
          )}
        </div>

        {/* Total Masuk & Keluar Pill */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium leading-tight">Total Masuk</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-400 tabular-nums mt-0.5 truncate">{formatRupiah(summary.income)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium leading-tight">Total Keluar</p>
              <p className="text-xs sm:text-sm font-bold text-rose-400 tabular-nums mt-0.5 truncate">{formatRupiah(summary.expense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Largest Expense Category Card */}
      {summary.topCategory && (
        <div className="bg-white dark:bg-slate-850/80 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-soft flex items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 dark:border-rose-500/30 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
              <CategoryIcon name={summary.topCategory.name} className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Pengeluaran Terbesar</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug truncate mt-0.5">{summary.topCategory.name}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-rose-500 dark:text-rose-400 tabular-nums leading-snug">{formatRupiah(summary.topCategory.amount)}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums leading-tight mt-0.5">{summary.topCategory.percentage}% dari total keluar</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Arus Kas &amp; Distribusi</h2>
        <div className="relative shrink-0">
          <div className="h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-between gap-2 shadow-sm">
            <span>{selectedMonth === 'all' ? 'Semua Waktu' : formatMonth(selectedMonth)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          </div>
          <select
            aria-label="Filter Periode Waktu"
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

      {/* Bar Chart: Cash Inflow vs Outflow */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800/90 shadow-soft transition-colors">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">Arus Masuk vs Keluar</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5 truncate">Perbandingan per periode transaksi</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              <span>Masuk</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Keluar</span>
            </div>
          </div>
        </div>

        {barChartData.length > 0 ? (
          <div className="h-48 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barMasukGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0193A5" stopOpacity={1} />
                    <stop offset="100%" stopColor="#027184" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="barKeluarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F16744" stopOpacity={1} />
                    <stop offset="100%" stopColor="#C73618" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800/80" />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  dy={6}
                />
                <YAxis
                  width={44}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  tickFormatter={val => (val === 0 ? '0' : val >= 1000000 ? `${+(val / 1000000).toFixed(1)}jt` : `${Math.round(val / 1000)}rb`)}
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
                          <span className={`text-[11px] font-extrabold ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
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
          <div className="h-36 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 text-xs gap-1">
            <BarChart3 className="w-6 h-6 stroke-[1.5] text-slate-300 dark:text-slate-600" />
            <span>Belum ada data transaksi di periode ini</span>
          </div>
        )}
      </div>

      {/* Donut Chart: Expense by Category */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800/90 shadow-soft transition-colors">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center shrink-0">
              <PieIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">Distribusi Kategori Pengeluaran</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5 truncate">Persentase pengeluaran per pos dana</p>
            </div>
          </div>
          {summary.expense > 0 && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
              {donutData.length} Kategori
            </span>
          )}
        </div>

        {donutData.length > 0 ? (
          <div className="space-y-4">
            {/* Donut Chart with Center Metric */}
            <div className="relative w-full flex items-center justify-center pt-1">
              <div className="h-44 w-44 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={72}
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
                            <span className="font-bold text-emerald-400 tabular-nums">{formatRupiah(Number(data.value))}</span>
                            <span className="text-[11px] text-slate-400 font-mono">({pct}%)</span>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Total Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                    Total Keluar
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight px-2 text-center tabular-nums leading-snug mt-0.5">
                    {formatRupiah(summary.expense)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modern Breakdown Category List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {donutData.slice(0, 5).map((item, idx) => {
                const pct = summary.expense > 0 ? Math.round((item.value / summary.expense) * 100) : 0;
                const color = DONUT_COLORS[idx % DONUT_COLORS.length];
                return (
                  <div
                    key={item.name}
                    className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-12 bg-slate-200/80 dark:bg-slate-700/80 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="w-10 text-center text-[11px] font-bold py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 tabular-nums">
                        {pct}%
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs w-[92px] text-right tabular-nums">
                        {formatRupiah(item.value)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-36 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 text-xs gap-1">
            <PieIcon className="w-6 h-6 stroke-[1.5] text-slate-300 dark:text-slate-600" />
            <span>Tidak ada pengeluaran pada periode ini</span>
          </div>
        )}
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white dark:bg-slate-850/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-soft transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">Transaksi Terkini</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">5 aktivitas kas terbaru</p>
          </div>
          <button
            onClick={() => onChangeTab('transactions')}
            className="text-xs text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1 hover:underline shrink-0 h-9 px-2 rounded-lg"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-snug">{tx.description || tx.category_name}</p>
                  <div className="flex items-center gap-1.5 text-[11px] leading-tight mt-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium truncate max-w-[120px]">
                      {tx.category_name}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 shrink-0">{formatDateIndo(tx.date)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p
                  className={`text-xs sm:text-sm font-bold tabular-nums leading-snug ${
                    tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                </p>
                {tx.proof_url ? (
                  <button
                    onClick={() => onSelectProof(tx)}
                    className="inline-flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-semibold mt-1 leading-none"
                  >
                    <FileCheck2 className="w-3 h-3" />
                    <span>Bukti</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mt-1 inline-block">Tanpa bukti</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
