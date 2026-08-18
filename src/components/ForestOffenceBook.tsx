import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCheck2, 
  ShieldAlert, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Scale, 
  FileText, 
  AlertCircle, 
  Search,
  Check,
  Building2,
  Calendar,
  Camera,
  Mic,
  MicOff,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { fieldAudio } from '../utils/audioSynth';
import { downloadOfflineFile } from '../utils/gpxExporter';
import { useVoiceRecorder } from '../utils/useVoiceRecorder';
import { fileToBase64, FORESTRY_SAMPLE_PHOTOS } from '../utils/imageHandler';

export interface ForestOffenceRecord {
  caseNumber: string;
  date: string;
  time: string;
  compartment: string;
  legalAct: string;
  offenderName: string;
  offenderAddress: string;
  contrabandItems: string[];
  vehicleDetails?: string;
  timberVolumeCuM?: number;
  estimatedValuationUSD: number;
  seizingOfficer: string;
  witnesses: string;
  status: 'seized_pending_court' | 'compounded' | 'under_trial';
  fullFIRText: string;
  photos?: string[];
  hasAudioStatement?: boolean;
}

const INITIAL_OFFENCES: ForestOffenceRecord[] = [
  {
    caseNumber: 'FOC-2026-YOS-042',
    date: '2026-08-18',
    time: '04:30 AM',
    compartment: 'Compartment 14-B (North Ridge)',
    legalAct: 'Wildlife Protection Act Sec 9/51 & Forest Act Sec 26',
    offenderName: 'Ramesh K. (Alias: Kala)',
    offenderAddress: 'Village Gudalur, Border Sector 4',
    contrabandItems: [
      '1x Stihl MS-382 Commercial Chainsaw',
      '3x Steel Wire Snare Traps (Clutch Cable)',
      '2 Logs of A-Grade Teak (Tectona grandis) - Volume 1.85 m³'
    ],
    vehicleDetails: 'Mahindra Bolero Pickup (Reg: MH-14-EA-9912)',
    timberVolumeCuM: 1.85,
    estimatedValuationUSD: 4200,
    seizingOfficer: 'Forest Guard FG-8842 (Verified by Range Officer R-04)',
    witnesses: 'Panch Witness 1: S. Devadas, Panch Witness 2: M. Joseph',
    status: 'seized_pending_court',
    fullFIRText: `FOREST OFFENCE REPORT & SEIZURE MEMO (FORM-A)
CASE NUMBER: FOC-2026-YOS-042
DATE & TIME: 18-Aug-2026 at 04:30 Hours
LOCATION: Compartment 14-B, North Slope Reserve Forest Beat

1. APPLICABLE STATUTES & SECTIONS:
- Indian Forest Act / National Forest Act, Section 26(1)(a) (Illicit Felling of Scheduled Timber)
- Wildlife Protection Act, Section 9, 39, 51 (Laying of Lethal Wire Snares in Tiger Buffer)

2. DETAILS OF ACCUSED:
Name: Ramesh K. (Alias: Kala), Age: 38
Address: Village Gudalur, Border Sector 4

3. SCHEDULE OF SEIZED PROPERTY / CONTRABAND:
- Item 1: Stihl MS-382 Commercial Chainsaw with 24" guide bar (Fresh sawdust present)
- Item 2: Three (3) high-tensile steel wire clutch snares
- Item 3: 2 Teak Logs (GBH 140cm, Length 3.2m each), Volume: 1.85 cu.m. Hammer marked: FG-8842

4. SEIZED VEHICLE:
Vehicle: Mahindra Bolero 4x4, Registration: MH-14-EA-9912

5. ESTIMATED VALUATION OF SEIZURE: $4,200 USD (INR 3,50,000)

6. WITNESS STATEMENT:
Seized on-site during dawn tactical anti-poaching patrol in presence of independent panch witnesses.

INVESTIGATING OFFICER: Forest Guard FG-8842
APPROVED BY: Range Forest Officer, Division HQ`
  }
];

export const ForestOffenceBook: React.FC = () => {
  const [offences, setOffences] = useState<ForestOffenceRecord[]>(INITIAL_OFFENCES);
  const [activeTab, setActiveTab] = useState<'register' | 'new_case'>('register');
  const [selectedCase, setSelectedCase] = useState<ForestOffenceRecord | null>(null);

  // Form State
  const [offenderName, setOffenderName] = useState('');
  const [offenderAddress, setOffenderAddress] = useState('');
  const [compartment, setCompartment] = useState('Compartment 14-B (North Slope)');
  const [legalAct, setLegalAct] = useState('Forest Conservation Act Sec 26 & Wildlife Act Sec 9/51');
  const [contrabandInput, setContrabandInput] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [valuation, setValuation] = useState(2500);
  const [witnesses, setWitnesses] = useState('Local Panch 1 & Panch 2');
  const [casePhotos, setCasePhotos] = useState<string[]>([]);
  const [caseCreatedSuccess, setCaseCreatedSuccess] = useState(false);

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
    setCasePhotos(prev => [...prev, ...newPhotos]);
  };

  const handleGenerateFIR = (e: React.FormEvent) => {
    e.preventDefault();
    fieldAudio.playCheckpointChime();

    const caseNum = `FOC-${new Date().getFullYear()}-YOS-${Math.floor(100 + Math.random() * 900)}`;
    const items = contrabandInput.split('\n').filter(i => i.trim().length > 0);

    const generatedFIR: ForestOffenceRecord = {
      caseNumber: caseNum,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      compartment,
      legalAct,
      offenderName: offenderName || 'Unknown / Absconding Suspect',
      offenderAddress: offenderAddress || 'Not Provided',
      contrabandItems: items.length > 0 ? items : ['Illicitly Felled Timber Logs (Grade I)'],
      vehicleDetails: vehicleDetails || 'None (Foot Transport)',
      estimatedValuationUSD: valuation,
      seizingOfficer: 'Forest Guard FG-8842',
      witnesses: voiceRecorder.transcript ? `${witnesses} [Recorded Voice Audio Statement: "${voiceRecorder.transcript}"]` : witnesses,
      status: 'seized_pending_court',
      photos: casePhotos.length > 0 ? casePhotos : [FORESTRY_SAMPLE_PHOTOS[2].url],
      hasAudioStatement: voiceRecorder.audioUrl !== null || voiceRecorder.transcript.length > 0,
      fullFIRText: `OFFICIAL FOREST OFFENCE REPORT & SEIZURE MEMO (FORM-A)
CASE NUMBER: ${caseNum}
DATE & TIME: ${new Date().toLocaleString()}
COMPARTMENT: ${compartment}

STATUTORY VIOLATIONS:
${legalAct}

ACCUSED / SUSPECT DETAILS:
Name: ${offenderName || 'Unknown / Absconding'}
Address: ${offenderAddress || 'Not Recorded'}

SEIZED CONTRABAND REGISTER:
${items.map((it, idx) => `${idx + 1}. ${it}`).join('\n')}

CONVEYANCE / VEHICLE SEIZED:
${vehicleDetails || 'None'}

ESTIMATED SEIZURE VALUATION: $${valuation.toLocaleString()} USD
SEIZING OFFICER: Forest Guard FG-8842
WITNESSES: ${witnesses}
${voiceRecorder.transcript ? `AUDIO STATEMENT TRANSCRIPT: ${voiceRecorder.transcript}` : ''}`
    };

    setOffences([generatedFIR, ...offences]);
    setCaseCreatedSuccess(true);
    setTimeout(() => {
      setCaseCreatedSuccess(false);
      setSelectedCase(generatedFIR);
      setActiveTab('register');
      setCasePhotos([]);
      voiceRecorder.clearRecording();
    }, 1500);
  };

  const handleDownloadFIR = (fir: ForestOffenceRecord) => {
    fieldAudio.playTap();
    downloadOfflineFile(
      fir.fullFIRText,
      `${fir.caseNumber}_Seizure_Memo.txt`,
      'text/plain'
    );
  };

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-full text-slate-900 pb-24">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">Forest Offence Register & FIR</h2>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Statutory Form-A Seizure & Prosecution Memos</p>
        </div>
        <span className="text-[10px] font-extrabold font-mono bg-red-100 text-red-800 px-2.5 py-1 rounded-full border border-red-200">
          COURT ADMISSIBLE
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-200/70 p-1 rounded-2xl font-mono text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setActiveTab('register');
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'register' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#0B4619]" />
          <span>Offence Docket ({offences.length})</span>
        </button>
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setActiveTab('new_case');
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'new_case' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600'
          }`}
        >
          <Plus className="w-3.5 h-3.5 text-[#0B4619]" />
          <span>New Seizure Memo</span>
        </button>
      </div>

      {/* VIEW 1: OFFENCE REGISTER DOCKET */}
      {activeTab === 'register' && (
        <div className="space-y-3">
          {offences.map(off => (
            <div
              key={off.caseNumber}
              onClick={() => {
                fieldAudio.playTap();
                setSelectedCase(off);
              }}
              className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900">{off.caseNumber}</span>
                  <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    SEIZED PROPERTY
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{off.date}</span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-800 block">Accused: {off.offenderName}</span>
                <p className="text-[11px] text-slate-500">{off.compartment} • {off.legalAct.split('&')[0]}</p>
              </div>

              {/* Contraband Chips */}
              <div className="space-y-1">
                {off.contrabandItems.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="bg-slate-50 px-2.5 py-1 rounded-xl text-[11px] text-slate-700 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100">
                <span className="text-[10px] font-mono text-emerald-800 font-bold">
                  Est. Value: ${off.estimatedValuationUSD.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadFIR(off);
                  }}
                  className="text-[10px] font-bold text-[#0B4619] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>FIR (.TXT)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: NEW SEIZURE MEMO FORM */}
      {activeTab === 'new_case' && (
        <form onSubmit={handleGenerateFIR} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold uppercase text-slate-900 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-[#0B4619]" />
              <span>Draft Official Form-A Seizure Memo</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              AIR-GAPPED DOCKET
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Accused / Suspect Name</label>
              <input
                type="text"
                value={offenderName}
                onChange={(e) => setOffenderName(e.target.value)}
                placeholder="e.g. Ramesh K. (or Unknown)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Village / Address</label>
              <input
                type="text"
                value={offenderAddress}
                onChange={(e) => setOffenderAddress(e.target.value)}
                placeholder="e.g. Gudalur Sector 4"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Applicable Legal Section / Violation</label>
            <select
              value={legalAct}
              onChange={(e) => setLegalAct(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
            >
              <option value="Forest Conservation Act Sec 26 & Wildlife Act Sec 9/51">Forest Act Sec 26 & Wildlife Act Sec 9 (Snares/Hunting)</option>
              <option value="Forest Act Sec 33 - Scheduled Timber Felling (Teak/Sandalwood)">Forest Act Sec 33 - Illicit Timber Felling & Smuggling</option>
              <option value="Wildlife Protection Act Sec 39/51 - Trophy / Skin Possession">Wildlife Protection Act - Trophy / Ivory / Skin Possession</option>
              <option value="Forest Encroachment & Boundary Pillar Defacement">Forest Encroachment & Boundary Pillar Defacement</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Contraband Items (One per line)</label>
            <textarea
              rows={3}
              value={contrabandInput}
              onChange={(e) => setContrabandInput(e.target.value)}
              placeholder="e.g.&#10;1x Chainsaw Stihl MS-382&#10;2x Teak Logs (GBH 140cm)&#10;4x Wire Snare Traps"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Seized Vehicle (Make & Reg No)</label>
              <input
                type="text"
                value={vehicleDetails}
                onChange={(e) => setVehicleDetails(e.target.value)}
                placeholder="e.g. Pickup MH-14-EA-9912"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Estimated Valuation ($ USD)</label>
              <input
                type="number"
                value={valuation}
                onChange={(e) => setValuation(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Independent Panch Witnesses</label>
            <input
              type="text"
              value={witnesses}
              onChange={(e) => setWitnesses(e.target.value)}
              placeholder="e.g. S. Devadas (Beat Guard) & Village Head M. Joseph"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900"
            />
          </div>

          {/* Photo Evidence & Witness Voice Note Controls */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5">
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

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">Seized Evidence Media & Audio</span>
              <span className="text-[9px] font-mono text-slate-400">LEGAL CHAIN OF CUSTODY</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  fieldAudio.playTap();
                  cameraInputRef.current?.click();
                }}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5 text-[#0B4619]" />
                <span>{casePhotos.length > 0 ? `${casePhotos.length} Photo(s)` : 'Take Contraband Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (voiceRecorder.isRecording) {
                    voiceRecorder.stopRecording();
                  } else {
                    fieldAudio.playRadioChirp();
                    voiceRecorder.startRecording();
                  }
                }}
                className={`border text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  voiceRecorder.isRecording 
                    ? 'bg-red-50 border-red-400 text-red-700 animate-pulse' 
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-amber-800 shadow-2xs'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-amber-600" />
                <span>{voiceRecorder.isRecording ? `REC ${voiceRecorder.recordingDuration}s...` : voiceRecorder.transcript ? 'Statement Recorded' : 'Record Witness Audio'}</span>
              </button>
            </div>

            {voiceRecorder.transcript && (
              <p className="text-[10px] font-mono bg-white p-2 rounded-xl border border-slate-200 text-slate-700 italic">
                "{voiceRecorder.transcript}"
              </p>
            )}

            {casePhotos.length > 0 && (
              <div className="flex gap-2 pt-1">
                {casePhotos.map((ph, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200">
                    <img src={ph} alt="Contraband" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCasePhotos(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{caseCreatedSuccess ? 'Seizure Docket Registered!' : 'Seal & Issue Offence Seizure FIR'}</span>
          </button>
        </form>
      )}

      {/* Case Detail Modal */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-y-auto space-y-3.5 text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#0B4619]" />
                  <h3 className="font-extrabold text-sm text-slate-900">{selectedCase.caseNumber}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form A Preview */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 font-mono text-[11px] whitespace-pre-wrap text-slate-800 leading-relaxed max-h-64 overflow-y-auto">
                {selectedCase.fullFIRText}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadFIR(selectedCase)}
                  className="flex-1 bg-[#0B4619] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Formal FIR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
