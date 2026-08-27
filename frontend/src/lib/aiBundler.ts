/**
 * AI Need-Based Intent Parser & Smart Bundler
 * Implements Problem Statement Section 4 & 5:
 * Decomposes natural-language prompts (e.g. "I need to make a reel for my club event tomorrow")
 * into coordinated multi-item bundles across nearby campus owners.
 */

export interface BundleSuggestion {
  id: string;
  bundleName: string;
  scenario: string;
  description: string;
  requiredKeywords: string[];
  estimatedBorrowHours: number;
}

export const PRESET_BUNDLES: BundleSuggestion[] = [
  {
    id: 'bundle_reel_shoot',
    bundleName: 'Club Event Media & Reel Kit',
    scenario: 'Reel / Fest Media Coverage',
    description: 'High-definition video camera, fluid tripod, wireless lapel audio, and bi-color ring light.',
    requiredKeywords: ['camera', 'tripod', 'microphone', 'light'],
    estimatedBorrowHours: 6
  },
  {
    id: 'bundle_lab_exam',
    bundleName: 'Engineering Lab Exam Emergency Kit',
    scenario: 'Lab Exam & Graphics Drawing',
    description: 'Casio scientific calculator, mini drafter, T-scale, and regulation lab coat.',
    requiredKeywords: ['calculator', 'drafter', 'coat'],
    estimatedBorrowHours: 4
  },
  {
    id: 'bundle_movie_night',
    bundleName: 'Hostel Wing Movie Night Kit',
    scenario: 'Dorm & Room Entertainment',
    description: 'Compact 1080p LED projector, high-bass Bluetooth speaker, and HDMI extension cord.',
    requiredKeywords: ['projector', 'speaker', 'hdmi'],
    estimatedBorrowHours: 8
  },
  {
    id: 'bundle_maker_circuit',
    bundleName: 'Robotics & Hardware Prototyping Kit',
    scenario: 'Minor Project & Hackathon Hardware',
    description: 'Arduino Mega board, digital multimeter, jumper wire pack, and sensor breakout module.',
    requiredKeywords: ['arduino', 'multimeter', 'sensor'],
    estimatedBorrowHours: 12
  }
];

export const parseNeedPrompt = (prompt: string): BundleSuggestion | null => {
  if (!prompt || typeof prompt !== 'string') return null;
  const p = prompt.toLowerCase();

  // Scenario 1: Media / Reel / Club Event
  if (
    p.includes('reel') ||
    p.includes('video') ||
    p.includes('club event') ||
    p.includes('shoot') ||
    p.includes('camera') ||
    p.includes('filming')
  ) {
    return PRESET_BUNDLES[0];
  }

  // Scenario 2: Lab Exam / Calculator
  if (
    p.includes('exam') ||
    p.includes('calculator') ||
    p.includes('lab') ||
    p.includes('casio') ||
    p.includes('drafter')
  ) {
    return PRESET_BUNDLES[1];
  }

  // Scenario 3: Movie Night / Projector
  if (
    p.includes('movie') ||
    p.includes('projector') ||
    p.includes('screen') ||
    p.includes('dorm party')
  ) {
    return PRESET_BUNDLES[2];
  }

  // Scenario 4: Hardware / Arduino / Robotics
  if (
    p.includes('arduino') ||
    p.includes('robot') ||
    p.includes('circuit') ||
    p.includes('multimeter') ||
    p.includes('hardware')
  ) {
    return PRESET_BUNDLES[3];
  }

  return null;
};

export const getAvailableBundles = (): BundleSuggestion[] => {
  return PRESET_BUNDLES;
};
