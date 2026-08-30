import React, { useState, useEffect } from 'react';
import { Lock, PlaySquare, Sparkles, TrendingDown, Target, ShieldAlert, X } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/currency';
import { Capacitor } from '@capacitor/core';
import { UnityAds } from 'capacitor-unity-ads';

interface PremiumProTipsProps {
  transactions: Transaction[];
  currency: 'NPR' | 'USD';
}

export function PremiumProTips({ transactions, currency }: PremiumProTipsProps) {
  const [adsWatched, setAdsWatched] = useState(() => {
    const saved = localStorage.getItem('mero_ads_watched');
    return saved ? Number(saved) : 0;
  });
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adTimeLeft, setAdTimeLeft] = useState(5);
  
  const [activeGoalName, setActiveGoalName] = useState('your target');
  const UNITY_GAME_ID = '5996901';

  useEffect(() => {
    localStorage.setItem('mero_ads_watched', adsWatched.toString());
  }, [adsWatched]);

  useEffect(() => {
    const savedGoal = localStorage.getItem('mero_active_goal');
    if (savedGoal) {
      const parsed = JSON.parse(savedGoal);
      if (parsed && parsed.name) {
        setActiveGoalName(parsed.name);
      }
    }
  }, []);

  // Initialize native Unity Ads if on mobile
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      UnityAds.initialize({ gameId: UNITY_GAME_ID, testMode: false })
        .then(() => {
          UnityAds.loadRewardedVideo({ placementId: 'Rewarded_Android' }).catch(console.error);
        })
        .catch(console.error);
    }
  }, []);

  const requiredAds = 2;
  const isUnlocked = adsWatched >= requiredAds;

  const runSimulationAd = () => {
    setIsWatchingAd(true);
    setAdTimeLeft(5);
    
    const interval = setInterval(() => {
      setAdTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsWatchingAd(false);
          setAdsWatched(prev => prev + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleWatchAd = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const { loaded } = await UnityAds.isRewardedVideoLoaded();
        if (loaded) {
          const result = await UnityAds.showRewardedVideo();
          if (result.success) {
            setAdsWatched(prev => prev + 1);
            UnityAds.loadRewardedVideo({ placementId: 'Rewarded_Android' }).catch(console.error);
          } else {
            console.warn("Native Ad not successful, falling back to simulation");
            runSimulationAd();
          }
        } else {
          console.warn("Native Ad not loaded yet, loading now & falling back to simulation");
          UnityAds.loadRewardedVideo({ placementId: 'Rewarded_Android' }).catch(console.error);
          runSimulationAd();
        }
      } catch (e) {
        console.error("Unity Ads Error", e);
        runSimulationAd(); // Fallback if plugin fails
      }
    } else {
      runSimulationAd(); // Run simulation on web preview
    }
  };

  // AI Logic based on transactions
  const wantsTotal = transactions.filter(t => t.category === 'Wants' && t.type === 'DEBIT').reduce((acc, t) => acc + t.amount, 0);
  const incomeTotal = transactions.filter(t => t.type === 'CREDIT').reduce((acc, t) => acc + t.amount, 0);
  const savingsTotal = transactions.filter(t => t.category === 'Savings' && t.type === 'DEBIT').reduce((acc, t) => acc + t.amount, 0);
  
  const topWant = transactions.filter(t => t.category === 'Wants' && t.type === 'DEBIT').sort((a, b) => b.amount - a.amount)[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden p-6 shadow-2xl transition-all duration-500 bg-gradient-to-br from-indigo-900 via-purple-900 to-black border border-purple-500/30">
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex items-center justify-between mb-5">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" /> AI Wealth Co-Pilot
        </h3>
        {!isUnlocked && (
          <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
            <Lock className="w-3 h-3" /> Premium
          </span>
        )}
      </div>

      {!isUnlocked ? (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute top-2 right-2 flex gap-1">
             <div className={`w-2 h-2 rounded-full ${adsWatched >= 1 ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/20'}`}></div>
             <div className={`w-2 h-2 rounded-full ${adsWatched >= 2 ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/20'}`}></div>
          </div>
          
          <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-brand rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h4 className="text-white font-bold mb-2">Unlock AI Masterplan for {activeGoalName}</h4>
          <p className="text-purple-200/70 text-xs leading-relaxed mb-5 max-w-[250px] mx-auto">
            Watch {requiredAds - adsWatched} more short ad{requiredAds - adsWatched > 1 ? 's' : ''} to let AI analyze your spending and build a custom blueprint for {activeGoalName}.
          </p>
          <button 
            onClick={handleWatchAd}
            className="w-full bg-gradient-to-r from-purple-600 to-brand text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlaySquare className="w-5 h-5" /> Watch Ad ({adsWatched}/{requiredAds})
          </button>
          <p className="text-[9px] text-white/30 mt-3 uppercase tracking-widest">Powered by Unity Ads (ID: {UNITY_GAME_ID})</p>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 flex gap-3 items-start">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 shrink-0 mt-0.5">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Cut The Excess</h4>
              <p className="text-purple-200/80 text-xs mt-1 leading-relaxed">
                {wantsTotal > (incomeTotal * 0.3) ? 
                  `You've spent ${formatCurrency(wantsTotal, currency)} on wants. To get your "${activeGoalName}" faster, cut back on non-essentials ${topWant ? `like ${topWant.merchant}` : ''} starting today.` : 
                  `Your discipline is great! Keeping your wants under 30% of income guarantees you will hit your "${activeGoalName}" goal on schedule.`
                }
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 flex gap-3 items-start">
            <div className="p-2 bg-brand/20 rounded-lg text-brand shrink-0 mt-0.5">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Turbo-Charge {activeGoalName}</h4>
              <p className="text-purple-200/80 text-xs mt-1 leading-relaxed">
                {savingsTotal > 0 ? 
                  `You've already saved ${formatCurrency(savingsTotal, currency)}. Automatically funnel this amount directly into an index fund or FD to beat inflation while waiting for your ${activeGoalName}.` : 
                  `You have no savings velocity. To afford the ${activeGoalName}, automate a 15% deduction from your income into a locked account before you even see it.`
                }
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 flex gap-3 items-start">
            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">EMI & Impulse Trap</h4>
              <p className="text-purple-200/80 text-xs mt-1 leading-relaxed">
                {topWant ? 
                  `Impulse buys like "${topWant.merchant}" delay your ${activeGoalName}. Apply the 48-hour rule: wait 2 days before any purchase over ${formatCurrency(500, currency)} to kill the urge.` :
                  `Avoid taking a high-interest EMI for your ${activeGoalName} if possible. Paying cash saves you 14-18% in hidden interest charges over a year.`
                }
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Simulated Unity Ad Overlay */}
      {isWatchingAd && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute top-6 right-6 flex items-center gap-3">
             <span className="text-white/50 text-xs font-bold">Reward in {adTimeLeft}s</span>
             <button disabled className="p-2 bg-white/10 rounded-full text-white/30 cursor-not-allowed">
               <X className="w-5 h-5" />
             </button>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Unity Ads</h2>
            <p className="text-brand text-xs font-bold tracking-widest uppercase mb-4">Game ID: {UNITY_GAME_ID}</p>
            <p className="text-zinc-400 text-sm max-w-[250px] mx-auto">
              Simulating Interstitial Video... Please wait {adTimeLeft} seconds to unlock AI insights.
            </p>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-brand transition-all duration-1000 ease-linear" style={{ width: `${((5 - adTimeLeft) / 5) * 100}%` }}></div>
          </div>
        </div>
      )}

    </div>
  );
}
