export type TransactionType = 'income' | 'expense';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export type UserRole = 'pro' | 'basic';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  created_at?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category_name: string;
  amount: number;
  description: string;
  proof_url?: string | null;
  proof_file_name?: string | null;
  proof_file_size?: number | null;
  proof_file_type?: string | null;
  verification_status: VerificationStatus;
  user_id?: string;
  user_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface CashflowSummary {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  topExpenseCategory: {
    name: string;
    amount: number;
    percentage: number;
  } | null;
}

export type ActiveTab = 'dashboard' | 'transactions' | 'proofs' | 'reports';

export interface DateFilterRange {
  startDate?: string;
  endDate?: string;
  period: 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
}
