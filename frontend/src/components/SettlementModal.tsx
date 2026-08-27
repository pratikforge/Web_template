import React, { useState } from 'react';
import {
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import type { SubLoanItem } from '../types/campus';
import { paiseToRupees, calculateSettlement } from '../lib/finance';

interface SettlementModalProps {
  isOpen: boolean;
  item: SubLoanItem;
  isOverdue?: boolean;
  onClose: () => void;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
  isOpen,
  item,
  isOverdue = false,
  onClose
}) => {
  const [isDisputeRaised, setIsDisputeRaised] = useState(false);

  if (!isOpen) return null;

  const lateFeePaise = isOverdue ? 15000 : 0; // ₹150 late fee if simulated overdue
  const damagePaise = item.damageDeductionPaise || 0;

  const settlement = calculateSettlement(item.depositPaise, lateFeePaise, damagePaise);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <DollarSign className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">Final Loan Settlement</h3>
          <p className="text-xs text-slate-400">
            PS Section 10 & 12: Transparent Escrow Accounting & Refund
          </p>
        </div>

        {/* Financial Settlement Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Locked Security Deposit:</span>
            <span className="text-white font-medium">₹{paiseToRupees(item.depositPaise)}</span>
          </div>

          {lateFeePaise > 0 && (
            <div className="flex justify-between text-rose-400">
              <span>Overdue Late Fee Deduction:</span>
              <span className="font-bold">-₹{paiseToRupees(lateFeePaise)}</span>
            </div>
          )}

          {damagePaise > 0 && (
            <div className="flex justify-between text-rose-400">
              <span>Verified Damage Deduction:</span>
              <span className="font-bold">-₹{paiseToRupees(damagePaise)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
            <span className="text-emerald-400">Net Refund to Borrower:</span>
            <span className="text-emerald-400 font-black">₹{paiseToRupees(settlement.refundPaise)}</span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
            <p>• Lender receives: ₹{paiseToRupees(item.borrowPaise + settlement.lenderCompensationPaise)} (Fee + Compensation)</p>
            <p>• Campus treasury banks: ₹{paiseToRupees(item.feePaise)} (5% Platform Fee)</p>
          </div>
        </div>

        {/* Dispute Resolution Section */}
        {isDisputeRaised ? (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>Dispute Ticket #DIS-9402 Logged</span>
            </div>
            <p className="text-[11px] text-amber-300/80">
              Escalated to Campus Admin Dashboard. Deposit deduction is held in escrow pending admin review.
            </p>
          </div>
        ) : damagePaise > 0 ? (
          <div className="space-y-2">
            <button
              onClick={() => setIsDisputeRaised(true)}
              className="w-full py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Dispute Damage Deduction with Campus Admin</span>
            </button>
          </div>
        ) : null}

        {/* Actions */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Release Refund & Complete Settlement</span>
        </button>
      </div>
    </div>
  );
};
