import { createClient } from '@supabase/supabase-js';
import type { Transaction, Category, VerificationStatus } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
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

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    date: getTodayOffset(10),
    type: 'income',
    category_name: 'Gaji & Upah',
    amount: 12500000,
    description: 'Gaji Bulanan Utama PT Teknologi',
    proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
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
    proof_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
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
    proof_url: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=800&q=80',
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
    proof_url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
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
    proof_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
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
    proof_url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
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
    proof_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
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
    proof_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
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
    return JSON.parse(data);
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
      if (data && data.length > 0) return data as Transaction[];
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
      if (data && data.length > 0) return data as Category[];
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
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) throw error;
      return data as Transaction;
    } catch (err) {
      console.warn('Supabase insert error, saving locally:', err);
    }
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
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ verification_status: status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('Supabase update status failed, updating locally:', err);
    }
  }

  const list = getLocalTransactions();
  const idx = list.findIndex(t => t.id === id);
  if (idx !== -1) {
    list[idx].verification_status = status;
    saveLocalTransactions(list);
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('Supabase delete failed, deleting locally:', err);
    }
  }

  const list = getLocalTransactions().filter(t => t.id !== id);
  saveLocalTransactions(list);
}
