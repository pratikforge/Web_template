import { describe, it, expect } from 'vitest';
import { canTransition } from '../lib/lifecycleStateMachine';

describe('Lifecycle State Machine & RBAC Matrix', () => {
  it('allows valid sequential state transitions with correct roles', () => {
    // Borrower requests available item
    expect(canTransition('AVAILABLE', 'REQUESTED', 'borrower')).toBe(true);

    // Lender accepts request
    expect(canTransition('REQUESTED', 'ACCEPTED', 'lender')).toBe(true);

    // Borrower acknowledges handover
    expect(canTransition('ACCEPTED', 'HANDOVER', 'borrower')).toBe(true);

    // Lender confirms handover to borrowed
    expect(canTransition('HANDOVER', 'BORROWED', 'lender')).toBe(true);

    // Borrower returns item
    expect(canTransition('BORROWED', 'RETURNED', 'borrower')).toBe(true);

    // Lender inspects return
    expect(canTransition('RETURNED', 'INSPECTION', 'lender')).toBe(true);

    // Lender confirms settlement
    expect(canTransition('INSPECTION', 'SETTLEMENT', 'lender')).toBe(true);
  });

  it('strictly blocks unauthorized role transitions (Elevation of Privilege check)', () => {
    // Borrower CANNOT approve their own request
    expect(canTransition('REQUESTED', 'ACCEPTED', 'borrower')).toBe(false);

    // Borrower CANNOT confirm their own return inspection
    expect(canTransition('RETURNED', 'INSPECTION', 'borrower')).toBe(false);

    // Borrower CANNOT release their own deposit settlement
    expect(canTransition('INSPECTION', 'SETTLEMENT', 'borrower')).toBe(false);
  });

  it('allows Admin to intervene and resolve disputes at any stage', () => {
    expect(canTransition('INSPECTION', 'SETTLEMENT', 'admin')).toBe(true);
    expect(canTransition('REQUESTED', 'ACCEPTED', 'admin')).toBe(true);
  });

  it('blocks illegal state skipping', () => {
    // Cannot skip from AVAILABLE directly to BORROWED without request and handover
    expect(canTransition('AVAILABLE', 'BORROWED', 'borrower')).toBe(false);

    // Cannot skip from BORROWED directly to SETTLEMENT without return and inspection
    expect(canTransition('BORROWED', 'SETTLEMENT', 'lender')).toBe(false);
  });
});
