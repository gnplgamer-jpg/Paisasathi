export type TabId = 'dashboard' | 'modules' | 'transactions' | 'gold' | 'brain';
export type ThemeId = 'light' | 'emerald' | 'luxury' | 'glass';

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  category: 'Needs' | 'Wants' | 'Savings';
  date: string;
  source: 'eSewa' | 'fonepay' | 'Bank' | 'Cash';
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', merchant: 'Bhatbhateni Supermarket', amount: 4500, type: 'DEBIT', category: 'Needs', date: 'Today, 2:30 PM', source: 'fonepay' },
  { id: '1b', merchant: 'Bhatbhateni Supermarket', amount: 4500, type: 'DEBIT', category: 'Needs', date: 'Today, 2:32 PM', source: 'fonepay' },
  { id: '2', merchant: 'Salary (Global IME)', amount: 65000, type: 'CREDIT', category: 'Savings', date: 'Yesterday', source: 'Bank' },
  { id: '3', merchant: 'Foodmandu', amount: 1200, type: 'DEBIT', category: 'Wants', date: 'Yesterday', source: 'eSewa' },
  { id: '4', merchant: 'NEA Electricity', amount: 850, type: 'DEBIT', category: 'Needs', date: '2 days ago', source: 'eSewa' },
  { id: '5', merchant: 'Gold SIP Installment', amount: 5000, type: 'DEBIT', category: 'Savings', date: '3 days ago', source: 'Bank' },
];
