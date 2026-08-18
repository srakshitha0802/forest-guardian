import { Incident, SOSAlert, TeamOfficer, GeofenceZone, Checkpoint, SystemAuditLog, ChatMessage } from '../types';

export const INITIAL_OFFICER_USER = {
  id: 'usr_officer_01',
  name: 'Officer Ranger',
  badgeId: 'FG-8842',
  role: 'OFFICER' as const,
  sector: 'Sector 4 - Alpha',
  division: 'Highland North Division',
  beat: 'Beat 3 - Pine Ridge',
  email: 'ranger.morrison@forestguardian.gov',
  phone: '+1 (555) 349-8821',
  status: 'on_patrol' as const,
  batteryLevel: 94,
  assignedRangeKm: 25,
};

export const INITIAL_RANGER_USER = {
  id: 'usr_ranger_02',
  name: 'Commander Sarah Jenkins',
  badgeId: 'FG-RO-102',
  role: 'RANGER' as const,
  sector: 'Sector 7 - Central Range',
  division: 'Highland North Division',
  beat: 'Range HQ Command',
  email: 's.jenkins@forestguardian.gov',
  phone: '+1 (555) 782-9901',
  status: 'on_duty' as const,
  batteryLevel: 88,
  assignedRangeKm: 150,
};

export const INITIAL_ADMIN_USER = {
  id: 'usr_admin_03',
  name: 'Chief Warden Marcus Vance',
  badgeId: 'FG-DIR-001',
  role: 'ADMIN' as const,
  sector: 'Department HQ',
  division: 'State Forest Command',
  beat: 'All Sectors (Alpha-Zeta)',
  email: 'admin.director@forestguardian.gov',
  phone: '+1 (555) 901-4455',
  status: 'on_duty' as const,
  batteryLevel: 98,
  assignedRangeKm: 500,
};

export const INITIAL_CHECKPOINTS: Checkpoint[] = [
  { id: 'cp_1', name: 'CP-1 North Ridge Lookout', lat: 37.7410, lng: -119.5850, status: 'checked', checkedAt: '09:15 AM' },
  { id: 'cp_2', name: 'CP-2 Spring Creek Crossing', lat: 37.7485, lng: -119.5720, status: 'checked', checkedAt: '10:40 AM' },
  { id: 'cp_3', name: 'CP-3 Fire Watchtower 4', lat: 37.7550, lng: -119.5600, status: 'checked', checkedAt: '11:55 AM' },
  { id: 'cp_4', name: 'CP-4 Valley Pass Ranger Station', lat: 37.7620, lng: -119.5480, status: 'pending' },
  { id: 'cp_5', name: 'CP-5 East Timber Perimeter', lat: 37.7690, lng: -119.5350, status: 'pending' },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc_01',
    category: 'smoke_fire',
    title: 'Smoke Detected',
    sector: 'Sector 7 - Ridge Line',
    description: 'Sector 7 - Ridge Line. Potential illegal campfire. Proceed with caution.',
    lat: 37.7562,
    lng: -119.5521,
    timestamp: '10 mins ago',
    status: 'pending',
    urgency: 'high',
    aiRiskScore: 8.8,
    aiClassification: 'Early-stage Thermal Anomaly / Ground Smoke',
    photos: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'
    ],
    reportedBy: 'Thermal Sensor Node #12',
    officerBadge: 'AUTO-CAM',
    assignedOfficer: 'Officer J. Hayes'
  },
  {
    id: 'inc_02',
    category: 'wildlife',
    title: 'Wildlife Crossing',
    sector: 'Trail 3 Crossing',
    description: 'Elk herd migration reported near Trail 3 crossing.',
    lat: 37.7420,
    lng: -119.5690,
    timestamp: '45 mins ago',
    status: 'resolved',
    urgency: 'low',
    aiRiskScore: 3.2,
    aiClassification: 'Ungulate Migration Group (Approx 14 specimens)',
    photos: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'
    ],
    reportedBy: 'Officer Ranger',
    officerBadge: 'FG-8842'
  },
  {
    id: 'inc_03',
    category: 'unauthorized_access',
    title: 'Unauthorized Access',
    sector: 'Zone B-14',
    description: 'Motion detector tripped on non-public logging access road. Vehicle signature detected.',
    lat: 37.7680,
    lng: -119.5900,
    timestamp: '10 mins ago',
    status: 'pending',
    urgency: 'high',
    aiRiskScore: 7.9,
    aiClassification: 'Off-road 4x4 Vehicle Without Transponder',
    photos: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80'
    ],
    reportedBy: 'Zone B-14 Motion Sensor',
    officerBadge: 'AUTO-PIR'
  },
  {
    id: 'inc_04',
    category: 'sensor_offline',
    title: 'Sensor Offline',
    sector: 'Trail Cam #4',
    description: 'Telemetry heartbeat lost for solar-assisted surveillance node #4.',
    lat: 37.7310,
    lng: -119.6100,
    timestamp: '1 hr ago',
    status: 'under_review',
    urgency: 'medium',
    aiRiskScore: 5.1,
    aiClassification: 'Probable Battery Depletion or Canopy Obscuration',
    photos: [],
    reportedBy: 'System Diagnostic Agent',
    officerBadge: 'SYS-DAEMON'
  },
  {
    id: 'inc_05',
    category: 'illegal_logging',
    title: 'Timber Cutting Activity Reported',
    sector: 'Sector 2 - West Basin',
    description: 'Acoustic audio signature matching chainsaw activity recorded by acoustic array #08.',
    lat: 37.7510,
    lng: -119.6250,
    timestamp: '2 hrs ago',
    status: 'under_review',
    urgency: 'high',
    aiRiskScore: 8.4,
    aiClassification: '2-Stroke Chainsaw Frequency Pattern (92% confidence)',
    photos: [],
    reportedBy: 'Acoustic Monitor B2',
    officerBadge: 'AI-ACOUSTIC',
    assignedOfficer: 'Officer Elena Rostova'
  }
];

export const INITIAL_SOS_ALERTS: SOSAlert[] = [
  {
    id: 'sos_01',
    officerId: 'usr_officer_09',
    officerName: 'Officer David K.',
    badgeId: 'FG-7719',
    sector: 'Sector 7 - Double Rock Ravine',
    lat: 37.7615,
    lng: -119.5780,
    batteryLevel: 28,
    timestamp: '8 mins ago',
    active: true,
    notes: 'Officer injured after steep ravine traverse. Needs emergency evacuation assistance.'
  },
  {
    id: 'sos_02',
    officerId: 'usr_officer_14',
    officerName: 'Officer Maya Lin',
    badgeId: 'FG-9102',
    sector: 'Sector 4 - Alpha Gorge',
    lat: 37.7380,
    lng: -119.5620,
    batteryLevel: 45,
    timestamp: '14 mins ago',
    active: true,
    notes: 'Encountered aggressive predator (grizzly mother with cubs) blocking exit trail.'
  },
  {
    id: 'sos_03',
    officerId: 'usr_officer_22',
    officerName: 'Officer Ben Torres',
    badgeId: 'FG-6631',
    sector: 'Zone B-14 Western Ridge',
    lat: 37.7710,
    lng: -119.5440,
    batteryLevel: 62,
    timestamp: '22 mins ago',
    active: true,
    notes: 'Flash flood surge after rapid rainstorm trapped patrol quad-bike in creek bed.'
  }
];

export const INITIAL_TEAM_OFFICERS: TeamOfficer[] = [
  { id: 'usr_1', name: 'Officer Ranger', badgeId: 'FG-8842', role: 'OFFICER', sector: 'Sector 4 - Alpha', beat: 'Beat 3', status: 'on_patrol', battery: 94, lat: 37.7550, lng: -119.5600, lastCheckIn: 'Just now', activePatrolKm: 12.4 },
  { id: 'usr_2', name: 'Officer Elena Rostova', badgeId: 'FG-8810', role: 'OFFICER', sector: 'Sector 7 - North', beat: 'Beat 1', status: 'on_patrol', battery: 82, lat: 37.7640, lng: -119.5490, lastCheckIn: '3m ago', activePatrolKm: 9.8 },
  { id: 'usr_3', name: 'Officer David Kim', badgeId: 'FG-7719', role: 'OFFICER', sector: 'Sector 7 - Double Rock', beat: 'Beat 2', status: 'sos', battery: 28, lat: 37.7615, lng: -119.5780, lastCheckIn: '8m ago', activePatrolKm: 14.1 },
  { id: 'usr_4', name: 'Officer Maya Lin', badgeId: 'FG-9102', role: 'OFFICER', sector: 'Sector 4 - Alpha Gorge', beat: 'Beat 4', status: 'sos', battery: 45, lat: 37.7380, lng: -119.5620, lastCheckIn: '14m ago', activePatrolKm: 6.2 },
  { id: 'usr_5', name: 'Officer Carlos Mendez', badgeId: 'FG-8899', role: 'OFFICER', sector: 'Sector 1 - South Valley', beat: 'Beat 5', status: 'on_patrol', battery: 89, lat: 37.7320, lng: -119.5850, lastCheckIn: '2m ago', activePatrolKm: 11.0 },
  { id: 'usr_6', name: 'Officer Sarah Chen', badgeId: 'FG-7754', role: 'OFFICER', sector: 'Zone B-14', beat: 'Beat 6', status: 'on_patrol', battery: 76, lat: 37.7690, lng: -119.5880, lastCheckIn: '5m ago', activePatrolKm: 8.5 },
  { id: 'usr_7', name: 'Officer Liam Walker', badgeId: 'FG-6640', role: 'OFFICER', sector: 'Sector 3 - Pine Peak', beat: 'Beat 7', status: 'available', battery: 95, lat: 37.7480, lng: -119.5390, lastCheckIn: '12m ago', activePatrolKm: 0 },
  { id: 'usr_8', name: 'Officer Aisha Patel', badgeId: 'FG-9211', role: 'OFFICER', sector: 'Sector 4 - Alpha', beat: 'Beat 2', status: 'on_patrol', battery: 71, lat: 37.7505, lng: -119.5710, lastCheckIn: '1m ago', activePatrolKm: 13.6 },
  { id: 'usr_9', name: 'Officer Thomas Wright', badgeId: 'FG-8302', role: 'OFFICER', sector: 'Sector 7 - Alpha', beat: 'Beat 1', status: 'on_patrol', battery: 64, lat: 37.7590, lng: -119.5640, lastCheckIn: '6m ago', activePatrolKm: 10.3 },
  { id: 'usr_10', name: 'Officer Zoe Martinez', badgeId: 'FG-8490', role: 'OFFICER', sector: 'Sector 2 - West Basin', beat: 'Beat 8', status: 'on_patrol', battery: 83, lat: 37.7530, lng: -119.6100, lastCheckIn: '4m ago', activePatrolKm: 7.9 },
  { id: 'usr_11', name: 'Officer Brian Foster', badgeId: 'FG-7612', role: 'OFFICER', sector: 'Sector 5 - Lake Basin', beat: 'Beat 9', status: 'on_patrol', battery: 91, lat: 37.7280, lng: -119.5700, lastCheckIn: '9m ago', activePatrolKm: 15.2 },
  { id: 'usr_12', name: 'Officer Grace Hopper', badgeId: 'FG-9901', role: 'OFFICER', sector: 'Sector 7 - Alpha', beat: 'Beat 3', status: 'on_patrol', battery: 87, lat: 37.7570, lng: -119.5580, lastCheckIn: '7m ago', activePatrolKm: 12.1 },
  { id: 'usr_13', name: 'Officer James Wilson', badgeId: 'FG-5510', role: 'OFFICER', sector: 'Sector 6 - Echo Ridge', beat: 'Beat 10', status: 'off_duty', battery: 99, lat: 37.7400, lng: -119.6000, lastCheckIn: '3h ago', activePatrolKm: 0 },
  { id: 'usr_14', name: 'Officer Rachel Adams', badgeId: 'FG-5522', role: 'OFFICER', sector: 'Sector 6 - Echo Ridge', beat: 'Beat 11', status: 'off_duty', battery: 100, lat: 37.7405, lng: -119.6010, lastCheckIn: '4h ago', activePatrolKm: 0 },
  { id: 'usr_15', name: 'Officer Noah Miller', badgeId: 'FG-5533', role: 'OFFICER', sector: 'Reserve Pool HQ', beat: 'HQ Reserve', status: 'available', battery: 98, lat: 37.7410, lng: -119.5850, lastCheckIn: '15m ago', activePatrolKm: 0 }
];

export const GEOFENCE_ZONES: GeofenceZone[] = [
  {
    id: 'geo_1',
    name: 'Sector 4 - Alpha Patrol Zone',
    type: 'patrol_area',
    color: '#16a34a',
    riskLevel: 'moderate',
    points: [
      { lat: 37.735, lng: -119.590 },
      { lat: 37.760, lng: -119.580 },
      { lat: 37.765, lng: -119.550 },
      { lat: 37.740, lng: -119.555 }
    ]
  },
  {
    id: 'geo_2',
    name: 'Double Rock Fire Risk Hotspot',
    type: 'high_fire_risk',
    color: '#ef4444',
    riskLevel: 'extreme',
    points: [
      { lat: 37.755, lng: -119.585 },
      { lat: 37.770, lng: -119.575 },
      { lat: 37.768, lng: -119.555 },
      { lat: 37.752, lng: -119.565 }
    ]
  },
  {
    id: 'geo_3',
    name: 'Zone B-14 Restricted Ecological Area',
    type: 'restricted',
    color: '#eab308',
    riskLevel: 'high',
    points: [
      { lat: 37.765, lng: -119.600 },
      { lat: 37.780, lng: -119.585 },
      { lat: 37.775, lng: -119.565 },
      { lat: 37.760, lng: -119.580 }
    ]
  }
];

export const INCIDENT_TRENDS_DATA = [
  { day: 'Mon', resolved: 24, newReports: 18 },
  { day: 'Tue', resolved: 28, newReports: 22 },
  { day: 'Wed', resolved: 33, newReports: 30 },
  { day: 'Thu', resolved: 42, newReports: 26 },
  { day: 'Fri', resolved: 49, newReports: 32 },
  { day: 'Sat', resolved: 44, newReports: 39 },
  { day: 'Sun', resolved: 38, newReports: 35 }
];

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  { id: 'log_01', action: 'SOS Alert Triggered', user: 'Officer David Kim', role: 'Officer (FG-7719)', timestamp: '05:21 AM', details: 'Triggered emergency beacon at Double Rock Ravine', type: 'sos' },
  { id: 'log_02', action: 'Incident Status Updated', user: 'Cmdr. Sarah Jenkins', role: 'Range Officer', timestamp: '05:15 AM', details: 'Changed Smoke Detected #inc_01 to Under Review', type: 'triage' },
  { id: 'log_03', action: 'Patrol Route Dispatched', user: 'Cmdr. Sarah Jenkins', role: 'Range Officer', timestamp: '04:45 AM', details: 'Assigned 18km East Perimeter to Officer Aisha Patel', type: 'patrol' },
  { id: 'log_04', action: 'Geofence Breach Detected', user: 'Zone B-14 Monitor', role: 'Automated System', timestamp: '04:10 AM', details: 'Unauthorized target entered restricted timber boundary', type: 'geofence' },
  { id: 'log_05', action: 'AI Threshold Modified', user: 'Chief Warden Vance', role: 'Department Admin', timestamp: '03:30 AM', details: 'Increased thermal anomaly sensitivity to 85% for dry season', type: 'admin' },
  { id: 'log_06', action: 'Biometric Login Verified', user: 'Officer Ranger', role: 'Officer (FG-8842)', timestamp: '02:00 AM', details: 'Authenticated via Face ID on device Pixel 8', type: 'auth' }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'usr_ranger_02',
    senderName: 'Cmdr. Sarah Jenkins',
    senderRole: 'RANGER',
    text: 'All units on Sector 4 and 7: keep a sharp eye on Ridge Line thermal readings. Humidity is down to 18%.',
    timestamp: '05:10 AM'
  },
  {
    id: 'msg_2',
    senderId: 'usr_officer_01',
    senderName: 'Officer Ranger',
    senderRole: 'OFFICER',
    text: 'Copy that Commander. I am at Checkpoint 3 Watchtower now. Visual smoke check underway.',
    timestamp: '05:14 AM'
  },
  {
    id: 'msg_3',
    senderId: 'usr_officer_01',
    senderName: 'Officer Ranger',
    senderRole: 'OFFICER',
    text: 'Logged a minor wildlife crossing at Trail 3 earlier. Route is clear otherwise.',
    timestamp: '05:16 AM',
    location: { lat: 37.7420, lng: -119.5690, name: 'Trail 3 Elk Crossing' }
  },
  {
    id: 'msg_4',
    senderId: 'usr_admin_03',
    senderName: 'Chief Warden Vance',
    senderRole: 'ADMIN',
    text: 'Dispatching Support Drone Alpha-2 over Double Rock sector to assist Officer Kim. Hold positions.',
    timestamp: '05:24 AM'
  }
];
