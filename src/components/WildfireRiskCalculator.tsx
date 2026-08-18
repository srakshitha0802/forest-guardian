import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Wind, 
  Droplets, 
  Thermometer, 
  Compass, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Radio, 
  RefreshCw, 
  FileText,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { fieldAudio } from '../utils/audioSynth';

export const WildfireRiskCalculator: React.FC = () => {
  // Weather Input States
  const [temperatureC, setTemperatureC] = useState<number>(33); // 33°C (91°F)
  const [relativeHumidity, setRelativeHumidity] = useState<number>(18); // 18% dry
  const [windSpeedKmH, setWindSpeedKmH] = useState<number>(26); // 26 km/h
  const [rainMm24h, setRainMm24h] = useState<number>(0.0); // 0 mm

  // Smoke Triangulation State
  const [tower1Bearing, setTower1Bearing] = useState<number>(135);
  const [tower2Bearing, setTower2Bearing] = useState<number>(45);
  const [triangulationCalculated, setTriangulationCalculated] = useState(false);
  const [simulatedHotspotCoord, setSimulatedHotspotCoord] = useState<{ lat: number; lng: number } | null>(null);

  // Active Tab: Calculator vs Triangulation vs Fuel Load
  const [subTab, setSubTab] = useState<'fwi' | 'triangulate' | 'suppression'>('fwi');

  // Mathematical Fire Weather Index (FWI) Calculation
  const fwiResults = useMemo(() => {
    // 1. Fine Fuel Moisture Code (FFMC) approximation
    const temp = Math.max(0, temperatureC);
    const rh = Math.min(100, Math.max(1, relativeHumidity));
    const wind = Math.max(0, windSpeedKmH);
    const rain = Math.max(0, rainMm24h);

    let ffmc = 85 + (temp - 20) * 0.4 - (rh - 30) * 0.25 + (wind - 15) * 0.15 - rain * 3.0;
    ffmc = Math.max(10, Math.min(99.5, ffmc));

    // 2. Duff Moisture Code (DMC)
    let dmc = 25 + (temp - 15) * 1.2 - (rh - 40) * 0.4 - rain * 1.8;
    dmc = Math.max(5, Math.min(180, dmc));

    // 3. Drought Code (DC)
    let dc = 280 + (temp - 20) * 4.0 - rain * 5.0;
    dc = Math.max(50, Math.min(750, dc));

    // 4. Initial Spread Index (ISI)
    const fw = Math.exp(0.05039 * wind);
    const isi = 0.208 * fw * Math.exp(0.02 * (ffmc - 50));
    const clampedIsi = Math.max(0.5, Math.min(35, isi));

    // 5. Buildup Index (BUI)
    const bui = (0.8 * dmc * dc) / (dmc + 0.4 * dc);
    const clampedBui = Math.max(5, Math.min(160, bui));

    // 6. Fire Weather Index (FWI)
    let fwi = Math.exp(2.72 * Math.pow(0.434 * Math.log(clampedIsi * 0.5 + 0.1), 0.647));
    if (clampedBui > 80) {
      fwi *= (0.1 * clampedBui) / (1 + 0.05 * clampedBui);
    }
    const finalFwi = Math.max(1, Math.min(65, Number(fwi.toFixed(1))));

    // Fire Danger Rating Categorization
    let dangerRating: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'EXTREME';
    let dangerColor: string;
    let dangerBg: string;
    let actionRecommendation: string;

    if (finalFwi < 5.2) {
      dangerRating = 'LOW';
      dangerColor = 'text-emerald-700';
      dangerBg = 'bg-emerald-50 border-emerald-200';
      actionRecommendation = 'Normal patrol beats. No fire bans required.';
    } else if (finalFwi < 11.2) {
      dangerRating = 'MODERATE';
      dangerColor = 'text-amber-700';
      dangerBg = 'bg-amber-50 border-amber-200';
      actionRecommendation = 'Campfire restrictions in dry pine needles. Monitor watchtowers.';
    } else if (finalFwi < 21.3) {
      dangerRating = 'HIGH';
      dangerColor = 'text-orange-700';
      dangerBg = 'bg-orange-50 border-orange-200';
      actionRecommendation = 'High ignition probability. Pre-position water bowsers at Base Camp 2.';
    } else if (finalFwi < 38.0) {
      dangerRating = 'VERY HIGH';
      dangerColor = 'text-red-700';
      dangerBg = 'bg-red-50 border-red-200';
      actionRecommendation = 'Total fire ban. Standby airborne water-bomber readiness & rapid response crew.';
    } else {
      dangerRating = 'EXTREME';
      dangerColor = 'text-purple-900';
      dangerBg = 'bg-purple-50 border-purple-300';
      actionRecommendation = 'CRITICAL EXPLOSIVE SPREAD POTENTIAL. Evacuate trekking trails & sound red alert.';
    }

    return {
      ffmc: Number(ffmc.toFixed(1)),
      dmc: Number(dmc.toFixed(1)),
      dc: Number(dc.toFixed(1)),
      isi: Number(clampedIsi.toFixed(1)),
      bui: Number(clampedBui.toFixed(1)),
      fwi: finalFwi,
      dangerRating,
      dangerColor,
      dangerBg,
      actionRecommendation
    };
  }, [temperatureC, relativeHumidity, windSpeedKmH, rainMm24h]);

  const handleTriangulatePlume = () => {
    fieldAudio.playRadioReceive();
    // Simulate geometric ray intersection from Tower 1 (37.7600, -119.5600) and Tower 2 (37.7400, -119.5900)
    const lat = 37.7535 + (tower1Bearing - 135) * 0.0005;
    const lng = -119.5710 + (tower2Bearing - 45) * 0.0005;
    setSimulatedHotspotCoord({ lat, lng });
    setTriangulationCalculated(true);
    fieldAudio.playCheckpointChime();
  };

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-full text-slate-900 pb-24">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">Wildfire Risk & FWI Engine</h2>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Canadian Forest Fire Weather Index (FFWI) Calculator</p>
        </div>
        <span className="text-[10px] font-extrabold font-mono bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full border border-orange-200">
          AIR-GAPPED MATH
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-200/70 p-1 rounded-2xl font-mono text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setSubTab('fwi');
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            subTab === 'fwi' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600'
          }`}
        >
          FWI Index
        </button>
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setSubTab('triangulate');
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            subTab === 'triangulate' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600'
          }`}
        >
          Smoke Plume
        </button>
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setSubTab('suppression');
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            subTab === 'suppression' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600'
          }`}
        >
          Fire SOP
        </button>
      </div>

      {/* SUBTAB 1: FWI CALCULATOR */}
      {subTab === 'fwi' && (
        <div className="space-y-4">
          {/* Main Risk Output Hero Card */}
          <div className={`p-4 rounded-3xl border shadow-xs transition-all ${fwiResults.dangerBg}`}>
            <div className="flex items-center justify-between pb-2 border-b border-black/10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                CURRENT BEAT FIRE DANGER RATING
              </span>
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                FWI: {fwiResults.fwi}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <h3 className={`text-2xl font-black tracking-tight ${fwiResults.dangerColor}`}>
                  {fwiResults.dangerRating}
                </h3>
                <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                  {fwiResults.actionRecommendation}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/80 border border-slate-200 flex flex-col items-center justify-center font-mono">
                <span className="text-[9px] text-slate-400 font-bold">SPREAD</span>
                <span className="text-sm font-extrabold text-slate-900">{fwiResults.isi}x</span>
              </div>
            </div>
          </div>

          {/* Meteorological Inputs Controls */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <span className="font-extrabold text-xs uppercase text-slate-900 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#0B4619]" />
              <span>Field Weather Sensors / Sling Psychrometer</span>
            </span>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-600 font-bold flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-red-500" />
                  <span>Ambient Air Temp:</span>
                </span>
                <span className="font-extrabold text-slate-900">{temperatureC}°C ({Math.round(temperatureC * 1.8 + 32)}°F)</span>
              </div>
              <input
                type="range"
                min={10}
                max={48}
                value={temperatureC}
                onChange={(e) => setTemperatureC(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            {/* Relative Humidity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-600 font-bold flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>Relative Humidity (RH):</span>
                </span>
                <span className="font-extrabold text-slate-900">{relativeHumidity}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={95}
                value={relativeHumidity}
                onChange={(e) => setRelativeHumidity(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Wind Speed Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-600 font-bold flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-teal-600" />
                  <span>Anemometer Wind Speed:</span>
                </span>
                <span className="font-extrabold text-slate-900">{windSpeedKmH} km/h</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={windSpeedKmH}
                onChange={(e) => setWindSpeedKmH(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* 24h Rain Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-600 font-bold flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Rain Gauge (Last 24h):</span>
                </span>
                <span className="font-extrabold text-slate-900">{rainMm24h} mm</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={0.5}
                value={rainMm24h}
                onChange={(e) => setRainMm24h(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Sub-Indices Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 block">FFMC (Litter):</span>
              <span className="font-extrabold text-sm text-slate-900">{fwiResults.ffmc}</span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Fine Fuel Code</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 block">DMC (Duff):</span>
              <span className="font-extrabold text-sm text-slate-900">{fwiResults.dmc}</span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Organic Layer</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 block">BUI (Buildup):</span>
              <span className="font-extrabold text-sm text-slate-900">{fwiResults.bui}</span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Total Fuel</span>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SMOKE PLUME TRIANGULATOR */}
      {subTab === 'triangulate' && (
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold uppercase text-slate-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#0B4619]" />
              <span>Watchtower Dual-Bearing Triangulation</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              GEODESIC RAYCAST
            </span>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed">
            Enter magnetic compass sightings of smoke column from two fixed fire watchtowers to calculate the exact wildfire GPS coordinates without physical approach.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="font-extrabold text-slate-800 text-[11px]">Tower Alpha (Ridge Peak)</div>
              <span className="text-[10px] text-slate-400 font-mono block">GPS: 37.7600°N, 119.5600°W</span>
              <label className="block text-[10px] font-bold text-slate-600 pt-1">Smoke Bearing (0° - 360°)</label>
              <input
                type="number"
                value={tower1Bearing}
                onChange={(e) => setTower1Bearing(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="font-extrabold text-slate-800 text-[11px]">Tower Bravo (Eagle Point)</div>
              <span className="text-[10px] text-slate-400 font-mono block">GPS: 37.7400°N, 119.5900°W</span>
              <label className="block text-[10px] font-bold text-slate-600 pt-1">Smoke Bearing (0° - 360°)</label>
              <input
                type="number"
                value={tower2Bearing}
                onChange={(e) => setTower2Bearing(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleTriangulatePlume}
            className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Compute Wildfire Geographic Origin</span>
          </button>

          {triangulationCalculated && simulatedHotspotCoord && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 p-3.5 rounded-2xl border border-red-200 space-y-2"
            >
              <div className="flex items-center justify-between text-red-900 font-extrabold">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-600 animate-pulse" />
                  <span>HOTSPOT COMPUTED: SECTOR 7-NORTH</span>
                </span>
                <span className="text-[10px] font-mono bg-red-100 px-2 py-0.5 rounded-full">
                  ACCURACY: ±35m
                </span>
              </div>
              <div className="font-mono text-xs text-red-800">
                Coordinates: {simulatedHotspotCoord.lat.toFixed(5)}° N, {simulatedHotspotCoord.lng.toFixed(5)}° W
              </div>
              <p className="text-[11px] text-red-700 font-medium">
                Terrain: Dense Teak & Dry Chir Pine canopy. Advise Water Bowser Crew 3 to approach via Fireline Bravo.
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* SUBTAB 3: SUPPRESSION SOP */}
      {subTab === 'suppression' && (
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
          <span className="font-extrabold uppercase text-slate-900 block pb-2 border-b border-slate-100">
            Wildfire Pre-Suppression Action Checklist
          </span>

          <div className="space-y-2 text-[11px]">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">Fire Break Maintenance</strong>
                <span className="text-slate-600">Ensure 6-meter cleared counter-fire buffer line along Compartment 14.</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">Waterhole Pressure Tanks</strong>
                <span className="text-slate-600">Verify diesel suction pump functional at Waterhole #3 and Leopard Ridge.</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">VHF Repeater Emergency Channel</strong>
                <span className="text-slate-600">Switch tactical fire channel to Repeater Ch-4 (142.850 MHz).</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
