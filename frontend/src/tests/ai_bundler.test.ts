import { describe, it, expect } from 'vitest';
import { parseNeedPrompt } from '../lib/aiBundler';

describe('AI Need-Based Bundler Parser', () => {
  it('correctly extracts 4-item bundle for the official hackathon example prompt', () => {
    const prompt = 'I need to make a reel for my club event tomorrow';
    const bundle = parseNeedPrompt(prompt);

    expect(bundle).toBeDefined();
    expect(bundle?.bundleName).toBe('Club Event Media & Reel Kit');
    expect(bundle?.requiredKeywords).toContain('camera');
    expect(bundle?.requiredKeywords).toContain('tripod');
    expect(bundle?.requiredKeywords).toContain('microphone');
    expect(bundle?.requiredKeywords).toContain('light');
  });

  it('correctly identifies Lab Exam emergency requirements', () => {
    const prompt = 'I have an electronics lab exam in 1 hour and forgot my calculator';
    const bundle = parseNeedPrompt(prompt);

    expect(bundle).toBeDefined();
    expect(bundle?.bundleName).toBe('Engineering Lab Exam Emergency Kit');
    expect(bundle?.requiredKeywords).toContain('calculator');
  });

  it('gracefully returns null and fallback suggestions on unrecognized prompts', () => {
    const prompt = 'random gibberish 12345 !@#';
    const bundle = parseNeedPrompt(prompt);

    expect(bundle).toBeNull();
  });
});
