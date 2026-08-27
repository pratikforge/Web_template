import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateTransactionTotal,
  calculateSettlement,
  rupeesToPaise,
  paiseToRupees
} from '../lib/finance';
import { safeStorage } from '../lib/safeStorage';

describe('Financial Engine (Integer Paise & Invariants)', () => {
  it('strictly enforces Borrowing Charge + Platform Fee + Deposit === Total Transaction', () => {
    const borrowPaise = rupeesToPaise(150); // ₹150 -> 15000 paise
    const feePct = 5; // 5%
    const depositPaise = rupeesToPaise(500); // ₹500 -> 50000 paise

    const { feePaise, totalPaise } = calculateTransactionTotal(borrowPaise, feePct, depositPaise);

    expect(feePaise).toBe(750); // 5% of 15000 = 750 paise (₹7.50)
    expect(totalPaise).toBe(15000 + 750 + 50000); // 65750 paise
    expect(borrowPaise + feePaise + depositPaise).toBe(totalPaise);
    expect(paiseToRupees(totalPaise)).toBe(657.5);
  });

  it('prevents JavaScript string concatenation bugs', () => {
    // Simulates form returning string values: "150", "5", "500"
    const borrowStr = '150' as unknown as number;
    const depositStr = '500' as unknown as number;

    const borrowPaise = rupeesToPaise(borrowStr);
    const depositPaise = rupeesToPaise(depositStr);

    const { totalPaise } = calculateTransactionTotal(borrowPaise, 5, depositPaise);
    expect(totalPaise).toBe(65750);
    expect(totalPaise).not.toBe('1500075050000'); // Must not concatenate strings!
  });

  it('correctly calculates settlement with late fees and damage deductions', () => {
    const depositPaise = rupeesToPaise(1000); // ₹1,000
    const lateFeePaise = rupeesToPaise(150);  // ₹150 (3 hrs late)
    const damagePaise = rupeesToPaise(250);   // ₹250 (minor scratch)

    const settlement = calculateSettlement(depositPaise, lateFeePaise, damagePaise);

    expect(settlement.refundPaise).toBe(60000); // ₹600 refunded to borrower
    expect(settlement.lenderCompensationPaise).toBe(40000); // ₹400 paid to lender
    expect(settlement.refundPaise + settlement.lenderCompensationPaise).toBe(depositPaise);
  });

  it('caps damage deductions at 100% of security deposit (no negative refunds)', () => {
    const depositPaise = rupeesToPaise(500);
    const excessiveDamagePaise = rupeesToPaise(2000);

    const settlement = calculateSettlement(depositPaise, 0, excessiveDamagePaise);
    expect(settlement.refundPaise).toBe(0);
    expect(settlement.lenderCompensationPaise).toBe(50000);
  });
});

describe('SafeStorage Adapter', () => {
  beforeEach(() => {
    safeStorage.clearAll();
  });

  it('saves and restores data reliably', () => {
    safeStorage.setItem('test_key', { campus: 'Webfusion University', active: true });
    const val = safeStorage.getItem<{ campus: string; active: boolean } | null>('test_key', null);
    expect(val?.campus).toBe('Webfusion University');
  });

  it('gracefully handles corrupted JSON without crashing', () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('CAMPUS_CIRCULAR_V1_corrupt', '{invalid_json}');
    } else {
      (safeStorage as unknown as { memoryFallback: Map<string, string> }).memoryFallback.set(
        'CAMPUS_CIRCULAR_V1_corrupt',
        '{invalid_json}'
      );
    }
    const val = safeStorage.getItem('corrupt', { fallback: true });
    expect(val).toEqual({ fallback: true });
  });

  it('rejects oversized payloads (>500KB) to prevent QuotaExceededError', () => {
    const giantPayload = 'x'.repeat(600 * 1024); // 600KB
    expect(() => safeStorage.setItem('giant', giantPayload)).toThrow(/Payload exceeds safety threshold/);
  });
});
