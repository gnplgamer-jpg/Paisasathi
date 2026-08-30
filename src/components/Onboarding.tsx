import React, { useState } from 'react';
import { Wallet, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (name: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="absolute inset-0 z-[100] bg-bg-base flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-sm space-y-8 text-center animate-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="w-20 h-20 bg-brand rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-brand/30">
          <Wallet className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-text-main tracking-tight">Mero Wallet</h1>
          <p className="text-text-muted text-sm leading-relaxed max-w-[260px] mx-auto">
            Your personal financial co-pilot. Let's start building your wealth.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          <input
            type="text"
            placeholder="What should we call you?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-bg-surface border border-border-subtle rounded-2xl px-5 py-4 text-center text-lg font-bold text-text-main focus:outline-none focus:border-brand shadow-sm transition-colors"
            autoFocus
            required
            maxLength={15}
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-brand text-white font-bold rounded-2xl px-5 py-4 flex items-center justify-center gap-2 shadow-lg shadow-brand/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
          >
            Start Saving <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
