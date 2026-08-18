import React, { useState } from 'react';
import { ClipboardList, X } from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '../../data/mockData';
import { SystemAuditLog } from '../../types';

interface SystemLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemLogsModal: React.FC<SystemLogsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [logs] = useState<SystemAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const filtered = logs.filter(l => filter === 'all' || l.type === filter);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col animate-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0B4619]">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">System Audit Trail</h3>
              <p className="text-[10px] text-slate-500 font-mono">IMMUTABLE LOGS &amp; EVENT TELEMETRY</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 py-3 overflow-x-auto text-[10px] font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${filter === 'all' ? 'bg-[#0B4619] text-white shadow-xs' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'}`}
          >
            All Logs
          </button>
          <button
            onClick={() => setFilter('sos')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${filter === 'sos' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'}`}
          >
            SOS Events
          </button>
          <button
            onClick={() => setFilter('triage')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${filter === 'triage' ? 'bg-[#0B4619] text-white shadow-xs' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'}`}
          >
            Triage
          </button>
          <button
            onClick={() => setFilter('auth')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${filter === 'auth' ? 'bg-[#0B4619] text-white shadow-xs' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'}`}
          >
            Auth / Access
          </button>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 py-1 text-xs">
          {filtered.map(log => (
            <div
              key={log.id}
              className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-slate-900 text-xs font-mono">{log.action}</span>
                <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed font-sans">{log.details}</p>
              <div className="text-[10px] text-slate-500 font-mono pt-1 flex items-center justify-between">
                <span>BY: {log.user.toUpperCase()} ({log.role})</span>
                <span className={`uppercase text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  log.type === 'sos' ? 'bg-red-100 text-red-700 border border-red-200' :
                  log.type === 'auth' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  'bg-slate-200 text-slate-600 border border-slate-300'
                }`}>
                  {log.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
