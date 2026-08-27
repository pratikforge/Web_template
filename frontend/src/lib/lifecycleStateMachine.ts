/**
 * CampusCircular 10-Stage Borrowing Lifecycle & RBAC State Machine
 * Implements Problem Statement Section 9 verbatim:
 * Available -> Requested -> Accepted -> Handover -> Borrowed -> Return Due -> Returned -> Inspection -> Settlement -> Rated
 */

export type LifecycleStage =
  | 'AVAILABLE'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'HANDOVER'
  | 'BORROWED'
  | 'RETURN_DUE'
  | 'RETURNED'
  | 'INSPECTION'
  | 'SETTLEMENT'
  | 'RATED';

export type UserRole = 'borrower' | 'lender' | 'admin';

export interface StageDefinition {
  stage: LifecycleStage;
  label: string;
  allowedRole: UserRole | 'system';
  nextStage: LifecycleStage;
  description: string;
}

export const LIFECYCLE_STAGES: Record<LifecycleStage, StageDefinition> = {
  AVAILABLE: {
    stage: 'AVAILABLE',
    label: '1. Available',
    allowedRole: 'borrower',
    nextStage: 'REQUESTED',
    description: 'Resource is open on catalog for borrowing.'
  },
  REQUESTED: {
    stage: 'REQUESTED',
    label: '2. Requested',
    allowedRole: 'lender',
    nextStage: 'ACCEPTED',
    description: 'Borrower submitted request; deposit held in escrow.'
  },
  ACCEPTED: {
    stage: 'ACCEPTED',
    label: '3. Accepted',
    allowedRole: 'borrower',
    nextStage: 'HANDOVER',
    description: 'Lender approved loan; meetup scheduled.'
  },
  HANDOVER: {
    stage: 'HANDOVER',
    label: '4. Handover',
    allowedRole: 'lender',
    nextStage: 'BORROWED',
    description: 'Parties meet; pre-borrow condition photos logged.'
  },
  BORROWED: {
    stage: 'BORROWED',
    label: '5. Borrowed',
    allowedRole: 'borrower',
    nextStage: 'RETURNED',
    description: 'Item in borrower possession; countdown timer running.'
  },
  RETURN_DUE: {
    stage: 'RETURN_DUE',
    label: '6. Return Due',
    allowedRole: 'borrower',
    nextStage: 'RETURNED',
    description: 'Return deadline approaching or passed.'
  },
  RETURNED: {
    stage: 'RETURNED',
    label: '7. Returned',
    allowedRole: 'lender',
    nextStage: 'INSPECTION',
    description: 'Borrower handed item back; inspection pending.'
  },
  INSPECTION: {
    stage: 'INSPECTION',
    label: '8. Inspection',
    allowedRole: 'lender',
    nextStage: 'SETTLEMENT',
    description: 'Post-return photo & hardware checklist audited.'
  },
  SETTLEMENT: {
    stage: 'SETTLEMENT',
    label: '9. Settlement',
    allowedRole: 'lender',
    nextStage: 'RATED',
    description: 'Deposit refunded or damage deducted; platform fee banked.'
  },
  RATED: {
    stage: 'RATED',
    label: '10. Rated',
    allowedRole: 'borrower',
    nextStage: 'AVAILABLE',
    description: 'Mutual 5-star ratings logged; trust scores updated.'
  }
};

export const canTransition = (
  current: LifecycleStage,
  next: LifecycleStage,
  role: UserRole
): boolean => {
  // Admin has emergency override across valid sequential steps
  if (role === 'admin') {
    if (current === 'INSPECTION' && next === 'SETTLEMENT') return true;
    if (current === 'REQUESTED' && next === 'ACCEPTED') return true;
  }

  // Handle Return Due special path
  if (current === 'BORROWED' && next === 'RETURN_DUE') {
    return true;
  }
  if (current === 'RETURN_DUE' && next === 'RETURNED') {
    return role === 'borrower' || role === 'admin';
  }

  const def = LIFECYCLE_STAGES[current];
  if (!def || def.nextStage !== next) {
    return false; // Blocks invalid skipping
  }

  if (role === 'admin') {
    return true;
  }

  return def.allowedRole === role;
};

export const getNextStage = (current: LifecycleStage): LifecycleStage => {
  return LIFECYCLE_STAGES[current]?.nextStage || 'AVAILABLE';
};
