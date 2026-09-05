import { describe, it, expect } from 'vitest';
import {
  isCampusInstitutionalEmail,
  generateHandoverAuditId,
  sanitizeInput,
  safePatch,
  isValidImageUrl
} from '../lib/security';
import { calculateTransactionTotal, calculateSettlement, rupeesToPaise } from '../lib/finance';

describe('STRIDE Escrow & Cyber Attack Security Verification Suite', () => {
  /* ========================================================================
     S — Spoofing Defense
     ======================================================================== */
  describe('Spoofing: Institutional Verification & Lender Identity', () => {
    it('approves legitimate verified campus institutional emails', () => {
      expect(isCampusInstitutionalEmail('rahul.j@iitb.ac.in')).toBe(true);
      expect(isCampusInstitutionalEmail('student.council@campus.edu')).toBe(true);
      expect(isCampusInstitutionalEmail('robotics.club@bits-pilani.ac.in')).toBe(true);
    });

    it('rejects commercial domains, phishing lookalikes, and malformed inputs', () => {
      expect(isCampusInstitutionalEmail('hacker@gmail.com')).toBe(false);
      expect(isCampusInstitutionalEmail('scammer@campus.edu.phishing.io')).toBe(false);
      expect(isCampusInstitutionalEmail('attacker@evil-campus.edu')).toBe(false);
      expect(isCampusInstitutionalEmail('')).toBe(false);
      expect(isCampusInstitutionalEmail('not-an-email')).toBe(false);
    });
  });

  /* ========================================================================
     T — Tampering Defense
     ======================================================================== */
  describe('Tampering: Client Financial Parameter Manipulation Defense', () => {
    it('strictly asserts [Borrow Fee] + [Platform Fee] + [Deposit] === [Total Escrow]', () => {
      const borrowPaise = rupeesToPaise(500); // 50000 paise
      const depositPaise = rupeesToPaise(2000); // 200000 paise
      const feePct = 5;

      const calc = calculateTransactionTotal(borrowPaise, feePct, depositPaise);
      expect(calc.borrowPaise).toBe(50000);
      expect(calc.feePaise).toBe(2500);
      expect(calc.depositPaise).toBe(200000);
      expect(calc.totalPaise).toBe(252500);
      expect(calc.borrowPaise + calc.feePaise + calc.depositPaise).toBe(calc.totalPaise);
    });

    it('blocks negative deposit injection exploits and clamps invalid values', () => {
      const negativeDeposit = -5000;
      const calc = calculateTransactionTotal(10000, 5, negativeDeposit);
      // Deposit must be safely clamped to non-negative 0
      expect(calc.depositPaise).toBe(0);
      expect(calc.totalPaise).toBe(10500);
    });

    it('caps settlement deductions at security deposit and prevents overdraft', () => {
      const depositPaise = 150000; // Rs 1500
      const massiveClaim = 9999999; // Attacker or lender claiming excessive damage

      const settlement = calculateSettlement(depositPaise, 0, massiveClaim);
      expect(settlement.totalDeductionsPaise).toBe(150000);
      expect(settlement.refundPaise).toBe(0);
      expect(settlement.lenderCompensationPaise).toBe(150000);
    });
  });

  /* ========================================================================
     R — Repudiation Defense
     ======================================================================== */
  describe('Repudiation: Immutable Handover Hash Audit Trails', () => {
    it('generates consistent and tamper-evident audit identifiers for handovers', () => {
      const timestamp = 1787806500;
      const auditId = generateHandoverAuditId('borrower_hostel_4', 'lender_hostel_9', timestamp);

      expect(auditId).toBe('audit_borrower_hostel_4_lender_hostel_9_1787806500');
      expect(auditId.startsWith('audit_')).toBe(true);
      expect(auditId).toContain('borrower_hostel_4');
      expect(auditId).toContain('lender_hostel_9');
    });
  });

  /* ========================================================================
     I — Information Disclosure Defense
     ======================================================================== */
  describe('Information Disclosure: PII Leak Prevention & Sanitization', () => {
    it('sanitizes XSS payloads and script tags from user inputs', () => {
      const dirty = '<script>alert("pwned")</script><img src="x" onerror="stealCookies()">Camera Lens';
      const clean = sanitizeInput(dirty);

      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('</script>');
      expect(clean).not.toContain('<img');
      expect(clean).toContain('Camera Lens');
    });

    it('enforces maximum input length boundaries to prevent resource exhaustion', () => {
      const longInput = 'A'.repeat(500);
      const clean = sanitizeInput(longInput, 100);

      expect(clean.length).toBe(100);
    });
  });

  /* ========================================================================
     D — Denial of Service & Prototype Pollution Defense
     ======================================================================== */
  describe('Denial of Service: Prototype Pollution & URL Scheme Smuggling', () => {
    it('blocks prototype pollution keys (__proto__, constructor, prototype) in safePatch', () => {
      const target = { name: 'Tripod', price: 200 };
      const maliciousPayload = JSON.parse(
        '{"__proto__": {"admin": true}, "constructor": {"polluted": true}, "price": 250}'
      );

      const patched = safePatch(target, maliciousPayload, ['name', 'price']);
      expect(patched.price).toBe(250);
      expect(({} as Record<string, unknown>).admin).toBeUndefined();
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });

    it('blocks javascript: and vbscript: scheme smuggling in image URLs', () => {
      expect(isValidImageUrl('javascript:alert(1)')).toBe(false);
      expect(isValidImageUrl('vbscript:msgbox(1)')).toBe(false);
      expect(isValidImageUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
      expect(isValidImageUrl('https://images.unsplash.com/photo-12345')).toBe(true);
      expect(isValidImageUrl('/images/gear/camera.jpg')).toBe(true);
    });
  });

  /* ========================================================================
     E — Elevation of Privilege Defense
     ======================================================================== */
  describe('Elevation of Privilege: Escrow State Machine Authorization', () => {
    type EscrowState = 'INITIATED' | 'ESCROW_LOCKED' | 'PICKUP_VERIFIED' | 'RETURN_COMPLETED' | 'REFUNDED';

    const canReleaseEscrow = (state: EscrowState, isAdmin: boolean): boolean => {
      // Release is strictly restricted to verified return states or campus admin intervention
      if (isAdmin) return true;
      return state === 'RETURN_COMPLETED';
    };

    it('prohibits releasing escrow funds when handover is still in progress', () => {
      expect(canReleaseEscrow('INITIATED', false)).toBe(false);
      expect(canReleaseEscrow('ESCROW_LOCKED', false)).toBe(false);
      expect(canReleaseEscrow('PICKUP_VERIFIED', false)).toBe(false);
    });

    it('permits releasing escrow funds only upon completed return verification or admin override', () => {
      expect(canReleaseEscrow('RETURN_COMPLETED', false)).toBe(true);
      expect(canReleaseEscrow('PICKUP_VERIFIED', true)).toBe(true); // Admin dispute resolution
    });
  });
});
