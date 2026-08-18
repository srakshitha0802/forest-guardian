import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { TreePine, CheckCircle2, ShieldAlert, Ruler, Droplets, MapPin, Plus, FileText, Camera, Mic, Upload, Trash2 } from 'lucide-react';
import { fieldAudio } from '../utils/audioSynth';
import { useVoiceRecorder } from '../utils/useVoiceRecorder';
import { fileToBase64 } from '../utils/imageHandler';

export interface BeatSurveyRecord {
  id: string;
  type: 'tree_felling' | 'pillar_check' | 'waterhole' | 'fuel_load';
  compartment: string;
  lat: number;
  lng: number;
  details: string;
  timestamp: string;
  status: 'verified' | 'violation_flagged' | 'normal';
  photos?: string[];
  audioTranscript?: string;
}

export const BeatSurveyTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timber' | 'pillar' | 'water'>('timber');
  
  // Timber Form State
  const [species, setSpecies] = useState('Teak (Tectona grandis)');
  const [girthCm, setGirthCm] = useState(140);
  const [compartment, setCompartment] = useState('Compartment 14-B (North Slope)');
  const [stumpStatus, setStumpStatus] = useState<'fresh_felling' | 'old_stump' | 'standing_healthy'>('fresh_felling');
  const [memoSaved, setMemoSaved] = useState(false);

  // Pillar Form State
  const [pillarId, setPillarId] = useState('BP-104');
  const [pillarCondition, setPillarCondition] = useState<'intact' | 'damaged' | 'encroached'>('intact');
  const [pillarNotes, setPillarNotes] = useState('');

  // Waterhole State
  const [waterholeName, setWaterholeName] = useState('Waterhole #3 - Leopard Ridge');
  const [waterLevelPct, setWaterLevelPct] = useState(65);
  const [wildlifeUsage, setWildlifeUsage] = useState('Heavy (Elephant & Deer tracks present)');

  // History
  const [records, setRecords] = useState<BeatSurveyRecord[]>([
    {
      id: 'srv_1',
      type: 'tree_felling',
      compartment: 'Compartment 14-B',
      lat: 37.7554,
      lng: -119.5582,
      details: 'Illicit Felling: Teak (GBH 140cm), Axe marks present. Hammer marked FG-8842.',
      timestamp: 'Today, 08:30 AM',
      status: 'violation_flagged'
    },
    {
      id: 'srv_2',
      type: 'pillar_check',
      compartment: 'Boundary Beat 2',
      lat: 37.7490,
      lng: -119.5690,
      details: 'Boundary Pillar BP-102 inspected. Masonry intact. White paint renewed.',
      timestamp: 'Today, 07:45 AM',
      status: 'verified'
    },
    {
      id: 'srv_3',
      type: 'waterhole',
      compartment: 'Ridge Basin',
      lat: 37.7420,
      lng: -119.5800,
      details: 'Waterhole #2 level at 45%. Silt clearance recommended before monsoon.',
      timestamp: 'Yesterday',
      status: 'normal'
    }
  ]);

  // Media & Voice State
  const [surveyPhotos, setSurveyPhotos] = useState<string[]>([]);
  const voiceRecorder = useVoiceRecorder();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    fieldAudio.playTap();

    const newPhotos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const base64 = await fileToBase64(files[i]);
      newPhotos.push(base64);
    }
    setSurveyPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleSaveTimberMemo = (e: React.FormEvent) => {
    e.preventDefault();
    fieldAudio.playCheckpointChime();

    const newRecord: BeatSurveyRecord = {
      id: `srv_${Date.now()}`,
      type: 'tree_felling',
      compartment,
      lat: 37.7550,
      lng: -119.5600,
      details: `${species} • Girth: ${girthCm}cm • Status: ${stumpStatus.replace('_', ' ').toUpperCase()}`,
      timestamp: 'Just now',
      status: stumpStatus === 'fresh_felling' ? 'violation_flagged' : 'verified',
      photos: surveyPhotos,
      audioTranscript: voiceRecorder.transcript || undefined
    };

    setRecords([newRecord, ...records]);
    setMemoSaved(true);
    setSurveyPhotos([]);
    voiceRecorder.clearRecording();
    setTimeout(() => setMemoSaved(false), 2000);
  };

  const handleSavePillarMemo = (e: React.FormEvent) => {
    e.preventDefault();
    fieldAudio.playCheckpointChime();

    const newRecord: BeatSurveyRecord = {
      id: `srv_p_${Date.now()}`,
      type: 'pillar_check',
      compartment: `Boundary Segment • ${pillarId}`,
      lat: 37.7490,
      lng: -119.5690,
      details: `Pillar ${pillarId}: ${pillarCondition.toUpperCase()} • ${pillarNotes || 'No notes'}`,
      timestamp: 'Just now',
      status: pillarCondition === 'encroached' ? 'violation_flagged' : 'verified',
      photos: surveyPhotos,
      audioTranscript: voiceRecorder.transcript || undefined
    };

    setRecords([newRecord, ...records]);
    setMemoSaved(true);
    setSurveyPhotos([]);
    voiceRecorder.clearRecording();
    setTimeout(() => setMemoSaved(false), 2000);
  };

  const handleSaveWaterholeMemo = (e: React.FormEvent) => {
    e.preventDefault();
    fieldAudio.playCheckpointChime();

    const newRecord: BeatSurveyRecord = {
      id: `srv_w_${Date.now()}`,
      type: 'waterhole',
      compartment: waterholeName,
      lat: 37.7420,
      lng: -119.5800,
      details: `Level: ${waterLevelPct}% • Activity: ${wildlifeUsage}`,
      timestamp: 'Just now',
      status: waterLevelPct < 20 ? 'violation_flagged' : 'normal',
      photos: surveyPhotos,
      audioTranscript: voiceRecorder.transcript || undefined
    };

    setRecords([newRecord, ...records]);
    setMemoSaved(true);
    setSurveyPhotos([]);
    voiceRecorder.clearRecording();
    setTimeout(() => setMemoSaved(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-full text-slate-900 pb-24">
      {/* Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-[#0B4619] flex items-center justify-center font-bold">
              <TreePine className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">Compartment & Timber Audit Tool</h2>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Official Forestry Beat Survey & Seizure Memo</p>
        </div>
        <span className="text-[10px] font-extrabold font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
          BEAT #4
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-200/70 p-1 rounded-2xl font-mono text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setActiveTab('timber');
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'timber' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Timber Log
        </button>
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setActiveTab('pillar');
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pillar' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pillars
        </button>
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setActiveTab('water');
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'water' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Waterholes
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Forms based on Active Tab */}
      {activeTab === 'timber' && (
        <form onSubmit={handleSaveTimberMemo} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold uppercase text-slate-900 flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-[#0B4619]" />
              <span>Tree Girth & Felling Seizure Form</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              GPS AUTO-TAGGED
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Tree Species</label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-[#0B4619]"
            >
              <option value="Teak (Tectona grandis)">Teak (Tectona grandis) - Grade I</option>
              <option value="Red Sandalwood (Pterocarpus santalinus)">Red Sandalwood - Scheduled I</option>
              <option value="Rosewood (Dalbergia latifolia)">Rosewood (Dalbergia latifolia)</option>
              <option value="Sal (Shorea robusta)">Sal (Shorea robusta)</option>
              <option value="Giant Pine / Cedar">Giant Pine / Cedar</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Girth at Breast Height (cm)</label>
              <input
                type="number"
                value={girthCm}
                onChange={(e) => setGirthCm(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#0B4619]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Condition / Finding</label>
              <select
                value={stumpStatus}
                onChange={(e) => setStumpStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-[#0B4619]"
              >
                <option value="fresh_felling">Fresh Illicit Felling (Violation)</option>
                <option value="old_stump">Old Weathered Stump</option>
                <option value="standing_healthy">Standing Healthy Tree (Sample)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Forest Compartment / Beat</label>
            <input
              type="text"
              value={compartment}
              onChange={(e) => setCompartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-[#0B4619]"
            />
          </div>

          {/* Photo & Audio Bar */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#0B4619]" />
              <span>{surveyPhotos.length > 0 ? `${surveyPhotos.length} Photo(s)` : 'Tree Photo'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (voiceRecorder.isRecording) voiceRecorder.stopRecording();
                else voiceRecorder.startRecording();
              }}
              className={`border text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                voiceRecorder.isRecording ? 'bg-red-50 border-red-300 text-red-700 animate-pulse' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-amber-800'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-amber-600" />
              <span>{voiceRecorder.isRecording ? `${voiceRecorder.recordingDuration}s...` : voiceRecorder.transcript ? 'Audio Note' : 'Voice Memo'}</span>
            </button>
          </div>

          {surveyPhotos.length > 0 && (
            <div className="flex gap-2">
              {surveyPhotos.map((p, i) => (
                <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                  <img src={p} alt="Tree" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setSurveyPhotos(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
          >
            <FileText className="w-4 h-4" />
            <span>{memoSaved ? 'Timber Seizure Recorded!' : 'Generate On-Device Timber Memo'}</span>
          </button>
        </form>
      )}

      {activeTab === 'pillar' && (
        <form onSubmit={handleSavePillarMemo} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold uppercase text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0B4619]" />
              <span>Boundary Pillar Verification</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              CADASTRE BEAT #4
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Pillar ID</label>
              <input
                type="text"
                value={pillarId}
                onChange={(e) => setPillarId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Condition</label>
              <select
                value={pillarCondition}
                onChange={(e) => setPillarCondition(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
              >
                <option value="intact">Intact & Painted</option>
                <option value="damaged">Damaged / Weathered</option>
                <option value="encroached">Encroached / Tampered</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Inspection Notes</label>
            <input
              type="text"
              value={pillarNotes}
              onChange={(e) => setPillarNotes(e.target.value)}
              placeholder="e.g. Masonry intact, repainted top white"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
            />
          </div>

          {/* Photo & Audio */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#0B4619]" />
              <span>{surveyPhotos.length > 0 ? `${surveyPhotos.length} Photo(s)` : 'Pillar Photo'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (voiceRecorder.isRecording) voiceRecorder.stopRecording();
                else voiceRecorder.startRecording();
              }}
              className={`border text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                voiceRecorder.isRecording ? 'bg-red-50 border-red-300 text-red-700 animate-pulse' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-amber-800'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-amber-600" />
              <span>{voiceRecorder.isRecording ? `${voiceRecorder.recordingDuration}s...` : voiceRecorder.transcript ? 'Audio Note' : 'Voice Memo'}</span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{memoSaved ? 'Boundary Check Saved!' : 'Log Boundary Verification'}</span>
          </button>
        </form>
      )}

      {activeTab === 'water' && (
        <form onSubmit={handleSaveWaterholeMemo} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold uppercase text-slate-900 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>Waterhole Census & Hydrology</span>
            </span>
            <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold">
              SUMMER DROUGHT MONITOR
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Waterhole Name / Location</label>
            <input
              type="text"
              value={waterholeName}
              onChange={(e) => setWaterholeName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Water Level ({waterLevelPct}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={waterLevelPct}
                onChange={(e) => setWaterLevelPct(Number(e.target.value))}
                className="w-full accent-[#0B4619] mt-2"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Wildlife Activity</label>
              <input
                type="text"
                value={wildlifeUsage}
                onChange={(e) => setWildlifeUsage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Photo & Audio */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#0B4619]" />
              <span>{surveyPhotos.length > 0 ? `${surveyPhotos.length} Photo(s)` : 'Waterhole Photo'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (voiceRecorder.isRecording) voiceRecorder.stopRecording();
                else voiceRecorder.startRecording();
              }}
              className={`border text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                voiceRecorder.isRecording ? 'bg-red-50 border-red-300 text-red-700 animate-pulse' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-amber-800'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-amber-600" />
              <span>{voiceRecorder.isRecording ? `${voiceRecorder.recordingDuration}s...` : voiceRecorder.transcript ? 'Audio Note' : 'Voice Memo'}</span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
          >
            <Droplets className="w-4 h-4" />
            <span>{memoSaved ? 'Waterhole Status Logged!' : 'Record Waterhole Audit'}</span>
          </button>
        </form>
      )}

      {/* History Feed */}
      <div className="space-y-2">
        <span className="text-[11px] font-extrabold uppercase text-slate-500 px-1 block">
          Recent On-Device Beat Records ({records.length})
        </span>

        {records.map(rec => (
          <div key={rec.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-900">{rec.compartment}</span>
              <span className="text-[10px] font-mono text-slate-400">{rec.timestamp}</span>
            </div>
            <p className="text-xs text-slate-700 font-sans">{rec.details}</p>

            {rec.audioTranscript && (
              <p className="text-[10px] font-mono bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-slate-600 italic">
                🎤 Voice Note: "{rec.audioTranscript}"
              </p>
            )}

            {rec.photos && rec.photos.length > 0 && (
              <div className="flex gap-1.5 pt-1">
                {rec.photos.map((ph, idx) => (
                  <div key={idx} className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200">
                    <img src={ph} alt="Record" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
              <span className="text-slate-400">📍 {rec.lat.toFixed(4)}, {rec.lng.toFixed(4)}</span>
              <span className={`font-bold px-2 py-0.5 rounded-full ${
                rec.status === 'violation_flagged' ? 'bg-red-100 text-red-700 border border-red-200' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {rec.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
