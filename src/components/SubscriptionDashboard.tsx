import React, { useState } from 'react';
import { CreditCard, AlertCircle, Calendar, PauseCircle, MonitorPlay, Music, Dumbbell, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface SubscriptionDashboardProps {
  currency: 'NPR' | 'USD';
}

export function SubscriptionDashboard({ currency }: SubscriptionDashboardProps) {
  const [subs, setSubs] = useState([
    {
      id: 1,
      name: 'Netflix Premium',
      amount: 800,
      icon: <MonitorPlay className="w-5 h-5" />,
      nextBilling: 'Tomorrow',
      daysLeft: 1,
      usage: 'high',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      id: 2,
      name: 'Gym Membership',
      amount: 2500,
      icon: <Dumbbell className="w-5 h-5" />,
      nextBilling: 'In 3 days',
      daysLeft: 3,
      usage: 'low',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      alertMsg: '0 visits in 30 days. Auto-pause recommended.'
    },
    {
      id: 3,
      name: 'Spotify Family',
      amount: 450,
      icon: <Music className="w-5 h-5" />,
      nextBilling: 'In 12 days',
      daysLeft: 12,
      usage: 'high',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    }
  ]);

  const totalMonthly = subs.reduce((acc, curr) => acc + curr.amount, 0);

  const handlePause = (id: number) => {
    setSubs(subs.filter(s => s.id !== id));
  };

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-3xl p-5 shadow-sm space-y-5 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center relative z-10">
        <div>
          <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            Subscriptions
          </h3>
          <p className="text-xs text-text-muted mt-0.5">Feature 9: Auto-Pause Engine</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Monthly</p>
          <p className="text-lg font-black text-text-main">{formatCurrency(totalMonthly, currency)}</p>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-3 relative z-10">
        {subs.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-border-subtle rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-text-main">No active subscriptions</p>
            <p className="text-xs text-text-muted">You are saving {formatCurrency(3750, currency)}/mo!</p>
          </div>
        ) : (
          subs.map((sub) => (
            <div key={sub.id} className="group flex flex-col gap-3 p-4 bg-bg-base border border-border-subtle rounded-2xl hover:border-brand/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${sub.bgColor} ${sub.color}`}>
                    {sub.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main text-sm">{sub.name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3 h-3 text-text-muted" />
                      <span className="text-[11px] font-semibold text-text-muted">{sub.nextBilling}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-text-main">{formatCurrency(sub.amount, currency)}</span>
                </div>
              </div>

              {/* Engine Alerts (Low Usage or Approaching Renewal) */}
              {(sub.usage === 'low' || sub.daysLeft <= 3) && (
                <div className="pt-3 mt-1 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {sub.usage === 'low' ? (
                    <div className="flex items-start gap-2 text-amber-500 bg-amber-500/10 px-3 py-2 rounded-lg flex-1">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-semibold leading-tight">{sub.alertMsg}</p>
                    </div>
                  ) : sub.daysLeft <= 3 ? (
                    <div className="flex items-start gap-2 text-blue-500 bg-blue-500/10 px-3 py-2 rounded-lg flex-1">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-semibold leading-tight">Renewal approaching in {sub.daysLeft} {sub.daysLeft === 1 ? 'day' : 'days'}.</p>
                    </div>
                  ) : null}

                  {/* Auto-Pause Button for low usage */}
                  {sub.usage === 'low' && (
                    <button 
                      onClick={() => handlePause(sub.id)}
                      className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-colors active:scale-95"
                    >
                      <PauseCircle className="w-4 h-4" /> Auto-Pause
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
