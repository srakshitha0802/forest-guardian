import React from 'react';
import { 
  Users, 
  AlertCircle, 
  UserCheck, 
  FileText, 
  AlertTriangle, 
  WifiOff, 
  ShieldCheck,
} from 'lucide-react';
import { TeamOfficer, Incident } from '../types';

interface RangeOfficerDashboardProps {
  teamOfficers: TeamOfficer[];
  incidents: Incident[];
  onOpenAssignPatrol: () => void;
  onOpenGenerateReport: () => void;
  onSelectIncident: (incident: Incident) => void;
  onNavigateToMap: () => void;
  onNavigateToIncidents: () => void;
}

export const RangeOfficerDashboard: React.FC<RangeOfficerDashboardProps> = ({
  teamOfficers,
  incidents,
  onOpenAssignPatrol,
  onOpenGenerateReport,
  onSelectIncident,
  onNavigateToMap,
  onNavigateToIncidents,
}) => {
  const activeCount = teamOfficers.filter(o => o.status === 'on_patrol' || o.status === 'available').length;
  const totalCount = teamOfficers.length;
  
  const pendingIncidents = incidents.filter(i => i.status === 'pending');
  const reviewIncidents = incidents.filter(i => i.status === 'under_review');
  const totalRequiringAttention = pendingIncidents.length + reviewIncidents.length;

  const unauthorizedIncident = incidents.find(i => i.id === 'inc_03') || incidents[2];
  const sensorOfflineIncident = incidents.find(i => i.id === 'inc_04') || incidents[3];

  return (
    <div className="w-full space-y-4 p-4 pb-8 max-w-lg mx-auto text-slate-900">
      {/* 1. Live Team Status Card */}
      <div 
        onClick={onNavigateToMap}
        className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs cursor-pointer hover:border-slate-300 transition-all"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B4619] block mb-0.5">
              Sector Command
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Live Team Status
            </h2>
            <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
              ACTIVE FIELD ROSTER
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0B4619]">
            <Users className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-slate-900 tracking-tight font-mono">
              {activeCount}
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono">
              / {totalCount} DEPLOYED
            </span>
          </div>

          {/* Sector Status Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sector 7 Alpha: All Clear</span>
          </div>
        </div>
      </div>

      {/* 2. Incident Triage Card */}
      <div 
        onClick={onNavigateToIncidents}
        className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs cursor-pointer hover:border-slate-300 transition-all"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 block mb-0.5">
              Threat Assessment
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Incident Triage
            </h2>
            <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
              QUEUE & PENDING AUDIT
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <AlertCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-red-600 tracking-tight font-mono">
              {totalRequiringAttention}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Requires Attention
            </span>
          </div>

          {/* Status Pills */}
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-xl font-mono">
              {pendingIncidents.length} Pending
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-xl font-mono">
              {reviewIncidents.length} Review
            </span>
          </div>
        </div>
      </div>

      {/* 3. Patrol Coverage Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-0.5">
              Range Efficiency
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Patrol Coverage
            </h2>
            <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
              ASSIGNED GRID COMPLETION
            </p>
          </div>
          <span className="text-3xl font-extrabold text-emerald-700 font-mono tracking-tight">
            78%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-700" 
              style={{ width: '78%' }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 mt-2">
            <span>0 KM</span>
            <span>150 KM TARGET</span>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTIONS Section */}
      <div className="pt-2">
        <h3 className="text-xs font-extrabold text-slate-700 tracking-wider uppercase mb-3">
          Quick Command Actions
        </h3>

        <div className="space-y-2.5">
          {/* Assign Patrol Button */}
          <button
            type="button"
            onClick={onOpenAssignPatrol}
            className="w-full bg-[#0B4619] hover:bg-emerald-800 active:scale-[0.99] text-white font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs uppercase tracking-wider"
          >
            <UserCheck className="w-4 h-4 text-white stroke-[2.5]" />
            <span>Assign Field Patrol</span>
          </button>

          {/* Generate Range Report Button */}
          <button
            type="button"
            onClick={onOpenGenerateReport}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-xs uppercase tracking-wider"
          >
            <FileText className="w-4 h-4 text-[#0B4619]" />
            <span>Generate Range Report</span>
          </button>
        </div>
      </div>

      {/* 5. RECENT ALERTS Section */}
      <div className="pt-2">
        <h3 className="text-xs font-extrabold text-slate-700 tracking-wider uppercase mb-3">
          Recent Sector Alerts
        </h3>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          {/* Alert 1: Unauthorized Access */}
          {unauthorizedIncident && (
            <div 
              onClick={() => onSelectIncident(unauthorizedIncident)}
              className="flex items-start gap-3 pl-3.5 border-l-4 border-red-500 cursor-pointer hover:bg-slate-50 p-2 rounded-r-2xl transition-all"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  {unauthorizedIncident.title}
                </h4>
                <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                  {unauthorizedIncident.sector} • {unauthorizedIncident.timestamp}
                </p>
              </div>
            </div>
          )}

          {/* Alert 2: Sensor Offline */}
          {sensorOfflineIncident && (
            <div 
              onClick={() => onSelectIncident(sensorOfflineIncident)}
              className="flex items-start gap-3 pl-3.5 border-l-4 border-amber-500 cursor-pointer hover:bg-slate-50 p-2 rounded-r-2xl transition-all"
            >
              <WifiOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  {sensorOfflineIncident.title}
                </h4>
                <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                  {sensorOfflineIncident.sector} • {sensorOfflineIncident.timestamp}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

