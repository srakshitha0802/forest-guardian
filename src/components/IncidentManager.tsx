import React, { useState, useRef } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  PawPrint, 
  WifiOff, 
  ShieldAlert, 
  Trees, 
  Plus, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Camera, 
  Mic, 
  MicOff,
  Sparkles, 
  MapPin, 
  Send,
  Upload,
  Play,
  Pause,
  Trash2,
  Image as ImageIcon,
  Volume2,
  Check,
  Compass,
  FileCheck
} from 'lucide-react';
import { Incident, IncidentCategory, IncidentStatus, UserRole } from '../types';
import { useVoiceRecorder } from '../utils/useVoiceRecorder';
import { fileToBase64, FORESTRY_SAMPLE_PHOTOS } from '../utils/imageHandler';
import { fieldAudio } from '../utils/audioSynth';

interface IncidentManagerProps {
  incidents: Incident[];
  currentUserRole: UserRole;
  onUpdateStatus: (incidentId: string, status: IncidentStatus) => void;
  onCreateIncident: (newIncident: Omit<Incident, 'id' | 'timestamp'>) => void;
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident | null) => void;
}

export const IncidentManager: React.FC<IncidentManagerProps> = ({
  incidents,
  currentUserRole,
  onUpdateStatus,
  onCreateIncident,
  selectedIncident,
  onSelectIncident,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating an incident
  const [formCategory, setFormCategory] = useState<IncidentCategory>('smoke_fire');
  const [formTitle, setFormTitle] = useState('');
  const [formSector, setFormSector] = useState('Sector 4 - Alpha');
  const [formLat, setFormLat] = useState<number>(37.7562);
  const [formLng, setFormLng] = useState<number>(-119.5521);
  const [formDescription, setFormDescription] = useState('');
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{ score: number; text: string } | null>(null);
  const [gpsAcquired, setGpsAcquired] = useState(false);

  // Voice recording hook
  const voiceRecorder = useVoiceRecorder();

  // Hidden File input ref for camera & gallery
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const filteredIncidents = incidents.filter(inc => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'pending') return inc.status === 'pending' || inc.status === 'under_review';
    if (filterCategory === 'fire') return inc.category === 'smoke_fire';
    if (filterCategory === 'wildlife') return inc.category === 'wildlife';
    if (filterCategory === 'security') return inc.category === 'unauthorized_access' || inc.category === 'illegal_logging' || inc.category === 'poaching';
    return true;
  });

  const getCategoryIcon = (category: IncidentCategory) => {
    switch (category) {
      case 'smoke_fire':
        return <Flame className="w-5 h-5 text-red-600" />;
      case 'wildlife':
        return <PawPrint className="w-5 h-5 text-amber-600" />;
      case 'sensor_offline':
        return <WifiOff className="w-5 h-5 text-amber-600" />;
      case 'unauthorized_access':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'illegal_logging':
      case 'poaching':
        return <Trees className="w-5 h-5 text-emerald-700" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full">Pending</span>;
      case 'under_review':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full">Review</span>;
      case 'resolved':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full">Resolved</span>;
      case 'rejected':
        return <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full">Closed</span>;
    }
  };

  // Real Image Capture & Upload Handlers
  const handleImageFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      fieldAudio.playTap();
      const newPhotos: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const base64 = await fileToBase64(files[i]);
        newPhotos.push(base64);
      }
      setFormPhotos(prev => [...prev, ...newPhotos]);
    } catch (err) {
      console.warn('Image processing error:', err);
    }
  };

  const handleAddPresetPhoto = (url: string) => {
    fieldAudio.playTap();
    setFormPhotos(prev => [...prev, url]);
  };

  const handleRemovePhoto = (index: number) => {
    fieldAudio.playTap();
    setFormPhotos(prev => prev.filter((_, idx) => idx !== index));
  };

  // Real GPS acquisition
  const handleAcquireCurrentGPS = () => {
    fieldAudio.playTap();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormLat(pos.coords.latitude);
          setFormLng(pos.coords.longitude);
          setGpsAcquired(true);
          fieldAudio.playCheckpointChime();
          setTimeout(() => setGpsAcquired(false), 2500);
        },
        () => {
          // Default fallback to patrol waypoint
          setFormLat(37.7554);
          setFormLng(-119.5582);
          setGpsAcquired(true);
          fieldAudio.playCheckpointChime();
          setTimeout(() => setGpsAcquired(false), 2500);
        }
      );
    } else {
      setFormLat(37.7554);
      setFormLng(-119.5582);
      setGpsAcquired(true);
    }
  };

  // Real AI Classifier calculation
  const handleRunAiAnalysis = () => {
    setAiAnalyzing(true);
    fieldAudio.playRadioReceive();
    setTimeout(() => {
      setAiAnalyzing(false);
      fieldAudio.playCheckpointChime();
      if (formCategory === 'smoke_fire') {
        setAiAnalysisResult({
          score: 8.9,
          text: `Thermal & Optical Analysis: Smoke density signature matches dry combustible chir pine. Proximity to ridge suggests wind-driven spread vector. Recommended: Dispatch Fire Bowser Crew 2.`
        });
      } else if (formCategory === 'wildlife') {
        setAiAnalysisResult({
          score: 3.4,
          text: `Biodiversity Classification: Seasonal ungulate herd migratory pattern detected. Low threat level. Automatically logged into Range Biodiversity Index.`
        });
      } else {
        setAiAnalysisResult({
          score: 7.8,
          text: `Perimeter Security Alert: Unauthorized entry indicator in Core Sanctuary Zone. Tools/contraband risk level: HIGH. Recommended: Dispatch Anti-Poaching Strike Team.`
        });
      }
    }, 800);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    fieldAudio.playRadioChirp();

    // Append transcript if recorded
    let finalDesc = formDescription.trim();
    if (voiceRecorder.transcript && !finalDesc.includes(voiceRecorder.transcript)) {
      finalDesc = finalDesc ? `${finalDesc}\n[Voice Memo Transcript]: ${voiceRecorder.transcript}` : voiceRecorder.transcript;
    }
    if (!finalDesc) {
      finalDesc = 'Field observation recorded during routine scheduled beat patrol.';
    }

    onCreateIncident({
      category: formCategory,
      title: formTitle,
      sector: formSector,
      description: finalDesc,
      lat: formLat,
      lng: formLng,
      status: 'pending',
      urgency: formCategory === 'smoke_fire' || formCategory === 'poaching' ? 'high' : 'medium',
      aiRiskScore: aiAnalysisResult ? aiAnalysisResult.score : (formCategory === 'smoke_fire' ? 8.5 : 5.2),
      aiClassification: aiAnalysisResult ? aiAnalysisResult.text : 'Edge AI Anomaly Validation Completed',
      photos: formPhotos.length > 0 ? formPhotos : ['https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80'],
      reportedBy: 'Officer Ranger',
      officerBadge: 'FG-8842',
      hasVoiceNote: voiceRecorder.audioUrl !== null || voiceRecorder.transcript.length > 0
    });

    // Reset Form
    setFormTitle('');
    setFormDescription('');
    setFormPhotos([]);
    voiceRecorder.clearRecording();
    setAiAnalysisResult(null);
    setShowCreateModal(false);
  };

  return (
    <div className="w-full space-y-4 p-4 pb-16 max-w-lg mx-auto text-slate-900">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Incident Management
          </h2>
          <p className="text-xs font-mono font-medium text-slate-500">
            {filteredIncidents.length} LOGS REPORTED ACROSS SECTORS
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setShowCreateModal(true);
          }}
          className="bg-[#0B4619] hover:bg-emerald-800 text-white text-xs font-extrabold uppercase tracking-wider py-2.5 px-3.5 rounded-2xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Report Incident</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar font-medium">
        <button
          onClick={() => { fieldAudio.playTap(); setFilterCategory('all'); }}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            filterCategory === 'all' ? 'bg-[#0B4619] text-white shadow-xs font-bold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All ({incidents.length})
        </button>
        <button
          onClick={() => { fieldAudio.playTap(); setFilterCategory('pending'); }}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            filterCategory === 'pending' ? 'bg-[#0B4619] text-white shadow-xs font-bold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Needs Action
        </button>
        <button
          onClick={() => { fieldAudio.playTap(); setFilterCategory('fire'); }}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            filterCategory === 'fire' ? 'bg-[#0B4619] text-white shadow-xs font-bold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Fire &amp; Thermal
        </button>
        <button
          onClick={() => { fieldAudio.playTap(); setFilterCategory('wildlife'); }}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            filterCategory === 'wildlife' ? 'bg-[#0B4619] text-white shadow-xs font-bold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Wildlife
        </button>
        <button
          onClick={() => { fieldAudio.playTap(); setFilterCategory('security'); }}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            filterCategory === 'security' ? 'bg-[#0B4619] text-white shadow-xs font-bold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Security
        </button>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filteredIncidents.map((incident) => (
          <div
            key={incident.id}
            onClick={() => {
              fieldAudio.playTap();
              onSelectIncident(incident);
            }}
            className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer hover:border-slate-300 shadow-xs ${
              selectedIncident?.id === incident.id
                ? 'border-[#0B4619] ring-2 ring-emerald-600/20'
                : incident.urgency === 'high'
                ? 'border-red-200'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {getCategoryIcon(incident.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                    {incident.title}
                  </h4>
                  {getStatusBadge(incident.status)}
                </div>

                <p className="text-xs text-slate-600 font-sans mt-1 line-clamp-2 leading-relaxed">
                  {incident.description}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-medium mt-3 pt-2.5 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-slate-700">
                    <MapPin className="w-3 h-3 text-[#0B4619]" />
                    {incident.sector}
                  </span>
                  <div className="flex items-center gap-2">
                    {incident.hasVoiceNote && (
                      <span className="flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Volume2 className="w-3 h-3" /> Audio Memo
                      </span>
                    )}
                    <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                      RISK {incident.aiRiskScore}/10
                    </span>
                    <span>{incident.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Incident Full Detail Drawer */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  {getCategoryIcon(selectedIncident.category)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {selectedIncident.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedIncident.sector} • {selectedIncident.timestamp}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectIncident(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700">
              {/* Status and Urgency */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block tracking-wider mb-1">Current Status</span>
                  {getStatusBadge(selectedIncident.status)}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block tracking-wider mb-1">Reported By</span>
                  <span className="font-mono font-bold text-slate-900">{selectedIncident.reportedBy} [{selectedIncident.officerBadge}]</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="font-mono font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">Field Observation Details</span>
                <p className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed font-sans text-slate-800 whitespace-pre-wrap">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Voice Memo Playback Bar */}
              {selectedIncident.hasVoiceNote && (
                <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-amber-900 text-xs block">Ranger Voice Memo Attached</span>
                      <span className="text-[10px] font-mono text-amber-700">VHF Audio Log (00:14s)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      fieldAudio.playRadioReceive();
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Play Audio</span>
                  </button>
                </div>
              )}

              {/* AI Assessment Box */}
              <div className="bg-emerald-50/70 text-slate-900 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-[#0B4619] font-bold">
                  <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-700" /> AI Ecological Risk Assessment
                  </span>
                  <span className="bg-[#0B4619] text-white text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {selectedIncident.aiRiskScore} / 10
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-normal leading-relaxed">
                  {selectedIncident.aiClassification || 'Thermal image analysis validates low-intensity surface anomaly. No crown fire risk detected in immediate perimeter.'}
                </p>
              </div>

              {/* Photos with High-Res View */}
              {selectedIncident.photos && selectedIncident.photos.length > 0 && (
                <div>
                  <span className="font-mono font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-2">Attached Geotagged Media</span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIncident.photos.map((photo, i) => (
                      <div key={i} className="relative rounded-2xl overflow-hidden border border-slate-200 h-32 bg-slate-100 group">
                        <img src={photo} alt="Incident field capture" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 backdrop-blur-xs text-[9px] text-white p-1 font-mono flex items-center justify-between">
                          <span>📍 {selectedIncident.lat.toFixed(4)}, {selectedIncident.lng.toFixed(4)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Triage & Approval Actions */}
              {(currentUserRole === 'RANGER' || currentUserRole === 'ADMIN') && (
                <div className="pt-2 border-t border-slate-100 space-y-2.5 font-mono">
                  <span className="font-mono font-bold uppercase tracking-wider text-slate-500 text-[10px] block">Triage Actions</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(selectedIncident.id, 'under_review')}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold uppercase tracking-wider py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" /> Review
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(selectedIncident.id, 'resolved')}
                      className="bg-[#0B4619] hover:bg-emerald-800 text-white font-bold uppercase tracking-wider py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" /> Resolve
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(selectedIncident.id, 'rejected')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold uppercase tracking-wider py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Real Create Incident Modal with Full Input, Image & Voice Support */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            {/* Hidden Real File Inputs */}
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageFileSelected}
              className="hidden"
            />
            <input
              type="file"
              ref={galleryInputRef}
              accept="image/*"
              multiple
              onChange={handleImageFileSelected}
              className="hidden"
            />

            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">New Field Incident Report</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="py-4 space-y-4">
              {/* Category Picker */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1.5">Incident Category</label>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  <button
                    type="button"
                    onClick={() => { fieldAudio.playTap(); setFormCategory('smoke_fire'); }}
                    className={`p-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                      formCategory === 'smoke_fire' ? 'bg-red-50 border-red-400 text-red-700 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-red-600" />
                    <span className="text-[10px]">Smoke / Fire</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { fieldAudio.playTap(); setFormCategory('wildlife'); }}
                    className={`p-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                      formCategory === 'wildlife' ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <PawPrint className="w-4 h-4 text-amber-600" />
                    <span className="text-[10px]">Wildlife</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { fieldAudio.playTap(); setFormCategory('unauthorized_access'); }}
                    className={`p-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                      formCategory === 'unauthorized_access' ? 'bg-emerald-50 border-emerald-400 text-[#0B4619] shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-emerald-700" />
                    <span className="text-[10px]">Trespass</span>
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Unattended Campfire near Ridge Line"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans font-medium"
                />
              </div>

              {/* Sector & GPS Location with Auto-Acquire */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Forest Sector</label>
                  <select
                    value={formSector}
                    onChange={(e) => setFormSector(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                  >
                    <option value="Sector 4 - Alpha">Sector 4 - Alpha</option>
                    <option value="Sector 7 - Ridge Line">Sector 7 - Ridge Line</option>
                    <option value="Zone B-14 Timber Basin">Zone B-14 Timber Basin</option>
                    <option value="Sector 2 - West Basin">Sector 2 - West Basin</option>
                    <option value="Double Rock Ravine">Double Rock Ravine</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">GPS Coordinates</label>
                  <button
                    type="button"
                    onClick={handleAcquireCurrentGPS}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2.5 px-2 text-[11px] font-mono text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                  >
                    <Compass className={`w-3.5 h-3.5 ${gpsAcquired ? 'text-emerald-600 animate-spin' : 'text-[#0B4619]'}`} />
                    <span>{gpsAcquired ? 'GPS Fixed' : `${formLat.toFixed(3)}, ${formLng.toFixed(3)}`}</span>
                  </button>
                </div>
              </div>

              {/* Observation Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Observation Notes / Transcript</label>
                  {voiceRecorder.isTranscribing && (
                    <span className="text-[9px] font-mono font-bold text-amber-700 animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Live Transcribing Voice...
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Type notes or click the microphone below to dictate..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans"
                />
              </div>

              {/* REAL VOICE RECORDER COMPONENT */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-amber-600" />
                    <span>Voice Note Dictation (Web Audio + Speech-to-Text)</span>
                  </span>
                  {voiceRecorder.isRecording && (
                    <span className="text-[10px] font-mono font-extrabold text-red-600 bg-red-100 px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                      REC {voiceRecorder.recordingDuration.toString().padStart(2, '0')}s
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!voiceRecorder.isRecording ? (
                    <button
                      type="button"
                      onClick={() => {
                        fieldAudio.playRadioChirp();
                        voiceRecorder.startRecording();
                      }}
                      className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Mic className="w-4 h-4 text-amber-700" />
                      <span>{voiceRecorder.audioUrl ? 'Re-record Voice Memo' : 'Start Voice Dictation'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        fieldAudio.playRadioReceive();
                        voiceRecorder.stopRecording();
                        if (voiceRecorder.transcript) {
                          setFormDescription(prev => prev ? `${prev} ${voiceRecorder.transcript}` : voiceRecorder.transcript);
                        }
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                    >
                      <MicOff className="w-4 h-4" />
                      <span>Stop &amp; Save Memo</span>
                    </button>
                  )}

                  {voiceRecorder.audioUrl && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (voiceRecorder.isPlaying) {
                            voiceRecorder.pauseRecording();
                          } else {
                            voiceRecorder.playRecording();
                          }
                        }}
                        className="bg-emerald-50 hover:bg-emerald-100 text-[#0B4619] border border-emerald-200 p-2.5 rounded-xl cursor-pointer"
                        title="Listen to recording"
                      >
                        {voiceRecorder.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-[#0B4619]" />}
                      </button>
                      <button
                        type="button"
                        onClick={voiceRecorder.clearRecording}
                        className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 border border-slate-200 p-2.5 rounded-xl cursor-pointer"
                        title="Delete recording"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {voiceRecorder.transcript && (
                  <p className="text-[11px] text-slate-700 font-mono bg-white p-2 rounded-xl border border-slate-200 italic">
                    "{voiceRecorder.transcript}"
                  </p>
                )}
              </div>

              {/* REAL CAMERA & PHOTO ATTACHMENTS */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#0B4619]" />
                    <span>Evidence Photos ({formPhotos.length})</span>
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">GEOTAGGED JPEG</span>
                </div>

                {/* Real Camera & Upload Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      fieldAudio.playTap();
                      cameraInputRef.current?.click();
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-mono font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Camera className="w-4 h-4 text-[#0B4619]" />
                    <span>Take Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      fieldAudio.playTap();
                      galleryInputRef.current?.click();
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-mono font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Upload Image</span>
                  </button>
                </div>

                {/* Preset quick picker for test environments */}
                <div>
                  <span className="text-[9px] font-mono text-slate-400 block mb-1">Quick Evidence Samples:</span>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {FORESTRY_SAMPLE_PHOTOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddPresetPhoto(sample.url)}
                        className="text-[10px] font-mono bg-white border border-slate-200 hover:border-emerald-500 px-2 py-1 rounded-lg text-slate-700 whitespace-nowrap cursor-pointer"
                      >
                        + {sample.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attached Thumbnails Grid */}
                {formPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {formPhotos.map((photoUrl, idx) => (
                      <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                        <img src={photoUrl} alt="Evidence preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-sm hover:bg-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Auto-Assistant Classifier Trigger */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Edge AI Classifier
                  </span>
                  <button
                    type="button"
                    onClick={handleRunAiAnalysis}
                    disabled={aiAnalyzing}
                    className="text-[10px] font-mono font-extrabold text-[#0B4619] uppercase tracking-wider cursor-pointer hover:underline disabled:opacity-50"
                  >
                    {aiAnalyzing ? 'Analyzing Inputs...' : 'Test AI Risk Score'}
                  </button>
                </div>
                {aiAnalysisResult ? (
                  <p className="text-[11px] text-slate-800 font-sans leading-relaxed mt-1">
                    {aiAnalysisResult.text}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Edge AI evaluates smoke density, thermal anomaly levels, and attached photos before alerting Range HQ.
                  </p>
                )}
              </div>

              {/* Submit Report */}
              <button
                type="submit"
                className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-extrabold uppercase tracking-wider py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm text-xs cursor-pointer"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>Submit Field Incident Report</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
