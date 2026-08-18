export type UserRole = 'OFFICER' | 'RANGER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  badgeId: string;
  role: UserRole;
  sector: string;
  division: string;
  beat: string;
  email: string;
  phone: string;
  status: 'on_patrol' | 'on_duty' | 'off_duty' | 'sos';
  avatarUrl?: string;
  batteryLevel: number;
  assignedRangeKm?: number;
}

export interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: string;
  speed: number;
  altitude: number;
  accuracy: number;
}

export interface Checkpoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'pending' | 'checked' | 'skipped';
  checkedAt?: string;
}

export interface PatrolState {
  isActive: boolean;
  isPaused: boolean;
  startTime: number | null;
  elapsedSeconds: number;
  distanceKm: number;
  durationHours: number;
  areaCoveredAcres: number;
  route: GPSPoint[];
  currentSpeed: number;
  checkpoints: Checkpoint[];
  targetKm: number;
}

export type IncidentCategory = 
  | 'smoke_fire'
  | 'wildlife'
  | 'unauthorized_access'
  | 'sensor_offline'
  | 'illegal_logging'
  | 'poaching'
  | 'landslide'
  | 'damaged_road';

export type IncidentStatus = 'pending' | 'under_review' | 'resolved' | 'rejected';

export interface Incident {
  id: string;
  category: IncidentCategory;
  title: string;
  sector: string;
  description: string;
  lat: number;
  lng: number;
  timestamp: string;
  status: IncidentStatus;
  urgency: 'high' | 'medium' | 'low';
  aiRiskScore: number; // 1-10
  aiClassification?: string;
  photos: string[];
  reportedBy: string;
  officerBadge: string;
  hasVoiceNote?: boolean;
  assignedOfficer?: string;
}

export interface SOSAlert {
  id: string;
  officerId: string;
  officerName: string;
  badgeId: string;
  sector: string;
  lat: number;
  lng: number;
  batteryLevel: number;
  timestamp: string;
  active: boolean;
  resolvedAt?: string;
  notes?: string;
}

export interface TeamOfficer {
  id: string;
  name: string;
  badgeId: string;
  role: UserRole;
  sector: string;
  beat: string;
  status: 'on_patrol' | 'available' | 'off_duty' | 'sos';
  battery: number;
  lat: number;
  lng: number;
  lastCheckIn: string;
  activePatrolKm: number;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'patrol_area' | 'restricted' | 'wildlife_sanctuary' | 'high_fire_risk';
  color: string;
  points: { lat: number; lng: number }[];
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isVoice?: boolean;
  voiceDuration?: string;
  location?: { lat: number; lng: number; name: string };
  mediaUrl?: string;
}

export interface SystemAuditLog {
  id: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  details: string;
  type: 'auth' | 'sos' | 'triage' | 'patrol' | 'geofence' | 'admin';
}
