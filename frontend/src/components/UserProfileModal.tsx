import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Award,
  Building2,
  GraduationCap,
  Home,
  DoorClosed,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Lock,
  Wallet,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useSession } from '../context/SessionContext';
import {
  ALLOWED_DEPARTMENTS,
  ALLOWED_HOSTELS,
  ALLOWED_YEARS,
  PRESET_AVATARS
} from '../lib/profileValidation';
import { paiseToRupees } from '../lib/finance';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateCurrentUser, activeRole } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    rollNo: currentUser.rollNo,
    department: currentUser.department,
    year: currentUser.year,
    hostel: currentUser.hostel,
    roomNo: currentUser.roomNo,
    avatarUrl: currentUser.avatarUrl
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setFormData({
        name: currentUser.name,
        rollNo: currentUser.rollNo,
        department: currentUser.department,
        year: currentUser.year,
        hostel: currentUser.hostel,
        roomNo: currentUser.roomNo,
        avatarUrl: currentUser.avatarUrl
      });
      setErrors({});
      setIsEditing(false);
    }
  }

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    const result = updateCurrentUser(formData);

    if (result.success) {
      setIsSaving(false);
      setIsEditing(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } else {
      setIsSaving(false);
      if (result.errors) {
        setErrors(result.errors);
      }
    }
  };

  const handlePresetAvatarSelect = (url: string) => {
    setFormData(prev => ({ ...prev, avatarUrl: url }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-indigo-950/50 flex flex-col max-h-[90vh]">
        {/* Banner Header */}
        <div className="relative h-28 w-full bg-gradient-to-r from-indigo-900 via-indigo-700 to-violet-800 p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_70%)]" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-slate-300 hover:bg-black/60 hover:text-white transition-colors"
            aria-label="Close Profile Modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Identity Avatar Row */}
        <div className="relative px-6 pb-2 -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="relative">
              <img
                src={isEditing ? formData.avatarUrl || currentUser.avatarUrl : currentUser.avatarUrl}
                alt={currentUser.name}
                className="h-20 w-20 rounded-2xl border-4 border-slate-900 bg-slate-800 object-cover shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PRESET_AVATARS[0];
                }}
              />
              {currentUser.isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white ring-2 ring-slate-900"
                  title="Verified Student Identity"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  {currentUser.name}
                </h2>
                <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-500/30 capitalize">
                  {activeRole}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span>{currentUser.rollNo}</span>
                <span>•</span>
                <span>{currentUser.department}</span>
              </p>
            </div>
          </div>

          {/* Edit Toggle Button */}
          <div>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: currentUser.name,
                    rollNo: currentUser.rollNo,
                    department: currentUser.department,
                    year: currentUser.year,
                    hostel: currentUser.hostel,
                    roomNo: currentUser.roomNo,
                    avatarUrl: currentUser.avatarUrl
                  });
                  setErrors({});
                }}
                className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors"
              >
                <span>Cancel Editing</span>
              </button>
            )}
          </div>
        </div>

        {/* Success Alert Toast */}
        {showSuccessToast && (
          <div className="mx-6 mt-3 flex items-center gap-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 p-3 text-xs font-semibold text-emerald-300 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>Profile parameters updated and synchronized to campus local storage!</span>
          </div>
        )}

        {/* Global Security / Form Error Banner */}
        {errors.security && (
          <div className="mx-6 mt-3 flex items-center gap-2 rounded-xl bg-rose-950/80 border border-rose-500/40 p-3 text-xs font-semibold text-rose-300">
            <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <span>{errors.security}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto px-6 py-4 space-y-6 flex-1 custom-scrollbar">
          {/* Reputation & Campus Metrics (Always Visible) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold">Trust Score</span>
                <Award className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-white">{currentUser.trustScore}</span>
                <span className="text-[10px] text-slate-500">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full"
                  style={{ width: `${currentUser.trustScore}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold">Exchanges</span>
                <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <span className="text-lg font-black text-white">{currentUser.successfulExchanges}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">100% on-time</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold">Campus Wallet</span>
                <Wallet className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="text-lg font-black text-emerald-400">
                ₹{paiseToRupees(currentUser.walletBalancePaise).toLocaleString('en-IN')}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">Escrow Ready</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold">Disputes</span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="text-lg font-black text-slate-200">{currentUser.disputes}</span>
              <p className="text-[10px] text-emerald-400 mt-0.5">Clean Record</p>
            </div>
          </div>

          {/* View Mode vs Edit Mode */}
          {!isEditing ? (
            /* View Mode: Clean Parameter Overview */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Campus Identity & Residency
                </h3>
                <span className="text-[11px] text-indigo-400 flex items-center gap-1 font-medium">
                  <Sparkles className="h-3 w-3" />
                  Verified Mesh Node
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-start gap-3 rounded-xl bg-slate-950/40 p-3 border border-slate-800/60">
                  <User className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Full Name</p>
                    <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-slate-950/40 p-3 border border-slate-800/60">
                  <GraduationCap className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Roll No / Student ID</p>
                    <p className="text-sm font-semibold font-mono text-white">{currentUser.rollNo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-slate-950/40 p-3 border border-slate-800/60">
                  <Building2 className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Department / Faculty</p>
                    <p className="text-sm font-semibold text-white">{currentUser.department}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-slate-950/40 p-3 border border-slate-800/60">
                  <GraduationCap className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Academic Standing</p>
                    <p className="text-sm font-semibold text-white">{currentUser.year}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-slate-950/40 p-3 border border-slate-800/60">
                  <Home className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Hostel / Residence</p>
                    <p className="text-sm font-semibold text-white">{currentUser.hostel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-slate-950/40 p-3 border border-slate-800/60">
                  <DoorClosed className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Room / Wing</p>
                    <p className="text-sm font-semibold text-white">{currentUser.roomNo}</p>
                  </div>
                </div>
              </div>

              {/* Immutable Security Parameters */}
              <div className="rounded-xl border border-slate-800/70 bg-slate-950/30 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                  <Lock className="h-3.5 w-3.5 text-slate-500" />
                  <span>Immutable System Attributes</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500">Unique User ID:</span>
                    <p className="font-mono text-slate-300">{currentUser.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Assigned Role:</span>
                    <p className="text-slate-300 capitalize">{currentUser.role}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Institutional ID Status:</span>
                    <p className="text-emerald-400 font-medium">Verified Official</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode: Interactive Parameter Modification Form */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Profile Parameters
                </h3>
                <span className="text-[11px] text-slate-400">All changes persist locally</span>
              </div>

              {/* 1. Full Name & Roll Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Rohan Sharma"
                    className={`w-full rounded-xl border bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      errors.name ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-[11px] text-rose-400">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Roll No / Student ID <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, rollNo: e.target.value }))}
                    placeholder="e.g. 23BCS042"
                    className={`w-full rounded-xl border bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none transition-colors ${
                      errors.rollNo ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  {errors.rollNo && <p className="mt-1 text-[11px] text-rose-400">{errors.rollNo}</p>}
                </div>
              </div>

              {/* 2. Department & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Department / Faculty <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  >
                    {ALLOWED_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && <p className="mt-1 text-[11px] text-rose-400">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Academic Year / Standing <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  >
                    {ALLOWED_YEARS.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                  {errors.year && <p className="mt-1 text-[11px] text-rose-400">{errors.year}</p>}
                </div>
              </div>

              {/* 3. Hostel & Room Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Hostel / Residence Block <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.hostel}
                    onChange={(e) => setFormData(prev => ({ ...prev, hostel: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  >
                    {ALLOWED_HOSTELS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  {errors.hostel && <p className="mt-1 text-[11px] text-rose-400">{errors.hostel}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Room / Wing Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.roomNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, roomNo: e.target.value }))}
                    placeholder="e.g. Room 218"
                    className={`w-full rounded-xl border bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      errors.roomNo ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  {errors.roomNo && <p className="mt-1 text-[11px] text-rose-400">{errors.roomNo}</p>}
                </div>
              </div>

              {/* 4. Avatar Selector (Presets + Custom URL) */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 space-y-3">
                <label className="block text-xs font-medium text-slate-300">
                  Profile Picture / Avatar
                </label>

                {/* Preset Avatar Selection Grid */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((presetUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetAvatarSelect(presetUrl)}
                      className={`relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        formData.avatarUrl === presetUrl
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105'
                          : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={presetUrl} alt={`Avatar option ${idx + 1}`} className="h-10 w-10 object-cover" />
                      {formData.avatarUrl === presetUrl && (
                        <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom URL Input */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <input
                    type="url"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    placeholder="Or enter custom image URL (https://...)"
                    className={`w-full rounded-xl border bg-slate-950 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      errors.avatarUrl ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {errors.avatarUrl && <p className="text-[11px] text-rose-400">{errors.avatarUrl}</p>}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
