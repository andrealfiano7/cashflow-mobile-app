import { createClient } from '@supabase/supabase-js';
import type { Transaction, Category, VerificationStatus } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_USE_SUPABASE === 'true' &&
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

// Create Supabase client if configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Mock / Seed data matching the Google Sheets reference
const INITIAL_CATEGORIES: Category[] = [
  { id: 'gaji', name: 'Gaji & Upah', type: 'income', icon: 'Wallet', color: '#10b981' },
  { id: 'penjualan', name: 'Hasil Penjualan / Bisnis', type: 'income', icon: 'TrendingUp', color: '#059669' },
  { id: 'investasi_masuk', name: 'Dividen & Investasi', type: 'income', icon: 'PiggyBank', color: '#047857' },
  { id: 'transfer_masuk', name: 'Transfer Masuk', type: 'income', icon: 'ArrowDownLeft', color: '#34d399' },
  { id: 'inflow_lain', name: 'Pemasukan Lainnya', type: 'income', icon: 'PlusCircle', color: '#6ee7b7' },
  { id: 'belanja', name: 'Belanja', type: 'expense', icon: 'ShoppingBag', color: '#f43f5e' },
  { id: 'kebutuhan', name: 'Kebutuhan Rumah', type: 'expense', icon: 'Home', color: '#e11d48' },
  { id: 'makanan', name: 'Makanan & Minuman', type: 'expense', icon: 'Utensils', color: '#fb923c' },
  { id: 'tagihan', name: 'Tagihan & Utilitas', type: 'expense', icon: 'FileText', color: '#f59e0b' },
  { id: 'transportasi', name: 'Transportasi', type: 'expense', icon: 'Car', color: '#3b82f6' },
  { id: 'hiburan', name: 'Hiburan & Liburan', type: 'expense', icon: 'Film', color: '#8b5cf6' },
  { id: 'transfer_keluar', name: 'Transfer Keluar', type: 'expense', icon: 'ArrowUpRight', color: '#ef4444' },
  { id: 'outflow_lain', name: 'Pengeluaran Lainnya', type: 'expense', icon: 'MinusCircle', color: '#64748b' },
];

const getTodayOffset = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

function createReceiptDataUrl(
  title: string,
  category: string,
  amount: number,
  date: string,
  type: 'income' | 'expense',
  refId: string
): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const accent = type === 'income' ? '#0193A5' : '#F16744';
  const badgeBg = type === 'income' ? '#d7f0f4' : '#ffe8de';
  const badgeText = type === 'income' ? '#004A59' : '#9e2d16';
  const formattedAmt = 'Rp ' + amount.toLocaleString('id-ID');
  const label = type === 'income' ? 'DANA MASUK' : 'BUKTI PEMBAYARAN';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600" viewBox="0 0 480 600">
    <rect width="480" height="600" rx="24" fill="#f8fafc"/>
    <rect x="24" y="24" width="432" height="552" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <rect x="24" y="24" width="432" height="10" rx="5" fill="${accent}"/>
    <circle cx="240" cy="96" r="28" fill="${badgeBg}"/>
    <path d="M228 96l8 8 16-16" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="240" y="152" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="${badgeText}" letter-spacing="1.5">${label}</text>
    <text x="240" y="194" text-anchor="middle" font-family="system-ui, sans-serif" font-size="30" font-weight="800" fill="#0f172a">${formattedAmt}</text>
    <text x="240" y="222" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="500" fill="#64748b">${esc(title)}</text>
    <line x1="56" y1="256" x2="424" y2="256" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="6 6"/>
    <text x="56" y="300" font-family="system-ui, sans-serif" font-size="13" fill="#64748b">Kategori</text>
    <text x="424" y="300" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#1e293b">${esc(category)}</text>
    <text x="56" y="344" font-family="system-ui, sans-serif" font-size="13" fill="#64748b">Tanggal Transaksi</text>
    <text x="424" y="344" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#1e293b">${date}</text>
    <text x="56" y="388" font-family="system-ui, sans-serif" font-size="13" fill="#64748b">No. Referensi</text>
    <text x="424" y="388" text-anchor="end" font-family="monospace" font-size="13" font-weight="700" fill="#1e293b">${refId}</text>
    <text x="56" y="432" font-family="system-ui, sans-serif" font-size="13" fill="#64748b">Status</text>
    <text x="424" y="432" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="${accent}">BERHASIL</text>
    <line x1="56" y1="472" x2="424" y2="472" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="240" y="516" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">Arsip Digital Cashflow</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    date: getTodayOffset(10),
    type: 'income',
    category_name: 'Gaji & Upah',
    amount: 12500000,
    description: 'Gaji Bulanan Utama PT Teknologi',
    proof_url: createReceiptDataUrl('Gaji Bulanan Utama PT Teknologi', 'Gaji & Upah', 12500000, getTodayOffset(10), 'income', 'CF-2026-0901'),
    proof_file_name: 'slip_gaji_september.pdf',
    proof_file_size: 245000,
    proof_file_type: 'application/pdf',
    verification_status: 'verified',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'tx-2',
    date: getTodayOffset(8),
    type: 'expense',
    category_name: 'Tagihan & Utilitas',
    amount: 1450000,
    description: 'Pembayaran Listrik PLN & Air PDAM',
    proof_url: createReceiptDataUrl('Pembayaran Listrik PLN & Air PDAM', 'Tagihan & Utilitas', 1450000, getTodayOffset(8), 'expense', 'CF-2026-0902'),
    proof_file_name: 'struk_pln_pdam.jpg',
    proof_file_size: 182000,
    proof_file_type: 'image/jpeg',
    verification_status: 'verified',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'tx-3',
    date: getTodayOffset(6),
    type: 'expense',
    category_name: 'Belanja',
    amount: 2350000,
    description: 'Belanja Perlengkapan Kantor & Rumah',
    proof_url: createReceiptDataUrl('Belanja Perlengkapan Kantor & Rumah', 'Belanja', 2350000, getTodayOffset(6), 'expense', 'CF-2026-0903'),
    proof_file_name: 'struk_supermarket.jpg',
    proof_file_size: 312000,
    proof_file_type: 'image/jpeg',
    verification_status: 'verified',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'tx-4',
    date: getTodayOffset(5),
    type: 'expense',
    category_name: 'Makanan & Minuman',
    amount: 485000,
    description: 'Makan Siang Tim & Kopi',
    proof_url: createReceiptDataUrl('Makan Siang Tim & Kopi', 'Makanan & Minuman', 485000, getTodayOffset(5), 'expense', 'CF-2026-0904'),
    proof_file_name: 'bukti_qris_resto.png',
    proof_file_size: 98000,
    proof_file_type: 'image/png',
    verification_status: 'verified',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'tx-5',
    date: getTodayOffset(3),
    type: 'income',
    category_name: 'Hasil Penjualan / Bisnis',
    amount: 4750000,
    description: 'Pembayaran Invoice Client Web Project',
    proof_url: createReceiptDataUrl('Pembayaran Invoice Client Web Project', 'Hasil Penjualan / Bisnis', 4750000, getTodayOffset(3), 'income', 'CF-2026-0905'),
    proof_file_name: 'transfer_bca_client.jpg',
    proof_file_size: 420000,
    proof_file_type: 'image/jpeg',
    verification_status: 'verified',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'tx-6',
    date: getTodayOffset(2),
    type: 'expense',
    category_name: 'Kebutuhan Rumah',
    amount: 850000,
    description: 'Isi Ulang Gas & Galon Bulanan',
    proof_url: createReceiptDataUrl('Isi Ulang Gas & Galon Bulanan', 'Kebutuhan Rumah', 850000, getTodayOffset(2), 'expense', 'CF-2026-0906'),
    proof_file_name: 'nota_toko_berkah.jpg',
    proof_file_size: 154000,
    proof_file_type: 'image/jpeg',
    verification_status: 'verified',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'tx-7',
    date: getTodayOffset(1),
    type: 'expense',
    category_name: 'Transfer Keluar',
    amount: 1200000,
    description: 'Transfer Cicilan Kendaraan',
    proof_url: createReceiptDataUrl('Transfer Cicilan Kendaraan', 'Transfer Keluar', 1200000, getTodayOffset(1), 'expense', 'CF-2026-0907'),
    proof_file_name: 'mutasi_mbanking_transfer.jpg',
    proof_file_size: 215000,
    proof_file_type: 'image/jpeg',
    verification_status: 'pending',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'tx-8',
    date: getTodayOffset(0),
    type: 'income',
    category_name: 'Dividen & Investasi',
    amount: 850000,
    description: 'Hasil Dividen Reksadana Pasar Uang',
    proof_url: createReceiptDataUrl('Hasil Dividen Reksadana Pasar Uang', 'Dividen & Investasi', 850000, getTodayOffset(0), 'income', 'CF-2026-0908'),
    proof_file_name: 'screenshot_bibit.png',
    proof_file_size: 320000,
    proof_file_type: 'image/png',
    verification_status: 'pending',
    created_at: new Date().toISOString(),
  }
];

const LOCAL_STORAGE_KEY = 'cashflow_app_transactions';

// Local storage helper
function getLocalTransactions(): Transaction[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  }
  try {
    const parsed: Transaction[] = JSON.parse(data);
    let migrated = false;
    const updated = parsed.map((tx, idx) => {
      if (
        tx.proof_url &&
        (tx.proof_url.includes('images.unsplash.com') ||
          tx.proof_url.includes('w3.org') ||
          (tx.proof_url.startsWith('data:image/svg+xml') && !tx.proof_url.includes('%26amp%3B') && tx.proof_url.includes('%26')))
      ) {
        migrated = true;
        return {
          ...tx,
          proof_url: createReceiptDataUrl(
            tx.description || tx.category_name,
            tx.category_name,
            Number(tx.amount),
            tx.date,
            tx.type,
            `CF-2026-090${idx + 1}`
          ),
        };
      }
      return tx;
    });
    if (migrated) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

function saveLocalTransactions(txs: Transaction[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(txs));
}

// -------------------------------------------------------------
// SUPABASE & LOCAL DATA SERVICES
// -------------------------------------------------------------

export async function fetchTransactions(): Promise<Transaction[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) return data as Transaction[];
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local data:', err);
    }
  }
  return getLocalTransactions();
}

export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      if (data) return data as Category[];
    } catch (err) {
      console.warn('Supabase categories fetch failed, falling back to local:', err);
    }
  }
  return INITIAL_CATEGORIES;
}

export async function uploadProofFile(file: File): Promise<{
  url: string;
  name: string;
  size: number;
  type: string;
}> {
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${timestamp}_${cleanFileName}`;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error: uploadError } = await supabase.storage
        .from('transfer-proofs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('transfer-proofs')
        .getPublicUrl(filePath);

      return {
        url: publicUrlData.publicUrl,
        name: file.name,
        size: file.size,
        type: file.type || 'image/jpeg',
      };
    } catch (err) {
      console.warn('Storage upload error, using local base64 fallback:', err);
    }
  }

  // Fallback: Read as base64 data URL for instant mobile preview without backend setup
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        name: file.name,
        size: file.size,
        type: file.type || 'image/jpeg',
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function addTransaction(
  newTx: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
  file?: File | null
): Promise<Transaction> {
  let proofInfo = {
    proof_url: newTx.proof_url || null,
    proof_file_name: newTx.proof_file_name || null,
    proof_file_size: newTx.proof_file_size || null,
    proof_file_type: newTx.proof_file_type || null,
  };

  if (file) {
    const uploaded = await uploadProofFile(file);
    proofInfo = {
      proof_url: uploaded.url,
      proof_file_name: uploaded.name,
      proof_file_size: uploaded.size,
      proof_file_type: uploaded.type,
    };
  }

  const transactionData = {
    ...newTx,
    ...proofInfo,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  }

  // Local fallback
  const created: Transaction = {
    ...transactionData,
    id: 'tx-' + Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const list = getLocalTransactions();
  list.unshift(created);
  saveLocalTransactions(list);
  return created;
}

export async function updateTransactionStatus(
  id: string,
  status: VerificationStatus
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('transactions')
      .update({ verification_status: status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return;
  }

  const list = getLocalTransactions();
  const idx = list.findIndex(t => t.id === id);
  if (idx !== -1) {
    list[idx].verification_status = status;
    saveLocalTransactions(list);
  }
}

export async function updateTransactionProof(
  id: string,
  file: File
): Promise<Transaction> {
  const uploaded = await uploadProofFile(file);
  const updates = {
    proof_url: uploaded.url,
    proof_file_name: uploaded.name,
    proof_file_size: uploaded.size,
    proof_file_type: uploaded.type,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Transaction;
  }

  const list = getLocalTransactions();
  const idx = list.findIndex(t => t.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    saveLocalTransactions(list);
    return list[idx];
  }
  throw new Error('Transaksi tidak ditemukan');
}

export async function deleteTransaction(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return; // Stop here if using supabase
  }

  const list = getLocalTransactions().filter(t => t.id !== id);
  saveLocalTransactions(list);
}
