import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Compass, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  X, 
  Camera, 
  Mic,
  MicOff,
  Plus, 
  Check,
  Upload,
  Trash2,
  Volume2,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { WILDLIFE_CATALOG, WildlifeSpecies } from '../data/wildlifeData';
import { fieldAudio } from '../utils/audioSynth';
import { useVoiceRecorder } from '../utils/useVoiceRecorder';
import { fileToBase64, FORESTRY_SAMPLE_PHOTOS } from '../utils/imageHandler';

interface SightingRecord {
  id: string;
  speciesName: string;
  scientificName: string;
  category: string;
  notes: string;
  photos: string[];
  audioUrl?: string | null;
  timestamp: string;
  coordinates: string;
}

interface WildlifeFieldGuideProps {
  onLogSighting?: (species: WildlifeSpecies, notes: string) => void;
}

export const WildlifeFieldGuide: React.FC<WildlifeFieldGuideProps> = ({ onLogSighting }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<WildlifeSpecies | null>(null);
  const [sightingNotes, setSightingNotes] = useState('');
  const [sightingPhotos, setSightingPhotos] = useState<string[]>([]);
  const [sightingLogged, setSightingLogged] = useState(false);
  const [savedSightings, setSavedSightings] = useState<SightingRecord[]>([
    {
      id: 'st_1',
      speciesName: 'Royal Bengal Tiger (Panthera tigris)',
      scientificName: 'Panthera tigris',
      category: 'mammal',
      notes: 'Fresh left hind pugmark (14.2cm width) observed in wet clay bank near Stream 3.',
      photos: ['https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&auto=format&fit=crop&q=80'],
      timestamp: 'Today, 08:30 AM',
      coordinates: '37.7554° N, 119.5582° W'
    }
  ]);

  const voiceRecorder = useVoiceRecorder();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', label: 'All Species' },
    { id: 'mammal', label: 'Mammals' },
    { id: 'flora', label: 'Protected Flora' },
    { id: 'poaching_evidence', label: 'Traps & Snares' },
    { id: 'bird', label: 'Birds' },
  ];

  const filtered = WILDLIFE_CATALOG.filter(sp => {
    const matchesCat = selectedCategory === 'all' || sp.category === selectedCategory;
    const matchesQuery = 
      sp.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.trackDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    fieldAudio.playTap();

    const newPhotos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const base64 = await fileToBase64(files[i]);
      newPhotos.push(base64);
    }
    setSightingPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleLogSighting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpecies) return;

    fieldAudio.playCheckpointChime();
    setSightingLogged(true);

    let finalNotes = sightingNotes.trim();
    if (voiceRecorder.transcript && !finalNotes.includes(voiceRecorder.transcript)) {
      finalNotes = finalNotes ? `${finalNotes} [Voice]: ${voiceRecorder.transcript}` : voiceRecorder.transcript;
    }

    const record: SightingRecord = {
      id: `st_${Date.now()}`,
      speciesName: selectedSpecies.commonName,
      scientificName: selectedSpecies.scientificName,
      category: selectedSpecies.category,
      notes: finalNotes || 'Sighting verified in beat register.',
      photos: sightingPhotos.length > 0 ? sightingPhotos : [FORESTRY_SAMPLE_PHOTOS[1].url],
      audioUrl: voiceRecorder.audioUrl,
      timestamp: 'Just now',
      coordinates: '37.7554° N, 119.5582° W'
    };

    setSavedSightings(prev => [record, ...prev]);

    if (onLogSighting) {
      onLogSighting(selectedSpecies, finalNotes);
    }

    setTimeout(() => {
      setSightingLogged(false);
      setSelectedSpecies(null);
      setSightingNotes('');
      setSightingPhotos([]);
      voiceRecorder.clearRecording();
    }, 1500);
  };

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-full text-slate-900 pb-24">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-[#0B4619] flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">Offline Field Guide & Spoor Key</h2>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1">100% On-Device Species & Pugmark Database</p>
        </div>
        <span className="text-[10px] font-extrabold font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
          AIR-GAPPED
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search species, tracks, pugmark girth, traps..."
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4619] shadow-xs font-medium"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              fieldAudio.playTap();
              setSelectedCategory(cat.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#0B4619] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Species List */}
      <div className="space-y-2.5">
        {filtered.map(sp => (
          <motion.div
            key={sp.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              fieldAudio.playTap();
              setSelectedSpecies(sp);
            }}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">
                {sp.iconEmoji}
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">{sp.commonName}</h4>
                <p className="text-[10px] text-slate-500 italic font-mono">{sp.scientificName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                    sp.iucnStatus.includes('Critically') ? 'bg-red-100 text-red-700' :
                    sp.iucnStatus.includes('Endangered') ? 'bg-orange-100 text-orange-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {sp.iucnStatus}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">📍 {sp.habitat.split(',')[0]}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </motion.div>
        ))}
      </div>

      {/* Recent Logged Sightings Section */}
      {savedSightings.length > 0 && (
        <div className="pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
              Recorded Beat Sightings ({savedSightings.length})
            </span>
          </div>

          <div className="space-y-2">
            {savedSightings.map((st) => (
              <div key={st.id} className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{st.speciesName}</span>
                  <span className="text-[10px] font-mono text-slate-400">{st.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{st.notes}</p>
                {st.photos.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {st.photos.map((ph, idx) => (
                      <div key={idx} className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200">
                        <img src={ph} alt="Sighting photo" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-[10px] font-mono text-emerald-800 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#0B4619]" />
                  <span>{st.coordinates}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Species Detail Modal Drawer */}
      <AnimatePresence>
        {selectedSpecies && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
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

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center">
                    {selectedSpecies.iconEmoji}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{selectedSpecies.commonName}</h3>
                    <p className="text-[10px] text-slate-500 italic font-mono">{selectedSpecies.scientificName}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSpecies(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {sightingLogged ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0B4619] flex items-center justify-center mx-auto animate-bounce">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">Sighting Stored in Offline DB</h4>
                  <p className="text-xs text-slate-500 font-mono">Geotagged with current GPS sensor coordinates.</p>
                </div>
              ) : (
                <div className="py-3 space-y-3.5 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#0B4619]" />
                      <span>Pugmark & Track Key:</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed font-sans">{selectedSpecies.trackDescription}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Visual Identification Clues:</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed font-sans">{selectedSpecies.keyIdentification}</p>
                  </div>

                  <div className="bg-red-50 p-3 rounded-2xl border border-red-200 space-y-1.5">
                    <div className="font-extrabold text-red-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                      <span>Field Emergency Protocol:</span>
                    </div>
                    <p className="text-red-800 text-[11px] leading-relaxed font-sans">{selectedSpecies.emergencyProtocol}</p>
                  </div>

                  {/* Log Sighting Form with Photo & Voice */}
                  <form onSubmit={handleLogSighting} className="space-y-2.5 pt-2 border-t border-slate-100">
                    <label className="block text-[11px] font-bold text-slate-700">Add Field Sighting Note / Pugmark Measurements</label>
                    <textarea
                      rows={2}
                      value={sightingNotes}
                      onChange={(e) => setSightingNotes(e.target.value)}
                      placeholder="e.g. Fresh claw marks on teak bark, approx 4 hours old, heading North-East towards water hole #4..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0B4619] font-sans"
                    />

                    {/* Camera & Voice Input Row */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#0B4619]" />
                        <span>{sightingPhotos.length > 0 ? `${sightingPhotos.length} Photo(s)` : 'Capture Photo'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (voiceRecorder.isRecording) {
                            voiceRecorder.stopRecording();
                            if (voiceRecorder.transcript) {
                              setSightingNotes(prev => prev ? `${prev} ${voiceRecorder.transcript}` : voiceRecorder.transcript);
                            }
                          } else {
                            fieldAudio.playRadioChirp();
                            voiceRecorder.startRecording();
                          }
                        }}
                        className={`border text-xs font-mono font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          voiceRecorder.isRecording 
                            ? 'bg-red-50 border-red-400 text-red-700 animate-pulse' 
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-amber-800'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5 text-amber-600" />
                        <span>{voiceRecorder.isRecording ? `REC ${voiceRecorder.recordingDuration}s` : 'Voice Note'}</span>
                      </button>
                    </div>

                    {/* Photo Thumbnails */}
                    {sightingPhotos.length > 0 && (
                      <div className="flex gap-2 pt-1">
                        {sightingPhotos.map((ph, idx) => (
                          <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200">
                            <img src={ph} alt="Captured" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setSightingPhotos(prev => prev.filter((_, i) => i !== idx))}
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
                      className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Log Sighting to On-Device Database</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
