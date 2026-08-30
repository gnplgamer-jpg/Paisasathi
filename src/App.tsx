import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LayoutDashboard, ReceiptText, Trophy, Target, Wallet, Wifi, CloudOff, RefreshCw, ArrowRightLeft, Cpu, Blocks } from 'lucide-react';
import { TabId, ThemeId, MOCK_TRANSACTIONS, Transaction } from './types';
import { Dashboard } from './components/Dashboard';
import { GoalTracker } from './components/GoalTracker';
import { TransactionsView } from './components/Transactions';
import { ThemeSelector } from './components/ThemeSelector';
import { WalletAxioBrain } from './components/WalletAxioBrain';
import { ModulesHub } from './components/ModulesHub';

import { Onboarding } from './components/Onboarding';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [theme, setTheme] = useState<ThemeId>('luxury'); 
  const [currency, setCurrency] = useState<'NPR' | 'USD'>('NPR');
  const [syncState, setSyncState] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('mero_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('mero_username') || '';
  });

  const handleOnboardingComplete = (name: string) => {
    setUserName(name);
    localStorage.setItem('mero_username', name);
  };


  // Simulate subtle background sync activity
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncState('syncing');
      setTimeout(() => setSyncState('synced'), 2000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('mero_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions([tx, ...transactions]);
    setActiveTab('transactions');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleResetAll = () => {
    setTransactions([]);
    setUserName('');
    localStorage.removeItem('mero_transactions');
    localStorage.removeItem('mero_username');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userName={userName} transactions={transactions} currency={currency} onNavigate={setActiveTab} />;
      case 'gold':
        return <GoalTracker transactions={transactions} currency={currency} />;
      case 'transactions':
        return <TransactionsView transactions={transactions} currency={currency} onAdd={handleAddTransaction} onDelete={handleDeleteTransaction} />;
      case 'brain':
        return <WalletAxioBrain onAddTransaction={handleAddTransaction} />;
      case 'modules':
        return <ModulesHub onResetAll={handleResetAll} />;
      default:
        return null;
    }
  };

  if (!userName) {
    return (
      <div className="flex justify-center h-screen bg-[#0a0a0a] text-text-main font-sans selection:bg-brand/30">
        <div className="w-full max-w-md bg-bg-base h-full relative shadow-2xl border-x border-border-subtle/50">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div data-theme={theme} className="flex justify-center h-screen bg-[#0a0a0a] text-text-main font-sans selection:bg-brand/30 transition-colors duration-300">
      
      {/* Mobile App Container Simulation */}
      <div className="w-full max-w-md bg-bg-base h-full flex flex-col relative shadow-2xl border-x border-border-subtle/50">
        
        {/* Subtle Offline/Sync Status Bar */}
        <div className="bg-bg-surface-hover border-b border-border-subtle py-1.5 px-3 flex justify-between items-center text-[10px] sm:text-[11px] font-semibold text-text-muted z-30 shrink-0">
           <div className="flex items-center gap-1.5 transition-all duration-300">
             {syncState === 'synced' && <><Wifi className="w-3 h-3 text-emerald-500" /> <span className="text-emerald-500/90">System Online: Encrypted Cloud Sync Active</span></>}
             {syncState === 'syncing' && <><RefreshCw className="w-3 h-3 text-brand animate-spin" /> <span className="text-brand/90">Syncing with Cloud...</span></>}
             {syncState === 'offline' && <><CloudOff className="w-3 h-3 text-amber-500" /> <span className="text-amber-500/90">Offline Mode: Saved Locally</span></>}
           </div>
           
           <button 
             onClick={() => setIsBusinessMode(!isBusinessMode)}
             className={`px-2 py-0.5 rounded border transition-colors ${isBusinessMode ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-bg-surface border-border-subtle text-text-muted'}`}
           >
             {isBusinessMode ? 'Business Khata' : 'Personal Mode'}
           </button>
        </div>

        {/* App Header */}
        <header className="shrink-0 bg-bg-surface border-b border-border-subtle p-4 flex items-center justify-between z-20 shadow-sm relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand border border-brand/20 flex items-center justify-center text-white shadow-md">
              <Wallet className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-text-main tracking-tight">Mero Wallet</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Currency Toggle */}
            <button 
              onClick={() => setCurrency(prev => prev === 'NPR' ? 'USD' : 'NPR')}
              className="flex items-center gap-1 px-2 py-1.5 bg-bg-base border border-border-subtle rounded-lg text-xs font-bold text-text-main hover:bg-bg-surface-hover transition-colors"
              aria-label="Toggle Currency"
            >
              {currency} <ArrowRightLeft className="w-3 h-3 text-text-muted" />
            </button>
            
            {/* Subtle Theme Switcher */}
            <div className="w-24 hidden sm:block">
               <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth pb-24 relative" id="scroll-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* App Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-bg-surface/90 backdrop-blur-xl border-t border-border-subtle px-1 sm:px-2 pb-safe pt-2 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center pb-2">
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 flex-1 ${
                activeTab === 'dashboard' ? 'text-brand' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <div className={`p-1.5 rounded-full mb-1 ${activeTab === 'dashboard' ? 'bg-brand/10' : ''}`}>
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">Budget</span>
            </button>

            <button
              onClick={() => setActiveTab('modules')}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 flex-1 ${
                activeTab === 'modules' ? 'text-blue-500' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <div className={`p-1.5 rounded-full mb-1 ${activeTab === 'modules' ? 'bg-blue-500/10' : ''}`}>
                <Blocks className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">Engines</span>
            </button>

            <button
              onClick={() => setActiveTab('brain')}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 flex-1 ${
                activeTab === 'brain' ? 'text-brand' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <div className={`p-1.5 rounded-full mb-1 ${activeTab === 'brain' ? 'bg-brand/10 shadow-[0_0_15px_rgba(var(--brand-rgb),0.5)]' : ''}`}>
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">AI Co-Pilot</span>
            </button>

            <button
              onClick={() => setActiveTab('gold')}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 flex-1 ${
                activeTab === 'gold' ? 'text-yellow-500' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <div className={`p-1.5 rounded-full mb-1 ${activeTab === 'gold' ? 'bg-yellow-500/10' : ''}`}>
                <Target className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">Goals</span>
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 flex-1 ${
                activeTab === 'transactions' ? 'text-emerald-500' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <div className={`p-1.5 rounded-full mb-1 ${activeTab === 'transactions' ? 'bg-emerald-500/10' : ''}`}>
                <ReceiptText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">History</span>
            </button>

          </div>
        </nav>

      </div>
    </div>
  );
}
