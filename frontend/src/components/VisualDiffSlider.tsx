import React, { useState, useRef, useCallback } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';

interface VisualDiffSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  onConfirmCondition: (isClean: boolean, damageDeductionRupees?: number) => void;
}

export const VisualDiffSlider: React.FC<VisualDiffSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Handover (Pre-Borrow)',
  afterLabel = 'Return (Post-Borrow)',
  onConfirmCondition
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [simulateDamage, setSimulateDamage] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 4-Point Hardware Checklist (PS Section 8)
  const [checklist, setChecklist] = useState({
    powersOn: true,
    opticsClean: true,
    cablesPresent: true,
    batteryCharged: true
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePointerMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = clientX - rect.left;
    const boundedPct = Math.max(0, Math.min(100, (rawX / rect.width) * 100));
    setSliderPos(boundedPct);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setSliderPos(p => Math.max(0, p - 5));
    if (e.key === 'ArrowRight') setSliderPos(p => Math.min(100, p + 5));
    if (e.key === 'Home') setSliderPos(0);
    if (e.key === 'End') setSliderPos(100);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Before & After Condition Visual Diff Slider
          </h4>
          <p className="text-xs text-slate-400">
            Slide horizontally to inspect condition between Handover and Return
          </p>
        </div>

        {/* Damage Simulation Toggle for Judges */}
        <button
          onClick={() => setSimulateDamage(!simulateDamage)}
          className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
            simulateDamage
              ? 'border-rose-500 bg-rose-500/20 text-rose-300'
              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="h-3 w-3" />
          <span>{simulateDamage ? 'Simulating Scratch' : 'Simulate Damage'}</span>
        </button>
      </div>

      {/* Interactive Slider Container with Responsive Aspect Ratio */}
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Condition comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPos)}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={e => isDragging && handlePointerMove(e.clientX)}
        onPointerUp={handlePointerUp}
        className="relative w-full aspect-video select-none overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl cursor-ew-resize touch-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {/* Return Photo (Background) */}
        <img
          src={afterImage}
          alt="Post-return state"
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
        />
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur border border-slate-800 text-[11px] font-semibold text-slate-300 pointer-events-none">
          {afterLabel}
        </div>

        {/* Handover Photo (Foreground with dynamic clip-path) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt="Pre-borrow state"
            className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          />
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-indigo-950/80 backdrop-blur border border-indigo-700/50 text-[11px] font-semibold text-indigo-300 pointer-events-none">
            {beforeLabel}
          </div>
        </div>

        {/* Synchronized Split Divider Thumb */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.9)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center border-2 border-indigo-600">
            <ArrowLeftRight className="h-4 w-4 text-indigo-600" />
          </div>
        </div>

        {/* Simulated Scratch Overlay */}
        {simulateDamage && (
          <div
            className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold shadow-lg animate-pulse"
            style={{ opacity: sliderPos > 50 ? 1 : 0.2 }}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Hairline Scratch Detected</span>
          </div>
        )}
      </div>

      {/* 4-Point Hardware Checklist (PS Section 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <button
          type="button"
          onClick={() => toggleCheck('powersOn')}
          className="flex items-center gap-2 p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-900"
        >
          {checklist.powersOn ? (
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          ) : (
            <Square className="h-4 w-4 text-slate-500" />
          )}
          <span>Powers On</span>
        </button>

        <button
          type="button"
          onClick={() => toggleCheck('opticsClean')}
          className="flex items-center gap-2 p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-900"
        >
          {checklist.opticsClean ? (
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          ) : (
            <Square className="h-4 w-4 text-slate-500" />
          )}
          <span>Optics Clean</span>
        </button>

        <button
          type="button"
          onClick={() => toggleCheck('cablesPresent')}
          className="flex items-center gap-2 p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-900"
        >
          {checklist.cablesPresent ? (
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          ) : (
            <Square className="h-4 w-4 text-slate-500" />
          )}
          <span>Accessories OK</span>
        </button>

        <button
          type="button"
          onClick={() => toggleCheck('batteryCharged')}
          className="flex items-center gap-2 p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-900"
        >
          {checklist.batteryCharged ? (
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          ) : (
            <Square className="h-4 w-4 text-slate-500" />
          )}
          <span>Battery Charged</span>
        </button>
      </div>

      {/* Inspection Decision Buttons */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
        <div>
          <p className="text-xs font-bold text-white">Inspection Result</p>
          <p className="text-[11px] text-slate-400">
            {simulateDamage
              ? 'Dispute: Deduct ₹200 repair cost from deposit'
              : 'Pristine condition: 100% deposit will be released'}
          </p>
        </div>

        <div className="flex gap-2">
          {simulateDamage ? (
            <button
              onClick={() => onConfirmCondition(false, 200)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Deduct ₹200 & Raise Dispute</span>
            </button>
          ) : (
            <button
              onClick={() => onConfirmCondition(true, 0)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Confirm Clean Return</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
