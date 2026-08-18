import React, { useState } from 'react';
import { UserCheck, Send, CheckCircle2, X } from 'lucide-react';
import { TeamOfficer } from '../../types';

interface AssignPatrolModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamOfficers: TeamOfficer[];
  onAssign: (officerId: string, sector: string, targetKm: number, notes: string) => void;
}

export const AssignPatrolModal: React.FC<AssignPatrolModalProps> = ({
  isOpen,
  onClose,
  teamOfficers,
  onAssign,
}) => {
  const [selectedOfficer, setSelectedOfficer] = useState(teamOfficers[0]?.id || '');
  const [sector, setSector] = useState('Sector 7 - Ridge Line');
  const [targetKm, setTargetKm] = useState(15);
  const [notes, setNotes] = useState('Prioritize ridge line thermal inspections due to dry wind conditions.');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(selectedOfficer, sector, targetKm, notes);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0B4619]">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Assign Range Patrol</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-[#0B4619] mx-auto animate-bounce" />
            <h4 className="font-extrabold uppercase tracking-wider text-slate-900 text-sm">Patrol Dispatched Successfully!</h4>
            <p className="text-xs text-slate-500 font-mono">Dispatched notification sent to field officer's mobile app.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-3.5 space-y-3.5 text-xs">
            <div>
              <label className="font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1 text-[10px]">Select Field Officer</label>
              <select
                value={selectedOfficer}
                onChange={(e) => setSelectedOfficer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#0B4619] cursor-pointer"
              >
                {teamOfficers.map(off => (
                  <option key={off.id} value={off.id} className="bg-white text-slate-900">
                    {off.name} ({off.badgeId}) - {off.status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1 text-[10px]">Target Forest Sector / Beat</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#0B4619] cursor-pointer"
              >
                <option value="Sector 7 - Ridge Line">Sector 7 - Ridge Line (Thermal Priority)</option>
                <option value="Zone B-14 Timber Basin">Zone B-14 Timber Basin (Anti-Poaching)</option>
                <option value="Sector 4 - Alpha">Sector 4 - Alpha (Lookout CP-1)</option>
                <option value="Double Rock Ravine">Double Rock Ravine (Gorge Patrol)</option>
              </select>
            </div>

            <div>
              <label className="font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1 text-[10px]">Target Distance Goal (km)</label>
              <input
                type="number"
                min={5}
                max={50}
                value={targetKm}
                onChange={(e) => setTargetKm(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#0B4619]"
              />
            </div>

            <div>
              <label className="font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1 text-[10px]">Special Directives & Checklist</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0B4619]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold uppercase tracking-wider py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Dispatch Patrol Route</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

