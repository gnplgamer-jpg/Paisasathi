import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Trophy, Calculator, Edit3, Check, Car, Home, Smartphone, Zap, CreditCard, Film, Plus } from 'lucide-react';
import { Celebration } from './Celebration';
import { formatCurrency } from '../utils/currency';
import { Transaction } from '../types';

interface GoalTrackerProps {
  transactions: Transaction[];
  currency: 'NPR' | 'USD';
}

const PRESET_GOALS = [
  { id: 'gold', name: 'Gold (1 Tola)', baseAmount: 145000, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'iphone', name: 'iPhone 15 Pro', baseAmount: 180000, icon: Smartphone, color: 'text-zinc-300', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20' },
  { id: 'car', name: 'Dream Car', baseAmount: 3500000, icon: Car, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'home', name: 'Home Downpayment', baseAmount: 5000000, icon: Home, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'rent', name: 'Monthly Rent', baseAmount: 25000, icon: Home, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'bill', name: 'Electricity Bill', baseAmount: 1500, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'emi', name: 'EMI / Loan Payment', baseAmount: 15000, icon: CreditCard, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 'movie', name: 'Movie Ticket', baseAmount: 500, icon: Film, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

export function GoalTracker({ transactions, currency }: GoalTrackerProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [months, setMonths] = useState(12);
  const [mockDeposited, setMockDeposited] = useState(0);
  
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  
  const [activeGoal, setActiveGoal] = useState(() => {
    const saved = localStorage.getItem('mero_active_goal');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const preset = PRESET_GOALS.find(g => g.id === parsed.id);
        return {
          ...parsed,
          icon: preset ? preset.icon : undefined
        };
      } catch (e) {
        return PRESET_GOALS[0];
      }
    }
    return PRESET_GOALS[0];
  });

  const [customAmount, setCustomAmount] = useState(activeGoal.baseAmount);
  const [customName, setCustomName] = useState(activeGoal.name);

  useEffect(() => {
    localStorage.setItem('mero_active_goal', JSON.stringify({ ...activeGoal, baseAmount: customAmount, name: customName }));
  }, [activeGoal, customAmount, customName]);

  const inflationRate = 0.08; // 8% expected annual inflation
  
  // Calculate real savings from transactions where category is 'Savings'
  const realSavings = transactions
    .filter(t => t.category === 'Savings' && t.type === 'DEBIT')
    .reduce((acc, t) => acc + t.amount, 0);

  const savedAmountBase = realSavings + mockDeposited;
  
  // Future Value Calculation if goal is > 1 year away, else just amount
  const years = months / 12;
  const futureTargetAmount = years >= 1 
    ? customAmount * Math.pow(1 + inflationRate, years) 
    : customAmount;
    
  const progressPercent = Math.min((savedAmountBase / futureTargetAmount) * 100, 100);
  
  const remainingAmount = futureTargetAmount - savedAmountBase;
  const dailyNeeded = Math.max(0, remainingAmount / (months * 30));

  const handleDeposit = () => {
    setMockDeposited(remainingAmount);
    setShowCelebration(true);
  };

  const handleSaveTarget = () => {
    setIsEditingTarget(false);
  };

  const selectGoal = (goal: any) => {
    setActiveGoal(goal);
    setCustomAmount(goal.baseAmount);
    setCustomName(goal.name);
    setIsEditingTarget(false);
  };

  const ActiveIcon = activeGoal.icon || Target;

  return (
    <>
      <Celebration show={showCelebration} onClose={() => setShowCelebration(false)} />
      
      <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div>
          <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Target className="w-6 h-6 text-brand" />
            Universal Goal Planner
          </h2>
          <p className="text-text-muted text-sm mt-1">Set targets for anything—cars, bills, or gold.</p>
        </div>

        {/* Goal Selector */}
        <div className="flex overflow-x-auto gap-3 pb-2 snap-x hide-scrollbar">
          {PRESET_GOALS.map(g => {
            const Icon = g.icon;
            const isSelected = activeGoal.id === g.id;
            return (
              <button 
                key={g.id}
                onClick={() => selectGoal(g)}
                className={`snap-center min-w-max flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all ${
                  isSelected 
                    ? `${g.bg} ${g.border} ${g.color} shadow-sm scale-105` 
                    : 'bg-bg-surface border-border-subtle text-text-muted hover:text-text-main hover:bg-bg-surface-hover'
                }`}
              >
                <Icon className="w-4 h-4" /> {g.name}
              </button>
            )
          })}
        </div>

        {/* Goal Progress Card */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <ActiveIcon className="w-32 h-32" />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                {isEditingTarget ? (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-text-muted font-bold">Goal Name</label>
                      <input 
                        type="text" 
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="bg-bg-base border border-brand/50 rounded-lg px-3 py-2 text-sm font-bold text-text-main focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-text-muted font-bold">Target Amount</label>
                      <input 
                        type="number" 
                        value={customAmount}
                        onChange={(e) => setCustomAmount(Number(e.target.value))}
                        className="bg-bg-base border border-brand/50 rounded-lg px-3 py-2 text-sm font-bold text-text-main focus:outline-none"
                      />
                    </div>
                    <button onClick={handleSaveTarget} className="px-4 py-2 bg-brand text-white font-bold rounded-lg hover:opacity-90 w-full flex justify-center items-center gap-2">
                      <Check className="w-4 h-4" /> Save Goal
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h3 className="font-bold text-text-main text-xl">{customName}</h3>
                    <button onClick={() => setIsEditingTarget(true)} className="p-1.5 text-text-muted hover:text-brand transition-colors bg-bg-base rounded-md">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {!isEditingTarget && <p className="text-text-muted text-sm mt-1">Target in {months} Month{months > 1 ? 's' : ''}</p>}
              </div>
              
              {!isEditingTarget && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand">{progressPercent.toFixed(0)}%</div>
                </div>
              )}
            </div>

            <div className="h-4 bg-bg-base rounded-full overflow-hidden mb-3 border border-border-subtle">
              <div 
                className={`h-full ${activeGoal.bg.replace('/10', '')} ${activeGoal.color.replace('text-', 'bg-')} rounded-full transition-all duration-1000 relative`}
                style={{ width: `${progressPercent}%`, backgroundColor: 'var(--brand)' }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>

            <div className="flex justify-between text-[11px] sm:text-xs font-medium">
              <span className="text-brand">{formatCurrency(savedAmountBase, currency)} Saved</span>
              <span className="text-text-muted">Target: {formatCurrency(futureTargetAmount, currency)}</span>
            </div>
          </div>
        </div>

        {/* Savings Planner */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-text-main flex items-center gap-2">
              <Calculator className="w-4 h-4 text-brand" />
              Savings Planner
            </h4>
            <select 
              value={months} 
              onChange={(e) => setMonths(Number(e.target.value))}
              className="bg-bg-base border border-border-subtle text-text-main text-xs font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand"
            >
              <option value={1}>In 1 Month</option>
              <option value={3}>In 3 Months</option>
              <option value={6}>In 6 Months</option>
              <option value={12}>In 1 Year</option>
              <option value={24}>In 2 Years</option>
              <option value={60}>In 5 Years</option>
            </select>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3 items-start p-4 bg-brand-muted/30 rounded-xl border border-brand/10">
              <div className="p-2 bg-brand/10 text-brand rounded-lg shrink-0 mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-text-main font-bold">Action Plan</p>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {years >= 1 ? 'Including 8% inflation, you' : 'You'} need to save <strong>{formatCurrency(dailyNeeded, currency)} / day</strong> to hit your "{customName}" goal in {months} months.
                </p>
              </div>
            </div>
            
            {progressPercent < 100 ? (
              <button 
                onClick={handleDeposit}
                className="w-full py-3.5 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Simulate Reaching Goal
              </button>
            ) : (
              <button 
                disabled
                className="w-full py-3.5 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 opacity-90 cursor-default"
              >
                Goal Reached! 🎉
              </button>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
