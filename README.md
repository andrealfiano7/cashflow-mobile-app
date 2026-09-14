# 📱 Cashflow Mobile - Arus Kas & Database Bukti Transfer

Aplikasi pengelola keuangan dan arus kas (*cashflow*) modern berbasis **Mobile-First** yang dirancang sesuai dengan template referensi Google Sheets (**Cashflow Dashboard**). Aplikasi ini terintegrasi langsung dengan **Supabase** (Database PostgreSQL & Storage Bucket) untuk pencatatan transaksi dan pengarsipan berkas bukti transfer / pembayaran.

---

## ✨ Fitur Utama

1. **📊 Financial Dashboard (Dashboard Finansial)**
   - **Kartu Ringkasan Realtime**: Sisa Saldo Kas, Total Dana Masuk, Total Dana Keluar, dan Pengeluaran Terbesar.
   - **Filter Waktu Interaktif**: 7 Hari Terakhir, 30 Hari, dan Semua Waktu.
   - **Grafik Batang (Inflow vs Outflow)**: Visualisasi perbandingan dana masuk vs keluar per tanggal.
   - **Grafik Donat (Distribusi Pengeluaran)**: Pembagian pos pengeluaran berdasarkan kategori (Belanja, Kebutuhan Rumah, Makanan, Tagihan, Transfer Keluar, dll.).
   - **Transaksi Terkini**: Menampilkan ringkasan riwayat mutasi terbaru dengan indikator ketersediaan bukti transfer.

2. **📋 Buku Kas (Cashflow Ledger)**
   - Daftar seluruh mutasi kas dengan pencarian dan filter cepat (Masuk / Keluar / Kategori).
   - **Saldo Berjalan (*Running Balance*)** otomatis di setiap baris transaksi.
   - **Export ke CSV**: Unduh data transaksi ke format CSV/Excel kapan saja.
   - Aksi hapus dan preview bukti transfer secara instan.

3. **🧾 Database & Upload Bukti Transfer**
   - **Upload Fleksibel**: Ambil foto langsung menggunakan kamera smartphone (*Mobile Camera*) atau pilih file struk/nota dari galeri (JPG, PNG, WEBP, PDF).
   - **Supabase Storage Integration**: Berkas tersimpan di cloud storage bucket `transfer-proofs`.
   - **Status Verifikasi**: Status *Menunggu (Pending)*, *Terverifikasi (Verified)*, dan *Ditolak (Rejected)* dengan tombol aksi verifikasi satu ketukan.
   - **Lightbox / Zoom Berkas**: Tampilan pratinjau bukti transfer resolusi penuh dengan tombol unduh langsung.

4. **📈 Analisis Finansial & Rasio Tabungan**
   - Perhitungan otomatis rasio tabungan (*Savings Rate*) dan evaluasi kesehatan finansial.
   - Diagram alokasi sumber pemasukan dan rincian pengeluaran per pos dana.

5. **⚡ Mobile-First PWA (Progressive Web App)**
   - Dilengkapi *Web App Manifest* (`manifest.json`) dan icon responsif.
   - Dapat di-install langsung ke layar utama (*Add to Home Screen*) di Android & iOS.
   - Navigasi bawah (*Bottom Navigation Bar*) khas aplikasi perbankan modern.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling & UI**: Tailwind CSS v3 + Lucide React Icons
- **Data Visualization**: Recharts
- **Backend & Cloud Storage**: Supabase (PostgreSQL Database & Storage Bucket `transfer-proofs`)
- **Interactive Feedback**: Canvas Confetti

---

## 🚀 Panduan Memulai (Quick Start)

### 1. Clone & Instalasi Dependensi
```bash
git clone https://github.com/andrealfiano7/cashflow-mobile-app.git
cd cashflow-mobile-app
npm install
```

### 2. Konfigurasi Supabase
1. Buat proyek baru di [Supabase](https://supabase.com).
2. Buka menu **SQL Editor** di dashboard Supabase Anda.
3. Buka file `supabase/schema.sql` di proyek ini, salin seluruh isinya, lalu klik **Run** di SQL Editor Supabase. Skrip ini akan membuat:
   - Tabel `categories` beserta kategori default
   - Tabel `transactions`
   - Storage bucket `transfer-proofs` dengan kebijakan izin akses publik
   - Data transaksi awal (*seed data*) dalam format Rupiah
4. Buka menu **Project Settings -> API** di Supabase untuk mendapatkan:
   - **Project URL**
   - **anon / public key**
5. Buat file `.env` di root proyek:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> 💡 **Catatan Mode Demo/Lokal**:
> Jika file `.env` belum diisi, aplikasi akan otomatis beralih ke **Mode Demo/Lokal**. Semua transaksi dan upload bukti dapat dicoba langsung di browser tanpa kendala!

### 3. Menjalankan Aplikasi
```bash
npm run dev
```
Buka browser pada alamat yang muncul (biasanya `http://localhost:5173`).
Gunakan mode *Mobile Device Simulator* di browser (tekan `F12` lalu pilih mode iPhone / Android) untuk pengalaman mobile terbaik.

---

## 📁 Struktur Proyek

```
cashflow/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.json          # PWA configuration
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx             # Navigasi bawah mobile
│   │   ├── CategoryIcon.tsx          # Ikon dinamis kategori
│   │   ├── DashboardView.tsx         # Tab Ringkasan & Grafik
│   │   ├── Header.tsx                # App bar & status Supabase
│   │   ├── ProofDatabaseView.tsx     # Tab Database Bukti Bayar
│   │   ├── ProofLightboxModal.tsx    # Modal preview gambar bukti
│   │   ├── ReportsView.tsx           # Tab Analisis Rasio Finansial
│   │   ├── SupabaseConfigModal.tsx   # Modal petunjuk Supabase
│   │   ├── TransactionListView.tsx   # Tab Buku Kas & Export CSV
│   │   └── TransactionModal.tsx      # Modal form + upload foto
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client & local fallback
│   │   └── utils.ts                  # Formatter Rupiah, tanggal, ukuran
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   ├── App.tsx                       # Main container
│   ├── index.css                     # Tailwind styles & safe-area
│   └── main.tsx                      # Entrypoint
├── supabase/
│   └── schema.sql                    # Skrip SQL lengkap Supabase
├── .env.example
├── package.json
└── tailwind.config.js
```

---

## 📄 Lisensi
MIT License. Bebas digunakan dan dikembangkan untuk keperluan pribadi maupun komersial.
