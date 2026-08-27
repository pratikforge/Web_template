import { describe, it, expect } from 'vitest';
import { sanitizeInput, safePatch, isValidImageUrl } from '../lib/security';
import { calculateSettlement, rupeesToPaise } from '../lib/finance';
import { canTransition } from '../lib/lifecycleStateMachine';

describe('Cyber Attack Resilience (STRIDE & OWASP Top 10)', () => {
  // OWASP A03: Injection / STRIDE: Tampering
  it('STRIDE Tampering / XSS: Sanitizes malicious script tags and HTML injection', () => {
    const maliciousPrompt = "<script>alert('pwned')</script>I need a camera <img src=x onerror=stealCookies()>";
    const sanitized = sanitizeInput(maliciousPrompt);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('<img');
    expect(sanitized).not.toContain('stealCookies');
    expect(sanitized).toContain('I need a camera');
  });

  // OWASP A08: Software & Data Integrity Failures / STRIDE: Elevation of Privilege
  it('STRIDE Elevation of Privilege: Blocks Prototype Pollution in state patches', () => {
    const maliciousPayload = JSON.parse('{"__proto__": {"isAdmin": true}, "name": "Hacker"}');
    const targetObject = { name: 'Student', role: 'borrower' };

    const result = safePatch(targetObject, maliciousPayload, ['name']);

    expect(result.name).toBe('Hacker');
    // Prototype must not be polluted!
    expect(({} as Record<string, unknown>).isAdmin).toBeUndefined();
  });

  // OWASP A04: Insecure Design / Financial Exploitation
  it('Financial Attack: Rejects negative deposit injection attempting to steal funds', () => {
    const negativeDeposit = rupeesToPaise(-500); // Hacker attempts negative deposit to receive money
    expect(() => calculateSettlement(negativeDeposit, 0, 0)).toThrow(/Deposit cannot be negative/);
  });

  // STRIDE: Tampering with Photo Evidence URLs
  it('STRIDE Tampering: Rejects javascript: URI and data: URI protocol smuggling in photo fields', () => {
    expect(isValidImageUrl('javascript:alert(1)')).toBe(false);
    expect(isValidImageUrl('data:text/html;base64,PHNjcmlwdD4=')).toBe(false);
    expect(isValidImageUrl('https://images.unsplash.com/photo-1516035069371-29a1b244cc32')).toBe(true);
    expect(isValidImageUrl('/assets/camera_pre.jpg')).toBe(true);
  });

  // STRIDE: Elevation of Privilege in State Machine
  it('STRIDE Elevation of Privilege: Hacker cannot force-advance stage to SETTLEMENT as borrower', () => {
    const canHack = canTransition('BORROWED', 'SETTLEMENT', 'borrower');
    expect(canHack).toBe(false);
  });
});
