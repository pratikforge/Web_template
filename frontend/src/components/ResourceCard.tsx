import React from 'react';
import { MapPin, ShieldCheck, Plus, Eye, Gift } from 'lucide-react';
import type { CampusResource } from '../types/campus';
import { useCart } from '../context/CartContext';

interface ResourceCardProps {
  resource: CampusResource;
  onSelectResource: (resource: CampusResource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onSelectResource }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#090d16] p-4 transition-all hover:border-[#8b5cf6]/50 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(139,92,246,0.2)]">
      {/* Image Container with Fallback */}
      <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-[#030712]">
        <img
          src={resource.imageUrl}
          alt={resource.title}
          onError={e => {
            // Graceful fallback to avoid broken image icons
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
          }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Condition Tag */}
        <span className="absolute top-2.5 left-2.5 rounded-md bg-[#090d16]/90 px-2 py-0.5 text-[11px] font-semibold text-slate-200 border border-white/10">
          {resource.condition}
        </span>

        {/* Free / Donate Tag */}
        {resource.isDonation && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-md">
            <Gift className="h-3 w-3" />
            Free Donation
          </span>
        )}
      </div>

      {/* Item Info */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-[#a78bfa]">{resource.category}</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-amber-400" />
              {resource.ownerHostel} (~{resource.distanceMinutes}m walk)
            </span>
          </div>

          <h3 className="font-bold text-sm text-slate-100 line-clamp-1 group-hover:text-[#df37a7] transition-colors">
            {resource.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
            {resource.description}
          </p>
        </div>

        {/* Owner Trust Badge & Pricing */}
        <div className="pt-3 border-t border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="truncate max-w-[120px]">{resource.ownerName}</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
              Verified
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              {resource.isDonation ? (
                <span className="text-base font-black text-emerald-400">₹0 (Free)</span>
              ) : (
                <>
                  <span className="text-base font-black text-white">₹{resource.hourlyRateRupees}</span>
                  <span className="text-xs text-slate-400"> /hr</span>
                </>
              )}
            </div>
            {!resource.isDonation && (
              <span className="text-[11px] text-slate-400">
                Deposit: <strong className="text-slate-200">₹{resource.depositRupees}</strong>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onSelectResource(resource)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#0f172a] hover:bg-[#1e293b] hover:text-white px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Specs</span>
            </button>
            <button
              onClick={() => addToCart(resource)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#df37a7] to-[#8b5cf6] hover:brightness-110 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-[#df37a7]/20 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add to Kit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
