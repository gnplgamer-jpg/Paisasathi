import React from 'react';
import { Zap, Users, TrendingUp, BrainCircuit, CheckCircle2, Lock, Trash2 } from 'lucide-react';

const ZONES = [
  {
    id: 'zone-1',
    title: 'Zone 1: Hyper-Automation',
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    color: 'border-yellow-500/20 bg-yellow-500/5',
    features: [
      'Multi-Currency & Hybrid Calendar (AD/BS)',
      'On-Device SMS Parser (Offline Privacy)',
      'Smart Receipt OCR & Itemizer',
      'Local Wallet Categorizer (eSewa/Khalti/UPI)',
      'Personal AI Finance Coach',
      'AI Scam & Double Payment Detector'
    ]
  },
  {
    id: 'zone-2',
    title: 'Zone 2: Collaborative Finance',
    icon: <Users className="w-5 h-5 text-blue-500" />,
    color: 'border-blue-500/20 bg-blue-500/5',
    features: [
      'Smart Group Bill Splitting',
      'Dual Mode: Personal + Business Khata',
      'Voice-Activated Dictation Logger',
      'Smart Subscription Auto-Pause',
      'Gamification & Savings Streaks'
    ]
  },
  {
    id: 'zone-3',
    title: 'Zone 3: Wealth Co-Pilot',
    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    color: 'border-emerald-500/20 bg-emerald-500/5',
    features: [
      'Predictive Cash-Flow Graphing',
      'Location-Based Categorization (GPS)',
      'Smart Investment Surplus Allocator',
      'Family Hub & Couple Shared Wallet',
      'Kid/Teen Wallet Monitor Mode'
    ]
  },
  {
    id: 'zone-4',
    title: 'Zone 4: Deep Utilities',
    icon: <BrainCircuit className="w-5 h-5 text-purple-500" />,
    color: 'border-purple-500/20 bg-purple-500/5',
    features: [
      'Impulse Buy Pause (24hr Lock)',
      'Financial Freedom Calculator',
      'Emotional Mood Tracker',
      'Smart Local Tax Deductor (NP/IN)',
      'Zero-Knowledge Encrypted Sync',
      'Widget Handler & Custom Automation (IFTTT)',
      'Eco-Financial Tracker (Carbon Footprint)'
    ]
  }
];

interface ModulesHubProps {
  onResetAll?: () => void;
}

export function ModulesHub({ onResetAll }: ModulesHubProps) {
  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Lock className="w-6 h-6 text-brand" />
            The 22 Engines
          </h2>
          <p className="text-text-muted text-sm mt-1">Mero Wallet Architecture Blueprint</p>
        </div>
        
        {onResetAll && (
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to completely erase all transactions and start from scratch?")) {
                onResetAll();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Reset App
          </button>
        )}
      </div>

      <div className="space-y-4">
        {ZONES.map((zone) => (
          <div key={zone.id} className={`border rounded-3xl p-5 shadow-sm ${zone.color}`}>
            <h3 className="font-bold text-text-main text-base flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-bg-surface rounded-lg shadow-sm">
                {zone.icon}
              </div>
              {zone.title}
            </h3>
            
            <div className="space-y-3">
              {zone.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <span className="text-sm text-text-muted leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
