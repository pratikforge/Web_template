import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Trash2,
  Navigation,
  ShieldCheck,
  ArrowRight,
  Info,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSession } from '../context/SessionContext';
import { calculateTransactionTotal, rupeesToPaise, paiseToRupees } from '../lib/finance';

interface BundleCartDrawerProps {
  onOrderCreated: (orderId: string) => void;
}

export const BundleCartDrawer: React.FC<BundleCartDrawerProps> = ({ onOrderCreated }) => {
  const {
    cartItems,
    isDrawerOpen,
    closeCartDrawer,
    selectedBundleName,
    borrowHours,
    setBorrowHours,
    removeFromCart,
    hostelClusters,
    checkoutCart
  } = useCart();

  const { platformFeePercentage } = useSession();

  if (!isDrawerOpen) return null;

  // Calculate using integer paise engine
  const totalBorrowPaise = rupeesToPaise(
    cartItems.reduce((sum, item) => sum + item.hourlyRateRupees * borrowHours, 0)
  );
  const totalDepositPaise = rupeesToPaise(
    cartItems.reduce((sum, item) => sum + item.depositRupees, 0)
  );

  const { feePaise, totalPaise } = calculateTransactionTotal(
    totalBorrowPaise,
    platformFeePercentage,
    totalDepositPaise
  );

  const handleCheckout = () => {
    const orderId = checkoutCart();
    if (orderId) {
      onOrderCreated(orderId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 p-6 flex flex-col h-full shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">
              {selectedBundleName || 'Custom Project Kit'}
            </h3>
            <p className="text-xs text-slate-400">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} bundled across campus
            </p>
          </div>
          <button
            onClick={closeCartDrawer}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* Duration Selector */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                Borrow Duration
              </span>
              <span className="font-bold text-indigo-400">{borrowHours} Hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              value={borrowHours}
              onChange={e => setBorrowHours(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 hr (Quick Lab)</span>
              <span>4 hrs (Half Day)</span>
              <span>24 hrs (Full Day)</span>
            </div>
          </div>

          {/* Clustered Pickup Route Notice (PS Section 4 & 5) */}
          {hostelClusters.length > 0 && (
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3.5 text-xs text-indigo-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-indigo-300">
                <Navigation className="h-4 w-4 text-indigo-400" />
                <span>Optimized Walking Pickup Route ({hostelClusters.length} Stops)</span>
              </div>
              <p className="text-[11px] text-indigo-300/80">
                Pick up all kit components without leaving campus within 10-15 minutes.
              </p>
            </div>
          )}

          {/* Items Grouped By Hostel Cluster with Pruning Option */}
          {hostelClusters.map((cluster, idx) => (
            <div key={cluster.hostelName} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                <span className="flex items-center gap-2 font-bold text-slate-200">
                  <span className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  Stop: {cluster.hostelName}
                </span>
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <MapPin className="h-3 w-3 text-amber-400" /> ~{cluster.estimatedWalkingMinutes} min walk
                </span>
              </div>

              {/* Items in Cluster */}
              <div className="space-y-2">
                {cluster.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-4 w-4 rounded border border-emerald-500 bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-slate-200 truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-400">Owner: {item.ownerName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="font-bold text-slate-200">
                          ₹{item.hourlyRateRupees * borrowHours}
                        </p>
                        <p className="text-[10px] text-emerald-400">
                          +₹{item.depositRupees} dep
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove / Prune from Kit"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {cartItems.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm text-slate-400">Your kit is currently empty.</p>
              <p className="text-xs text-slate-500">
                Use the AI Search or catalog to add equipment to your project bundle.
              </p>
            </div>
          )}
        </div>

        {/* Footer: Mandatory Section 12 Financial Formula Breakdown */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-3.5">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Borrowing Fee ({borrowHours} hrs):</span>
                <span className="text-white font-medium">₹{paiseToRupees(totalBorrowPaise)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  Campus Platform Fee ({platformFeePercentage}%):
                  <Info className="h-3 w-3 text-slate-500" />
                </span>
                <span className="text-white font-medium">₹{paiseToRupees(feePaise)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Refundable Security Deposit:</span>
                <span className="text-emerald-400 font-semibold">
                  ₹{paiseToRupees(totalDepositPaise)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Escrow Amount:</span>
                <span className="text-indigo-400 font-black">₹{paiseToRupees(totalPaise)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-indigo-200" />
              <span>Confirm Agreement & Lock Escrow ({cartItems.length} Items)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
