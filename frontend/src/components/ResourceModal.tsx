import React from 'react';
import {
  X,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import type { CampusResource } from '../types/campus';
import { useCart } from '../context/CartContext';

interface ResourceModalProps {
  resource: CampusResource | null;
  onClose: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onClose }) => {
  const { addToCart } = useCart();

  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Main Image Banner */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-800">
            <img
              src={resource.imageUrl}
              alt={resource.title}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-3 left-3 rounded bg-slate-950/90 px-2.5 py-1 text-xs font-bold text-slate-200 backdrop-blur border border-slate-800">
              Condition: {resource.condition}
            </span>
          </div>

          {/* Title & Metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
              <span>{resource.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="h-3 w-3 text-amber-400" />
                {resource.ownerHostel} (~{resource.distanceMinutes} min walk)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{resource.title}</h2>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">{resource.description}</p>
          </div>

          {/* Pricing & Deposit Breakdown (PS Section 6 & 12) */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
            <div>
              <p className="text-[11px] text-slate-400">Borrowing Charge</p>
              <p className="text-lg font-black text-white">
                {resource.isDonation ? 'Free' : `₹${resource.hourlyRateRupees} /hr`}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Refundable Deposit</p>
              <p className="text-lg font-black text-emerald-400">
                {resource.isDonation ? '₹0' : `₹${resource.depositRupees}`}
              </p>
            </div>
          </div>

          {/* Included Accessories (PS Section 2) */}
          {resource.accessoriesIncluded.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Included in Package
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {resource.accessoriesIncluded.map((acc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg bg-slate-950/40 border border-slate-800/80 px-3 py-2 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{acc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Borrowing Terms & Conditions */}
          {resource.borrowingTerms.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Borrowing Rules & Safety
              </h4>
              <div className="space-y-1.5">
                {resource.borrowingTerms.map((term, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Owner Trust Card (PS Section 1) */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-900/60 border border-indigo-700 flex items-center justify-center font-bold text-sm text-indigo-300">
                {resource.ownerName[0]}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{resource.ownerName}</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400">{resource.ownerDepartment}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800/40">
                {resource.totalBorrowsCount} Exchanges
              </span>
              <p className="text-[10px] text-slate-500 mt-1">100% On-Time Returns</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex gap-3">
          <button
            onClick={() => {
              addToCart(resource);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add to Project Kit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
