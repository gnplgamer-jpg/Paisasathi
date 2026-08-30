import React from 'react';
import { Trophy } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { Transaction } from '../types';

interface LeaderboardProps {
  userName: string;
  transactions: Transaction[];
  currency: 'NPR' | 'USD';
}

export function Leaderboard({ userName, transactions, currency }: LeaderboardProps) {
  // Calculate actual user savings
  const realSavings = transactions
    .filter(t => t.category === 'Savings' && t.type === 'DEBIT')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncome = transactions.filter(t => t.type === 'CREDIT').reduce((acc, t) => acc + t.amount, 0);
  const totalSpent = transactions.filter(t => t.type === 'DEBIT').reduce((acc, t) => acc + t.amount, 0);
  const leftover = Math.max(0, totalIncome - totalSpent);
  
  // Give user a 1000 welcome bonus so they start at Rank 5, beating the bottom 2 bots
  const baseUserSavings = realSavings + leftover;
  const userTotalSavings = baseUserSavings === 0 ? 1000 : baseUserSavings + 1000;

  // Fake bots
  const baseLeaderboard = [
    { id: 'b1', name: 'Sita T.', savings: 145000, isBot: true },
    { id: 'b2', name: 'Rajesh S.', savings: 85000, isBot: true },
    { id: 'b3', name: 'Pooja G.', savings: 42000, isBot: true },
    { id: 'b4', name: 'Bikash M.', savings: 15500, isBot: true },
    { id: 'b5', name: 'Anjali K.', savings: 500, isBot: true },
    { id: 'b6', name: 'Rohan P.', savings: 0, isBot: true },
  ];

  // Add user and sort
  const combined = [
    ...baseLeaderboard, 
    { id: 'u1', name: userName || 'You', savings: userTotalSavings, isBot: false }
  ];
  combined.sort((a, b) => b.savings - a.savings);

  // Keep top 6
  const displayBoard = combined.slice(0, 6);

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-3xl p-5 shadow-sm space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" /> City Wealth Rank
        </h3>
        <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-1 rounded-lg uppercase tracking-wider">Top Savers</span>
      </div>
      
      <div className="space-y-2">
        {displayBoard.map((user, idx) => (
          <div 
            key={user.id} 
            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
              !user.isBot 
                ? 'bg-brand/10 border-brand/30 shadow-sm scale-[1.02]' 
                : 'bg-bg-base border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`font-bold w-6 text-center text-sm ${
                idx === 0 ? 'text-yellow-500' : 
                idx === 1 ? 'text-zinc-400' : 
                idx === 2 ? 'text-amber-600' : 'text-text-muted'
              }`}>
                #{idx + 1}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                !user.isBot ? 'bg-brand shadow-md shadow-brand/20' : 'bg-gradient-to-tr from-gray-400 to-gray-300'
              }`}>
                {user.name.charAt(0)}
              </div>
              <span className={`text-sm font-bold ${!user.isBot ? 'text-brand' : 'text-text-main'}`}>
                {user.name} {!user.isBot && <span className="text-[10px] ml-1 bg-brand/20 px-1.5 py-0.5 rounded text-brand">(You)</span>}
              </span>
            </div>
            <div className="text-sm font-bold text-text-main">
              {formatCurrency(user.savings, currency)}
            </div>
          </div>
        ))}
      </div>
      
      {baseUserSavings === 0 && (
        <div className="bg-brand/10 border border-brand/20 p-3 rounded-xl text-center mt-4">
          <p className="text-xs text-brand font-bold">
            🎉 You received a 1,000 Pts Welcome Bonus!
          </p>
          <p className="text-xs text-text-muted mt-1">
            Log your first income or savings to climb past Bikash and reach the Top 3.
          </p>
        </div>
      )}
    </div>
  );
}
