import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertOctagon, X } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/currency';

interface SecurityScannerProps {
  transactions: Transaction[];
  currency: 'NPR' | 'USD';
}

export function SecurityScanner({ transactions, currency }: SecurityScannerProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);

  useEffect(() => {
    // Simple duplicate detection: same merchant, same amount, adjacent or close
    const detected: any[] = [];
    const seen = new Map();

    for (const tx of transactions) {
      if (tx.type !== 'DEBIT') continue;
      
      const key = `${tx.merchant}-${tx.amount}`;
      if (seen.has(key)) {
        const previous = seen.get(key);
        // Ignore if dismissed
        if (!dismissed.includes(key)) {
          // Check if it's already in detected list to avoid duplicate alerts for the same key
          if (!detected.find(d => d.key === key)) {
            detected.push({
              key,
              merchant: tx.merchant,
              amount: tx.amount,
              originalTx: previous,
              duplicateTx: tx
            });
          }
        }
      } else {
        seen.set(key, tx);
      }
    }
    setDuplicates(detected);
  }, [transactions, dismissed]);

  if (duplicates.length === 0) return null;

  return (
    <div className="space-y-3 mb-6 animate-in slide-in-from-top-4 duration-300">
      {duplicates.map((dup, idx) => (
        <div key={idx} className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/30 rounded-3xl p-5 relative overflow-hidden flex flex-col sm:flex-row items-start gap-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-2xl rounded-full -mr-10 -mt-10"></div>
          
          <div className="p-3 bg-gradient-to-tr from-red-500 to-red-600 rounded-2xl text-white shrink-0 shadow-lg shadow-red-500/30 animate-pulse relative z-10">
            <AlertOctagon className="w-6 h-6" />
          </div>
          
          <div className="flex-1 relative z-10 w-full">
            <h4 className="text-red-500 font-bold text-base flex items-center gap-1.5 mb-1">
              AI Scam & Double Payment Detector
            </h4>
            <p className="text-sm text-text-muted leading-relaxed max-w-xl">
              We detected two identical deductions of <strong className="text-text-main">{formatCurrency(dup.amount, currency)}</strong> at <strong className="text-text-main">{dup.merchant}</strong> within a short window. Was this intentional?
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button 
                onClick={() => setDismissed([...dismissed, dup.key])}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-red-500/20 active:scale-95"
              >
                Block & Dispute
              </button>
              <button 
                onClick={() => setDismissed([...dismissed, dup.key])}
                className="px-4 py-2 bg-bg-base border border-border-subtle text-text-muted hover:text-text-main text-xs font-bold rounded-xl transition-colors active:scale-95"
              >
                Dismiss (Legit)
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
