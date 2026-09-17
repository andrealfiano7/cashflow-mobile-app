import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  FileText,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Category, Transaction, TransactionType, User } from '../types';
import { formatBytes } from '../lib/utils';
import { CategoryIcon } from './CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (
    data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
    file?: File | null
  ) => Promise<void>;
  currentUser?: User | null;
  onOpenUpgrade?: (reason?: string) => void;
  isQuotaFull?: boolean;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSubmit,
  currentUser = null,
  onOpenUpgrade,
  isQuotaFull = false,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // Proof file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Filter categories by type
  const availableCategories = categories.filter(c => c.type === type);

  // Auto select first category if none or invalid
  const currentCategory = categoryName || (availableCategories[0]?.name || '');

  // Format nominal input as Rupiah string
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setAmountStr('');
      return;
    }
    const num = parseInt(rawValue, 10);
    setAmountStr(new Intl.NumberFormat('id-ID').format(num));
  };

  const isBasic = currentUser?.role === 'basic';
  const maxSizeBytes = isBasic ? 2 * 1024 * 1024 : 10 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeBytes) {
      if (isBasic) {
        setErrorMsg('Ukuran file melebihi 2MB (batas akun Basic). Upgrade ke Pro 💎 untuk upload berkas resolusi tinggi (HD) hingga 10MB!');
        onOpenUpgrade?.('hd_upload');
      } else {
        setErrorMsg('Ukuran file maksimal 10MB');
      }
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBasic && isQuotaFull) {
      setErrorMsg('Batas kuota 15 transaksi akun Basic telah tercapai. Upgrade ke Pro untuk menambah transaksi baru!');
      onOpenUpgrade?.('transaction_limit');
      return;
    }

    const rawAmount = parseInt(amountStr.replace(/[^0-9]/g, ''), 10);

    if (isNaN(rawAmount) || rawAmount <= 0) {
      setErrorMsg('Masukkan nominal transaksi yang valid');
      return;
    }

    if (!currentCategory) {
      setErrorMsg('Pilih kategori transaksi');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      await onSubmit(
        {
          date,
          type,
          category_name: currentCategory,
          amount: rawAmount,
          description: description.trim() || currentCategory,
          verification_status: selectedFile ? 'pending' : 'verified',
        },
        selectedFile
      );

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      // Reset form
      setAmountStr('');
      setDescription('');
      removeFile();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan transaksi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl transition-colors">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Catat Transaksi Baru</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pemasukan, pengeluaran & upload bukti</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Type Toggle: Pemasukan vs Pengeluaran */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategoryName('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Pengeluaran</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategoryName('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Pemasukan</span>
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nominal (Rupiah)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 dark:text-slate-500">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={amountStr}
                onChange={handleAmountChange}
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-lg font-extrabold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors shadow-inner"
                autoFocus
              />
            </div>
          </div>

          {/* Category Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Kategori Pos Dana</label>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-50/60 dark:bg-slate-850/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              {availableCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryName(cat.name)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    currentCategory === cat.name
                      ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    <CategoryIcon name={cat.name} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tanggal</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Keterangan / Catatan</label>
              <input
                type="text"
                placeholder="Contoh: Belanja mingguan supermarket"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Upload Bukti Transfer */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>Upload Bukti Transfer / Struk</span>
                <span className="text-[10px] text-slate-400 font-normal">(Opsional)</span>
              </label>
              {isBasic ? (
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Maks 2MB</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={() => onOpenUpgrade?.('hd_upload')}
                    className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>HD 10MB</span>
                  </button>
                </div>
              ) : (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>HD Upload Aktif (10MB)</span>
                </span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 bg-slate-50/60 dark:bg-slate-850/40 rounded-2xl p-4 text-center cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800/40 group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:bg-brand-500/20 text-slate-500 dark:text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400 flex items-center justify-center mx-auto mb-2 transition-colors">
                  <Camera className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Ambil Foto Kamera / Pilih Berkas
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Mendukung JPG, PNG, WEBP, atau struk PDF
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview Bukti"
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-rose-500 shrink-0">
                    <FileText className="w-6 h-6" />
                    <span className="text-[8px] font-bold">PDF</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{formatBytes(selectedFile.size)}</p>
                  <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3" /> Berkas siap diupload
                  </span>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="Hapus berkas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                type === 'income'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-400'
                  : 'bg-gradient-to-r from-rose-600 to-orange-500 shadow-rose-500/25 hover:from-rose-500 hover:to-orange-400'
              } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengupload & Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Simpan Transaksi {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
