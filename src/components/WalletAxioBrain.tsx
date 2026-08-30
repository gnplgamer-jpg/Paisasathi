import React, { useState } from 'react';
import { Sparkles, Send, Cpu, Mic, Plus } from 'lucide-react';
import { Transaction } from '../types';

interface WalletAxioBrainProps {
  onAddTransaction: (transaction: Transaction) => void;
}

export function WalletAxioBrain({ onAddTransaction }: WalletAxioBrainProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/walletaxio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error('Failed to process. Make sure GEMINI_API_KEY is configured in Settings.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAction = () => {
    if (!result || result.engine !== 'voice_logger') return;
    
    const newTx: Transaction = {
      id: Date.now().toString(),
      merchant: result.data.interpreted_text || 'AI Logged Expense',
      amount: result.data.detected_amount || 0,
      type: result.data.transaction_type?.toUpperCase() === 'CREDIT' ? 'CREDIT' : 'DEBIT',
      category: result.data.category || 'Needs',
      date: 'Just Now',
      source: result.data.payment_source || 'Cash'
    };
    
    onAddTransaction(newTx);
    setResult(null);
    setInput('');
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
          <Cpu className="w-6 h-6 text-brand" />
          Mero Wallet Engine
        </h2>
        <p className="text-text-muted text-sm mt-1">Multi-modal AI financial processor</p>
      </div>

      <div className="bg-bg-surface border border-brand/30 rounded-3xl p-5 shadow-lg shadow-brand/10 flex-1 flex flex-col relative overflow-hidden">
        
        {/* Animated Background Rays */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

        <div className="flex-1 flex flex-col justify-center gap-4 relative z-10">
          
          {error && (
             <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-xl text-xs">
                {error}
             </div>
          )}

          {result ? (
            <div className="bg-bg-base border border-border-subtle rounded-2xl p-4 flex flex-col gap-4 animate-in zoom-in duration-300">
               <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                 <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Engine: {result.engine}</span>
                 <Sparkles className="w-4 h-4 text-brand" />
               </div>
               <pre className="text-[10px] text-text-main overflow-x-auto p-2 bg-black/20 rounded-lg">
                 {JSON.stringify(result.data, null, 2)}
               </pre>
               
               {result.engine === 'voice_logger' && (
                  <button 
                    onClick={handleApplyAction}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-brand text-white rounded-xl font-bold shadow-md shadow-brand/20 hover:opacity-90 transition-all active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" /> Log Transaction
                  </button>
               )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(var(--brand-rgb),0.3)]">
                <Mic className="w-8 h-8" />
              </div>
              <p className="text-sm text-text-muted px-4 leading-relaxed">
                Type or speak a prompt (e.g. "Sathiko baje ma dus rupiya khalti bata haley") to process using the Engine.
              </p>
            </div>
          )}

        </div>

        <div className="mt-6 flex gap-2 relative z-10">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
            placeholder="Process transaction data..."
            className="flex-1 bg-bg-base border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors text-text-main placeholder-text-muted/50"
            disabled={loading}
          />
          <button 
            onClick={handleProcess}
            disabled={loading || !input.trim()}
            className="bg-brand text-white p-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {loading ? <span className="animate-spin block">...</span> : <Send className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
}
