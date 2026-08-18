import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Eye, 
  Battery, 
  HardDrive, 
  AlertTriangle, 
  ShieldAlert, 
  Plane, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  Play, 
  Maximize2, 
  Sparkles, 
  Zap, 
  Clock, 
  MapPin, 
  Download,
  Filter,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { fieldAudio } from '../utils/audioSynth';
import { fileToBase64 } from '../utils/imageHandler';

export interface CameraTrap {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  batteryPct: number;
  sdUsedGB: number;
  sdTotalGB: number;
  lastTrigger: string;
  status: 'active' | 'alert_detected' | 'low_battery' | 'maintenance';
  captureCount: number;
  recentCaptures: TrapCapture[];
}

export interface TrapCapture {
  id: string;
  trapId: string;
  trapName: string;
  timestamp: string;
  speciesDetected: string;
  confidencePct: number;
  threatLevel: 'normal' | 'caution' | 'critical_poaching';
  detectionBox: { x: number; y: number; w: number; h: number; label: string };
  imagePlaceholderColor: string;
  timeOfDay: 'day' | 'night_ir';
  notes: string;
}

const INITIAL_TRAPS: CameraTrap[] = [
  {
    id: 'CT-01',
    name: 'Camera Trap Alpha (CT-01)',
    location: 'North Ridge Salt Lick • Compartment 14-B',
    lat: 37.7554,
    lng: -119.5582,
    batteryPct: 88,
    sdUsedGB: 14.2,
    sdTotalGB: 64,
    lastTrigger: '14 mins ago',
    status: 'alert_detected',
    captureCount: 342,
    recentCaptures: [
      {
        id: 'CAP-1042',
        trapId: 'CT-01',
        trapName: 'CT-01 North Ridge',
        timestamp: 'Today, 04:18 AM',
        speciesDetected: 'Night Intruder w/ Heavy Tool',
        confidencePct: 94.2,
        threatLevel: 'critical_poaching',
        detectionBox: { x: 35, y: 25, w: 40, h: 55, label: 'SUSPECT [AXE / SAW DETECTED]' },
        imagePlaceholderColor: 'bg-slate-900 border-red-500',
        timeOfDay: 'night_ir',
        notes: 'Unauthorized person carrying cutting tool in core sanctuary buffer at 04:18 AM.'
      },
      {
        id: 'CAP-1039',
        trapId: 'CT-01',
        trapName: 'CT-01 North Ridge',
        timestamp: 'Yesterday, 11:42 PM',
        speciesDetected: 'Royal Bengal Tiger (Male T-42)',
        confidencePct: 98.6,
        threatLevel: 'normal',
        detectionBox: { x: 20, y: 30, w: 60, h: 50, label: 'Panthera tigris [98.6%]' },
        imagePlaceholderColor: 'bg-emerald-950 border-emerald-500',
        timeOfDay: 'night_ir',
        notes: 'Healthy adult male crossing North-West game trail.'
      }
    ]
  },
  {
    id: 'CT-02',
    name: 'Camera Trap Bravo (CT-02)',
    location: 'Waterhole #3 • Leopard Ridge',
    lat: 37.7490,
    lng: -119.5690,
    batteryPct: 74,
    sdUsedGB: 28.5,
    sdTotalGB: 64,
    lastTrigger: '2 hours ago',
    status: 'active',
    captureCount: 819,
    recentCaptures: [
      {
        id: 'CAP-0988',
        trapId: 'CT-02',
        trapName: 'CT-02 Waterhole #3',
        timestamp: 'Today, 06:15 AM',
        speciesDetected: 'Indian Leopard (Female w/ Cub)',
        confidencePct: 96.1,
        threatLevel: 'normal',
        detectionBox: { x: 25, y: 35, w: 50, h: 45, label: 'Panthera pardus [96.1%]' },
        imagePlaceholderColor: 'bg-slate-800 border-amber-500',
        timeOfDay: 'day',
        notes: 'Mother and single sub-adult cub drinking at edge.'
      }
    ]
  },
  {
    id: 'CT-03',
    name: 'Camera Trap Charlie (CT-03)',
    location: 'Valley Elephant Corridor • Beat 2',
    lat: 37.7420,
    lng: -119.5800,
    batteryPct: 22,
    sdUsedGB: 58.1,
    sdTotalGB: 64,
    lastTrigger: 'Yesterday',
    status: 'low_battery',
    captureCount: 1420,
    recentCaptures: [
      {
        id: 'CAP-0891',
        trapId: 'CT-03',
        trapName: 'CT-03 Elephant Pass',
        timestamp: 'Yesterday, 07:30 PM',
        speciesDetected: 'Asian Elephant Herd (6 Individuals)',
        confidencePct: 99.1,
        threatLevel: 'caution',
        detectionBox: { x: 15, y: 20, w: 70, h: 60, label: 'Elephas maximus [99.1%]' },
        imagePlaceholderColor: 'bg-slate-900 border-blue-500',
        timeOfDay: 'night_ir',
        notes: 'Herd moving towards village perimeter agricultural crop fields.'
      }
    ]
  }
];

export const CameraTrapManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'traps' | 'captures' | 'drone'>('traps');
  const [traps, setTraps] = useState<CameraTrap[]>(INITIAL_TRAPS);
  const [selectedCapture, setSelectedCapture] = useState<TrapCapture | null>(null);
  const [filterThreat, setFilterThreat] = useState<'all' | 'critical' | 'wildlife'>('all');
  const [thermalPalette, setThermalPalette] = useState<'ironbow' | 'white_hot' | 'black_hot'>('ironbow');
  const [droneFlying, setDroneFlying] = useState(false);
  const [droneAltitude, setDroneAltitude] = useState(120); // meters
  const [droneThermalTarget, setDroneThermalTarget] = useState<'poacher' | 'wildlife' | 'cold'>('poacher');

  const allCaptures = traps.flatMap(t => t.recentCaptures);
  const filteredCaptures = allCaptures.filter(c => {
    if (filterThreat === 'critical') return c.threatLevel === 'critical_poaching';
    if (filterThreat === 'wildlife') return c.threatLevel !== 'critical_poaching';
    return true;
  });

  const handleSimulateNewTrapTrigger = () => {
    fieldAudio.playSOSAlert();
    const newCap: TrapCapture = {
      id: `CAP-${Date.now().toString().slice(-4)}`,
      trapId: 'CT-01',
      trapName: 'CT-01 North Ridge',
      timestamp: 'Just now (LIVE TRIGGER)',
      speciesDetected: 'Automated Motion Trigger • Review Required',
      confidencePct: 92.4,
      threatLevel: 'critical_poaching',
      detectionBox: { x: 30, y: 30, w: 45, h: 50, label: 'HEAT SIGNATURE DETECTED' },
      imagePlaceholderColor: 'bg-red-950 border-red-500',
      timeOfDay: 'night_ir',
      notes: 'Instant PIR sensor trip logged on air-gapped node.'
    };

    setTraps(prev => prev.map(t => {
      if (t.id === 'CT-01') {
        return {
          ...t,
          status: 'alert_detected',
          lastTrigger: 'Just now',
          captureCount: t.captureCount + 1,
          recentCaptures: [newCap, ...t.recentCaptures]
        };
      }
      return t;
    }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadTrapPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    fieldAudio.playRadioReceive();
    const base64 = await fileToBase64(file);

    const newCap: TrapCapture = {
      id: `CAP-MANUAL-${Date.now().toString().slice(-4)}`,
      trapId: 'CT-01',
      trapName: 'SD Card Dump (Manual Import)',
      timestamp: 'Imported Just Now',
      speciesDetected: 'Imported Field Frame • AI Analyzed',
      confidencePct: 97.8,
      threatLevel: 'normal',
      detectionBox: { x: 25, y: 20, w: 50, h: 60, label: 'SUBJECT DETECTED [97.8% CONF]' },
      imagePlaceholderColor: 'bg-slate-900 border-emerald-500',
      timeOfDay: 'day',
      notes: 'Imported from field camera trap SD card and parsed via on-device Edge AI.'
    };

    setTraps(prev => prev.map(t => {
      if (t.id === 'CT-01') {
        return {
          ...t,
          captureCount: t.captureCount + 1,
          recentCaptures: [newCap, ...t.recentCaptures]
        };
      }
      return t;
    }));

    setSelectedCapture(newCap);
  };

  const handleSwapSDCard = (trapId: string) => {
    fieldAudio.playCheckpointChime();
    setTraps(prev => prev.map(t => {
      if (t.id === trapId) {
        return {
          ...t,
          sdUsedGB: 0.1,
          batteryPct: 100,
          status: 'active'
        };
      }
      return t;
    }));
  };

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-full text-slate-900 pb-24">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-[#0B4619] flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">Camera Trap Grid & Drone Recon</h2>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Autonomous Motion & Thermal Intrusion Array</p>
        </div>
        <button
          type="button"
          onClick={handleSimulateNewTrapTrigger}
          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[10px] font-extrabold font-mono px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Zap className="w-3 h-3 text-red-600 animate-pulse" />
          <span>Simulate PIR</span>
        </button>
      </div>

      {/* Main Tab Pills */}
      <div className="grid grid-cols-3 gap-2 bg-slate-200/70 p-1 rounded-2xl font-mono text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setActiveView('traps');
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeView === 'traps' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-[#0B4619]" />
          <span>Trap Grid ({traps.length})</span>
        </button>
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setActiveView('captures');
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeView === 'captures' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-[#0B4619]" />
          <span>Captures ({allCaptures.length})</span>
        </button>
        <button
          type="button"
          onClick={() => {
            fieldAudio.playRadioChirp();
            setActiveView('drone');
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeView === 'drone' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600'
          }`}
        >
          <Plane className="w-3.5 h-3.5 text-[#0B4619]" />
          <span>Drone IR</span>
        </button>
      </div>

      {/* VIEW 1: TRAP GRID */}
      {activeView === 'traps' && (
        <div className="space-y-3">
          {traps.map(trap => (
            <div key={trap.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">{trap.name}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      trap.status === 'alert_detected' ? 'bg-red-100 text-red-700 animate-pulse' :
                      trap.status === 'low_battery' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {trap.status === 'alert_detected' ? '🚨 PIR INTRUSION ALERT' :
                       trap.status === 'low_battery' ? '⚠️ LOW BATTERY' : 'ARMED & MONITORING'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{trap.location}</p>
                </div>
              </div>

              {/* Hardware Telemetry Grid */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                    <Battery className="w-3 h-3" />
                    <span>Battery</span>
                  </div>
                  <span className={`font-extrabold text-xs ${trap.batteryPct < 30 ? 'text-red-600' : 'text-slate-900'}`}>
                    {trap.batteryPct}%
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                    <HardDrive className="w-3 h-3" />
                    <span>SD Storage</span>
                  </div>
                  <span className="font-extrabold text-xs text-slate-900">
                    {trap.sdUsedGB}/{trap.sdTotalGB} GB
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                    <Clock className="w-3 h-3" />
                    <span>Last Trip</span>
                  </div>
                  <span className="font-extrabold text-xs text-slate-900">
                    {trap.lastTrigger}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <span className="text-[10px] font-mono text-slate-400">
                  {trap.captureCount} frames recorded
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSwapSDCard(trap.id)}
                    className="text-[10px] font-bold text-[#0B4619] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl transition-all cursor-pointer"
                  >
                    Swap SD / Battery
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      fieldAudio.playTap();
                      setSelectedCapture(trap.recentCaptures[0]);
                    }}
                    className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl transition-all cursor-pointer"
                  >
                    View Latest Frame
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: CAPTURES & OFFLINE AI CLASSIFIER */}
      {activeView === 'captures' && (
        <div className="space-y-3">
          {/* Filters & Import Button */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleUploadTrapPhoto}
            className="hidden"
          />

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => setFilterThreat('all')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  filterThreat === 'all' ? 'bg-[#0B4619] text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterThreat('critical')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  filterThreat === 'critical' ? 'bg-red-600 text-white' : 'bg-white border border-slate-200 text-red-700'
                }`}
              >
                Intrusions
              </button>
              <button
                type="button"
                onClick={() => setFilterThreat('wildlife')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  filterThreat === 'wildlife' ? 'bg-emerald-700 text-white' : 'bg-white border border-slate-200 text-emerald-800'
                }`}
              >
                Wildlife
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                fieldAudio.playTap();
                fileInputRef.current?.click();
              }}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#0B4619] border border-emerald-300 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Photo / SD Dump</span>
            </button>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {filteredCaptures.map(cap => (
              <div 
                key={cap.id} 
                onClick={() => {
                  fieldAudio.playTap();
                  setSelectedCapture(cap);
                }}
                className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-2.5"
              >
                {/* Visual Frame Simulation with Bounding Box */}
                <div className={`relative w-full h-36 rounded-2xl overflow-hidden ${cap.imagePlaceholderColor} border-2 flex items-center justify-center p-2`}>
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />

                  {/* Simulated Bounding Box */}
                  <div 
                    style={{
                      left: `${cap.detectionBox.x}%`,
                      top: `${cap.detectionBox.y}%`,
                      width: `${cap.detectionBox.w}%`,
                      height: `${cap.detectionBox.h}%`,
                    }}
                    className={`absolute border-2 ${
                      cap.threatLevel === 'critical_poaching' ? 'border-red-400 bg-red-500/15' : 'border-emerald-400 bg-emerald-500/15'
                    } rounded-md flex flex-col justify-between p-1`}
                  >
                    <span className="text-[8px] font-mono font-black text-white bg-black/80 px-1 py-0.5 rounded w-fit">
                      {cap.detectionBox.label}
                    </span>
                    <span className="text-[7px] font-mono text-white/80 self-end">
                      CONF: {cap.confidencePct}%
                    </span>
                  </div>

                  {/* Top Bar on image */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 font-mono text-[9px] text-white/90 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    <span>{cap.timeOfDay === 'night_ir' ? '🌙 NIGHT IR SENSOR' : '☀️ DAYLIGHT SENSOR'}</span>
                    <span>•</span>
                    <span>{cap.timestamp}</span>
                  </div>

                  <div className="absolute bottom-2 right-2 font-mono text-[9px] text-white bg-black/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>ON-DEVICE AI</span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{cap.speciesDetected}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">{cap.trapName} • {cap.id}</p>
                  </div>
                  <span className={`text-[10px] font-extrabold font-mono px-2.5 py-1 rounded-full ${
                    cap.threatLevel === 'critical_poaching' ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {cap.confidencePct}% MATCH
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: DRONE THERMAL RECON */}
      {activeView === 'drone' && (
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-[#0B4619]" />
              <span className="font-extrabold text-xs uppercase text-slate-900">UAV-04 Sentinel Thermal Feed</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {droneFlying ? 'AIRBORNE • 120m AGL' : 'STANDBY AT LZ-1'}
            </span>
          </div>

          {/* Thermal Viewport */}
          <div className={`relative w-full h-56 rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center ${
            thermalPalette === 'ironbow' ? 'bg-gradient-to-tr from-indigo-950 via-purple-900 to-amber-600' :
            thermalPalette === 'white_hot' ? 'bg-slate-950' : 'bg-slate-100'
          }`}>
            {/* Crosshair HUD */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 border border-white/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute w-full h-px bg-white/15" />
              <div className="absolute h-full w-px bg-white/15" />
            </div>

            {/* Thermal Target simulation */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-amber-400 text-black font-mono font-black text-[9px] px-2 py-1 rounded-md shadow-lg border border-white/50 animate-pulse flex items-center gap-1">
              <Zap className="w-3 h-3 text-red-600 fill-red-600" />
              <span>HOTSPOT: 36.8°C [HUMAN SIGNATURE]</span>
            </div>

            {/* HUD Telemetry Overlay */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-white bg-black/60 px-2 py-1 rounded space-y-0.5">
              <div>ALT: {droneAltitude}m • SPEED: 38 km/h</div>
              <div>COORD: 37.7554° N, 119.5582° W</div>
              <div>GIMBAL PITCH: -45° • FOV: 64°</div>
            </div>

            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-white bg-black/60 px-2 py-1 rounded flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>REC 1080p THERMAL</span>
            </div>
          </div>

          {/* Palette & Flight Controls */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thermal Palette</label>
              <div className="flex gap-1">
                {(['ironbow', 'white_hot', 'black_hot'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      fieldAudio.playTap();
                      setThermalPalette(p);
                    }}
                    className={`flex-1 py-1 text-[10px] font-bold rounded-lg uppercase ${
                      thermalPalette === p ? 'bg-[#0B4619] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {p.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Flight State</label>
              <button
                type="button"
                onClick={() => {
                  fieldAudio.playRadioChirp();
                  setDroneFlying(!droneFlying);
                }}
                className={`w-full py-1 text-[10px] font-bold rounded-lg uppercase cursor-pointer ${
                  droneFlying ? 'bg-amber-600 text-white' : 'bg-[#0B4619] text-white'
                }`}
              >
                {droneFlying ? 'Order RTB (Return to Base)' : 'Launch Grid Recon Flight'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Capture Detail Modal Drawer */}
      <AnimatePresence>
        {selectedCapture && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-3.5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#0B4619]" />
                  <h3 className="font-extrabold text-sm text-slate-900">{selectedCapture.id} Forensic View</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCapture(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Big Photo Preview */}
              <div className={`relative w-full h-44 rounded-2xl overflow-hidden ${selectedCapture.imagePlaceholderColor} border-2 flex items-center justify-center p-2`}>
                <div 
                  style={{
                    left: `${selectedCapture.detectionBox.x}%`,
                    top: `${selectedCapture.detectionBox.y}%`,
                    width: `${selectedCapture.detectionBox.w}%`,
                    height: `${selectedCapture.detectionBox.h}%`,
                  }}
                  className="absolute border-2 border-red-400 bg-red-500/20 rounded flex items-start p-1"
                >
                  <span className="text-[9px] font-mono font-black text-white bg-black/90 px-1 py-0.5 rounded">
                    {selectedCapture.detectionBox.label}
                  </span>
                </div>

                <div className="absolute top-2 left-2 text-[10px] font-mono text-white bg-black/70 px-2 py-0.5 rounded">
                  {selectedCapture.timestamp} • {selectedCapture.trapName}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block font-mono">FORENSIC CLASSIFICATION:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{selectedCapture.speciesDetected}</span>
                  <p className="text-slate-600 text-xs mt-1">{selectedCapture.notes}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px]">AI Neural Confidence:</span>
                    <div className="font-extrabold text-emerald-800 text-sm">{selectedCapture.confidencePct}% Match</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px]">PIR Response Time:</span>
                    <div className="font-extrabold text-slate-800 text-sm">0.18 seconds</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    fieldAudio.playCheckpointChime();
                    setSelectedCapture(null);
                  }}
                  className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  Dispatch Nearest Patrol Unit to Coordinates
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
