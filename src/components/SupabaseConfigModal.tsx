import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onResetData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const envSample = `VITE_SUPABASE_URL=https://xyzcompany.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Konfigurasi Supabase Backend</h3>
              <p className="text-[10px] text-slate-400">Database PostgreSQL & Storage Bukti</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status Alert */}
          {isSupabaseConfigured ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-400 text-xs">Supabase Terhubung!</h4>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  Aplikasi saat ini terhubung langsung dengan Supabase Database dan Storage bucket <code className="bg-emerald-950 px-1 py-0.5 rounded">transfer-proofs</code>.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-400 text-xs">Mode Demo / Lokal Aktif</h4>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  Kredensial Supabase belum dimasukkan di file <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">.env</code>. Semua pencatatan transaksi & bukti saat ini tersimpan otomatis di browser secara interaktif.
                </p>
              </div>
            </div>
          )}

          {/* Setup Guide Steps */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-slate-400">
              Langkah Menghubungkan Supabase:
            </h4>

            <div className="p-3 rounded-2xl bg-slate-850 border border-slate-800 space-y-1.5">
              <p className="font-bold text-slate-200">1. Eksekusi Skrip SQL</p>
              <p className="text-[11px] text-slate-400">
                Buka tab <strong>SQL Editor</strong> di dashboard Supabase Anda, lalu salin isi file:
              </p>
              <code className="block bg-slate-900 p-2 rounded-xl border border-slate-800 font-mono text-[10px] text-brand-400">
                supabase/schema.sql
              </code>
            </div>

            <div className="p-3 rounded-2xl bg-slate-850 border border-slate-800 space-y-1.5">
              <p className="font-bold text-slate-200">2. Isi Environment Variables</p>
              <p className="text-[11px] text-slate-400">
                Buka file <code className="text-slate-300">.env</code> di root proyek dan masukkan URL & Anon Key:
              </p>
              <div className="relative">
                <pre className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300 overflow-x-auto">
                  {envSample}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Salin contoh"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Reset Demo Data Button */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">Ingin mereset contoh transaksi awal?</p>
            <button
              onClick={() => {
                if (confirm('Kembalikan transaksi ke data demo awal?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
            >
              <RotateCcw className="w-3 h-3 text-brand-400" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
