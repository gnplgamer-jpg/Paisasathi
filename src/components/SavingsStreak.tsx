import React, { useState } from 'react';
import { Flame, Target, CheckCircle2, Award, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface SavingsStreakProps {
  currency: 'NPR' | 'USD';
  dailyLimit?: number;
}

export function SavingsStreak({ currency, dailyLimit = 1500 }: SavingsStreakProps) {
  const [challengeType, setChallengeType] = useState<7 | 30>(7);
  const [currentStreak, setCurrentStreak] = useState(6); // Start at 6 to easily reach 7

  const days = Array.from({ length: challengeType }, (_, i) => i + 1);
  const isGoalReached = currentStreak >= challengeType;

  const handleLogDay = () => {
    if (currentStreak < challengeType) {
      setCurrentStreak(prev => prev + 1);
    }
  };

  const handleSwitchChallenge = (type: 7 | 30) => {
    setChallengeType(type);
    if (type === 7 && currentStreak > 7) {
      setCurrentStreak(7);
    }
  };

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-3xl p-5 shadow-sm relative overflow-hidden transition-all duration-300">
      {/* Glow effect if goal reached */}
      {isGoalReached && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 animate-pulse z-0"></div>
      )}

      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
          <Flame className={`w-5 h-5 ${isGoalReached ? 'text-yellow-500' : 'text-orange-500'}`} />
          Savings Streak
        </h3>
        <div className="flex bg-bg-base rounded-lg p-1 border border-border-subtle">
          <button
            onClick={() => handleSwitchChallenge(7)}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${challengeType === 7 ? 'bg-bg-surface text-text-main shadow-sm border border-border-subtle' : 'text-text-muted hover:text-text-main border border-transparent'}`}
          >
            7D
          </button>
          <button
            onClick={() => handleSwitchChallenge(30)}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${challengeType === 30 ? 'bg-bg-surface text-text-main shadow-sm border border-border-subtle' : 'text-text-muted hover:text-text-main border border-transparent'}`}
          >
            30D
          </button>
        </div>
      </div>

      {isGoalReached ? (
        <div className="flex items-center gap-3 mb-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 rounded-2xl border border-yellow-500/20 relative z-10 animate-in zoom-in duration-300">
          <div className="p-3 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-xl text-white shrink-0 shadow-lg shadow-yellow-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-main">
              {challengeType}-Day Master!
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              You successfully stayed under budget for {challengeType} days.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-500 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-main">
              Spend under {formatCurrency(dailyLimit, currency)}/day
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {currentStreak} days on fire! Keep it up.
            </p>
          </div>
        </div>
      )}

      {/* Segmented Progress Bar */}
      <div className="space-y-3 mt-2 relative z-10">
        <div className="flex justify-between text-xs font-bold text-text-muted mb-1">
          <span>Progress</span>
          <span className={isGoalReached ? 'text-yellow-500' : 'text-orange-500'}>{currentStreak} / {challengeType} Days</span>
        </div>
        
        {challengeType === 7 ? (
          <div className="flex gap-1.5 h-6">
            {days.map((day) => (
              <div 
                key={day} 
                className={`flex-1 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                  day <= currentStreak 
                    ? (isGoalReached ? 'bg-gradient-to-t from-yellow-500 to-yellow-400 text-white shadow-sm scale-[1.02]' : 'bg-gradient-to-t from-orange-500 to-orange-400 text-white shadow-sm')
                    : 'bg-bg-base border border-border-subtle text-text-muted'
                }`}
              >
                {day <= currentStreak ? <CheckCircle2 className="w-3 h-3" /> : day}
              </div>
            ))}
          </div>
        ) : (
          /* 30 days - condensed continuous bar view */
          <div className="h-3 bg-bg-base rounded-full overflow-hidden border border-border-subtle relative">
            <div 
              className={`h-full rounded-full transition-all duration-1000 relative ${isGoalReached ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'}`}
              style={{ width: `${(currentStreak / 30) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        )}

        {!isGoalReached && (
          <button 
            onClick={handleLogDay}
            className="w-full mt-3 py-2.5 flex items-center justify-center gap-1.5 bg-bg-base border border-border-subtle rounded-xl text-xs font-bold text-text-main hover:bg-bg-surface-hover hover:border-orange-500/30 transition-colors active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Simulate Under-Budget Day
          </button>
        )}
      </div>
    </div>
  );
}
