-- =========================================================================
-- SKEMA SUPABASE: APLIKASI CASHFLOW & DATABASE BUKTI PEMBAYARAN
-- Sesuai Struktur Google Sheet Cashflow Dashboard
-- =========================================================================

-- 1. Buat Tabel Categories (Kategori Arus Kas)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    icon TEXT NOT NULL DEFAULT 'Tag',
    color TEXT NOT NULL DEFAULT '#10b981',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat Tabel Transactions (Cashflow Ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category_name TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    description TEXT,
    -- Field Bukti Pembayaran / Transfer
    proof_url TEXT,
    proof_file_name TEXT,
    proof_file_size BIGINT,
    proof_file_type TEXT,
    -- Field Multi-User & RBAC
    user_id TEXT,
    user_name TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing untuk performa kueri multi-user
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);

-- Indexing untuk performa kueri mobile
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category_name);
CREATE INDEX IF NOT EXISTS idx_transactions_verification ON public.transactions(verification_status);

-- 3. Setup Storage Bucket untuk Bukti Transfer
INSERT INTO storage.buckets (id, name, public)
VALUES ('transfer-proofs', 'transfer-proofs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Kebijakan Keamanan (Row Level Security - RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses untuk Categories (Bisa dibaca & dikelola publik / anonim)
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public manage categories" ON public.categories FOR ALL USING (true);

-- Kebijakan Akses untuk Transactions
CREATE POLICY "Public read transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Public insert transactions" ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update transactions" ON public.transactions FOR UPDATE USING (true);
CREATE POLICY "Public delete transactions" ON public.transactions FOR DELETE USING (true);

-- Kebijakan Akses Storage Bucket 'transfer-proofs'
CREATE POLICY "Public access to transfer proofs" ON storage.objects
FOR SELECT USING (bucket_id = 'transfer-proofs');

CREATE POLICY "Public upload transfer proofs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'transfer-proofs');

CREATE POLICY "Public update transfer proofs" ON storage.objects
FOR UPDATE USING (bucket_id = 'transfer-proofs');

CREATE POLICY "Public delete transfer proofs" ON storage.objects
FOR DELETE USING (bucket_id = 'transfer-proofs');

-- 5. Data Awal Kategori (Seed Categories)
INSERT INTO public.categories (id, name, type, icon, color) VALUES
-- Pemasukan (Income)
('gaji', 'Gaji & Upah', 'income', 'Wallet', '#10b981'),
('penjualan', 'Hasil Penjualan / Bisnis', 'income', 'TrendingUp', '#059669'),
('investasi_masuk', 'Dividen & Investasi', 'income', 'PiggyBank', '#047857'),
('transfer_masuk', 'Transfer Masuk', 'income', 'ArrowDownLeft', '#34d399'),
('inflow_lain', 'Pemasukan Lainnya', 'income', 'PlusCircle', '#6ee7b7'),

-- Pengeluaran (Expense)
('belanja', 'Belanja', 'expense', 'ShoppingBag', '#f43f5e'),
('kebutuhan', 'Kebutuhan Rumah', 'expense', 'Home', '#e11d48'),
('makanan', 'Makanan & Minuman', 'expense', 'Utensils', '#fb923c'),
('tagihan', 'Tagihan & Utilitas', 'expense', 'FileText', '#f59e0b'),
('transportasi', 'Transportasi', 'expense', 'Car', '#3b82f6'),
('hiburan', 'Hiburan & Liburan', 'expense', 'Film', '#8b5cf6'),
('transfer_keluar', 'Transfer Keluar', 'expense', 'ArrowUpRight', '#ef4444'),
('outflow_lain', 'Pengeluaran Lainnya', 'expense', 'MinusCircle', '#64748b')
ON CONFLICT (id) DO NOTHING;

-- 6. Sample Transaksi Awal (Seed Data Realistis Rupiah dengan Multi-User)
INSERT INTO public.transactions (date, type, category_name, amount, description, proof_url, proof_file_name, proof_file_size, proof_file_type, verification_status, user_id, user_name) VALUES
(CURRENT_DATE - INTERVAL '10 days', 'income', 'Gaji & Upah', 12500000.00, 'Gaji Bulanan Utama PT Teknologi', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80', 'slip_gaji_september.pdf', 245000, 'application/pdf', 'verified', 'usr-admin-1', 'Ahmad Pratama'),
(CURRENT_DATE - INTERVAL '8 days', 'expense', 'Tagihan & Utilitas', 1450000.00, 'Pembayaran Listrik PLN & Air PDAM', 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80', 'struk_pln_pdam.jpg', 182000, 'image/jpeg', 'verified', 'usr-finance-1', 'Siti Rahma'),
(CURRENT_DATE - INTERVAL '6 days', 'expense', 'Belanja', 2350000.00, 'Belanja Perlengkapan Kantor & Rumah', 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=600&q=80', 'struk_supermarket.jpg', 312000, 'image/jpeg', 'verified', 'usr-member-1', 'Budi Santoso'),
(CURRENT_DATE - INTERVAL '5 days', 'expense', 'Makanan & Minuman', 485000.00, 'Makan Siang Tim & Kopi', 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80', 'bukti_qris_resto.png', 98000, 'image/png', 'verified', 'usr-member-1', 'Budi Santoso'),
(CURRENT_DATE - INTERVAL '3 days', 'income', 'Hasil Penjualan / Bisnis', 4750000.00, 'Pembayaran Invoice Client Web Project', 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80', 'transfer_bca_client.jpg', 420000, 'image/jpeg', 'verified', 'usr-finance-1', 'Siti Rahma'),
(CURRENT_DATE - INTERVAL '2 days', 'expense', 'Kebutuhan Rumah', 850000.00, 'Isi Ulang Gas & Galon Bulanan', 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80', 'nota_toko_berkah.jpg', 154000, 'image/jpeg', 'verified', 'usr-member-1', 'Budi Santoso'),
(CURRENT_DATE - INTERVAL '1 days', 'expense', 'Transfer Keluar', 1200000.00, 'Transfer Cicilan Kendaraan', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80', 'mutasi_mbanking_transfer.jpg', 215000, 'image/jpeg', 'pending', 'usr-admin-1', 'Ahmad Pratama'),
(CURRENT_DATE, 'income', 'Dividen & Investasi', 850000.00, 'Hasil Dividen Reksadana Pasar Uang', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80', 'screenshot_bibit.png', 320000, 'image/png', 'pending', 'usr-finance-1', 'Siti Rahma');
