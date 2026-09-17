import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { TransactionListView } from './components/TransactionListView';
import { ProofDatabaseView } from './components/ProofDatabaseView';
import { ReportsView } from './components/ReportsView';
import { TransactionModal } from './components/TransactionModal';
import { ProofLightboxModal } from './components/ProofLightboxModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { LoginView } from './components/LoginView';
import { UserProfileModal } from './components/UserProfileModal';
import { useTheme } from './lib/theme';
import {
  checkCurrentUser,
  logoutUser,
  canPerformAction,
} from './lib/auth';
import {
  fetchTransactions,
  fetchCategories,
  addTransaction,
  deleteTransaction,
  updateTransactionStatus,
  updateTransactionProof,
} from './lib/supabase';
import type { ActiveTab, Transaction, Category, VerificationStatus, User } from './types';
import { Loader2 } from 'lucide-react';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProofTx, setSelectedProofTx] = useState<Transaction | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Initial Auth Check
  useEffect(() => {
    async function initAuth() {
      try {
        const user = await checkCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Auth verification failed:', err);
      } finally {
        setIsAuthChecking(false);
      }
    }
    initAuth();
  }, []);

  // Load transactions and categories
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [txs, cats] = await Promise.all([fetchTransactions(), fetchCategories()]);
      setTransactions(txs);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load cashflow data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Count pending proofs for badge
  const pendingProofsCount = useMemo(() => {
    return transactions.filter(t => t.proof_url && t.verification_status === 'pending').length;
  }, [transactions]);

  // Handler: Add Transaction
  const handleAddTransaction = async (
    data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
    file?: File | null
  ) => {
    try {
      const txWithUser = {
        ...data,
        user_id: currentUser?.id,
        user_name: currentUser?.name,
      };
      const created = await addTransaction(txWithUser, file);
      setTransactions(prev => [created, ...prev]);
    } catch (err: any) {
      alert(`Gagal menambah transaksi: ${err.message || 'Terjadi kesalahan'}`);
    }
  };

  // Handler: Delete Transaction
  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      if (selectedProofTx?.id === id) {
        setSelectedProofTx(null);
      }
    } catch (err: any) {
      alert(`Gagal menghapus transaksi: ${err.message || 'Terjadi kesalahan'}`);
    }
  };

  // Handler: Update Verification Status
  const handleUpdateStatus = async (id: string, status: VerificationStatus) => {
    try {
      await updateTransactionStatus(id, status);
      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...t, verification_status: status } : t))
      );
      if (selectedProofTx && selectedProofTx.id === id) {
        setSelectedProofTx(prev => (prev ? { ...prev, verification_status: status } : null));
      }
    } catch (err: any) {
      alert(`Gagal memperbarui status: ${err.message || 'Terjadi kesalahan'}`);
    }
  };

  // Handler: Upload Proof
  const handleUploadProof = async (id: string, file: File) => {
    try {
      const updatedTx = await updateTransactionProof(id, file);
      setTransactions(prev => prev.map(t => (t.id === id ? updatedTx : t)));
    } catch (err: any) {
      alert(`Gagal upload bukti: ${err.message || 'Terjadi kesalahan'}`);
    }
  };

  // Handler: Reset Demo Data
  const handleResetData = () => {
    localStorage.removeItem('cashflow_app_transactions');
    loadData();
  };

  // Handler: Logout
  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  // Handler: Switch User
  const handleSwitchUser = (newUser: User) => {
    setCurrentUser(newUser);
  };

  // 1. Checking Session Spinner
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center gap-3 text-slate-500 dark:text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600 dark:text-brand-500" />
        <p className="text-xs font-bold">Memeriksa Sesi Login...</p>
      </div>
    );
  }

  // 2. If Not Logged In, Render Login Screen
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={user => {
          setCurrentUser(user);
          loadData();
        }}
      />
    );
  }

  // 3. Main Authenticated App
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center text-slate-800 dark:text-slate-100 transition-colors">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col relative shadow-2xl border-x border-slate-200 dark:border-slate-800/80 transition-colors">
        {/* Top App Bar */}
        <Header
          onOpenConfig={() => setIsConfigModalOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600 dark:text-brand-500" />
              <p className="text-xs font-semibold">Memuat Data Arus Kas...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  transactions={transactions}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  onSelectProof={tx => setSelectedProofTx(tx)}
                  onChangeTab={tab => setActiveTab(tab)}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionListView
                  transactions={transactions}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  onSelectProof={tx => setSelectedProofTx(tx)}
                  onDeleteTransaction={handleDeleteTransaction}
                  onUploadProof={handleUploadProof}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'proofs' && (
                <ProofDatabaseView
                  transactions={transactions}
                  onSelectProof={tx => setSelectedProofTx(tx)}
                  onUpdateStatus={handleUpdateStatus}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'reports' && <ReportsView transactions={transactions} />}
            </>
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={tab => setActiveTab(tab)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          pendingProofsCount={pendingProofsCount}
          canAddTransaction={canPerformAction(currentUser, 'add_transaction')}
        />

        {/* Modals */}
        <TransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          categories={categories}
          onSubmit={handleAddTransaction}
        />

        <ProofLightboxModal
          transaction={selectedProofTx}
          onClose={() => setSelectedProofTx(null)}
          onUpdateStatus={handleUpdateStatus}
          canUpdateStatus={canPerformAction(currentUser, 'verify_proof')}
        />

        <SupabaseConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onResetData={handleResetData}
        />

        {/* User Profile & Role Switcher Modal */}
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchUser={handleSwitchUser}
        />
      </div>
    </div>
  );
}

export default App;
