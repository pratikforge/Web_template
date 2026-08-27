import React, { useState, useRef } from 'react';
import { X, Plus, Gift, Sparkles, CheckCircle2, Image as ImageIcon, RefreshCw, AlertCircle, CornerDownLeft } from 'lucide-react';
import type { CampusResource, ResourceCategory } from '../types/campus';
import { useSession } from '../context/SessionContext';
import {
  validateImageFile,
  fileToDataUrl,
  createProductListing
} from '../lib/fileValidation';

interface ListResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResourceAdded: (newResource: CampusResource) => void;
  initialImageUrl?: string;
  initialFileName?: string;
}

export const ListResourceModal: React.FC<ListResourceModalProps> = ({
  isOpen,
  onClose,
  onResourceAdded,
  initialImageUrl = '',
  initialFileName = ''
}) => {
  const { currentUser } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [imageFileName, setImageFileName] = useState<string>(initialFileName);
  const [fileError, setFileError] = useState<string | null>(null);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile({
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (!validation.isValid) {
      setFileError(validation.error || 'Please select a valid PNG, JPG, or JPEG picture.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFileError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setImageUrl(dataUrl);
      setImageFileName(file.name);
    } catch {
      setFileError('Failed to read selected image. Please try again.');
    }
  };

  const triggerNativeFilePicker = () => {
    fileInputRef.current?.click();
  };

  // 1-Click Campus Listing Templates for quick testing
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Must have at least description or title
    if (!description.trim() && !title.trim()) {
      setFileError('Please enter a product description or item title.');
      return;
    }

    const newResource = createProductListing(
      {
        title,
        category,
        description,
        hourlyRate,
        deposit,
        condition,
        isDonation,
        accessories,
        imageUrl
      },
      currentUser
    );

    onResourceAdded(newResource);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Pressing Enter directly submits the listing (Shift+Enter for newline)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Native Windows File Input strictly for PNG, JPG, JPEG pictures */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          onChange={handleFileChange}
          className="hidden"
          data-testid="native-image-input"
        />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">Fill Product Details</h3>
            <p className="text-xs text-slate-400">Enter product description and press Enter to list item</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="overflow-y-auto p-5 space-y-4 text-xs"
          >
            {/* Error Banner */}
            {fileError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span className="text-xs font-medium">{fileError}</span>
              </div>
            )}

            {/* Product Image Preview Section */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center justify-between">
                <span>Selected Picture (PNG, JPG, JPEG)</span>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={triggerNativeFilePicker}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Change Image
                  </button>
                )}
              </label>

              {imageUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center gap-3 p-2.5">
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="h-16 w-20 object-cover rounded-lg border border-slate-800 shrink-0 bg-slate-900"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {imageFileName || 'Selected Picture'}
                    </p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Picture selected • Ready to publish
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={triggerNativeFilePicker}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors shrink-0 cursor-pointer"
                  >
                    Change Picture
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={triggerNativeFilePicker}
                  className="w-full py-4 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl bg-slate-950/60 hover:bg-slate-900/60 transition-all flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
                >
                  <div className="p-2 rounded-full bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 transition-colors">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    Choose Picture from Computer
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Supports .png, .jpg, .jpeg (Max 5MB)
                  </span>
                </button>
              )}
            </div>

            {/* Product Description (Primary Field) */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center justify-between">
                <span>Product Description *</span>
                <span className="text-[10px] text-indigo-300 flex items-center gap-0.5 font-medium">
                  <CornerDownLeft className="h-3 w-3 inline" /> Press Enter to list item
                </span>
              </label>
              <textarea
                rows={3}
                required
                autoFocus
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter equipment details, condition notes, and specifications... (Press Enter when done)"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Title (Optional / Auto-inferred) */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center justify-between">
                <span>Item Title / Name</span>
                <span className="text-[10px] text-slate-500">Optional (auto-derived from description)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Casio fx-991EX Calculator (or leave blank to use description)"
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
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
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
                  onChange={e => setCondition(e.target.value as 'Brand New' | 'Excellent' | 'Good' | 'Fair')}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
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

            {/* Quick Templates */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                Quick 1-Click Templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyTemplate('calculator')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
                >
                  Scientific Calculator
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('lab_coat')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
                >
                  Lab Coat
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('camera')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
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

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer mt-2"
            >
              <Plus className="h-4 w-4" />
              <span>List Product to Campus Catalog (Enter)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
