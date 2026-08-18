import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Moon, 
  Globe, 
  Gauge, 
  Fingerprint, 
  LogOut, 
  Database,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';
import { fieldAudio } from '../utils/audioSynth';

interface ProfileViewProps {
  currentUserRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onLogout: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenOfflineHub?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUserRole,
  onChangeRole,
  onLogout,
  isOffline,
  onToggleOffline,
  onOpenOfflineHub,
}) => {
  const [nightMode, setNightMode] = useState(false);
  const [biometricsActive, setBiometricsActive] = useState(true);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [language, setLanguage] = useState('English');
  const [syncing, setSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  const handleManualSync = () => {
    fieldAudio.playRadioReceive();
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncedSuccess(true);
      fieldAudio.playCheckpointChime();
      setTimeout(() => setSyncedSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="w-full space-y-4 p-4 pb-20 max-w-lg mx-auto text-slate-900">
      {/* Officer ID Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-600 text-[#0B4619] font-black text-xl flex items-center justify-center shadow-xs font-mono">
            {currentUserRole === 'ADMIN' ? 'MV' : currentUserRole === 'RANGER' ? 'SJ' : 'OR'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {currentUserRole === 'ADMIN' ? 'Marcus Vance' : currentUserRole === 'RANGER' ? 'Sarah Jenkins' : 'Officer Ranger'}
              </h2>
              <span className="bg-[#0B4619] text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase font-mono tracking-wider">
                {currentUserRole}
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
              BADGE: {currentUserRole === 'ADMIN' ? 'FG-DIR-001' : currentUserRole === 'RANGER' ? 'FG-RO-102' : 'FG-8842'}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              HIGHLAND NORTH • SECTOR 4
            </p>
          </div>
        </div>

        {/* Role Switcher in Profile */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Switch Perspective Role:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                fieldAudio.playTap();
                onChangeRole('OFFICER');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentUserRole === 'OFFICER' ? 'bg-[#0B4619] text-white shadow-xs' : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Officer
            </button>
            <button
              type="button"
              onClick={() => {
                fieldAudio.playTap();
                onChangeRole('RANGER');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentUserRole === 'RANGER' ? 'bg-[#0B4619] text-white shadow-xs' : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Range RO
            </button>
            <button
              type="button"
              onClick={() => {
                fieldAudio.playTap();
                onChangeRole('ADMIN');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentUserRole === 'ADMIN' ? 'bg-[#0B4619] text-white shadow-xs' : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Offline Mode & Data Sync Queue */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOffline ? (
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <WifiOff className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0B4619]">
                <Wifi className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                {isOffline ? 'Offline Field Mode' : 'Connected to Grid'}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                {isOffline ? 'GPS & Reports cached locally' : 'AES-256 cloud sync active'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              fieldAudio.playTap();
              onToggleOffline();
            }}
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              isOffline ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {isOffline ? 'Go Online' : 'Simulate Offline'}
          </button>
        </div>

        {/* Offline Engine Management Button */}
        {onOpenOfflineHub && (
          <button
            type="button"
            onClick={() => {
              fieldAudio.playTap();
              onOpenOfflineHub();
            }}
            className="w-full bg-slate-50 hover:bg-emerald-50 text-[#0B4619] border border-emerald-200 p-3 rounded-2xl flex items-center justify-between font-bold text-xs cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#0B4619]" />
              <span>Open Offline Hub & GPX Track Exporter</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-100 px-2 py-0.5 rounded font-extrabold">
              AES-256 DB
            </span>
          </button>
        )}

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
              {syncedSuccess ? 'Sync Complete (0 Pending)' : isOffline ? '3 Points & 1 Incident In Local Queue' : 'All 142 Records Synced'}
            </span>
            <span className="text-[10px] font-mono text-slate-500">Last Synced: Today at 05:28 AM</span>
          </div>

          <button
            type="button"
            onClick={handleManualSync}
            disabled={syncing}
            className="bg-[#0B4619] hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 stroke-[2.5] ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Field Application Settings */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs font-bold text-slate-800">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B4619] font-mono">
          Tactical Settings
        </h3>

        {/* Night Patrol Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Moon className="w-4 h-4 text-slate-400" />
            <span>Night Patrol Mode</span>
          </div>
          <button
            type="button"
            onClick={() => setNightMode(!nightMode)}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              nightMode ? 'bg-[#0B4619]' : 'bg-slate-200'
            }`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform ${nightMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Biometric App Lock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Fingerprint className="w-4 h-4 text-slate-400" />
            <span>Biometric Tactical Lock</span>
          </div>
          <button
            type="button"
            onClick={() => setBiometricsActive(!biometricsActive)}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              biometricsActive ? 'bg-[#0B4619]' : 'bg-slate-200'
            }`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform ${biometricsActive ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Units System */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Gauge className="w-4 h-4 text-slate-400" />
            <span>Measurement Units</span>
          </div>
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-[11px] font-mono">
            <button
              onClick={() => setUnitSystem('metric')}
              className={`px-2.5 py-1 rounded-lg font-bold uppercase cursor-pointer ${unitSystem === 'metric' ? 'bg-[#0B4619] text-white shadow-xs' : 'text-slate-600'}`}
            >
              km / °C
            </button>
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`px-2.5 py-1 rounded-lg font-bold uppercase cursor-pointer ${unitSystem === 'imperial' ? 'bg-[#0B4619] text-white shadow-xs' : 'text-slate-600'}`}
            >
              mi / °F
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono font-bold cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="French">Français</option>
          </select>
        </div>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={onLogout}
        className="w-full bg-white hover:bg-red-50 text-red-600 font-bold py-3.5 px-4 rounded-2xl border border-red-200 flex items-center justify-center gap-2 shadow-xs transition-all text-xs uppercase tracking-wider cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>End Session & Sign Out</span>
      </button>
    </div>
  );
};


