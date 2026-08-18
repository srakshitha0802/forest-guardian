import React, { useState } from 'react';
import { 
  Briefcase, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  UserCog, 
  Network, 
  ClipboardList, 
  Plus, 
  Minus,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { INCIDENT_TRENDS_DATA } from '../data/mockData';
import { SOSAlert } from '../types';

interface AdminDashboardProps {
  sosAlerts: SOSAlert[];
  onReviewSOSAlerts: () => void;
  onOpenManageUsers: () => void;
  onOpenDivisionHierarchy: () => void;
  onOpenSystemLogs: () => void;
  onNavigateToMap: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  sosAlerts,
  onReviewSOSAlerts,
  onOpenManageUsers,
  onOpenDivisionHierarchy,
  onOpenSystemLogs,
  onNavigateToMap,
}) => {
  const [mapZoom, setMapZoom] = useState(1);
  const activeSOSCount = sosAlerts.filter(a => a.active).length;

  return (
    <div className="w-full space-y-4 p-4 pb-8 max-w-lg mx-auto text-slate-900">
      {/* 1. Total Active Officers Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B4619] block mb-0.5">
              Force Readiness
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Total Active Officers
            </h2>
            <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
              ACROSS 5 FOREST DIVISIONS
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0B4619]">
            <Briefcase className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="text-5xl font-extrabold text-slate-900 tracking-tight font-mono">
            142
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            / 150 ACTIVE DUTY
          </span>
        </div>
      </div>

      {/* 2. Active SOS Alerts Card */}
      <div className="bg-red-50/70 rounded-3xl p-5 border-2 border-red-300 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 block mb-0.5">
              Emergency Broadcast
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-red-700">
              Active SOS Alerts
            </h2>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6 stroke-[2.8]" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-5xl font-extrabold text-red-600 tracking-tight font-mono">
            {activeSOSCount > 0 ? activeSOSCount : '3'}
          </span>
          <span className="text-xs font-extrabold text-white bg-red-600 px-2.5 py-1 rounded-xl uppercase tracking-wider font-mono">
            HIGH PRIORITY
          </span>
        </div>

        <button
          type="button"
          onClick={onReviewSOSAlerts}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-extrabold py-3 px-6 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <span>Review Distress Beacons</span>
        </button>
      </div>

      {/* 3. Fire Risk Hotspots Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-extrabold uppercase tracking-tight text-slate-900">
              Fire Risk Hotspots
            </h2>
          </div>
          <span className="text-[10px] font-mono text-red-700 font-extrabold bg-red-50 px-2 py-0.5 rounded-lg">THERMAL SATELLITE</span>
        </div>

        {/* Map Container */}
        <div 
          onClick={onNavigateToMap}
          className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group"
        >
          {/* Topographical Map Visual Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80')`,
              filter: 'saturate(1.1) contrast(1.1) brightness(0.85)'
            }}
          />

          {/* Fire Heatmap Glow Layer */}
          <div className="absolute inset-0 bg-radial from-red-500/35 via-amber-500/15 to-transparent pointer-events-none" />

          {/* Map Pin: Double Rock */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-red-300">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">Double Rock</span>
            <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-white font-black">
              <span className="text-[9px]">▲</span>
            </div>
          </div>

          {/* Secondary Yosemite Label */}
          <div className="absolute bottom-2 left-3 text-[10px] font-mono font-bold text-slate-700 bg-white/90 border border-slate-200 px-2 py-0.5 rounded-md shadow-xs">
            Yosemite Zone 4
          </div>

          {/* Map Zoom Controls on Right */}
          <div 
            className="absolute bottom-3 right-3 flex flex-col bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              onClick={() => setMapZoom(z => Math.min(z + 0.2, 2))}
              className="p-2 hover:bg-slate-50 text-slate-700 border-b border-slate-200 font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={() => setMapZoom(z => Math.max(z - 0.2, 0.6))}
              className="p-2 hover:bg-slate-50 text-slate-700 font-bold cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Incident Trends Card (Chart) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-extrabold uppercase tracking-tight text-slate-900">
              Incident Trends
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-bold">7-DAY TELEMETRY</span>
        </div>

        {/* Custom Clean Recharts Display */}
        <div className="w-full h-44 bg-slate-50 rounded-2xl p-2 border border-slate-200">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={INCIDENT_TRENDS_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 9, fill: '#64748B' }} domain={[0, 60]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#E2E8F0', 
                  borderRadius: '12px', 
                  fontSize: '11px',
                  color: '#0F172A',
                  fontFamily: 'monospace',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }} 
              />
              <Legend 
                wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }}
                iconSize={8}
              />
              {/* Green Line: Resolved Incidents */}
              <Line 
                type="monotone" 
                dataKey="resolved" 
                name="Resolved" 
                stroke="#15803D" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#15803D' }} 
              />
              {/* Orange Line: New Reports */}
              <Line 
                type="monotone" 
                dataKey="newReports" 
                name="New Reports" 
                stroke="#DC2626" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#DC2626' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Footer with +12% */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
          <span className="text-xs font-mono font-bold text-slate-500">Past 7 Days Aggregate</span>
          <div className="flex items-center gap-1 text-xs font-mono font-extrabold text-emerald-700">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12% CLEARANCE</span>
          </div>
        </div>
      </div>

      {/* 5. Quick Actions Section */}
      <div className="pt-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3">
          HQ Administration
        </h3>

        {/* 2-Column Action Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Manage Users */}
          <button
            type="button"
            onClick={onOpenManageUsers}
            className="bg-white hover:bg-slate-50 active:scale-[0.98] rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0B4619] mb-3">
              <UserCog className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Personnel Directory</span>
          </button>

          {/* Division Hierarchy */}
          <button
            type="button"
            onClick={onOpenDivisionHierarchy}
            className="bg-white hover:bg-slate-50 active:scale-[0.98] rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0B4619] mb-3">
              <Network className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 leading-tight">
              Division Tree
            </span>
          </button>
        </div>

        {/* System Logs Full Width Card */}
        <button
          type="button"
          onClick={onOpenSystemLogs}
          className="w-full bg-white hover:bg-slate-50 active:scale-[0.99] rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-2">
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Security Audit Trail</span>
        </button>
      </div>
    </div>
  );
};

