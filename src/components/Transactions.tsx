import React, { useState } from 'react';
import { Smartphone, Building, Wallet, Plus, Trash2, CreditCard, Banknote } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/currency';

interface TransactionsViewProps {
  transactions: Transaction[];
  currency: 'NPR' | 'USD';
  onAdd: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionsView({ transactions, currency, onAdd, onDelete }: TransactionsViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    merchant: '',
    amount: '',
    type: 'DEBIT',
    category: 'Needs',
    source: 'Cash'
  });

  const getIcon = (source: string) => {
    switch(source) {
      case 'eSewa': 
      case 'Khalti': 
        return <Wallet className="w-4 h-4" />;
      case 'fonepay': return <Smartphone className="w-4 h-4" />;
      case 'Card': return <CreditCard className="w-4 h-4" />;
      case 'Cash': return <Banknote className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const getColor = (category: string) => {
    switch(category) {
      case 'Needs': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Wants': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Savings': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Salary':
      case 'Freelance':
      case 'Business':
      case 'Investment Return':
      case 'Other Income':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.merchant || !formData.amount) return;
    
    onAdd({
      id: Date.now().toString(),
      merchant: formData.merchant,
      amount: Number(formData.amount),
      type: formData.type as 'CREDIT' | 'DEBIT',
      category: formData.category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      source: formData.source
    });
    setFormData({ merchant: '', amount: '', type: 'DEBIT', category: 'Needs', source: 'Cash' });
    setShowForm(false);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setFormData({
      ...formData,
      type: newType,
      category: newType === 'CREDIT' ? 'Salary' : 'Needs'
    });
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Transactions</h2>
          <p className="text-text-muted text-sm mt-1">Your financial ledger</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-brand text-sm font-bold bg-brand/10 px-3 py-1.5 rounded-lg hover:bg-brand/20 transition-colors"
        >
          {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Manual</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-bg-surface border border-brand/30 p-4 rounded-2xl shadow-sm space-y-3 animate-in zoom-in-95 duration-200">
          <input
            type="text"
            placeholder="Merchant / Description"
            value={formData.merchant}
            onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
            className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand text-text-main"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full flex-1 bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand text-text-main"
              required
            />
            <select
              value={formData.type}
              onChange={handleTypeChange}
              className="bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand text-text-main"
            >
              <option value="DEBIT">Expense</option>
              <option value="CREDIT">Income</option>
            </select>
          </div>
          <div className="flex gap-2">
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand text-text-main"
            >
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="eSewa">eSewa</option>
              <option value="Khalti">Khalti</option>
              <option value="fonepay">fonepay</option>
              <option value="Card">Card</option>
            </select>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full flex-1 bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand text-text-main"
            >
              {formData.type === 'DEBIT' ? (
                <>
                  <option value="Needs">Needs</option>
                  <option value="Wants">Wants</option>
                  <option value="Savings">Savings</option>
                  <option value="Debt Payment">Debt Payment</option>
                  <option value="Investment">Investment</option>
                </>
              ) : (
                <>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Business">Business</option>
                  <option value="Investment Return">Investment Return</option>
                  <option value="Other Income">Other Income</option>
                </>
              )}
            </select>
          </div>
          <button type="submit" className="w-full bg-brand text-white font-bold rounded-lg px-4 py-2 text-sm hover:opacity-90 transition-opacity">
            Save Transaction
          </button>
        </form>
      )}

      {transactions.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border-subtle rounded-2xl">
          <Wallet className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-50" />
          <p className="text-text-main font-bold">No transactions yet</p>
          <p className="text-text-muted text-sm mt-1">Add one manually or use the AI Co-Pilot.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-bg-surface border border-border-subtle p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:border-brand/30 transition-colors group">
              
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-bg-base border border-border-subtle flex items-center justify-center text-text-muted shrink-0">
                  {getIcon(tx.source)}
                </div>
                
                <div className="truncate">
                  <h4 className="font-bold text-text-main text-sm truncate">{tx.merchant}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold truncate">{tx.date}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border shrink-0 ${getColor(tx.category)}`}>
                      {tx.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className={`font-bold text-sm ${tx.type === 'CREDIT' ? 'text-emerald-500' : 'text-text-main'}`}>
                  {tx.type === 'CREDIT' ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                </div>
                <button onClick={() => onDelete(tx.id)} className="text-red-500/50 hover:text-red-500 transition-colors p-1 md:opacity-0 md:group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
