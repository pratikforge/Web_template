import React from 'react';
import { Leaf, IndianRupee, Repeat, ShieldCheck } from 'lucide-react';
import { MOCK_IMPACT_STATS } from '../data/mockCampusData';

export const ImpactSection: React.FC = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-xl backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Campus Circular Sustainability & Economic Impact</h3>
              <p className="text-xs text-slate-400">PS Section 13: Collective Student Savings & Circular Resource Reuse</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 self-start sm:self-auto">
            Live Campus Ledger
          </span>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
              <span>Money Saved by Students</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              ₹{MOCK_IMPACT_STATS.moneySavedRupees.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-400 font-medium">vs. buying brand new</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Repeat className="h-3.5 w-3.5 text-indigo-400" />
              <span>Resources Reused</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {MOCK_IMPACT_STATS.itemsReusedCount}
            </p>
            <p className="text-[11px] text-slate-400">Exchanges in current semester</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              <span>CO₂ Emissions Avoided</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {MOCK_IMPACT_STATS.co2DivertedKg} <span className="text-sm font-bold text-slate-400">kg</span>
            </p>
            <p className="text-[11px] text-slate-400">From prevented manufacturing</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>On-Time Return Rate</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {MOCK_IMPACT_STATS.onTimeReturnPercentage}%
            </p>
            <p className="text-[11px] text-emerald-400 font-medium">Peer trust integrity</p>
          </div>
        </div>
      </div>
    </section>
  );
};
