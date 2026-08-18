import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Sun, 
  Moon, 
  Volume2, 
  Flashlight, 
  Navigation, 
  MapPin, 
  Mountain, 
  Radio, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Maximize2,
  Copy,
  Check
} from 'lucide-react';
import { fieldAudio } from '../utils/audioSynth';

export const TacticalCompassHUD: React.FC = () => {
  const [heading, setHeading] = useState<number>(42); // 42° NNE
  const [altitude, setAltitude] = useState<number>(450); // 450 meters
  const [declination, setDeclination] = useState<number>(1.4); // 1.4° E
  const [copiedCoord, setCopiedCoord] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [isDeterrentActive, setIsDeterrentActive] = useState(false);
  const [isMorseActive, setIsMorseActive] = useState(false);

  // Smooth heading simulation if sensor not available
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && !isNaN(e.alpha)) {
        setHeading(Math.round(e.alpha));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const getCardinal = (deg: number) => {
    const normalized = (deg % 360 + 360) % 360;
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(normalized / 22.5) % 16;
    return directions[index];
  };

  const handleCopyCoords = () => {
    fieldAudio.playTap();
    navigator.clipboard.writeText('37.7554° N, 119.5582° W (UTM 11S 271890 4181920)');
    setCopiedCoord(true);
    setTimeout(() => setCopiedCoord(false), 2000);
  };

  const handleTriggerAnimalDeterrent = () => {
    setIsDeterrentActive(true);
    fieldAudio.playAnimalDeterrent();
    setTimeout(() => setIsDeterrentActive(false), 1500);
  };

  const handleTriggerMorse = () => {
    setIsMorseActive(true);
    fieldAudio.playMorseDistress();
    setTimeout(() => setIsMorseActive(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-full text-slate-900 pb-24">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-[#0B4619] flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">Tactical Dead Reckoning & Compass HUD</h2>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Astronomical Azimuth & Multi-Grid Navigation</p>
        </div>
        <span className="text-[10px] font-extrabold font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
          GPS ACCURACY ±3m
        </span>
      </div>

      {/* Main Compass Rose Viewport */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0B4619_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Heading Digital readout */}
        <div className="text-center z-10">
          <div className="text-4xl font-black tracking-tight text-slate-900 font-mono">
            {heading.toString().padStart(3, '0')}° <span className="text-[#0B4619]">{getCardinal(heading)}</span>
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
            MAG VAR: +{declination}° E • TRUE NORTH: {((heading + declination) % 360).toFixed(1)}°
          </p>
        </div>

        {/* Compass Dial Rotating Graphic */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Static Top Target Pointer */}
          <div className="absolute -top-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-[#0B4619] z-20" />

          {/* Rotating Compass Ring */}
          <motion.div
            animate={{ rotate: -heading }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="w-full h-full rounded-full border-4 border-slate-100 bg-slate-50/50 shadow-inner flex items-center justify-center relative select-none cursor-grab active:cursor-grabbing"
          >
            {/* Cardinal Markers */}
            <span className="absolute top-2 font-black text-red-600 font-mono text-sm">N</span>
            <span className="absolute bottom-2 font-extrabold text-slate-800 font-mono text-xs">S</span>
            <span className="absolute right-2 font-extrabold text-slate-800 font-mono text-xs">E</span>
            <span className="absolute left-2 font-extrabold text-slate-800 font-mono text-xs">W</span>

            {/* Sub-cardinals */}
            <span className="absolute top-8 right-8 text-[9px] font-mono font-bold text-slate-400">NE</span>
            <span className="absolute bottom-8 right-8 text-[9px] font-mono font-bold text-slate-400">SE</span>
            <span className="absolute bottom-8 left-8 text-[9px] font-mono font-bold text-slate-400">SW</span>
            <span className="absolute top-8 left-8 text-[9px] font-mono font-bold text-slate-400">NW</span>

            {/* Crosshair Lines */}
            <div className="absolute w-full h-px bg-slate-200" />
            <div className="absolute h-full w-px bg-slate-200" />

            {/* Center Dial Hub */}
            <div className="w-8 h-8 rounded-full bg-white border border-slate-300 shadow-sm flex items-center justify-center z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0B4619]" />
            </div>
          </motion.div>
        </div>

        {/* Manual Bearing Slider for Simulator testing */}
        <div className="w-full max-w-xs flex items-center gap-2 pt-2 z-10">
          <span className="text-[10px] font-mono text-slate-400 font-bold">ROTATE:</span>
          <input
            type="range"
            min={0}
            max={359}
            value={heading}
            onChange={(e) => setHeading(Number(e.target.value))}
            className="w-full accent-[#0B4619] cursor-pointer"
          />
        </div>
      </div>

      {/* Multi-Grid Coordinates & Elevation */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="font-extrabold text-xs uppercase text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#0B4619]" />
            <span>Multi-Grid Coordinate Formats</span>
          </span>
          <button
            type="button"
            onClick={handleCopyCoords}
            className="text-[10px] font-mono font-bold text-[#0B4619] bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copiedCoord ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copiedCoord ? 'Copied' : 'Copy All'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">WGS84 Lat / Long (DD):</span>
            <span className="font-extrabold text-slate-900 text-[11px]">37.7554° N, 119.5582° W</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">UTM Zone Grid:</span>
            <span className="font-extrabold text-slate-900 text-[11px]">11S 271890m E, 4181920m N</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">MGRS Tactical:</span>
            <span className="font-extrabold text-slate-900 text-[11px]">11SKU 71890 81920</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">Elevation (Barometric):</span>
            <span className="font-extrabold text-slate-900 text-[11px]">{altitude}m ({Math.round(altitude * 3.28084)} ft)</span>
          </div>
        </div>
      </div>

      {/* Solar Azimuth & Astronomical Guide */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="font-extrabold uppercase text-slate-900 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Solar Ephemeris & Daylight Tracker</span>
          </span>
          <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">
            SUNSET 19:42
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">Sun Azimuth:</span>
            <span className="font-bold text-slate-800">118° ESE</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">Solar Elevation:</span>
            <span className="font-bold text-slate-800">+48°</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">Golden Hour:</span>
            <span className="font-bold text-amber-700">18:45</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-200/60 leading-relaxed font-sans">
          💡 <strong>Wilderness Shadow-Stick Method:</strong> Place a 1m vertical stick in ground. The line connecting the first shadow tip to the second shadow tip 15 minutes later gives exact West-to-East baseline.
        </p>
      </div>

      {/* Tactical Wilderness Sound & Light Tools */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <span className="font-extrabold text-xs uppercase text-slate-900 block pb-1 border-b border-slate-100">
          Tactical Wilderness Tools
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={handleTriggerAnimalDeterrent}
            className={`p-3 rounded-2xl border font-bold flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
              isDeterrentActive ? 'bg-amber-600 text-white border-amber-700 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Volume2 className="w-5 h-5 text-amber-600" />
            <span className="text-xs">Animal Deterrent</span>
            <span className="text-[9px] font-mono text-slate-500">3.8 kHz Sonic Siren</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerMorse}
            className={`p-3 rounded-2xl border font-bold flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
              isMorseActive ? 'bg-red-600 text-white border-red-700 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Radio className="w-5 h-5 text-red-600" />
            <span className="text-xs">Morse SOS Tone</span>
            <span className="text-[9px] font-mono text-slate-500">... --- ... Beacon</span>
          </button>
        </div>
      </div>
    </div>
  );
};
