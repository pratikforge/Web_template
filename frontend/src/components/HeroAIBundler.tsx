import React, { useState } from 'react';
import { Sparkles, ArrowRight, Video, Calculator, Film, Cpu, HelpCircle } from 'lucide-react';
import { parseNeedPrompt } from '../lib/aiBundler';
import type { CampusResource } from '../types/campus';
import { useCart } from '../context/CartContext';
import { sanitizeInput } from '../lib/security';

interface HeroAIBundlerProps {
  resources: CampusResource[];
}

export const HeroAIBundler: React.FC<HeroAIBundlerProps> = ({ resources }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [aiError, setAiError] = useState<string | null>(null);
  const { loadBundleIntoCart } = useCart();

  const handleBundleMatch = (rawInput: string) => {
    setAiError(null);
    const cleaned = sanitizeInput(rawInput);
    if (!cleaned) return;

    const matchedBundle = parseNeedPrompt(cleaned);
    if (!matchedBundle) {
      setAiError("Couldn't match a specific kit. Try searching 'reel shoot', 'lab exam', or 'movie night'!");
      return;
    }

    // Match required keywords to resources
    const matchedResources: CampusResource[] = [];
    matchedBundle.requiredKeywords.forEach(kw => {
      const found = resources.find(
        r =>
          r.title.toLowerCase().includes(kw) ||
          r.description.toLowerCase().includes(kw) ||
          r.category.toLowerCase().includes(kw)
      );
      if (found && !matchedResources.some(m => m.id === found.id)) {
        matchedResources.push(found);
      }
    });

    if (matchedResources.length > 0) {
      loadBundleIntoCart(matchedBundle.bundleName, matchedResources);
    } else {
      setAiError(`Found intent '${matchedBundle.bundleName}', but some items are currently checked out!`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBundleMatch(prompt);
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/80 py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-[600px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>PS Section 4 — Natural Language AI Need Discovery</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Why buy what someone <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300">nearby already has?</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300">
          Describe your project or college requirement in plain words. CampusCircular uses AI to instantly discover and bundle all required gear from peers across nearby hostels.
        </p>

        {/* Natural Language AI Prompt Box */}
        <form onSubmit={handleFormSubmit} className="relative mx-auto max-w-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 p-2 shadow-2xl shadow-indigo-950/50 backdrop-blur-md focus-within:border-indigo-500 transition-all">
            <div className="flex items-center gap-2 pl-3 flex-1 w-full">
              <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
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
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Bundle Kit</span>
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
              setPrompt('I need to make a reel for my club event tomorrow');
              handleBundleMatch('I need to make a reel for my club event tomorrow');
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/30 hover:text-indigo-200 transition-all"
          >
            <Video className="h-3.5 w-3.5 text-indigo-400" />
            <span>Club Reel Shoot (4 Items)</span>
          </button>

          <button
            onClick={() => {
              setPrompt('I have an electronics lab exam in 1 hour and need gear');
              handleBundleMatch('I have an electronics lab exam in 1 hour and need gear');
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/30 hover:text-indigo-200 transition-all"
          >
            <Calculator className="h-3.5 w-3.5 text-amber-400" />
            <span>Lab Exam Kit</span>
          </button>

          <button
            onClick={() => {
              setPrompt('Dorm movie night with projector and audio');
              handleBundleMatch('Dorm movie night with projector and audio');
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/30 hover:text-indigo-200 transition-all"
          >
            <Film className="h-3.5 w-3.5 text-violet-400" />
            <span>Movie Night Kit</span>
          </button>

          <button
            onClick={() => {
              setPrompt('Hardware circuit prototyping with Arduino');
              handleBundleMatch('Hardware circuit prototyping with Arduino');
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/30 hover:text-indigo-200 transition-all"
          >
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            <span>Robotics Maker Kit</span>
          </button>
        </div>
      </div>
    </section>
  );
};
