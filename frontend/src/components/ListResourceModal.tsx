import React, { useState } from 'react';
import { X, Plus, Gift, Sparkles, CheckCircle2 } from 'lucide-react';
import type { CampusResource, ResourceCategory } from '../types/campus';
import { useSession } from '../context/SessionContext';
import { sanitizeInput } from '../lib/security';

interface ListResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResourceAdded: (newResource: CampusResource) => void;
}

export const ListResourceModal: React.FC<ListResourceModalProps> = ({
  isOpen,
  onClose,
  onResourceAdded
}) => {
  const { currentUser } = useSession();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Electronics');
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState('20');
  const [deposit, setDeposit] = useState('100');
  const [condition, setCondition] = useState<'Brand New' | 'Excellent' | 'Good' | 'Fair'>('Excellent');
  const [isDonation, setIsDonation] = useState(false);
  const [accessories, setAccessories] = useState('Carry Bag, Power Cable');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // 1-Click Campus Listing Templates for quick judge testing
  const applyTemplate = (templateName: string) => {
    if (templateName === 'calculator') {
      setTitle('Casio fx-991ES Plus Scientific Calculator');
      setCategory('Lab & Academic');
      setDescription('Non-programmable 417-function calculator. Mandatory for university engineering exams.');
      setHourlyRate('15');
      setDeposit('100');
      setAccessories('Protective Slide Cover');
    } else if (templateName === 'lab_coat') {
      setTitle('White Chemistry Lab Coat (Size M)');
      setCategory('Lab & Academic');
      setDescription('Standard regulation cotton lab coat with front chest pocket.');
      setHourlyRate('10');
      setDeposit('50');
      setAccessories('Safety Glasses');
    } else if (templateName === 'camera') {
      setTitle('Canon EOS 1500D DSLR Camera Kit');
      setCategory('Media & Events');
      setDescription('24.1MP APS-C sensor with 18-55mm IS II lens, battery charger, and 64GB card.');
      setHourlyRate('80');
      setDeposit('400');
      setAccessories('18-55mm Lens, Battery Charger, Neck Strap');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = sanitizeInput(title);
    const cleanDesc = sanitizeInput(description);
    if (!cleanTitle) return;

    const newResource: CampusResource = {
      id: `res_user_${Date.now()}`,
      title: cleanTitle,
      category: isDonation ? 'Free / Donate' : category,
      description: cleanDesc || 'Student-shared campus resource.',
      hourlyRateRupees: isDonation ? 0 : Math.max(0, parseInt(hourlyRate) || 0),
      depositRupees: isDonation ? 0 : Math.max(0, parseInt(deposit) || 0),
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerDepartment: currentUser.department,
      ownerHostel: currentUser.hostel,
      distanceMinutes: 2,
      condition,
      isAvailable: true,
      imageUrl:
        category === 'Lab & Academic'
          ? 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80'
          : category === 'Media & Events'
          ? 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      accessoriesIncluded: accessories
        .split(',')
        .map(a => a.trim())
        .filter(Boolean),
      borrowingTerms: ['Return in clean condition', 'Report any faults immediately'],
      totalBorrowsCount: 0,
      isDonation
    };

    onResourceAdded(newResource);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">List Equipment for Campus Sharing</h3>
            <p className="text-xs text-slate-400">Put idle equipment to work or donate to peers</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Item Listed Successfully!</h4>
            <p className="text-xs text-slate-400">
              Your equipment is now live in the campus catalog for students to borrow.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 text-xs">
            {/* Quick Templates */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                Quick Campus Templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyTemplate('calculator')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  Scientific Calculator
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('lab_coat')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  Lab Coat
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('camera')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  DSLR Camera
                </button>
              </div>
            </div>

            {/* Donation Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className="font-bold text-slate-200">Donate for Free (₹0 Fee & Deposit)</p>
                  <p className="text-[10px] text-slate-400">Pass on old textbooks, notes, or lab gear</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isDonation}
                onChange={e => setIsDonation(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Item Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Casio fx-991EX Calculator"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ResourceCategory)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Lab & Academic">Lab & Academic</option>
                  <option value="Media & Events">Media & Events</option>
                  <option value="Sports & Dorm">Sports & Dorm</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Condition</label>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>

            {/* Pricing (Hidden if donation) */}
            {!isDonation && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Hourly Charge (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={hourlyRate}
                    onChange={e => setHourlyRate(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Refundable Deposit (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={deposit}
                    onChange={e => setDeposit(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Accessories */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Included Accessories</label>
              <input
                type="text"
                value={accessories}
                onChange={e => setAccessories(e.target.value)}
                placeholder="Comma separated: Battery, Padded Bag, Lens Cap"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Key details, specifications, and borrowing guidelines..."
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer mt-2"
            >
              <Plus className="h-4 w-4" />
              <span>Publish Listing to Campus</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
