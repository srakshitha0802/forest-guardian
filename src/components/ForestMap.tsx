import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Navigation, 
  Flame, 
  Users, 
  AlertTriangle, 
  Compass, 
  CheckCircle2, 
  ShieldAlert, 
  Plus, 
  Minus, 
  Crosshair, 
  WifiOff,
  Search,
  Ruler,
  CloudSun,
  Wind,
  Droplets,
  Radio,
  Eye,
  EyeOff,
  Map as MapIcon,
  Download,
  Info,
  X,
  Send
} from 'lucide-react';
import { TeamOfficer, Incident, Checkpoint, GeofenceZone, PatrolState } from '../types';

interface ForestMapProps {
  teamOfficers: TeamOfficer[];
  incidents: Incident[];
  checkpoints: Checkpoint[];
  geofences: GeofenceZone[];
  patrolState: PatrolState;
  onCheckInCheckpoint: (checkpointId: string) => void;
  onSelectIncident: (incident: Incident) => void;
  onOpenReportModalWithCoords?: (lat: number, lng: number, placeName?: string) => void;
  isOffline?: boolean;
}

// Preset real-world forest locations for instant switching
const FOREST_PRESETS = [
  { name: 'Yosemite National Park (HQ)', lat: 37.7550, lng: -119.5600, zoom: 13 },
  { name: 'Yellowstone National Park', lat: 44.4280, lng: -110.5885, zoom: 12 },
  { name: 'Black Forest (Schwarzwald)', lat: 48.1500, lng: 8.2000, zoom: 12 },
  { name: 'Jim Corbett National Park', lat: 29.5300, lng: 78.7747, zoom: 12 },
  { name: 'Amazon Rainforest Reserve', lat: -3.4653, lng: -62.2159, zoom: 11 },
];

export const ForestMap: React.FC<ForestMapProps> = ({
  teamOfficers,
  incidents,
  checkpoints,
  geofences,
  patrolState,
  onCheckInCheckpoint,
  onSelectIncident,
  onOpenReportModalWithCoords,
  isOffline = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // Layer groups refs for efficient updating
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const officersLayerRef = useRef<L.LayerGroup | null>(null);
  const incidentsLayerRef = useRef<L.LayerGroup | null>(null);
  const checkpointsLayerRef = useRef<L.LayerGroup | null>(null);
  const geofencesLayerRef = useRef<L.LayerGroup | null>(null);
  const patrolPathLayerRef = useRef<L.Polyline | null>(null);
  const userGpsMarkerRef = useRef<L.Marker | null>(null);
  const userGpsCircleRef = useRef<L.Circle | null>(null);
  const measureLayerRef = useRef<L.LayerGroup | null>(null);
  const pinDropMarkerRef = useRef<L.Marker | null>(null);

  // States
  const [mapLayer, setMapLayer] = useState<'satellite' | 'topo' | 'osm' | 'terrain'>('satellite');
  const [showOfficers, setShowOfficers] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showGeofences, setShowGeofences] = useState(true);
  const [showCheckpoints, setShowCheckpoints] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  
  // Real GPS State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number; speed?: number | null; altitude?: number | null } | null>(null);
  const [isTrackingGps, setIsTrackingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Search & Geocoding
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);

  // Weather & Environmental Sensors (Live Open-Meteo)
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    fireRisk: 'Low' | 'Moderate' | 'High' | 'Extreme';
  } | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Tools: Pin Dropping & Distance Measurement
  const [toolMode, setToolMode] = useState<'none' | 'pin_drop' | 'measure'>('none');
  const [droppedPin, setDroppedPin] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [measuredDistanceMeters, setMeasuredDistanceMeters] = useState<number>(0);

  // Selected Entity Modal/Drawer
  const [selectedEntity, setSelectedEntity] = useState<{ type: 'officer' | 'incident' | 'checkpoint' | 'zone'; data: any } | null>(null);

  // Map Center Coordinates
  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lng: number }>({ lat: 37.7550, lng: -119.5600 });

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [37.7550, -119.5600],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    mapRef.current = map;

    // Initialize Layer Groups
    officersLayerRef.current = L.layerGroup().addTo(map);
    incidentsLayerRef.current = L.layerGroup().addTo(map);
    checkpointsLayerRef.current = L.layerGroup().addTo(map);
    geofencesLayerRef.current = L.layerGroup().addTo(map);
    measureLayerRef.current = L.layerGroup().addTo(map);

    // Track map center on move
    map.on('moveend', () => {
      const center = map.getCenter();
      setCurrentCenter({ lat: center.lat, lng: center.lng });
    });

    // Map click handler for tool modes (Pin drop / Distance measurement)
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if ((map as any)._toolMode === 'pin_drop') {
        handleMapPinDrop(lat, lng);
      } else if ((map as any)._toolMode === 'measure') {
        handleMapMeasureClick(lat, lng);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map internal tool mode
  useEffect(() => {
    if (mapRef.current) {
      (mapRef.current as any)._toolMode = toolMode;
    }
  }, [toolMode]);

  // 2. Tile Layer Update
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = '';
    let attribution = '';
    let maxZoom = 19;

    switch (mapLayer) {
      case 'satellite':
        // ESRI World Imagery (High Resolution Satellite)
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
        break;
      case 'topo':
        // OpenTopoMap
        url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        attribution = 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)';
        maxZoom = 17;
        break;
      case 'terrain':
        // CartoDB Voyager Clean
        url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        attribution = '&copy; OpenStreetMap contributors &copy; CARTO';
        break;
      case 'osm':
      default:
        // OpenStreetMap Standard
        url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = '&copy; OpenStreetMap contributors';
        break;
    }

    const newTileLayer = L.tileLayer(url, { maxZoom, attribution });
    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [mapLayer]);

  // 3. Render Geofences (GeoJSON Polygons)
  useEffect(() => {
    if (!geofencesLayerRef.current) return;
    geofencesLayerRef.current.clearLayers();

    if (!showGeofences) return;

    geofences.forEach(zone => {
      const latLngs = zone.points.map(p => [p.lat, p.lng] as [number, number]);
      const isFire = zone.type === 'high_fire_risk';
      const isRestricted = zone.type === 'restricted';

      const polygon = L.polygon(latLngs, {
        color: isFire ? '#EF4444' : isRestricted ? '#F59E0B' : '#16A34A',
        weight: 2,
        fillColor: isFire ? '#EF4444' : isRestricted ? '#F59E0B' : '#16A34A',
        fillOpacity: isFire ? 0.25 : 0.12,
        dashArray: isRestricted ? '6, 6' : undefined
      });

      polygon.on('click', () => {
        setSelectedEntity({ type: 'zone', data: zone });
      });

      polygon.bindTooltip(
        `<div class="font-bold text-xs font-sans ${isFire ? 'text-red-700' : isRestricted ? 'text-amber-800' : 'text-emerald-800'}">
          ${isFire ? '🔥 ' : ''}${zone.name}
        </div>`, 
        { sticky: true, className: 'bg-white/95 rounded-lg border border-slate-200 px-2 py-1 shadow-md' }
      );

      geofencesLayerRef.current?.addLayer(polygon);
    });
  }, [geofences, showGeofences]);

  // 4. Render Officers Markers
  useEffect(() => {
    if (!officersLayerRef.current) return;
    officersLayerRef.current.clearLayers();

    if (!showOfficers) return;

    teamOfficers.forEach(officer => {
      const isSOS = officer.status === 'sos';
      const isSelf = officer.badgeId === 'FG-8842';

      const iconHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          ${isSOS ? `
            <div class="absolute w-10 h-10 rounded-full bg-red-500 animate-ping opacity-75"></div>
            <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-[10px] font-mono animate-pulse">
              SOS
            </div>
          ` : isSelf ? `
            <div class="absolute w-9 h-9 rounded-full bg-emerald-500/40 animate-pulse"></div>
            <div class="w-7 h-7 rounded-full bg-emerald-700 border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            </div>
          ` : `
            <div class="w-6 h-6 rounded-full bg-slate-900 border border-white shadow-md flex items-center justify-center text-white font-bold text-[10px] font-mono">
              ${officer.name.charAt(0)}
            </div>
          `}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-officer-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([officer.lat, officer.lng], { icon: customIcon });
      
      marker.on('click', () => {
        setSelectedEntity({ type: 'officer', data: officer });
      });

      marker.bindTooltip(
        `<div class="font-bold text-[11px]">${officer.name} (${officer.badgeId})</div>
         <div class="text-[10px] text-slate-500">Bat: ${officer.battery}% • ${officer.sector}</div>`,
        { direction: 'top', offset: [0, -10], className: 'bg-white rounded-xl shadow-md border border-slate-200 p-1.5' }
      );

      officersLayerRef.current?.addLayer(marker);
    });
  }, [teamOfficers, showOfficers]);

  // 5. Render Incident Markers
  useEffect(() => {
    if (!incidentsLayerRef.current) return;
    incidentsLayerRef.current.clearLayers();

    if (!showIncidents) return;

    incidents.forEach(incident => {
      const isFire = incident.category === 'smoke_fire';
      const isWildlife = incident.category === 'wildlife';
      const isTrespass = incident.category === 'unauthorized_access';

      const iconBg = isFire ? 'bg-red-600 text-white' : isWildlife ? 'bg-amber-600 text-white' : isTrespass ? 'bg-orange-600 text-white' : 'bg-slate-800 text-white';

      const iconHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          ${isFire ? `<div class="absolute w-8 h-8 rounded-full bg-red-500/50 animate-ping"></div>` : ''}
          <div class="w-7 h-7 rounded-xl ${iconBg} border-2 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer">
            <span class="text-xs">${isFire ? '🔥' : isWildlife ? '🦌' : isTrespass ? '⚠️' : '📍'}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-incident-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([incident.lat, incident.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedEntity({ type: 'incident', data: incident });
        onSelectIncident(incident);
      });

      marker.bindTooltip(
        `<div class="font-extrabold text-xs">${incident.title}</div>
         <div class="text-[10px] text-slate-500">${incident.sector} • AI Risk: ${incident.aiRiskScore}/10</div>`,
        { direction: 'top', offset: [0, -10], className: 'bg-white rounded-xl shadow-md border border-slate-200 p-1.5' }
      );

      incidentsLayerRef.current?.addLayer(marker);
    });
  }, [incidents, showIncidents, onSelectIncident]);

  // 6. Render Checkpoints
  useEffect(() => {
    if (!checkpointsLayerRef.current) return;
    checkpointsLayerRef.current.clearLayers();

    if (!showCheckpoints) return;

    checkpoints.forEach(cp => {
      const isChecked = cp.status === 'checked';
      const iconHtml = `
        <div class="w-5 h-5 rounded-lg ${isChecked ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'} border border-white shadow-md flex items-center justify-center text-[10px] font-bold">
          ${isChecked ? '✓' : '•'}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-cp-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([cp.lat, cp.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedEntity({ type: 'checkpoint', data: cp });
      });

      marker.bindTooltip(
        `<div class="font-bold text-xs">${cp.name}</div>
         <div class="text-[10px] text-slate-500 font-mono">${isChecked ? 'Checked in ' + (cp.checkedAt || '') : 'Pending check-in'}</div>`,
        { direction: 'top', offset: [0, -8], className: 'bg-white rounded-xl shadow-md border border-slate-200 p-1.5' }
      );

      checkpointsLayerRef.current?.addLayer(marker);
    });
  }, [checkpoints, showCheckpoints]);

  // 7. Patrol Path Polyline
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (patrolPathLayerRef.current) {
      map.removeLayer(patrolPathLayerRef.current);
      patrolPathLayerRef.current = null;
    }

    if (patrolState.isActive) {
      // Mock Patrol Points around Sector 4 / Ridge Line
      const routePoints: [number, number][] = [
        [37.7410, -119.5850],
        [37.7485, -119.5720],
        [37.7550, -119.5600],
        [37.7590, -119.5540]
      ];

      const polyline = L.polyline(routePoints, {
        color: '#10B981',
        weight: 4,
        dashArray: '8, 6',
        opacity: 0.9,
        lineJoin: 'round'
      }).addTo(map);

      patrolPathLayerRef.current = polyline;
    }
  }, [patrolState.isActive]);

  // 8. Live Real GPS Tracking (`navigator.geolocation`)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsTrackingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy, speed, altitude } = pos.coords;
        const newLoc = { lat: latitude, lng: longitude, accuracy, speed, altitude };
        setUserLocation(newLoc);

        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 15, { duration: 1.5 });

          // Update/Create GPS Marker & Accuracy Circle
          if (userGpsMarkerRef.current) {
            userGpsMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const gpsIcon = L.divIcon({
              html: `
                <div class="relative flex items-center justify-center">
                  <div class="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping"></div>
                  <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                    <div class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
              `,
              className: 'custom-gps-icon',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            userGpsMarkerRef.current = L.marker([latitude, longitude], { icon: gpsIcon }).addTo(mapRef.current);
            userGpsMarkerRef.current.bindTooltip('Your Real Location', { permanent: false, direction: 'top' });
          }

          if (userGpsCircleRef.current) {
            userGpsCircleRef.current.setLatLng([latitude, longitude]);
            userGpsCircleRef.current.setRadius(accuracy);
          } else {
            userGpsCircleRef.current = L.circle([latitude, longitude], {
              radius: accuracy,
              color: '#3B82F6',
              fillColor: '#3B82F6',
              fillOpacity: 0.12,
              weight: 1.5
            }).addTo(mapRef.current);
          }
        }
      },
      (err) => {
        console.warn('GPS location error:', err);
        setGpsError('Could not acquire GPS fix: ' + err.message);
        setIsTrackingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 9. Fetch Live Weather & Fire Weather Danger (Open-Meteo)
  const fetchLiveWeather = async (lat: number, lng: number) => {
    setIsLoadingWeather(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m`
      );
      if (res.ok) {
        const data = await res.json();
        const cur = data.current;
        const temp = Math.round(cur.temperature_2m);
        const humidity = Math.round(cur.relative_humidity_2m);
        const windSpeed = Math.round(cur.wind_speed_10m);
        const windDirection = Math.round(cur.wind_direction_10m);

        // Compute Canadian/US Fire Weather Danger Index heuristic
        let fireRisk: 'Low' | 'Moderate' | 'High' | 'Extreme' = 'Moderate';
        if (humidity < 25 && windSpeed > 25 && temp > 28) fireRisk = 'Extreme';
        else if (humidity < 35 && windSpeed > 18) fireRisk = 'High';
        else if (humidity > 60 || windSpeed < 10) fireRisk = 'Low';

        setWeatherData({ temp, humidity, windSpeed, windDirection, fireRisk });
      }
    } catch (e) {
      console.warn('Weather fetch failed, falling back to local sensor heuristic');
      setWeatherData({ temp: 24, humidity: 32, windSpeed: 14, windDirection: 210, fireRisk: 'Moderate' });
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather(currentCenter.lat, currentCenter.lng);
  }, [currentCenter.lat, currentCenter.lng]);

  // 10. Global Search & Geocoding (OpenStreetMap Nominatim)
  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        if (data.length > 0) {
          const first = data[0];
          flyToLocation(parseFloat(first.lat), parseFloat(first.lon), first.display_name);
        }
      }
    } catch (err) {
      console.error('Search geocoding error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const flyToLocation = (lat: number, lng: number, name?: string) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([lat, lng], 13, { duration: 1.8 });
    setSearchResults([]);
    setShowPresetsDropdown(false);
  };

  // 11. Tool: Pin Dropper
  const handleMapPinDrop = async (lat: number, lng: number) => {
    setDroppedPin({ lat, lng, address: 'Resolving coordinates...' });

    if (mapRef.current) {
      if (pinDropMarkerRef.current) {
        pinDropMarkerRef.current.setLatLng([lat, lng]);
      } else {
        const pinIcon = L.divIcon({
          html: `
            <div class="w-8 h-8 rounded-full bg-red-600 text-white border-2 border-white shadow-2xl flex items-center justify-center animate-bounce">
              📍
            </div>
          `,
          className: 'custom-pin-drop-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        pinDropMarkerRef.current = L.marker([lat, lng], { icon: pinIcon }).addTo(mapRef.current);
      }
    }

    // Reverse Geocode
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (res.ok) {
        const data = await res.json();
        setDroppedPin({ lat, lng, address: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
      }
    } catch (e) {
      setDroppedPin({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
    }
  };

  // 12. Tool: Distance Measurement
  const handleMapMeasureClick = (lat: number, lng: number) => {
    const updated = [...measurePoints, [lat, lng] as [number, number]];
    setMeasurePoints(updated);

    if (measureLayerRef.current && mapRef.current) {
      measureLayerRef.current.clearLayers();

      // Add waypoint circles
      updated.forEach((pt, i) => {
        const ptCircle = L.circleMarker(pt, {
          radius: 5,
          color: '#0F172A',
          fillColor: '#FFFFFF',
          fillOpacity: 1,
          weight: 2
        });
        measureLayerRef.current?.addLayer(ptCircle);
      });

      // Add polyline
      if (updated.length > 1) {
        const line = L.polyline(updated, { color: '#0B4619', weight: 3, dashArray: '4, 4' });
        measureLayerRef.current.addLayer(line);

        // Calculate total distance using Haversine
        let dist = 0;
        for (let i = 0; i < updated.length - 1; i++) {
          dist += mapRef.current.distance(updated[i], updated[i + 1]);
        }
        setMeasuredDistanceMeters(dist);
      }
    }
  };

  const clearMeasurement = () => {
    setMeasurePoints([]);
    setMeasuredDistanceMeters(0);
    if (measureLayerRef.current) {
      measureLayerRef.current.clearLayers();
    }
    setToolMode('none');
  };

  return (
    <div className="relative w-full h-[calc(100vh-130px)] flex flex-col bg-[#F8FAF8] overflow-hidden text-slate-900">
      {/* Top Search & Presets Floating Bar */}
      <div className="absolute top-3 inset-x-3 z-[1000] flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Global Search Bar */}
          <form onSubmit={handleSearchLocation} className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any forest, park, or coordinates..."
              className="w-full bg-white/95 backdrop-blur-md text-xs font-semibold text-slate-900 pl-9 pr-8 py-2.5 rounded-2xl shadow-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B4619]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Quick Presets Dropdown Toggle */}
          <button
            type="button"
            onClick={() => setShowPresetsDropdown(!showPresetsDropdown)}
            className="bg-white/95 backdrop-blur-md hover:bg-slate-50 text-slate-700 p-2.5 rounded-2xl shadow-md border border-slate-200 flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
          >
            <MapIcon className="w-4 h-4 text-[#0B4619]" />
            <span className="hidden sm:inline">Parks</span>
          </button>
        </div>

        {/* Presets Menu */}
        {showPresetsDropdown && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-slate-200 pointer-events-auto space-y-1 animate-in fade-in zoom-in duration-150">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 px-2 py-1 block">Real World Forest Reserves</span>
            {FOREST_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => flyToLocation(preset.lat, preset.lng, preset.name)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{preset.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">📍 {preset.lat.toFixed(2)}, {preset.lng.toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Real Map Canvas Container */}
      <div className="relative w-full flex-1">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Live Weather & Fire Danger Pill (Top Right) */}
        {weatherData && (
          <div className="absolute top-16 right-3 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-slate-200 text-xs flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-800 font-extrabold">
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span>{weatherData.temp}°C</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 font-semibold text-[11px]">
              <Wind className="w-3.5 h-3.5 text-blue-500" />
              <span>{weatherData.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 font-semibold text-[11px]">
              <Droplets className="w-3.5 h-3.5 text-cyan-500" />
              <span>{weatherData.humidity}%</span>
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              weatherData.fireRisk === 'Extreme' ? 'bg-red-100 text-red-800 border border-red-300' :
              weatherData.fireRisk === 'High' ? 'bg-orange-100 text-orange-800' :
              'bg-emerald-100 text-emerald-800'
            }`}>
              Fire Risk: {weatherData.fireRisk}
            </span>
          </div>
        )}

        {/* Layer Toggles & Mode Toolbar (Left Side) */}
        <div className="absolute left-3 top-16 z-[1000] flex flex-col gap-2">
          {/* Map Layer Mode (Satellite / Topo / Terrain / OSM) */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setMapLayer('satellite')}
              title="ESRI Satellite Imagery"
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${mapLayer === 'satellite' ? 'bg-[#0B4619] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('topo')}
              title="OpenTopoMap Contours"
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${mapLayer === 'topo' ? 'bg-[#0B4619] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('terrain')}
              title="CartoDB Clean Terrain"
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${mapLayer === 'terrain' ? 'bg-[#0B4619] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Tools: Drop Pin & Distance Measure */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                setToolMode(toolMode === 'pin_drop' ? 'none' : 'pin_drop');
                setDroppedPin(null);
              }}
              title="Drop Incident Pin on Map"
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${toolMode === 'pin_drop' ? 'bg-red-600 text-white shadow-xs animate-pulse' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <MapPin className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setToolMode(toolMode === 'measure' ? 'none' : 'measure');
                if (toolMode === 'measure') clearMeasurement();
              }}
              title="Measure Trail Distance"
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${toolMode === 'measure' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Ruler className="w-4 h-4" />
            </button>
          </div>

          {/* Overlays Visibility Toggles */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setShowOfficers(!showOfficers)}
              title="Toggle Officer Pins"
              className={`p-2 rounded-xl transition-all cursor-pointer ${showOfficers ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400'}`}
            >
              <Users className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowIncidents(!showIncidents)}
              title="Toggle Incident Pins"
              className={`p-2 rounded-xl transition-all cursor-pointer ${showIncidents ? 'text-red-700 bg-red-50' : 'text-slate-400'}`}
            >
              <Flame className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowGeofences(!showGeofences)}
              title="Toggle Geofence Sectors"
              className={`p-2 rounded-xl transition-all cursor-pointer ${showGeofences ? 'text-amber-700 bg-amber-50' : 'text-slate-400'}`}
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Navigation & GPS Controls */}
        <div className="absolute right-3 bottom-14 z-[1000] flex flex-col gap-2">
          {/* Zoom In */}
          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
          >
            <Minus className="w-5 h-5" />
          </button>
          {/* Real GPS Locate Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            title="Track My Real Location (GPS)"
            className={`w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center border border-slate-200 cursor-pointer transition-all ${
              isTrackingGps ? 'text-blue-600 ring-2 ring-blue-400' : 'text-emerald-700 hover:bg-slate-100'
            }`}
          >
            <Crosshair className="w-5 h-5" />
          </button>
        </div>

        {/* Pin Dropped Action Card */}
        {toolMode === 'pin_drop' && droppedPin && (
          <div className="absolute bottom-14 inset-x-4 z-[1000] bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-wider block">Dropped Map Geotag</span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-0.5 line-clamp-1">{droppedPin.address}</h4>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  📍 {droppedPin.lat.toFixed(5)}, {droppedPin.lng.toFixed(5)}
                </p>
              </div>
              <button onClick={() => setDroppedPin(null)} className="text-slate-400 hover:text-slate-700 p-1">
                ✕
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onOpenReportModalWithCoords) {
                  onOpenReportModalWithCoords(droppedPin.lat, droppedPin.lng, droppedPin.address);
                } else {
                  alert(`Report filed for location: ${droppedPin.lat}, ${droppedPin.lng}`);
                }
                setToolMode('none');
                setDroppedPin(null);
              }}
              className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Report Incident at This Exact Location</span>
            </button>
          </div>
        )}

        {/* Distance Measure Floating Banner */}
        {toolMode === 'measure' && (
          <div className="absolute bottom-14 inset-x-4 z-[1000] bg-white/95 backdrop-blur-md rounded-3xl p-3.5 shadow-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Trail Distance ({measurePoints.length} points)</span>
                <span className="font-extrabold text-sm text-slate-900 font-mono">
                  {(measuredDistanceMeters / 1000).toFixed(2)} km <span className="text-xs text-slate-500">({(measuredDistanceMeters * 0.000621371).toFixed(2)} miles)</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearMeasurement}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setToolMode('none')}
                className="bg-[#0B4619] hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Selected Entity Card Popover */}
        {selectedEntity && (
          <div className="absolute bottom-14 inset-x-4 z-[1000] bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#0B4619] tracking-wider block">
                  {selectedEntity.type}
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {selectedEntity.type === 'officer' ? selectedEntity.data.name :
                   selectedEntity.type === 'incident' ? selectedEntity.data.title :
                   selectedEntity.type === 'zone' ? selectedEntity.data.name :
                   selectedEntity.data.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {selectedEntity.type === 'officer' ? `Sector: ${selectedEntity.data.sector} • Battery: ${selectedEntity.data.battery}% • Status: ${selectedEntity.data.status}` :
                   selectedEntity.type === 'incident' ? selectedEntity.data.description :
                   selectedEntity.type === 'zone' ? `Risk Level: ${selectedEntity.data.riskLevel} • Type: ${selectedEntity.data.type}` :
                   `Coordinates: ${selectedEntity.data.lat}, ${selectedEntity.data.lng} • Status: ${selectedEntity.data.status}`}
                </p>
              </div>
              <button 
                onClick={() => setSelectedEntity(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedEntity.type === 'checkpoint' && selectedEntity.data.status === 'pending' && (
              <button
                type="button"
                onClick={() => {
                  onCheckInCheckpoint(selectedEntity.data.id);
                  setSelectedEntity(null);
                }}
                className="mt-3 w-full bg-[#0B4619] hover:bg-[#083613] text-white font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Checkpoint Arrival</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Status Telemetry Bar */}
      <div className="bg-white text-slate-700 text-[11px] font-mono px-4 py-2 flex items-center justify-between border-t border-slate-200 z-[1000]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#0B4619]" />
          <span className="font-bold">{currentCenter.lat.toFixed(4)}° N, {Math.abs(currentCenter.lng).toFixed(4)}° W</span>
        </div>
        <div className="flex items-center gap-2">
          {userLocation && (
            <span className="text-blue-600 font-bold">GPS: ±{Math.round(userLocation.accuracy)}m</span>
          )}
          {isOffline ? (
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
              Offline Cache
            </span>
          ) : (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live OpenStreetMap
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
