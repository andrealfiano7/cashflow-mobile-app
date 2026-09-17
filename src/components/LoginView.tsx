import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { DEMO_ACCOUNTS, ROLE_CONFIGS } from '../lib/auth';
import type { User } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Silakan isi email dan kata sandi Anda.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Receive Set-Cookie with HttpOnly
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      let data: any = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        // Fallback for demo users if API returns non-JSON
        const demoMatch = DEMO_ACCOUNTS.find(
          a => a.email.toLowerCase() === loginEmail.toLowerCase() && a.password === loginPassword
        );
        if (demoMatch) {
          const fallbackUser: User = {
            id: `usr-${demoMatch.role}-1`,
            email: demoMatch.email,
            name: demoMatch.name,
            role: demoMatch.role,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          };
          localStorage.setItem('cashflow_active_user', JSON.stringify(fallbackUser));
          onLoginSuccess(fallbackUser);
          return;
        }
        throw new Error('Gagal menghubungi server otentikasi. Silakan periksa kembali email & sandi.');
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Email atau kata sandi tidak valid');
      }

      if (data?.user) {
        localStorage.setItem('cashflow_active_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      // Offline / network fallback for demo users
      const demoMatch = DEMO_ACCOUNTS.find(
        a => a.email.toLowerCase() === loginEmail.toLowerCase() && a.password === loginPassword
      );
      if (demoMatch) {
        const fallbackUser: User = {
          id: `usr-${demoMatch.role}-1`,
          email: demoMatch.email,
          name: demoMatch.name,
          role: demoMatch.role,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        };
        localStorage.setItem('cashflow_active_user', JSON.stringify(fallbackUser));
        onLoginSuccess(fallbackUser);
        return;
      }
      setErrorMessage(err.message || 'Terjadi kesalahan saat masuk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    handleLogin(undefined, acc.email, acc.password);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center items-center p-4 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 rounded-full bg-brand-500/20 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo.png" alt="Cashflow Logo" className="w-12 h-12 object-contain drop-shadow-md" />
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Cashflow
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  Mobile
                </span>
              </h1>
              <p className="text-xs text-slate-400">Masuk untuk mengelola arus kas & mutasi</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
            <span>Dilindungi JWT &amp; Cookie <strong>HttpOnly</strong> (Anti-XSS)</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-shake">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Alamat Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Token...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Masuk ke Akun</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Login for Multi-User & Demo Accounts */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Login Cepat Akun Demo:
              </span>
              <span className="text-[10px] text-slate-400">1-Klik Langsung Masuk</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => {
                const cfg = ROLE_CONFIGS[acc.role];
                return (
                  <button
                    key={acc.role}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickLogin(acc)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-left transition-all active:scale-95 flex flex-col gap-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                        {acc.name.split(' ')[0]}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono truncate">{acc.email}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
