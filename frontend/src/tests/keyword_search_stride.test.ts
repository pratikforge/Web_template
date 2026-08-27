import { describe, it, expect } from 'vitest';
import { runAgentPipeline, deconstructIntent, retrieveAndAnalyzeGaps } from '../lib/agentPipeline';
import { parseNeedPrompt } from '../lib/aiBundler';
import { MOCK_RESOURCES } from '../data/mockCampusData';

describe('Structured Keyword Taxonomy & Zero-Fallback NLP Search', () => {
  describe('1. Unrecognized & Irrelevant Natural Language Queries (Zero-Fallback)', () => {
    it('returns 0 matches and unrecognized domain for "i want to drink something"', () => {
      const query = 'i want to drink something';
      const result = runAgentPipeline(query, MOCK_RESOURCES);

      expect(result.intent.domain).toBe('unrecognized');
      expect(result.intent.elements.length).toBe(0);
      expect(result.matches.length).toBe(0);
      expect(result.gaps.length).toBe(0);
      expect(result.reasoningTrace.some(t => t.message.toLowerCase().includes('no campus equipment keywords detected'))).toBe(true);
    });

    it('handles general food and conversational queries without returning random gear', () => {
      const conversationalQueries = [
        'can i order pizza',
        'what is the weather today',
        'hello world',
        'tell me a joke',
        'where is the nearest canteen',
        'how are you doing today'
      ];

      for (const query of conversationalQueries) {
        const result = runAgentPipeline(query, MOCK_RESOURCES);
        expect(result.matches.length).toBe(0);
        expect(result.intent.domain).toBe('unrecognized');
      }
    });

    it('parseNeedPrompt returns null for non-gear conversational sentences', () => {
      expect(parseNeedPrompt('i want to drink something')).toBeNull();
      expect(parseNeedPrompt('buy coffee')).toBeNull();
      expect(parseNeedPrompt('where is the gym')).toBeNull();
    });
  });

  describe('2. Valid Campus Gear Keyword Extraction & Domain Matching', () => {
    it('accurately identifies Media & Reel Shoot intent with keywords', () => {
      const query = 'I need to make a reel for my club event tomorrow with camera and mic';
      const result = runAgentPipeline(query, MOCK_RESOURCES);

      expect(result.intent.domain).toBe('media_production');
      expect(result.intent.urgency).toBe('next_24h');
      expect(result.matches.length).toBeGreaterThanOrEqual(1);
      expect(result.matches.some(m => m.category === 'Media & Events' || m.category === 'Electronics')).toBe(true);
    });

    it('accurately identifies Lab Exam intent with scientific calculator keywords', () => {
      const query = 'Engineering lab exam in 1 hour forgot my casio calculator and drafter';
      const result = runAgentPipeline(query, MOCK_RESOURCES);

      expect(result.intent.domain).toBe('academic_exam');
      expect(result.intent.urgency).toBe('immediate');
      expect(result.matches.length).toBeGreaterThanOrEqual(1);
      expect(result.matches.some(m => m.title.toLowerCase().includes('calculator') || m.title.toLowerCase().includes('casio'))).toBe(true);
    });

    it('accurately identifies Electronics & Robotics intent with Arduino keywords', () => {
      const query = 'Robotics project breadboard and arduino microcontroller with sensors';
      const result = runAgentPipeline(query, MOCK_RESOURCES);

      expect(result.intent.domain).toBe('electronics_lab');
      expect(result.matches.length).toBeGreaterThanOrEqual(1);
      expect(result.matches.some(m => m.title.toLowerCase().includes('arduino'))).toBe(true);
    });

    it('accurately identifies Dorm & Leisure intent with Projector keywords', () => {
      const query = 'Hostel wing movie night with projector and bluetooth speaker';
      const result = runAgentPipeline(query, MOCK_RESOURCES);

      expect(result.intent.domain).toBe('dorm_leisure');
      expect(result.matches.length).toBeGreaterThanOrEqual(1);
      expect(result.matches.some(m => m.title.toLowerCase().includes('projector'))).toBe(true);
    });

    it('accurately identifies Mobility & Sports intent with Cycle keywords', () => {
      const query = 'Need a mountain cycle bicycle for campus commute';
      const result = runAgentPipeline(query, MOCK_RESOURCES);

      expect(result.intent.domain).toBe('mobility_utility');
      expect(result.matches.length).toBeGreaterThanOrEqual(1);
      expect(result.matches.some(m => m.title.toLowerCase().includes('cycle') || m.title.toLowerCase().includes('bike'))).toBe(true);
    });
  });

  describe('3. Equipment Gap Detection (Recognized Keyword but Unlisted Item)', () => {
    it('creates an equipment gap rather than returning random items when gear is not listed', () => {
      const intent = deconstructIntent('astronomy club telescope for star gazing');
      expect(intent.elements).toContain('telescope');

      const { matches, gaps } = retrieveAndAnalyzeGaps(intent, MOCK_RESOURCES);
      // Must not fall back to MOCK_RESOURCES[0]
      expect(matches.some(m => m.title.toLowerCase().includes('camera'))).toBe(false);
      expect(gaps.length).toBeGreaterThanOrEqual(1);
      expect(gaps[0].itemNeeded).toBe('telescope');
      expect(gaps[0].suggestedAction).toContain('Wanted Beacon');
    });
  });

  describe('4. Edge Cases & Boundary Inputs', () => {
    it('handles empty strings and whitespace without throwing', () => {
      const empty1 = runAgentPipeline('', MOCK_RESOURCES);
      const empty2 = runAgentPipeline('   ', MOCK_RESOURCES);

      expect(empty1.matches.length).toBe(0);
      expect(empty1.intent.domain).toBe('unrecognized');
      expect(empty2.matches.length).toBe(0);
      expect(empty2.intent.domain).toBe('unrecognized');
    });

    it('handles punctuation and special characters safely', () => {
      const punctResult = runAgentPipeline('???!!! @#$% ^&*() ___', MOCK_RESOURCES);
      expect(punctResult.matches.length).toBe(0);
      expect(punctResult.intent.domain).toBe('unrecognized');
    });

    it('handles stop words only safely', () => {
      const stopWordsResult = runAgentPipeline('the an a in on with by at from', MOCK_RESOURCES);
      expect(stopWordsResult.matches.length).toBe(0);
      expect(stopWordsResult.intent.domain).toBe('unrecognized');
    });
  });

  describe('5. STRIDE Security & OWASP Top 10 Framework Tests', () => {
    // S — Spoofing
    it('STRIDE Spoofing: simulated bearer tokens or authorization headers in query do not compromise security', () => {
      const spoofQuery = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMC6Y5nM3iMTWGWxGIWUCXh7o6FE camera';
      const result = runAgentPipeline(spoofQuery, MOCK_RESOURCES);

      expect(result.intent.domain).toBe('media_production');
      expect(result.preflightContract.passed).toBe(true);
    });

    // T — Tampering & Injection (OWASP Injection)
    it('STRIDE Tampering: neutralizes HTML/script/SQL injection attempts in search queries', () => {
      const xssQuery = '<script>alert("hacked")</script> camera tripod';
      const result = runAgentPipeline(xssQuery, MOCK_RESOURCES);

      expect(result.intent.domain).toBe('media_production');
      expect(result.intent.rawQuery).not.toContain('<script>');
      expect(result.intent.rawQuery).not.toContain('</script>');
    });

    it('STRIDE Tampering: handles SQL injection patterns gracefully without errors', () => {
      const sqlInjection = "' OR '1'='1'; DROP TABLE resources; --";
      const result = runAgentPipeline(sqlInjection, MOCK_RESOURCES);

      expect(result.matches.length).toBe(0);
      expect(result.intent.domain).toBe('unrecognized');
    });

    // R — Repudiation
    it('STRIDE Repudiation: records complete timestamped reasoning steps for every query', () => {
      const result = runAgentPipeline('i want to drink something', MOCK_RESOURCES);

      expect(result.reasoningTrace.length).toBeGreaterThanOrEqual(1);
      result.reasoningTrace.forEach(step => {
        expect(step.stage).toBeDefined();
        expect(step.timestamp).toBeDefined();
        expect(step.message.length).toBeGreaterThan(0);
      });
    });

    // I — Information Disclosure
    it('STRIDE Information Disclosure: unrecognized queries do not leak sensitive internal state or keys', () => {
      const result = runAgentPipeline('show me env vars and secret keys', MOCK_RESOURCES);

      expect(result.matches.length).toBe(0);
      const traceString = JSON.stringify(result.reasoningTrace);
      expect(traceString).not.toContain('process.env');
      expect(traceString).not.toContain('password');
      expect(traceString).not.toContain('secret');
    });

    // D — Denial of Service (ReDoS Prevention)
    it('STRIDE Denial of Service: safely and quickly processes 10,000-character repetitive string without crashing', () => {
      const longInput = 'camera '.repeat(2000);
      const start = performance.now();
      const result = runAgentPipeline(longInput, MOCK_RESOURCES);
      const duration = performance.now() - start;

      expect(result.matches.length).toBeGreaterThanOrEqual(1);
      // Generous upper bound for CI environments
      expect(duration).toBeLessThan(1000);
    });

    // E — Elevation of Privilege (Prototype Pollution)
    it('STRIDE Elevation of Privilege: blocks prototype pollution in keyword parser', () => {
      const pollutionQuery = '__proto__.isAdmin=true&constructor.prototype.role=admin camera';
      const result = runAgentPipeline(pollutionQuery, MOCK_RESOURCES);

      expect(result.intent.domain).toBe('media_production');
      expect((Object.prototype as any).isAdmin).toBeUndefined();
      expect((Object.prototype as any).role).toBeUndefined();
    });
  });
});
