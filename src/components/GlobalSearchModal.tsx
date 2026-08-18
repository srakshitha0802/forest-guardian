import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Flame, 
  TreePine, 
  CheckCircle2, 
  ChevronRight, 
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { Incident, TeamOfficer, Checkpoint, GeofenceZone, UserRole } from '../types';
import { fieldAudio } from '../utils/audioSynth';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  teamOfficers: TeamOfficer[];
  checkpoints: Checkpoint[];
  geofences: GeofenceZone[];
  currentUserRole: UserRole;
  onSelectIncident?: (incident: Incident) => void;
  onNavigateToMap?: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  incidents,
  teamOfficers,
  checkpoints,
  geofences,
  currentUserRole,
  onSelectIncident,
  onNavigateToMap,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'officers' | 'incidents' | 'checkpoints' | 'zones'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Sector 7',
    'Smoke Detected',
    'Officer Ranger',
    'CP-3 Fire Watchtower',
    'Zone B-14'
  ]);

  if (!isOpen) return null;

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: {
      type: 'officer' | 'incident' | 'checkpoint' | 'zone';
      title: string;
      subtitle: string;
      id: string;
      item: any;
    }[] = [];

    // Officers
    if (filterType === 'all' || filterType === 'officers') {
      teamOfficers.forEach(o => {
        if (o.name.toLowerCase().includes(q) || o.badgeId.toLowerCase().includes(q) || o.sector.toLowerCase().includes(q)) {
          results.push({
            type: 'officer',
            title: `${o.name} (${o.badgeId})`,
            subtitle: `${o.sector} • ${o.role} • Battery ${o.battery}%`,
            id: o.id,
            item: o
          });
        }
      });
    }

    // Incidents
    if (filterType === 'all' || filterType === 'incidents') {
      incidents.forEach(inc => {
        if (inc.title.toLowerCase().includes(q) || inc.sector.toLowerCase().includes(q) || inc.description.toLowerCase().includes(q) || inc.category.toLowerCase().includes(q)) {
          results.push({
            type: 'incident',
            title: `[${inc.urgency.toUpperCase()}] ${inc.title}`,
            subtitle: `${inc.sector} • Status: ${inc.status} • Score: ${inc.aiRiskScore}/10`,
            id: inc.id,
            item: inc
          });
        }
      });
    }

    // Checkpoints
    if (filterType === 'all' || filterType === 'checkpoints') {
      checkpoints.forEach(cp => {
        if (cp.name.toLowerCase().includes(q) || cp.id.toLowerCase().includes(q)) {
          results.push({
            type: 'checkpoint',
            title: cp.name,
            subtitle: `Status: ${cp.status.toUpperCase()} • GPS: ${cp.lat.toFixed(4)}, ${cp.lng.toFixed(4)}`,
            id: cp.id,
            item: cp
          });
        }
      });
    }

    // Zones
    if (filterType === 'all' || filterType === 'zones') {
      geofences.forEach(g => {
        if (g.name.toLowerCase().includes(q) || g.type.toLowerCase().includes(q)) {
          results.push({
            type: 'zone',
            title: g.name,
            subtitle: `Type: ${g.type.replace('_', ' ')} • Risk: ${g.riskLevel.toUpperCase()}`,
            id: g.id,
            item: g
          });
        }
      });
    }

    return results;
  }, [query, filterType, teamOfficers, incidents, checkpoints, geofences]);

  const handleSelect = (result: typeof searchResults[0]) => {
    fieldAudio.playTap();
    if (!recentSearches.includes(result.title)) {
      setRecentSearches(prev => [result.title, ...prev.slice(0, 4)]);
    }

    if (result.type === 'incident' && onSelectIncident) {
      onClose();
      onSelectIncident(result.item);
    } else if (onNavigateToMap) {
      onClose();
      onNavigateToMap();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg h-[86vh] max-h-[640px] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#0B4619]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Officers, Incidents, Beats, Checkpoints..."
            autoFocus
            className="flex-1 text-sm font-sans outline-hidden bg-transparent placeholder:text-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex gap-1.5 overflow-x-auto text-xs font-bold">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'officers', label: 'Officers' },
            { id: 'incidents', label: 'Incidents' },
            { id: 'checkpoints', label: 'Checkpoints' },
            { id: 'zones', label: 'Zones / Geofence' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => { fieldAudio.playTap(); setFilterType(f.id as any); }}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                filterType === f.id ? 'bg-[#0B4619] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results / Recent Searches Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {query.trim() === '' ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  RECENT FIELD SEARCHES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#0B4619] border border-slate-200 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200 space-y-1.5">
                <span className="text-[10px] font-mono font-extrabold text-[#0B4619] uppercase block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Quick CAD Filters
                </span>
                <p className="text-[11px] text-slate-600">
                  Search by badge (e.g. "FG-8842"), incident type ("smoke", "chainsaw"), or compartment code.
                </p>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p>No records found matching "{query}"</p>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                {searchResults.length} MATCHING RECORDS
              </span>

              {searchResults.map(res => (
                <div
                  key={res.id}
                  onClick={() => handleSelect(res)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between gap-3 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-[#0B4619] group-hover:text-white transition-colors">
                      {res.type === 'officer' && <Users className="w-4 h-4" />}
                      {res.type === 'incident' && <AlertTriangle className="w-4 h-4 text-red-600 group-hover:text-white" />}
                      {res.type === 'checkpoint' && <MapPin className="w-4 h-4 text-emerald-600 group-hover:text-white" />}
                      {res.type === 'zone' && <Layers className="w-4 h-4 text-purple-600 group-hover:text-white" />}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-[#0B4619] transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {res.subtitle}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700" />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
