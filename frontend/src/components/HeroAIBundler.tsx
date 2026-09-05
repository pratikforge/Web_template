import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, Video, Calculator, Film, Cpu, HelpCircle, Bot, PlusCircle } from 'lucide-react';
import type { CampusResource } from '../types/campus';
import { sanitizeInput } from '../lib/security';
import { runAgentPipeline, type AgentPipelineResult } from '../lib/agentPipeline';
import { AgentReasoningHUD } from './AgentReasoningHUD';
import { validateImageFile, fileToDataUrl } from '../lib/fileValidation';

interface HeroAIBundlerProps {
  resources: CampusResource[];
  onOpenListModal?: (initialImageUrl?: string, initialFileName?: string) => void;
}

export const HeroAIBundler: React.FC<HeroAIBundlerProps> = ({ resources, onOpenListModal }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [pipelineResult, setPipelineResult] = useState<AgentPipelineResult | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const handleBundleMatch = (rawInput: string) => {
    setAiError(null);
    const cleaned = sanitizeInput(rawInput);
    if (!cleaned) return;

    try {
      const result = runAgentPipeline(cleaned, resources);
      setPipelineResult(result);
    } catch {
      setAiError("Agent pipeline encountered an issue. Try searching 'reel shoot', 'lab exam', or 'movie night'!");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBundleMatch(prompt);
  };

  const handleHeroListClick = () => {
    if (heroFileInputRef.current) {
      heroFileInputRef.current.value = '';
      heroFileInputRef.current.click();
    } else if (onOpenListModal) {
      onOpenListModal();
    }
  };

  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onOpenListModal) return;

    const validation = validateImageFile({
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (!validation.isValid) {
      alert(validation.error || 'Please select a valid PNG, JPG, or JPEG picture.');
      onOpenListModal();
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      onOpenListModal(dataUrl, file.name);
    } catch {
      onOpenListModal();
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#030712] py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Hidden File Picker for Hero Quick List */}
      <input
        type="file"
        ref={heroFileInputRef}
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        onChange={handleHeroFileChange}
        className="hidden"
        data-testid="hero-image-picker"
      />

      {/* Subtle Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-[600px] rounded-full bg-[#8b5cf6]/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3 py-1 text-xs font-semibold text-[#a78bfa]">
          <Bot className="h-3.5 w-3.5 text-[#df37a7]" />
          <span>PS Section 4 — Natural Language Multi-Agent Discovery</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Why buy what someone <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#df37a7] via-[#8b5cf6] to-[#38bdf8]">nearby already has?</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300">
          Describe your project or college requirement in plain words. CampusCircular&apos;s autonomous agent pipeline deconstructs your intent, audits peer trust, and clusters gear into optimized walking pickup routes.
        </p>

        {/* Natural Language AI Prompt Box */}
        <form onSubmit={handleFormSubmit} className="relative mx-auto max-w-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-white/10 bg-[#090d16] p-2 shadow-2xl shadow-black/80 backdrop-blur-md focus-within:border-[#8b5cf6] transition-all">
            <div className="flex items-center gap-2 pl-3 flex-1 w-full">
              <Sparkles className="h-5 w-5 text-[#df37a7] shrink-0" />
              <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. &ldquo;I need to make a reel for my club event tomorrow&rdquo;"
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#df37a7] to-[#8b5cf6] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#df37a7]/30 transition-all cursor-pointer"
            >
              <span>Run Agent Pipeline</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {aiError && (
            <p className="mt-2 text-xs text-rose-400 flex items-center justify-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5" />
              {aiError}
            </p>
          )}
        </form>

        {/* Suggested Quick Scenario Chips (1-Click Judge Experience) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-slate-500 text-[11px] font-medium mr-1">Quick Scenarios:</span>
          
          <button
            onClick={() => {
              const text = 'I need to make a reel for my club event tomorrow';
              setPrompt(text);
              handleBundleMatch(text);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0f172a] px-3 py-1.5 text-slate-300 hover:border-[#8b5cf6]/50 hover:bg-[#1e293b] hover:text-white transition-all cursor-pointer"
          >
            <Video className="h-3.5 w-3.5 text-[#a78bfa]" />
            <span>Club Reel Shoot (4 Items)</span>
          </button>

          <button
            onClick={() => {
              const text = 'I have an electronics lab exam in 1 hour and need gear';
              setPrompt(text);
              handleBundleMatch(text);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0f172a] px-3 py-1.5 text-slate-300 hover:border-[#8b5cf6]/50 hover:bg-[#1e293b] hover:text-white transition-all cursor-pointer"
          >
            <Calculator className="h-3.5 w-3.5 text-amber-400" />
            <span>Lab Exam Kit</span>
          </button>

          <button
            onClick={() => {
              const text = 'Dorm movie night with projector and audio';
              setPrompt(text);
              handleBundleMatch(text);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0f172a] px-3 py-1.5 text-slate-300 hover:border-[#8b5cf6]/50 hover:bg-[#1e293b] hover:text-white transition-all cursor-pointer"
          >
            <Film className="h-3.5 w-3.5 text-[#df37a7]" />
            <span>Dorm Movie Night</span>
          </button>

          <button
            onClick={() => {
              const text = 'Robotics project with Arduino and sensors';
              setPrompt(text);
              handleBundleMatch(text);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0f172a] px-3 py-1.5 text-slate-300 hover:border-[#8b5cf6]/50 hover:bg-[#1e293b] hover:text-white transition-all cursor-pointer"
          >
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            <span>Robotics & IoT Kit</span>
          </button>
        </div>

        {/* Dedicated "List New Product" Hero CTA Banner */}
        {onOpenListModal && (
          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={handleHeroListClick}
              data-testid="hero-list-product-btn"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-white/10 hover:border-[#8b5cf6]/50 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm group"
            >
              <PlusCircle className="h-4 w-4 text-[#a78bfa] group-hover:text-[#df37a7]" />
              <span>Have idle gear in your hostel? <strong className="text-[#a78bfa] underline underline-offset-2">List New Product with a Photo</strong></span>
            </button>
          </div>
        )}
      </div>

      {/* Multi-Agent Reasoning HUD & Visual Pipeline State */}
      {pipelineResult && (
        <div className="mx-auto max-w-5xl pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AgentReasoningHUD
            pipelineResult={pipelineResult}
            resources={resources}
            onUpdateResult={setPipelineResult}
            onClose={() => setPipelineResult(null)}
          />
        </div>
      )}
    </section>
  );
};
