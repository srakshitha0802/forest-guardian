import React, { useState, useEffect } from 'react';
import { HardDrive, Download, Upload, Trash2, CheckCircle2, ShieldCheck, Database, RefreshCw, X, Radio, MapPin, FileCode } from 'lucide-react';
import { OfflineStorageManager, OfflineDbStats } from '../data/offlineDb';
import { exportPatrolToGPX, downloadOfflineFile } from '../utils/gpxExporter';
import { PatrolState, Incident, Checkpoint } from '../types';
import { fieldAudio } from '../utils/audioSynth';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patrolState: PatrolState;
  incidents: Incident[];
  checkpoints: Checkpoint[];
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  patrolState,
  incidents,
  checkpoints,
  isOffline,
  onToggleOffline,
}) => {
  const [stats, setStats] = useState<OfflineDbStats | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStats(OfflineStorageManager.getStats());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    fieldAudio.playTap();
    const backupJson = OfflineStorageManager.exportFullBackupJSON();
    const filename = `forest_guardian_offline_backup_${new Date().toISOString().slice(0, 10)}.json`;
    downloadOfflineFile(backupJson, filename, 'application/json');
    setStatusMsg('Database JSON backup saved to device storage!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleExportGPX = () => {
    fieldAudio.playCheckpointChime();
    const gpxData = exportPatrolToGPX(
      'Yosemite Ridge Beat Patrol',
      'FG-8842',
      patrolState.route,
      checkpoints,
      incidents
    );
    const filename = `patrol_track_FG8842_${Date.now()}.gpx`;
    downloadOfflineFile(gpxData, filename, 'application/gpx+xml');
    setStatusMsg('GPX Track exported for Garmin/QGIS GPS!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col animate-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0B4619]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Offline Hub & Engine</h3>
              <p className="text-[10px] text-slate-500 font-mono">100% AIR-GAPPED ON-DEVICE ENGINE</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-3.5 space-y-3.5 text-xs overflow-y-auto">
          {/* Status Message */}
          {statusMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl flex items-center gap-2 font-mono text-[11px] animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Engine Card */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0B4619]" />
                <span>On-Device Storage Engine</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                READY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Incidents Stored:</span>
                <span className="font-bold text-slate-800 text-sm">{stats?.incidentsCount || incidents.length}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Storage Allocated:</span>
                <span className="font-bold text-slate-800 text-sm">{stats?.storageUsedKB || 32} KB</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Checkpoints:</span>
                <span className="font-bold text-slate-800 text-sm">{stats?.checkpointsCount || checkpoints.length}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Encryption:</span>
                <span className="font-bold text-[#0B4619] text-xs">AES-256 GCM</span>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1">
              Data Portability & Field Extraction
            </span>

            <button
              type="button"
              onClick={handleExportGPX}
              className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              <span>Export Active Patrol Route (.GPX for Garmin)</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-2xl flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export Database Backup (.JSON for HQ Archive)</span>
            </button>
          </div>

          {/* Network Simulator Toggle */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block text-xs">Field Connectivity State</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {isOffline ? 'Air-Gapped (Zero internet required)' : 'Online simulation mode'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                fieldAudio.playTap();
                onToggleOffline();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold font-mono text-[10px] uppercase transition-all cursor-pointer ${
                isOffline ? 'bg-amber-600 text-white' : 'bg-emerald-700 text-white'
              }`}
            >
              {isOffline ? 'Offline Active' : 'Connected'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
