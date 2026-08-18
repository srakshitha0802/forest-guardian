import React from 'react';
import { Menu, Wifi, WifiOff, Bell, Search, Sparkles, AlertTriangle } from 'lucide-react';
import { UserRole } from '../types';
import { fieldAudio } from '../utils/audioSynth';

interface TopAppBarProps {
  role: UserRole;
  onOpenMenu: () => void;
  onTriggerSOS: () => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  onOpenAI?: () => void;
  unreadNotificationsCount?: number;
  isOffline?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  role,
  onOpenMenu,
  onTriggerSOS,
  onOpenSearch,
  onOpenNotifications,
  onOpenAI,
  unreadNotificationsCount = 2,
  isOffline = false,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 py-2 flex items-center justify-between shadow-xs">
      {/* Left: Menu & Search */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => { fieldAudio.playTap(); onOpenMenu(); }}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-none cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-slate-800" />
        </button>

        {onOpenSearch && (
          <button
            type="button"
            onClick={() => { fieldAudio.playTap(); onOpenSearch(); }}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-slate-700" />
          </button>
        )}
      </div>

      {/* Center Title & Role Subtitle */}
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-1.5">
          <h1 className="text-sm font-extrabold tracking-tight text-[#0B4619] leading-tight">
            Forest Guardian
          </h1>
          {role === 'ADMIN' && (
            <span className="bg-slate-900 text-white text-[8px] font-mono font-bold px-1.5 py-0.2 rounded">
              HQ
            </span>
          )}
        </div>
        
        {role === 'ADMIN' ? (
          <span className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">
            Department Admin
          </span>
        ) : role === 'RANGER' ? (
          <span className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">
            Range Commander
          </span>
        ) : (
          <span className="text-[9px] font-semibold text-slate-500 flex items-center gap-1">
            {isOffline ? (
              <>
                <WifiOff className="w-2.5 h-2.5 text-amber-600" />
                <span className="text-amber-700 font-bold">Offline Airgap</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-800 font-bold">Live GPS Lock</span>
              </>
            )}
          </span>
        )}
      </div>

      {/* Right: AI Assistant, Notifications & SOS Button */}
      <div className="flex items-center gap-1.5">
        {onOpenAI && (
          <button
            type="button"
            onClick={() => { fieldAudio.playRadioChirp(); onOpenAI(); }}
            title="Forest Guardian AI Assistant"
            className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0B4619] border border-emerald-200 transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-[#0B4619]" />
          </button>
        )}

        {onOpenNotifications && (
          <button
            type="button"
            onClick={() => { fieldAudio.playTap(); onOpenNotifications(); }}
            className="relative p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        )}

        {/* SOS Button */}
        <button
          type="button"
          onClick={() => { fieldAudio.playTap(); onTriggerSOS(); }}
          className="px-2.5 py-1 rounded-xl text-[11px] font-black text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all tracking-wider uppercase shadow-xs cursor-pointer flex items-center gap-1"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>SOS</span>
        </button>
      </div>
    </header>
  );
};
