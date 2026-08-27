import React, { useState } from 'react';
import { X, Radio, Plus, Clock, MapPin, CheckCircle2, Send } from 'lucide-react';
import type { CommunityBeaconRequest } from '../types/campus';
import { MOCK_BEACON_REQUESTS } from '../data/mockCampusData';
import { sanitizeInput } from '../lib/security';

interface CommunityBeaconDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityBeaconDrawer: React.FC<CommunityBeaconDrawerProps> = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState<CommunityBeaconRequest[]>(MOCK_BEACON_REQUESTS);
  const [itemNeeded, setItemNeeded] = useState('');
  const [hostel, setHostel] = useState('Hostel 4 (Aryabhatta)');
  const [urgency, setUrgency] = useState<'Immediate (Next 1 hr)' | 'Today' | 'This Weekend'>('Immediate (Next 1 hr)');
  const [budget, setBudget] = useState('50');
  const [lentNotification, setLentNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanItem = sanitizeInput(itemNeeded);
    if (!cleanItem) return;

    const newReq: CommunityBeaconRequest = {
      id: `req_${Date.now()}`,
      studentName: 'Rohan Sharma (You)',
      studentHostel: hostel,
      itemNeeded: cleanItem,
      category: 'Electronics',
      urgency,
      maxBudgetRupees: parseInt(budget) || 40,
      postedAgo: 'Just now',
      responsesCount: 0
    };

    setRequests(prev => [newReq, ...prev]);
    setItemNeeded('');
  };

  const handleLendResponse = (reqId: string, itemTitle: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === reqId ? { ...r, responsesCount: r.responsesCount + 1 } : r))
    );
    setLentNotification(`Notified student that you can lend: "${itemTitle}"!`);
    setTimeout(() => setLentNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col h-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Radio className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Campus Wanted Beacon</h3>
              <p className="text-xs text-slate-400">PS Section 5: Urgent Community Peer Requests</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {lentNotification && (
          <div className="my-3 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{lentNotification}</span>
          </div>
        )}

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Post New Request Accordion */}
          <form onSubmit={handlePostRequest} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-indigo-400" />
              Broadcast Urgent Need to Campus
            </h4>

            <input
              type="text"
              required
              value={itemNeeded}
              onChange={e => setItemNeeded(e.target.value)}
              placeholder="What equipment do you urgently need?"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-medium">Your Hostel</label>
                <select
                  value={hostel}
                  onChange={e => setHostel(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                >
                  <option value="Hostel 1 (Aryabhatta)">Hostel 1</option>
                  <option value="Hostel 2 (Kalpana Chawla)">Hostel 2</option>
                  <option value="Hostel 3 (CV Raman)">Hostel 3</option>
                  <option value="Hostel 4 (Aryabhatta)">Hostel 4</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-medium">Urgency</label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value as any)}
                  className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                >
                  <option value="Immediate (Next 1 hr)">Next 1 Hour</option>
                  <option value="Today">Today</option>
                  <option value="This Weekend">This Weekend</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-medium">Max Budget (₹)</label>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Broadcast Beacon</span>
            </button>
          </form>

          {/* Active Broadcasts */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Live Campus Broadcasts ({requests.length})
            </span>

            {requests.map(req => (
              <div
                key={req.id}
                className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2.5 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-slate-200 text-sm">{req.itemNeeded}</h5>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-amber-400" />
                      {req.studentHostel} • {req.studentName}
                    </p>
                  </div>
                  <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300 shrink-0">
                    {req.urgency}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {req.postedAgo}
                  </span>
                  <span>Budget: <strong className="text-white">₹{req.maxBudgetRupees}</strong></span>
                </div>

                <button
                  onClick={() => handleLendResponse(req.id, req.itemNeeded)}
                  className="w-full py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  I Can Lend This ({req.responsesCount} offers)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
