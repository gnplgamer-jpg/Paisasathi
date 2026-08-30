import React from 'react';
import { ArrowUpRight, ArrowDownRight, Sparkles, AlertTriangle, PlusCircle, Target, Lightbulb } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/currency';
import { SavingsStreak } from './SavingsStreak';
import { SubscriptionDashboard } from './SubscriptionDashboard';
import { SecurityScanner } from './SecurityScanner';
import { Leaderboard } from './Leaderboard';
import { PremiumProTips } from './PremiumProTips';

interface DashboardProps {
  userName: string;
  transactions: Transaction[];
  currency: 'NPR' | 'USD';
  onNavigate: (tab: any) => void;
}

export function Dashboard({ userName, transactions, currency, onNavigate }: DashboardProps) {
  const totalIncome = transactions.filter(t => t.type === 'CREDIT').reduce((acc, t) => acc + t.amount, 0);
  const totalSpent = transactions.filter(t => t.type === 'DEBIT').reduce((acc, t) => acc + t.amount, 0);
  const totalBalance = totalIncome - totalSpent;
  const monthlyIncome = totalIncome > 0 ? totalIncome : 1; // Prevent divide by zero

  // Budget Threshold Logic
  const spendingRatio = totalIncome > 0 ? (totalSpent / totalIncome) : 0;
  const isOverBudgetThreshold = spendingRatio > 0.8 && totalIncome > 0;

  // 50/30/20 Rule Data
  const spentNeeds = transactions.filter(t => t.category === 'Needs' && t.type === 'DEBIT').reduce((acc, t) => acc + t.amount, 0);
  const spentWants = transactions.filter(t => t.category === 'Wants' && t.type === 'DEBIT').reduce((acc, t) => acc + t.amount, 0);
  const savedAmount = transactions.filter(t => t.category === 'Savings' && t.type === 'DEBIT').reduce((acc, t) => acc + t.amount, 0);
  
  const leftover = Math.max(0, totalIncome - totalSpent);

  const budgetData = totalIncome > 1 ? [
    { name: 'Needs (50%)', value: spentNeeds, color: '#10b981' },
    { name: 'Wants (30%)', value: spentWants, color: '#f59e0b' },
    { name: 'Savings (20%)', value: savedAmount + leftover, color: '#3b82f6' },
  ] : [
    { name: 'No Data Yet', value: 1, color: '#4b5563' }
  ];

  const highestWant = transactions.filter(t => t.category === 'Wants' && t.type === 'DEBIT').sort((a, b) => b.amount - a.amount)[0];
  const dynamicDailyLimit = totalIncome > 0 ? (totalIncome * 0.5) / 30 : 500;

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
        <h2 className="text-xl md:text-2xl font-bold text-text-main mb-3 leading-tight relative z-10">
          Welcome back, {userName}. Let's secure your wealth.
        </h2>
        <p className="text-sm text-text-muted leading-relaxed relative z-10">
          <strong className="text-brand">Mero Wallet</strong> is your intelligent financial co-pilot. Keep logging transactions to outsmart your budget and rise up the city ranks.
        </p>
      </div>

      <SecurityScanner transactions={transactions} currency={currency} />

      {/* Hero Balance Card */}
      <div className="bg-brand text-white rounded-3xl p-6 shadow-lg shadow-brand/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <p className="text-brand-muted font-medium mb-1 flex justify-between items-center">
          Total Net Worth
        </p>
        <h2 className="text-4xl font-bold mb-4 tracking-tight">{formatCurrency(totalBalance, currency)}</h2>
        
        <div className="flex gap-4">
          <div className="bg-black/20 rounded-xl p-3 flex-1 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
              <ArrowDownRight className="w-4 h-4" /> Income
            </div>
            <div className="font-semibold">{formatCurrency(monthlyIncome, currency)}</div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 flex-1 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-red-300 text-xs font-bold uppercase tracking-wider mb-1">
              <ArrowUpRight className="w-4 h-4" /> Spent
            </div>
            <div className="font-semibold">{formatCurrency(totalSpent, currency)}</div>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="flex gap-3">
        <button 
          onClick={() => onNavigate('transactions')}
          className="flex-1 bg-brand text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-brand/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-5 h-5" /> Add Income
        </button>
        <button 
          onClick={() => onNavigate('gold')}
          className="flex-1 bg-yellow-500 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Target className="w-5 h-5" /> Set Goal
        </button>
      </div>

      {/* AI Premium Pro Tips (Ad-gated) */}
      <PremiumProTips transactions={transactions} currency={currency} />

      {/* Budget Threshold Alert */}
      {isOverBudgetThreshold && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 shadow-sm items-start animate-in fade-in zoom-in duration-300">
          <div className="p-2 bg-red-500/20 text-red-500 rounded-full shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-red-500 text-sm">Budget Threshold Exceeded</h4>
            <p className="text-red-500/80 text-xs mt-1 leading-relaxed">
              You have spent <strong>{(spendingRatio * 100).toFixed(0)}%</strong> of your monthly income. Consider minimizing "Wants" for the rest of the period.
            </p>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-bg-surface border border-brand/20 rounded-2xl p-4 flex gap-3 shadow-sm items-start">
        <div className="p-2 bg-brand/10 text-brand rounded-full shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-text-main text-sm">AI Savings Advice</h4>
          <p className="text-text-muted text-xs mt-1 leading-relaxed">
            {highestWant ? (
              <>You spent {formatCurrency(highestWant.amount, currency)} on {highestWant.merchant} recently. Minimizing these "Wants" can boost your Gold savings faster!</>
            ) : (
              <>Log your "Wants" to get AI-powered insights on how to cut back and save more for your goals!</>
            )}
          </p>
        </div>
      </div>

      {/* Savings Streak Tracker */}
      <SavingsStreak currency={currency} dailyLimit={dynamicDailyLimit} />

      {/* Leaderboard (Gamification) */}
      <Leaderboard userName={userName} transactions={transactions} currency={currency} />

      {/* Subscription Dashboard & Auto-Pause Engine */}
      <SubscriptionDashboard currency={currency} />

      {/* 50/30/20 Budget Breakdown */}
      <div className="bg-bg-surface border border-border-subtle rounded-3xl p-5 shadow-sm">
        <h3 className="font-bold text-text-main mb-4 text-lg">Monthly Budget</h3>
        
        <div className="flex items-center justify-between gap-4">
          <div className="w-32 h-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 space-y-3">
            {budgetData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-text-muted font-medium text-xs">{item.name}</span>
                </div>
                <span className="font-bold text-text-main text-xs">{formatCurrency(item.value, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gamified MVP Leaderboard */}
      <Leaderboard userName={userName} transactions={transactions} currency={currency} />

    </div>
  );
}
