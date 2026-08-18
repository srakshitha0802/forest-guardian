import React, { useState } from 'react';
import { UserCog, Plus, Trash2, X, Search } from 'lucide-react';
import { TeamOfficer, UserRole } from '../../types';

interface ManageUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamOfficers: TeamOfficer[];
  onAddOfficer: (officer: Partial<TeamOfficer>) => void;
  onDeleteOfficer: (id: string) => void;
}

export const ManageUsersModal: React.FC<ManageUsersModalProps> = ({
  isOpen,
  onClose,
  teamOfficers,
  onAddOfficer,
  onDeleteOfficer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('OFFICER');
  const [newSector, setNewSector] = useState('Sector 4 - Alpha');

  if (!isOpen) return null;

  const filtered = teamOfficers.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.badgeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newBadge) return;
    onAddOfficer({
      name: newName,
      badgeId: newBadge,
      role: newRole,
      sector: newSector,
      beat: 'Beat 1',
      status: 'available',
      battery: 100,
      lat: 37.7550,
      lng: -119.5600,
      lastCheckIn: 'Just added',
      activePatrolKm: 0
    });
    setNewName('');
    setNewBadge('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col animate-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0B4619]">
              <UserCog className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Personnel Directory</h3>
              <p className="text-[10px] text-slate-500 font-mono">{teamOfficers.length} REGISTERED FIELD OFFICERS</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Add Button */}
        <div className="pt-3.5 pb-2 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search officer, badge or sector..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4619] font-mono"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#0B4619] hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </div>

        {/* Add User Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 my-2 space-y-2.5 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-slate-900 text-xs">Add New Officer Account</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0B4619]"
              />
              <input
                type="text"
                required
                placeholder="Badge (e.g. FG-9920)"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-mono placeholder-slate-400 focus:ring-2 focus:ring-[#0B4619]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#0B4619] cursor-pointer"
              >
                <option value="OFFICER">Forest Officer</option>
                <option value="RANGER">Range Officer</option>
                <option value="ADMIN">Department Admin</option>
              </select>
              <select
                value={newSector}
                onChange={(e) => setNewSector(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#0B4619] cursor-pointer"
              >
                <option value="Sector 4 - Alpha">Sector 4 - Alpha</option>
                <option value="Sector 7 - Ridge">Sector 7 - Ridge</option>
                <option value="Zone B-14 Timber">Zone B-14 Timber</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold uppercase tracking-wider py-2.5 rounded-xl text-xs shadow-xs cursor-pointer"
            >
              Save Officer Credentials
            </button>
          </form>
        )}

        {/* User List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 py-2">
          {filtered.map(officer => (
            <div
              key={officer.id}
              className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 text-[#0B4619] font-mono font-bold text-xs flex items-center justify-center">
                  {officer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold uppercase tracking-wider text-slate-900 text-xs">{officer.name}</span>
                    <span className="text-[9px] bg-white text-[#0B4619] px-1.5 py-0.5 rounded font-mono font-bold border border-slate-200">
                      {officer.badgeId}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {officer.sector} • BATTERY {officer.battery}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  officer.status === 'on_patrol' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  officer.status === 'sos' ? 'bg-red-600 text-white animate-pulse font-bold' :
                  'bg-slate-200 text-slate-600'
                }`}>
                  {officer.status}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteOfficer(officer.id)}
                  className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                  title="Suspend Account"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

