import React, { useState } from 'react';
import {
  Clock,
  Play,
  ArrowRight,
  Camera,
  DollarSign,
  Check
} from 'lucide-react';
import { useLoanEngine } from '../context/LoanEngineContext';
import { useSession } from '../context/SessionContext';
import { LIFECYCLE_STAGES } from '../lib/lifecycleStateMachine';
import type { LifecycleStage } from '../lib/lifecycleStateMachine';
import { VisualDiffSlider } from './VisualDiffSlider';
import { SettlementModal } from './SettlementModal';

const STAGES_ORDER: LifecycleStage[] = [
  'AVAILABLE',
  'REQUESTED',
  'ACCEPTED',
  'HANDOVER',
  'BORROWED',
  'RETURN_DUE',
  'RETURNED',
  'INSPECTION',
  'SETTLEMENT',
  'RATED'
];

export const LifecycleTracker: React.FC = () => {
  const {
    activeOrder,
    advanceItemStage,
    setItemConditionInspection,
    warpTime,
    timeWarpHours,
    resetTimeWarp,
    runGoldenPathDemo,
    isDemoRunning
  } = useLoanEngine();

  const { activeRole, switchRole } = useSession();

  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [currentTimestamp] = useState(() => Date.now());

  if (!activeOrder || activeOrder.items.length === 0) return null;

  const currentItem = activeOrder.items[0];
  const currentStageDef = LIFECYCLE_STAGES[currentItem.stage];
  const currentIndex = STAGES_ORDER.indexOf(currentItem.stage);

  // Time calculations with time warp
  const effectiveDueAt = activeOrder.dueAtEpoch;
  const simulatedNow = currentTimestamp + timeWarpHours * 3600000;
  const isOverdue = simulatedNow > effectiveDueAt && currentItem.stage === 'BORROWED';

  const handleNextAction = () => {
    if (currentItem.stage === 'INSPECTION') {
      setIsDiffOpen(true);
      return;
    }
    if (currentItem.stage === 'SETTLEMENT') {
      setIsSettlementOpen(true);
      return;
    }

    advanceItemStage(activeOrder.id, currentItem.resourceId);
  };

  const handleConfirmCondition = (isClean: boolean, damageDeductionRupees: number = 0) => {
    setItemConditionInspection(
      activeOrder.id,
      currentItem.resourceId,
      isClean,
      !isClean,
      damageDeductionRupees * 100
    );
    setIsDiffOpen(false);
    advanceItemStage(activeOrder.id, currentItem.resourceId);
    setIsSettlementOpen(true);
  };

  const handleCloseSettlement = () => {
    setIsSettlementOpen(false);
    advanceItemStage(activeOrder.id, currentItem.resourceId);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Container Box */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md space-y-6">
        {/* Header with Judge Demo Accelerators */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">10-Stage Borrowing Lifecycle Engine</h2>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                PS Section 9 Verbatim
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulating loan: <strong className="text-slate-200">{currentItem.title}</strong> • Borrower: {activeOrder.borrowerName} • Lender: {currentItem.ownerName}
            </p>
          </div>

          {/* Golden Path Demo Button & Time Warp Controller */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={runGoldenPathDemo}
              disabled={isDemoRunning}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-3 py-2 text-xs font-bold text-slate-950 shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isDemoRunning ? 'Stepping...' : '⚡ Fast Demo: Run Golden Path'}</span>
            </button>

            {/* Time Warp Tool */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs text-slate-300">
              <Clock className="h-3.5 w-3.5 text-indigo-400 ml-1.5" />
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Time Warp:</span>
              <button
                onClick={() => warpTime(1)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold"
              >
                +1h
              </button>
              <button
                onClick={() => warpTime(6)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold"
              >
                +6h Overdue
              </button>
              {timeWarpHours > 0 && (
                <button
                  onClick={resetTimeWarp}
                  className="px-1.5 py-1 text-[10px] text-slate-500 hover:text-white"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 10-Stage Horizontal Visual Stepper */}
        <div className="overflow-x-auto pb-3 scrollbar-none">
          <div className="flex items-center justify-between min-w-[760px] gap-2">
            {STAGES_ORDER.map((st, idx) => {
              const isPassed = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={st} className="flex flex-col items-center flex-1 relative">
                  {/* Connecting Line */}
                  {idx > 0 && (
                    <div
                      className={`absolute top-4 -left-1/2 right-1/2 h-0.5 -z-0 ${
                        isPassed ? 'bg-indigo-600' : 'bg-slate-800'
                      }`}
                    />
                  )}

                  {/* Stage Circle Node */}
                  <div
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30 scale-110 shadow-lg shadow-indigo-600/40 animate-pulse'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isPassed ? <Check className="h-4 w-4" /> : idx + 1}
                  </div>

                  {/* Stage Label */}
                  <span
                    className={`mt-2 text-[11px] font-semibold text-center whitespace-nowrap ${
                      isCurrent ? 'text-indigo-400' : isPassed ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {LIFECYCLE_STAGES[st].label.split('. ')[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Stage Card & Action Zone */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Current Stage:
              </span>
              <span className="text-sm font-black text-white">{currentStageDef.label}</span>
              {isOverdue && (
                <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/40 animate-pulse">
                  OVERDUE (Late Fee Active)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300">{currentStageDef.description}</p>
            <p className="text-[11px] text-slate-400">
              Required Acting Role: <strong className="text-amber-400 capitalize">{currentStageDef.allowedRole}</strong> (You are currently in: <strong className="text-indigo-400 capitalize">{activeRole} mode</strong>)
            </p>
          </div>

          {/* Dynamic Next Step Trigger Button */}
          <div className="flex items-center gap-3">
            {activeRole !== currentStageDef.allowedRole && activeRole !== 'admin' && (
              <button
                onClick={() => switchRole(currentStageDef.allowedRole as any)}
                className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                Switch to {currentStageDef.allowedRole}
              </button>
            )}

            <button
              onClick={handleNextAction}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {currentItem.stage === 'INSPECTION' ? (
                <>
                  <Camera className="h-4 w-4" />
                  <span>Launch Visual Diff Inspection</span>
                </>
              ) : currentItem.stage === 'SETTLEMENT' ? (
                <>
                  <DollarSign className="h-4 w-4" />
                  <span>Execute Settlement & Release Refund</span>
                </>
              ) : (
                <>
                  <span>Advance to {currentStageDef.nextStage}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Diff Slider Modal */}
      {isDiffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6">
            <VisualDiffSlider
              beforeImage={currentItem.preHandoverPhoto!}
              afterImage={currentItem.postReturnPhoto!}
              onConfirmCondition={handleConfirmCondition}
            />
          </div>
        </div>
      )}

      {/* Settlement Modal */}
      <SettlementModal
        isOpen={isSettlementOpen}
        item={currentItem}
        isOverdue={isOverdue}
        onClose={handleCloseSettlement}
      />
    </section>
  );
};
