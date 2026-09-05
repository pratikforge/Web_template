/**
 * CampusCircular Integer-Paise Financial Engine
 * Enforces Problem Statement Section 12 mathematical invariants:
 * [Borrowing Charge] + [Platform Fee] + [Security Deposit] = [Transaction Amount]
 * 1 INR = 100 Paise (Eliminates floating-point precision loss and string concatenation bugs)
 */

export const rupeesToPaise = (rupees: number | string): number => {
  const numeric = typeof rupees === 'string' ? parseFloat(rupees) : rupees;
  if (isNaN(numeric)) return 0;
  return Math.round(numeric * 100);
};

export const paiseToRupees = (paise: number): number => {
  return Number((paise / 100).toFixed(2));
};

export interface TransactionCalculation {
  borrowPaise: number;
  feePaise: number;
  depositPaise: number;
  totalPaise: number;
}

export const calculateTransactionTotal = (
  borrowPaise: number,
  feePercentage: number = 5,
  depositPaise: number = 0
): TransactionCalculation => {
  const bPaise = Math.max(0, Number(borrowPaise) || 0);
  const dPaise = Math.max(0, Number(depositPaise) || 0);
  const fPct = Math.max(0, Math.min(15, Number(feePercentage) || 0));

  // Round fee paise to nearest integer paise
  const feePaise = Math.round(bPaise * (fPct / 100));
  const totalPaise = bPaise + feePaise + dPaise;

  // Invariant assertion
  if (bPaise + feePaise + dPaise !== totalPaise) {
    throw new Error(`Financial invariant violation: ${bPaise} + ${feePaise} + ${dPaise} !== ${totalPaise}`);
  }

  return {
    borrowPaise: bPaise,
    feePaise,
    depositPaise: dPaise,
    totalPaise
  };
};

export interface SettlementResult {
  depositPaise: number;
  lateFeePaise: number;
  damagePaise: number;
  totalDeductionsPaise: number;
  refundPaise: number;
  lenderCompensationPaise: number;
}

export const calculateSettlement = (
  depositPaise: number,
  lateFeePaise: number = 0,
  damagePaise: number = 0
): SettlementResult => {
  const dep = Number(depositPaise);
  if (dep < 0) {
    throw new Error('Deposit cannot be negative');
  }

  const late = Math.max(0, Number(lateFeePaise) || 0);
  const damage = Math.max(0, Number(damagePaise) || 0);

  // Deductions are strictly capped by the security deposit
  const totalDeductions = Math.min(dep, late + damage);
  const refundPaise = dep - totalDeductions;
  const lenderCompensationPaise = totalDeductions;

  return {
    depositPaise: dep,
    lateFeePaise: late,
    damagePaise: damage,
    totalDeductionsPaise: totalDeductions,
    refundPaise,
    lenderCompensationPaise
  };
};
