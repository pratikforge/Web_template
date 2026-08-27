import React, { useRef } from 'react';
import {
  RotateCcw,
  Sparkles,
  ShoppingBag,
  PlusCircle,
  Radio,
  UserCheck,
  ShieldAlert,
  Wallet,
  ChevronDown
} from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useCart } from '../context/CartContext';
import { paiseToRupees } from '../lib/finance';
import { validateImageFile, fileToDataUrl } from '../lib/fileValidation';

interface NavbarProps {
  onOpenListModal: (initialImageUrl?: string, initialFileName?: string) => void;
  onOpenBeaconDrawer: () => void;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenListModal, onOpenBeaconDrawer, onOpenProfileModal }) => {
  const { currentUser, activeRole, switchRole, resetAllDemoData, platformFeePercentage } = useSession();
  const { cartItems, openCartDrawer } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleShareButtonClick = () => {
    // Directly invoke native OS file picker
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    } else {
      onOpenListModal();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile({
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (!validation.isValid) {
      alert(validation.error || 'Please select a valid PNG, JPG, or JPEG picture.');
      onOpenListModal();
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      onOpenListModal(dataUrl, file.name);
    } catch {
      onOpenListModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      {/* Hidden Native File Picker for 1-click picture upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg, .png, .jpg, .jpeg"
        onChange={handleFileSelected}
        className="hidden"
        data-testid="navbar-image-picker"
      />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-600/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">CAMPUS CIRCULAR</span>
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                WEBFUSION 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">From Ownership to Access • College Resource Mesh</p>
          </div>
        </div>

        {/* Role Switcher Pill Bar (Crucial for Evaluator Demo) */}
        <div className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            onClick={() => switchRole('borrower')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'borrower'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            Borrower (Rohan)
          </button>
          <button
            onClick={() => switchRole('lender')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'lender'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            Lender (Priya)
          </button>
          <button
            onClick={() => switchRole('admin')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'admin'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Campus Admin ({platformFeePercentage}% Fee)
          </button>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Simulated Campus Wallet Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-300">
            <Wallet className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-emerald-400">
              ₹{paiseToRupees(currentUser.walletBalancePaise).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500">Escrow Ready</span>
          </div>

          {/* User Profile Pill Trigger */}
          <button
            onClick={onOpenProfileModal}
            data-testid="navbar-profile-btn"
            className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 text-xs text-white transition-all cursor-pointer group"
            title="Click to View & Edit Profile Parameters"
          >
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="h-6 w-6 rounded-full object-cover border border-indigo-500/50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                }}
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-semibold text-slate-200 group-hover:text-white block leading-none text-xs">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">
                {currentUser.rollNo}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-200 transition-transform group-hover:translate-y-0.5" />
          </button>

          {/* Wanted Community Beacon Trigger */}
          <button
            onClick={onOpenBeaconDrawer}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
            title="Open Campus Community Requests"
          >
            <Radio className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Wanted Beacon</span>
          </button>

          {/* List / Donate Item Trigger (Directly opens Native File Manager) */}
          <button
            onClick={handleShareButtonClick}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors cursor-pointer"
            title="List new product by selecting a picture (PNG, JPG, JPEG)"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Share / Donate</span>
          </button>

          {/* Cart Drawer Button with Count */}
          <button
            onClick={openCartDrawer}
            className="relative flex items-center justify-center h-9 w-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors cursor-pointer"
            aria-label="View Project Kit Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* 1-Click Atomic Reset for Evaluators */}
          <button
            onClick={resetAllDemoData}
            title="Reset to default demo data state"
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-800 bg-slate-900 hover:bg-rose-950/40 hover:border-rose-800/50 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
