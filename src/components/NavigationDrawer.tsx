import React from 'react';
import { 
  TreePine, 
  UserCheck, 
  MessageSquare, 
  FileText, 
  ClipboardList, 
  Network, 
  LogOut, 
  X, 
  Sparkles,
  Camera,
  Flame,
  Scale,
  Compass,
  AlertTriangle,
  Bell,
  Database,
  Brain,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { UserRole } from '../types';
import { fieldAudio } from '../utils/audioSynth';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenChat: () => void;
  onOpenReport: () => void;
  onOpenLogs: () => void;
  onOpenHierarchy: () => void;
  onOpenUsers: () => void;
  onOpenAI: () => void;
  onOpenCommandCenter: () => void;
  onOpenNotifications: () => void;
  onOpenOfflineHub: () => void;
  onSelectFieldTool?: (toolId: 'wildlife' | 'survey' | 'camera_trap' | 'wildfire' | 'offence' | 'compass') => void;
  onLogout: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  onChangeRole,
  onOpenChat,
  onOpenReport,
  onOpenLogs,
  onOpenHierarchy,
  onOpenUsers,
  onOpenAI,
  onOpenCommandCenter,
  onOpenNotifications,
  onOpenOfflineHub,
  onSelectFieldTool,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-start animate-in fade-in duration-200">
      <div className="bg-white border-r border-slate-200 w-80 h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200 text-slate-900">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0B4619] shadow-xs">
                <TreePine className="w-6 h-6 stroke-[2.2] fill-[#0B4619]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
                  Forest Guardian
                </h3>
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                  Field Operations System
                </span>
              </div>
            </div>
            <button 
              onClick={() => { fieldAudio.playTap(); onClose(); }} 
              className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Role Switcher */}
          <div className="my-3.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-mono font-bold text-slate-500 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0B4619]" /> Authenticated Role Context:
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => { fieldAudio.playTap(); onChangeRole('OFFICER'); onClose(); }}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                  currentUserRole === 'OFFICER' ? 'bg-[#0B4619] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Officer
              </button>
              <button
                type="button"
                onClick={() => { fieldAudio.playTap(); onChangeRole('RANGER'); onClose(); }}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                  currentUserRole === 'RANGER' ? 'bg-[#0B4619] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Range RO
              </button>
              <button
                type="button"
                onClick={() => { fieldAudio.playTap(); onChangeRole('ADMIN'); onClose(); }}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                  currentUserRole === 'ADMIN' ? 'bg-[#0B4619] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Admin HQ
              </button>
            </div>
          </div>

          {/* Core AI & Emergency Modules */}
          <div className="space-y-1 text-xs font-bold uppercase tracking-wider text-slate-700">
            <span className="text-[9px] font-mono font-extrabold text-slate-400 px-3 block py-1">COMMAND & INTELLIGENCE</span>

            <button
              onClick={() => { fieldAudio.playRadioChirp(); onOpenAI(); onClose(); }}
              className="w-full py-2 px-3 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 text-[#0B4619] border border-emerald-200 flex items-center justify-between text-left transition-colors cursor-pointer mb-1"
            >
              <div className="flex items-center gap-2.5">
                <Brain className="w-4 h-4 text-[#0B4619]" />
                <span>AI Forest Intelligence</span>
              </div>
              <span className="text-[9px] font-mono font-bold bg-[#0B4619] text-white px-1.5 py-0.5 rounded">v4.2</span>
            </button>

            <button
              onClick={() => { fieldAudio.playTap(); onOpenCommandCenter(); onClose(); }}
              className="w-full py-2 px-3 rounded-xl hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Emergency Command (CAD)</span>
            </button>

            <button
              onClick={() => { fieldAudio.playTap(); onOpenNotifications(); onClose(); }}
              className="w-full py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Operations Notifications</span>
            </button>

            <button
              onClick={() => { fieldAudio.playTap(); onOpenOfflineHub(); onClose(); }}
              className="w-full py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-[#0B4619]" />
              <span>Offline Air-Gap DB & GPX</span>
            </button>

            <span className="text-[9px] font-mono font-extrabold text-slate-400 px-3 block pt-2 pb-1">TACTICAL FIELD TOOLS</span>
            
            {onSelectFieldTool && (
              <>
                <button
                  onClick={() => { onSelectFieldTool('camera_trap'); onClose(); }}
                  className="w-full py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-purple-600" />
                  <span>Camera Traps & Drone</span>
                </button>

                <button
                  onClick={() => { onSelectFieldTool('wildfire'); onClose(); }}
                  className="w-full py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span>Fire FWI & Smoke Plume</span>
                </button>

                <button
                  onClick={() => { onSelectFieldTool('offence'); onClose(); }}
                  className="w-full py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <Scale className="w-4 h-4 text-red-600" />
                  <span>Offence Register (Form-A)</span>
                </button>

                <button
                  onClick={() => { onSelectFieldTool('compass'); onClose(); }}
                  className="w-full py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-teal-600" />
                  <span>Dead Reckoning Compass</span>
                </button>
              </>
            )}

            <span className="text-[9px] font-mono font-extrabold text-slate-400 px-3 block pt-2 pb-1">COMMUNICATIONS & HQ</span>

            <button
              onClick={() => { onOpenChat(); onClose(); }}
              className="w-full py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#0B4619]" />
              <span>Tactical Radio Channel</span>
            </button>

            <button
              onClick={() => { onOpenReport(); onClose(); }}
              className="w-full py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Generate Official Report</span>
            </button>

            {currentUserRole === 'ADMIN' && (
              <>
                <button
                  onClick={() => { onOpenUsers(); onClose(); }}
                  className="w-full py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-[#0B4619]" />
                  <span>Personnel Roster</span>
                </button>
                <button
                  onClick={() => { onOpenHierarchy(); onClose(); }}
                  className="w-full py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <Network className="w-4 h-4 text-amber-600" />
                  <span>Division Hierarchy</span>
                </button>
                <button
                  onClick={() => { onOpenLogs(); onClose(); }}
                  className="w-full py-2 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <ClipboardList className="w-4 h-4 text-slate-500" />
                  <span>System Audit Logs</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100">
          <div className="bg-slate-50 p-2 rounded-xl text-[9px] font-mono text-slate-500 mb-2 leading-tight border border-slate-100">
            Encrypted AES-256 GCM • Zero-Trust Mobile CAD • Air-Gapped Local Storage
          </div>
          <button
            onClick={() => { fieldAudio.playTap(); onLogout(); onClose(); }}
            className="w-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
