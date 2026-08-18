import React, { useState } from 'react';
import { 
  Flame, 
  Thermometer, 
  Compass, 
  Footprints, 
  Clock, 
  Mountain, 
  AlertTriangle, 
  PawPrint,
  Pause,
  Play,
  Square,
  CheckCircle2,
  ChevronRight,
  Radio
} from 'lucide-react';
import { PatrolState, Incident } from '../types';

interface OfficerDashboardProps {
  patrolState: PatrolState;
  onStartPatrol: () => void;
  onPausePatrol: () => void;
  onResumePatrol: () => void;
  onEndPatrol: () => void;
  onSelectIncident: (incident: Incident) => void;
  onNavigateToMap: () => void;
  recentIncidents: Incident[];
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  patrolState,
  onStartPatrol,
  onPausePatrol,
  onResumePatrol,
  onEndPatrol,
  onSelectIncident,
  onNavigateToMap,
  recentIncidents,
}) => {
  const [isOnDuty, setIsOnDuty] = useState(true);

  // Format elapsed time as HH:MM:SS or string
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const smokeAlert = recentIncidents.find(i => i.id === 'inc_01') || recentIncidents[0];
  const wildlifeAlert = recentIncidents.find(i => i.id === 'inc_02') || recentIncidents[1];

  return (
    <div className="w-full space-y-4 p-4 pb-8 max-w-lg mx-auto text-slate-900">
      {/* Officer Status Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        {/* Header with Name & Fire Risk Badge */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B4619] block mb-0.5">
              Field Patrol Unit
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Officer Ranger
            </h2>
            <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
              SECTOR 4 - ALPHA • BEAT #01
            </p>
          </div>

          {/* High Fire Risk Badge */}
          <div className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-red-200 shadow-xs">
            <Flame className="w-4 h-4 fill-red-600 text-red-600" />
            <span>High Fire Risk</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4" />

        {/* Weather & Duty Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 font-mono font-bold text-xs">
            <Thermometer className="w-4 h-4 text-amber-600" />
            <span>28°C / 14% HUMIDITY (DRY)</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
            </span>
            <button
              type="button"
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${
                isOnDuty ? 'bg-[#0B4619]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                  isOnDuty ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Start / Manage Patrol Action Button */}
      {!patrolState.isActive ? (
        <button
          type="button"
          onClick={onStartPatrol}
          className="w-full bg-[#0B4619] hover:bg-emerald-800 active:scale-[0.99] text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-sm transition-all text-sm uppercase tracking-wider cursor-pointer"
        >
          <Compass className="w-5 h-5 text-white stroke-[2.5]" />
          <span>Start Field Patrol</span>
        </button>
      ) : (
        <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-md space-y-3 border-2 border-[#0B4619]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-extrabold text-xs uppercase tracking-wider text-[#0B4619] flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#0B4619]" /> Live GPS Broadcast
              </span>
            </div>
            <span className="font-mono text-base font-black bg-slate-900 px-3 py-1 rounded-xl text-emerald-400">
              {formatDuration(patrolState.elapsedSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {patrolState.isPaused ? (
              <button
                type="button"
                onClick={onResumePatrol}
                className="flex-1 bg-[#0B4619] hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-xs cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Resume
              </button>
            ) : (
              <button
                type="button"
                onClick={onPausePatrol}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 uppercase tracking-wider cursor-pointer"
              >
                <Pause className="w-4 h-4" /> Pause
              </button>
            )}

            <button
              type="button"
              onClick={onEndPatrol}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
            >
              <Square className="w-4 h-4 fill-red-600 text-red-600" /> End Patrol
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Stats Grid (Distance & Duration) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Distance Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">
            <Footprints className="w-4 h-4 text-[#0B4619]" />
            <span>Distance</span>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
              {patrolState.isActive ? patrolState.distanceKm.toFixed(1) : '12.4'}
            </span>
            <span className="text-xs font-bold uppercase text-slate-400 ml-1.5 font-mono">KM</span>
          </div>
        </div>

        {/* Duration Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">
            <Clock className="w-4 h-4 text-[#0B4619]" />
            <span>Duration</span>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
              {patrolState.isActive 
                ? (patrolState.elapsedSeconds >= 3600 ? Math.floor(patrolState.elapsedSeconds / 3600) : (patrolState.elapsedSeconds / 3600).toFixed(1))
                : '3.2'}
            </span>
            <span className="text-xs font-bold uppercase text-slate-400 ml-1.5 font-mono">HRS</span>
          </div>
        </div>
      </div>

      {/* Area Covered Full Width Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 font-extrabold text-xs uppercase tracking-wider">
          <Mountain className="w-4 h-4 text-[#0B4619]" />
          <span>Area Covered</span>
        </div>
        <div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
            {patrolState.isActive ? Math.round(450 + patrolState.distanceKm * 15) : '450'}
          </span>
          <span className="text-xs font-bold uppercase text-slate-400 ml-1.5 font-mono">ACRES</span>
        </div>
      </div>

      {/* Recent Alerts Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
            Recent Sector Alerts
          </h3>
          <span className="text-[10px] font-mono text-[#0B4619] font-extrabold">2 ACTIVE ALERTS</span>
        </div>

        <div className="space-y-3">
          {/* Smoke Detected Card */}
          {smokeAlert && (
            <div 
              onClick={() => onSelectIncident(smokeAlert)}
              className="bg-red-50/50 rounded-3xl p-4 border-2 border-red-300 shadow-xs hover:border-red-500 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center shrink-0 shadow-xs text-white">
                  <AlertTriangle className="w-5 h-5 text-white stroke-[2.5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-700">
                      {smokeAlert.title}
                    </h4>
                    <span className="text-[9px] font-mono font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      CRITICAL
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                    {smokeAlert.description}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400 font-bold block mt-2">
                    {smokeAlert.timestamp}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Wildlife Crossing Card */}
          {wildlifeAlert && (
            <div 
              onClick={() => onSelectIncident(wildlifeAlert)}
              className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200">
                  <PawPrint className="w-5 h-5 text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    {wildlifeAlert.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                    {wildlifeAlert.description}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400 font-bold block mt-2">
                    {wildlifeAlert.timestamp}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Checkpoints & AI Patrol Advice */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Active Patrol Checkpoints
          </span>
          <button 
            onClick={onNavigateToMap}
            className="text-xs font-bold text-[#0B4619] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Map View <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="flex items-center gap-2 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> CP-1 North Ridge Lookout
            </span>
            <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-lg uppercase">Checked 09:15</span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="flex items-center gap-2 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> CP-2 Spring Creek Crossing
            </span>
            <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-lg uppercase">Checked 10:40</span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="flex items-center gap-2 font-bold text-slate-500">
              <div className="w-4 h-4 rounded-full border-2 border-slate-400" /> CP-4 Valley Pass
            </span>
            <span className="text-[9px] font-mono bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-lg uppercase">Next (1.8 KM)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

