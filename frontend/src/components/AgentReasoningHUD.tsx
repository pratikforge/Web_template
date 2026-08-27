import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Send,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MapPin,
  ArrowRight,
  HelpCircle,
  Lock
} from 'lucide-react';
import type { AgentPipelineResult } from '../lib/agentPipeline';
import { refineAgentBundle } from '../lib/agentPipeline';
import type { CampusResource } from '../types/campus';
import { useCart } from '../context/CartContext';

interface AgentReasoningHUDProps {
  pipelineResult: AgentPipelineResult;
  resources: CampusResource[];
  onUpdateResult: (updated: AgentPipelineResult) => void;
  onClose: () => void;
}

export const AgentReasoningHUD: React.FC<AgentReasoningHUDProps> = ({
  pipelineResult,
  resources,
  onUpdateResult,
  onClose
}) => {
  const { loadBundleIntoCart } = useCart();
  const [refinementInput, setRefinementInput] = useState('');
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim()) return;

    const refined = refineAgentBundle(pipelineResult, refinementInput, resources);
    onUpdateResult(refined);
    setRefinementInput('');
  };

  const handleCommitToCart = () => {
    loadBundleIntoCart(
      `${pipelineResult.intent.domain.replace('_', ' ').toUpperCase()} Kit`,
      pipelineResult.matches
    );
    onClose();
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-indigo-500/40 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-md space-y-5 animate-in fade-in">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Cpu className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm sm:text-base">
                Campus Gear Concierge Agent
              </h3>
              <span className="rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-bold">
                ADK Multi-Agent Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Query: &ldquo;{pipelineResult.query}&rdquo;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Agent Preflight Contract Button (pratikforge/agent-preflight inspired) */}
          <button
            onClick={() => setIsContractOpen(!isContractOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Preflight Contract</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* 4-Stage Agent Execution Pipeline Visualization (Awesome-LLM-Apps Inspired) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                1. Intent Agent
              </span>
              <p className="font-bold text-slate-200 capitalize">
                {pipelineResult.intent.domain.replace('_', ' ')}
              </p>
              <p className="text-[10px] text-slate-400">Urgency: {pipelineResult.intent.urgency}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                2. Retriever Agent
              </span>
              <p className="font-bold text-slate-200">
                {pipelineResult.matches.length} Assets Found
              </p>
              <p className="text-[10px] text-slate-400">
                {pipelineResult.gaps.length > 0 ? `${pipelineResult.gaps.length} Gaps Detected` : 'All Gear Available'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                3. Logistics Agent
              </span>
              <p className="font-bold text-slate-200">
                {pipelineResult.route.stops.length} Hostel Stops
              </p>
              <p className="text-[10px] text-slate-400">
                ~{pipelineResult.route.totalWalkingMinutes} min walking route
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                4. Preflight Gate
              </span>
              <p className="font-bold text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Verified
              </p>
              <p className="text-[10px] text-slate-400">0 Egress • Escrow Locked</p>
            </div>
          </div>

          {/* Preflight Contract Popover / Detail (Inspired by pratikforge/agent-preflight) */}
          {isContractOpen && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  Agent-Preflight Capability Contract (Deterministic Verification)
                </span>
                <span className="text-[10px] text-emerald-400/80 font-mono">contract.yaml verified ✓</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {pipelineResult.preflightContract.checks.map(check => (
                  <div key={check.id} className="flex items-start gap-2 text-slate-300 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">{check.label}: </span>
                      <span className="text-slate-300">{check.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gap Analysis Alert (If any missing components were detected) */}
          {pipelineResult.gaps.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                Missing Equipment Gap Identified:
              </span>
              {pipelineResult.gaps.map((g, idx) => (
                <p key={idx} className="text-[11px] text-amber-300/90 pl-5">
                  • <strong>{g.itemNeeded}</strong>: {g.reason}. {g.suggestedAction}
                </p>
              ))}
            </div>
          )}

          {/* Matches Preview (Items Bundled by the Agent) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Agent-Recommended Gear Bundle ({pipelineResult.matches.length} items):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pipelineResult.matches.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-200 truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-400" />
                      {item.ownerHostel} • {item.ownerName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-white">₹{item.hourlyRateRupees}/hr</p>
                    <p className="text-[10px] text-emerald-400">+₹{item.depositRupees} dep</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Agent Thought Stream */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Agent Thought Stream:
            </span>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-2 text-xs max-h-36 overflow-y-auto font-mono text-[11px]">
              {pipelineResult.reasoningTrace.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 shrink-0">[{step.stage}]</span>
                  <span className="text-slate-300">{step.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Turn Conversational Refinement Input (Google ADK & Awesome-LLM-Apps Inspired) */}
          <form onSubmit={handleRefineSubmit} className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 focus-within:border-indigo-500">
              <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
              <input
                type="text"
                value={refinementInput}
                onChange={e => setRefinementInput(e.target.value)}
                placeholder="Conversationally steer agent (e.g. &ldquo;remove tripod&rdquo; or &ldquo;Hostel 1 only&rdquo;)..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 cursor-pointer"
                title="Send instruction to agent"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
              Bundle optimized for nearest campus hostel pickup stops.
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Dismiss HUD
              </button>
              <button
                onClick={handleCommitToCart}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Commit & Lock in Project Cart</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
