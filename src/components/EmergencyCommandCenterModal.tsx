import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Radio, 
  Users, 
  MapPin, 
  Battery, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  X, 
  Phone, 
  Navigation, 
  Compass,
  ArrowRight,
  Flame,
  Volume2
} from 'lucide-react';
import { SOSAlert, TeamOfficer, UserRole } from '../types';
import { fieldAudio } from '../utils/audioSynth';

interface EmergencyCommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  sosAlerts: SOSAlert[];
  teamOfficers: TeamOfficer[];
  currentUserRole: UserRole;
  onResolveSOS: (sosId: string, notes?: string) => void;
  onNavigateToMap?: () => void;
}

// Distance calculation using Haversine formula
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const EmergencyCommandCenterModal: React.FC<EmergencyCommandCenterModalProps> = ({
  isOpen,
  onClose,
  sosAlerts,
  teamOfficers,
  currentUserRole,
  onResolveSOS,
  onNavigateToMap,
}) => {
  const [selectedSosId, setSelectedSosId] = useState<string>(sosAlerts[0]?.id || 'sos_01');
  const [dispatchedOfficerId, setDispatchedOfficerId] = useState<string | null>(null);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveDialog, setShowResolveDialog] = useState(false);

  if (!isOpen) return null;

  const currentSos = sosAlerts.find(s => s.id === selectedSosId) || sosAlerts[0];

  // Smart Dispatch Ranking
  const rankedOfficers = teamOfficers
    .map(officer => {
      const dist = currentSos 
        ? calculateDistanceKm(currentSos.lat, currentSos.lng, officer.lat, officer.lng)
        : 1.5;
      
      // Calculate ETA assuming 5 km/h on foot or 25 km/h vehicle
      const etaMins = Math.max(2, Math.round(dist * 12));

      // Suitability score (0 - 100)
      let score = 100 - (dist * 15);
      if (officer.battery < 30) score -= 20;
      if (officer.status === 'on_patrol') score += 10;
      if (officer.status === 'off_duty') score -= 30;

      return {
        ...officer,
        distanceKm: dist,
        etaMinutes: etaMins,
        suitabilityScore: Math.max(10, Math.min(99, Math.round(score)))
      };
    })
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  const handleDispatch = (officer: typeof rankedOfficers[0]) => {
    fieldAudio.playRadioReceive();
    setDispatchedOfficerId(officer.id);
  };

  const handleBroadcastAll = () => {
    fieldAudio.playRadioChirp();
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const handleConfirmResolution = () => {
    fieldAudio.playCheckpointChime();
    if (currentSos) {
      onResolveSOS(currentSos.id, resolutionNotes || 'Emergency stabilized and field unit assisted safely.');
    }
    setShowResolveDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border-2 border-red-500 w-full max-w-xl h-[94vh] max-h-[760px] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base uppercase tracking-tight">
                  Emergency Command Center
                </h2>
                <span className="bg-white text-red-700 text-[10px] font-mono font-black px-2 py-0.5 rounded-full">
                  LIVE CAD
                </span>
              </div>
              <p className="text-[11px] text-red-100 font-mono">
                Real-Time Incident Triage, Geofence Watch & Smart Dispatch
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => { fieldAudio.playTap(); onClose(); }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SOS Alert Selector Tabs if multiple */}
        <div className="bg-red-50 border-b border-red-200 p-2 flex gap-2 overflow-x-auto">
          {sosAlerts.map(alert => (
            <button
              key={alert.id}
              type="button"
              onClick={() => { fieldAudio.playTap(); setSelectedSosId(alert.id); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                selectedSosId === alert.id 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-white border border-red-200 text-red-800 hover:bg-red-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${alert.active ? 'bg-red-400 animate-ping' : 'bg-slate-400'}`} />
              <span>{alert.badgeId}: {alert.officerName}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
          
          {/* Active Emergency Card */}
          {currentSos && (
            <div className="bg-red-50/60 border border-red-200 rounded-3xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-red-700 uppercase tracking-wider block">
                    DISTRESS TRANSMISSION #{currentSos.id.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    {currentSos.officerName} ({currentSos.badgeId})
                  </h3>
                  <p className="text-xs font-mono text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>{currentSos.sector} • GPS: {currentSos.lat.toFixed(4)}, {currentSos.lng.toFixed(4)}</span>
                  </p>
                </div>

                <div className="text-right font-mono">
                  <span className="bg-red-100 text-red-800 text-[10px] font-black px-2.5 py-1 rounded-xl border border-red-300">
                    {currentSos.active ? 'TRIGGERED / CRITICAL' : 'RESOLVED'}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-1">
                    {currentSos.timestamp}
                  </span>
                </div>
              </div>

              {/* Telemetry quick bar */}
              <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-2xl border border-red-100 font-mono text-center">
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold">BATTERY LEVEL</span>
                  <span className="text-xs font-extrabold text-red-600 flex items-center justify-center gap-1">
                    <Battery className="w-3.5 h-3.5" />
                    {currentSos.batteryLevel}%
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold">FREQUENCY</span>
                  <span className="text-xs font-extrabold text-slate-800">10s TELEMETRY</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold">EST. ALTITUDE</span>
                  <span className="text-xs font-extrabold text-slate-800">420m AMSL</span>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleBroadcastAll}
                  className={`flex-1 font-bold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs ${
                    broadcastSent ? 'bg-emerald-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span>{broadcastSent ? 'Broadcast Sent to All Units!' : 'Broadcast Emergency Audio'}</span>
                </button>

                {currentSos.active && (
                  <button
                    type="button"
                    onClick={() => setShowResolveDialog(true)}
                    className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-2.5 px-4 rounded-2xl text-xs cursor-pointer shadow-2xs"
                  >
                    Resolve / Close
                  </button>
                )}
              </div>
            </div>
          )}

          {/* AI Smart Dispatch Recommendations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0B4619]" />
                <span>AI Smart Dispatch • Ranked Responders</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                PROXIMITY + READINESS WEIGHTED
              </span>
            </div>

            <div className="space-y-2">
              {rankedOfficers.slice(0, 4).map((officer, idx) => {
                const isDispatched = dispatchedOfficerId === officer.id;

                return (
                  <div 
                    key={officer.id}
                    className={`bg-white border rounded-2xl p-3.5 shadow-2xs flex items-center justify-between gap-3 transition-all ${
                      idx === 0 ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs ${
                        idx === 0 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}>
                        #{idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs text-slate-900">{officer.name}</h4>
                          <span className="text-[10px] font-mono font-bold text-slate-500">({officer.badgeId})</span>
                          {idx === 0 && (
                            <span className="bg-emerald-100 text-emerald-800 text-[8px] font-extrabold px-1.5 py-0.2 rounded-md font-mono">
                              OPTIMAL
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                          {officer.sector} • {officer.distanceKm} km away • ETA ~{officer.etaMinutes} mins
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDispatch(officer)}
                        disabled={isDispatched}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                          isDispatched 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-[#0B4619] hover:bg-emerald-800 text-white shadow-xs'
                        }`}
                      >
                        {isDispatched ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>En Route</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Dispatch</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incident Timeline Audit Log */}
          <div className="bg-slate-50 p-3.5 rounded-3xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider block">
              CAD AUDIT TIMELINE & CHAIN OF CUSTODY
            </span>

            <div className="space-y-2 text-[11px] font-mono text-slate-700">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 mt-1" />
                <div>
                  <span className="font-bold text-red-700">09:30:14 AM</span> — SOS Beacon triggered by {currentSos?.badgeId} (Sector 7 Ridge).
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1" />
                <div>
                  <span className="font-bold text-amber-700">09:30:18 AM</span> — Acknowledged by Range Officer Command Server.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1" />
                <div>
                  <span className="font-bold text-emerald-700">09:31:02 AM</span> — Smart dispatch algorithm assigned nearest unit (FG-8842).
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Resolution Dialog Modal Overlay */}
        {showResolveDialog && (
          <div className="fixed inset-0 z-60 bg-slate-900/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-slate-200 shadow-2xl space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm">Resolve Emergency Signal</h4>
              <p className="text-xs text-slate-600">
                Please document debrief details before closing this emergency beacon:
              </p>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g. Officer encountered steep terrain, backup assisted, physical condition good."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 h-20 outline-hidden"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResolveDialog(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResolution}
                  className="flex-1 bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Confirm Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
