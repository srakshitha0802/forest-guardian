import React, { useState, useEffect } from 'react';
import { UserRole, PatrolState, Incident, TeamOfficer, SOSAlert, Checkpoint } from './types';
import { 
  INITIAL_OFFICER_USER, 
  INITIAL_SOS_ALERTS, 
  GEOFENCE_ZONES 
} from './data/mockData';
import { OfflineStorageManager } from './data/offlineDb';
import { fieldAudio } from './utils/audioSynth';
import { LoginScreen } from './components/LoginScreen';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar, ActiveTab } from './components/BottomNavBar';
import { OfficerDashboard } from './components/OfficerDashboard';
import { RangeOfficerDashboard } from './components/RangeOfficerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ForestMap } from './components/ForestMap';
import { IncidentManager } from './components/IncidentManager';
import { WildlifeFieldGuide } from './components/WildlifeFieldGuide';
import { BeatSurveyTool } from './components/BeatSurveyTool';
import { CameraTrapManager } from './components/CameraTrapManager';
import { WildfireRiskCalculator } from './components/WildfireRiskCalculator';
import { ForestOffenceBook } from './components/ForestOffenceBook';
import { TacticalCompassHUD } from './components/TacticalCompassHUD';
import { ProfileView } from './components/ProfileView';
import { NavigationDrawer } from './components/NavigationDrawer';
import { SOSModal } from './components/SOSModal';
import { AssignPatrolModal } from './components/Modals/AssignPatrolModal';
import { GenerateReportModal } from './components/Modals/GenerateReportModal';
import { ManageUsersModal } from './components/Modals/ManageUsersModal';
import { DivisionHierarchyModal } from './components/Modals/DivisionHierarchyModal';
import { SystemLogsModal } from './components/Modals/SystemLogsModal';
import { ChatModal } from './components/Modals/ChatModal';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { EmergencyCommandCenterModal } from './components/EmergencyCommandCenterModal';
import { NotificationCenterModal, AppNotification } from './components/NotificationCenterModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Battery, 
  Wifi, 
  ShieldAlert, 
  BookOpen, 
  TreePine, 
  Database,
  Camera,
  Flame,
  Scale,
  Compass,
  AlertTriangle,
  Brain
} from 'lucide-react';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    category: 'SOS',
    title: 'Emergency SOS Signal Triggered',
    message: 'Officer J. Hayes (FG-9021) initiated emergency distress beacon in Sector 7 Ridge. Battery at 18%.',
    timestamp: '5 mins ago',
    isRead: false,
    priority: 'CRITICAL'
  },
  {
    id: 'notif_02',
    category: 'FIRE',
    title: 'Elevated Fire Weather Warning (FWI 68)',
    message: 'High wind speed (18 km/h NW) & low humidity (14%) detected in Sector 4 Alpha. High fire risk advisory.',
    timestamp: '25 mins ago',
    isRead: false,
    priority: 'HIGH'
  },
  {
    id: 'notif_03',
    category: 'GEOFENCE',
    title: 'Geofence Perimeter Breach',
    message: 'Unidentified motion signature detected crossing Sector 2 West Timber Boundary.',
    timestamp: '1 hr ago',
    isRead: true,
    priority: 'HIGH'
  },
  {
    id: 'notif_04',
    category: 'PATROL',
    title: 'Checkpoint CP-3 Verified',
    message: 'Officer Ranger checked in at CP-3 Fire Watchtower 4 via GPS proximity lock.',
    timestamp: '2 hrs ago',
    isRead: true,
    priority: 'NORMAL'
  }
];

export default function App() {
  // Authentication & Role
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('OFFICER');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [fieldToolSubTab, setFieldToolSubTab] = useState<'wildlife' | 'survey' | 'camera_trap' | 'wildfire' | 'offence' | 'compass'>('wildlife');
  const [isOffline, setIsOffline] = useState(true); // Default to offline-first mode
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Live Patrol State (GPS simulation & breadcrumb logging)
  const [patrolState, setPatrolState] = useState<PatrolState>({
    isActive: false,
    isPaused: false,
    startTime: null,
    elapsedSeconds: 0,
    distanceKm: 12.0,
    durationHours: 3.0,
    areaCoveredAcres: 450,
    route: [
      { lat: 37.7410, lng: -119.5850, timestamp: '08:00 AM', speed: 4.1, altitude: 410, accuracy: 5 },
      { lat: 37.7485, lng: -119.5720, timestamp: '08:45 AM', speed: 4.3, altitude: 435, accuracy: 4 },
      { lat: 37.7550, lng: -119.5600, timestamp: '09:30 AM', speed: 3.9, altitude: 450, accuracy: 3 }
    ],
    currentSpeed: 4.2,
    checkpoints: OfflineStorageManager.loadCheckpoints(),
    targetKm: 25.0
  });

  // Data States loaded directly from on-device offline storage
  const [incidents, setIncidents] = useState<Incident[]>(() => OfflineStorageManager.loadIncidents());
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [teamOfficers, setTeamOfficers] = useState<TeamOfficer[]>(() => OfflineStorageManager.loadOfficers());
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>(INITIAL_SOS_ALERTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isAssignPatrolOpen, setIsAssignPatrolOpen] = useState(false);
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);
  const [isDivisionHierarchyOpen, setIsDivisionHierarchyOpen] = useState(false);
  const [isSystemLogsOpen, setIsSystemLogsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOfflineHubOpen, setIsOfflineHubOpen] = useState(false);

  // Auto-save incidents & checkpoints to on-device offline storage
  useEffect(() => {
    OfflineStorageManager.saveIncidents(incidents);
  }, [incidents]);

  useEffect(() => {
    OfflineStorageManager.saveCheckpoints(patrolState.checkpoints);
  }, [patrolState.checkpoints]);

  useEffect(() => {
    OfflineStorageManager.saveOfficers(teamOfficers);
  }, [teamOfficers]);

  // Patrol Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (patrolState.isActive && !patrolState.isPaused) {
      interval = setInterval(() => {
        setPatrolState(prev => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
          distanceKm: prev.distanceKm + 0.002,
          areaCoveredAcres: prev.areaCoveredAcres + 0.1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [patrolState.isActive, patrolState.isPaused]);

  // Handle Patrol Actions with sound feedback
  const handleStartPatrol = () => {
    fieldAudio.playRadioChirp();
    setPatrolState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
      startTime: Date.now(),
      elapsedSeconds: prev.elapsedSeconds === 0 ? 1 : prev.elapsedSeconds
    }));
  };

  const handlePausePatrol = () => {
    fieldAudio.playTap();
    setPatrolState(prev => ({ ...prev, isPaused: true }));
  };

  const handleResumePatrol = () => {
    fieldAudio.playRadioChirp();
    setPatrolState(prev => ({ ...prev, isPaused: false }));
  };

  const handleEndPatrol = () => {
    fieldAudio.playCheckpointChime();
    setPatrolState(prev => ({ ...prev, isActive: false, isPaused: false }));
  };

  const handleCheckInCheckpoint = (checkpointId: string) => {
    fieldAudio.playCheckpointChime();
    setPatrolState(prev => ({
      ...prev,
      checkpoints: prev.checkpoints.map(cp => 
        cp.id === checkpointId ? { ...cp, status: 'checked', checkedAt: 'Just now' } : cp
      )
    }));
  };

  // Incident Handlers
  const handleUpdateIncidentStatus = (incidentId: string, status: any) => {
    fieldAudio.playTap();
    setIncidents(prev => prev.map(inc => 
      inc.id === incidentId ? { ...inc, status } : inc
    ));
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleCreateIncident = (newIncident: Omit<Incident, 'id' | 'timestamp'>) => {
    fieldAudio.playRadioReceive();
    const created: Incident = {
      ...newIncident,
      id: `inc_${Date.now()}`,
      timestamp: 'Just now'
    };
    setIncidents([created, ...incidents]);
  };

  // SOS Resolution Handler
  const handleResolveSOS = (sosId: string, notes?: string) => {
    setSosAlerts(prev => prev.map(alert => 
      alert.id === sosId ? { ...alert, active: false, notes, resolvedAt: new Date().toLocaleTimeString() } : alert
    ));
  };

  // Notification Handlers
  const handleMarkNotifAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllNotifsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // User Management Handlers
  const handleAddOfficer = (officerData: Partial<TeamOfficer>) => {
    fieldAudio.playTap();
    const newOfficer: TeamOfficer = {
      id: `usr_${Date.now()}`,
      name: officerData.name || 'New Officer',
      badgeId: officerData.badgeId || 'FG-9900',
      role: officerData.role || 'OFFICER',
      sector: officerData.sector || 'Sector 4 - Alpha',
      beat: officerData.beat || 'Beat 1',
      status: 'available',
      battery: 100,
      lat: 37.7550,
      lng: -119.5600,
      lastCheckIn: 'Just now',
      activePatrolKm: 0
    };
    setTeamOfficers([...teamOfficers, newOfficer]);
  };

  const handleDeleteOfficer = (id: string) => {
    fieldAudio.playTap();
    setTeamOfficers(teamOfficers.filter(o => o.id !== id));
  };

  // Auth Handlers
  const handleLogin = (role: UserRole) => {
    fieldAudio.playRadioReceive();
    setCurrentRole(role);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    fieldAudio.playTap();
    setIsAuthenticated(false);
  };

  // Badge counts
  const pendingIncidentsCount = incidents.filter(i => i.status === 'pending' || i.status === 'under_review').length;
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-center font-sans antialiased select-none p-0 sm:p-4">
      {/* Top Floating Control Bar */}
      <header className="fixed top-2 z-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full px-3.5 py-1.5 shadow-lg flex items-center gap-2 text-xs text-slate-800">
        <span className="font-extrabold text-[#0B4619] flex items-center gap-1 uppercase tracking-wider text-[10px]">
          <Sparkles className="w-3.5 h-3.5 text-[#0B4619]" /> Role:
        </span>

        {/* Role Quick Switches */}
        <div className="flex bg-slate-100 rounded-full p-0.5 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              fieldAudio.playTap();
              setIsAuthenticated(false);
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              !isAuthenticated ? 'bg-[#0B4619] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              fieldAudio.playTap();
              setIsAuthenticated(true);
              setCurrentRole('OFFICER');
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              isAuthenticated && currentRole === 'OFFICER' ? 'bg-[#0B4619] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Officer
          </button>
          <button
            type="button"
            onClick={() => {
              fieldAudio.playTap();
              setIsAuthenticated(true);
              setCurrentRole('RANGER');
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              isAuthenticated && currentRole === 'RANGER' ? 'bg-[#0B4619] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Range RO
          </button>
          <button
            type="button"
            onClick={() => {
              fieldAudio.playTap();
              setIsAuthenticated(true);
              setCurrentRole('ADMIN');
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              isAuthenticated && currentRole === 'ADMIN' ? 'bg-[#0B4619] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
        </div>

        {/* AI Quick Launcher Button */}
        <button
          type="button"
          onClick={() => {
            fieldAudio.playRadioChirp();
            setIsAIAssistantOpen(true);
          }}
          title="Open Forest Guardian AI Assistant"
          className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#0B4619] border border-emerald-200 ml-1 transition-colors cursor-pointer"
        >
          <Brain className="w-3.5 h-3.5" />
        </button>

        {/* Offline Hub Quick Launcher */}
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setIsOfflineHubOpen(true);
          }}
          title="Open Offline Storage Hub & GPX Track Exporter"
          className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
        >
          <Database className="w-3.5 h-3.5" />
        </button>

        {/* View Mode Toggle */}
        <button
          type="button"
          onClick={() => {
            fieldAudio.playTap();
            setIsPhoneFrame(!isPhoneFrame);
          }}
          title={isPhoneFrame ? 'Switch to Full Screen Layout' : 'Switch to Mobile Phone Mockup Frame'}
          className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
        >
          {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5 text-[#0B4619]" />}
        </button>
      </header>

      {/* Main Container / Mobile Device Mockup Frame */}
      <main
        className={`w-full transition-all duration-300 overflow-hidden flex flex-col bg-white ${
          isPhoneFrame
            ? 'max-w-[430px] h-[92vh] sm:h-[880px] sm:rounded-[44px] shadow-[0_20px_50px_rgba(15,23,42,0.15)] border-0 sm:border-[8px] sm:border-slate-800 mt-10 relative text-slate-900'
            : 'max-w-4xl min-h-screen shadow-xl mt-12 relative text-slate-900'
        }`}
      >
        {/* Mobile Device Notch & Status Bar */}
        {isPhoneFrame && (
          <div className="w-full bg-slate-900 pt-2 px-6 pb-1.5 flex items-center justify-between text-[11px] font-mono font-bold text-white select-none z-30 shrink-0">
            <span>09:41</span>
            <div className="w-20 h-3.5 bg-black rounded-full border border-slate-700 hidden sm:block" />
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[9px] tracking-wider text-emerald-400 font-bold bg-emerald-950 px-1 rounded">AIR-GAP</span>
              <Wifi className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">98%</span>
                <div className="w-4 h-2 rounded-xs border border-slate-400 p-0.5 flex items-center">
                  <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                </div>
              </div>
            </div>
          </div>
        )}

        {!isAuthenticated ? (
          /* Screen 1: Login Screen */
          <div className="flex-1 overflow-y-auto bg-slate-50">
            <LoginScreen onLogin={handleLogin} />
          </div>
        ) : (
          /* Authenticated Mobile App Experience */
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
            {/* Top App Bar */}
            <TopAppBar
              role={currentRole}
              onOpenMenu={() => {
                fieldAudio.playTap();
                setIsDrawerOpen(true);
              }}
              onTriggerSOS={() => {
                fieldAudio.playSOSAlert();
                setIsSOSOpen(true);
              }}
              onOpenSearch={() => {
                fieldAudio.playTap();
                setIsGlobalSearchOpen(true);
              }}
              onOpenNotifications={() => {
                fieldAudio.playTap();
                setIsNotificationCenterOpen(true);
              }}
              onOpenAI={() => {
                fieldAudio.playRadioChirp();
                setIsAIAssistantOpen(true);
              }}
              unreadNotificationsCount={unreadNotificationsCount}
              isOffline={isOffline}
            />

            {/* Scrollable Main Screen Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50 relative">
              {activeTab === 'dashboard' && (
                <>
                  {currentRole === 'OFFICER' && (
                    <OfficerDashboard
                      patrolState={patrolState}
                      onStartPatrol={handleStartPatrol}
                      onPausePatrol={handlePausePatrol}
                      onResumePatrol={handleResumePatrol}
                      onEndPatrol={handleEndPatrol}
                      onSelectIncident={(inc) => {
                        setSelectedIncident(inc);
                        setActiveTab('incidents');
                      }}
                      onNavigateToMap={() => setActiveTab('map')}
                      recentIncidents={incidents}
                    />
                  )}

                  {currentRole === 'RANGER' && (
                    <RangeOfficerDashboard
                      teamOfficers={teamOfficers}
                      incidents={incidents}
                      onOpenAssignPatrol={() => setIsAssignPatrolOpen(true)}
                      onOpenGenerateReport={() => setIsGenerateReportOpen(true)}
                      onSelectIncident={(inc) => {
                        setSelectedIncident(inc);
                        setActiveTab('incidents');
                      }}
                      onNavigateToMap={() => setActiveTab('map')}
                      onNavigateToIncidents={() => setActiveTab('incidents')}
                    />
                  )}

                  {currentRole === 'ADMIN' && (
                    <AdminDashboard
                      sosAlerts={sosAlerts}
                      onReviewSOSAlerts={() => setIsCommandCenterOpen(true)}
                      onOpenManageUsers={() => setIsManageUsersOpen(true)}
                      onOpenDivisionHierarchy={() => setIsDivisionHierarchyOpen(true)}
                      onOpenSystemLogs={() => setIsSystemLogsOpen(true)}
                      onNavigateToMap={() => setActiveTab('map')}
                    />
                  )}
                </>
              )}

              {activeTab === 'map' && (
                <ForestMap
                  teamOfficers={teamOfficers}
                  incidents={incidents}
                  checkpoints={patrolState.checkpoints}
                  geofences={GEOFENCE_ZONES}
                  patrolState={patrolState}
                  onCheckInCheckpoint={handleCheckInCheckpoint}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                  isOffline={isOffline}
                />
              )}

              {activeTab === 'incidents' && (
                <IncidentManager
                  incidents={incidents}
                  currentUserRole={currentRole}
                  onUpdateStatus={handleUpdateIncidentStatus}
                  onCreateIncident={handleCreateIncident}
                  selectedIncident={selectedIncident}
                  onSelectIncident={setSelectedIncident}
                />
              )}

              {activeTab === 'field_tools' && (
                <div className="flex flex-col h-full">
                  {/* Sub Header for Field Tools */}
                  <div className="bg-white px-2 py-2 border-b border-slate-200 sticky top-0 z-10 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1.5 min-w-max px-2">
                      <button
                        type="button"
                        onClick={() => {
                          fieldAudio.playTap();
                          setFieldToolSubTab('wildlife');
                        }}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          fieldToolSubTab === 'wildlife' ? 'bg-[#0B4619] text-white shadow-xs font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Species Guide</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          fieldAudio.playTap();
                          setFieldToolSubTab('survey');
                        }}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          fieldToolSubTab === 'survey' ? 'bg-[#0B4619] text-white shadow-xs font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <TreePine className="w-3.5 h-3.5" />
                        <span>Beat Survey</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          fieldAudio.playTap();
                          setFieldToolSubTab('camera_trap');
                        }}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          fieldToolSubTab === 'camera_trap' ? 'bg-[#0B4619] text-white shadow-xs font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Traps & Drone</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          fieldAudio.playTap();
                          setFieldToolSubTab('wildfire');
                        }}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          fieldToolSubTab === 'wildfire' ? 'bg-[#0B4619] text-white shadow-xs font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Fire FWI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          fieldAudio.playTap();
                          setFieldToolSubTab('offence');
                        }}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          fieldToolSubTab === 'offence' ? 'bg-[#0B4619] text-white shadow-xs font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Offence (Form-A)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          fieldAudio.playTap();
                          setFieldToolSubTab('compass');
                        }}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          fieldToolSubTab === 'compass' ? 'bg-[#0B4619] text-white shadow-xs font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Dead Reckoning</span>
                      </button>
                    </div>
                  </div>

                  {fieldToolSubTab === 'wildlife' && <WildlifeFieldGuide />}
                  {fieldToolSubTab === 'survey' && <BeatSurveyTool />}
                  {fieldToolSubTab === 'camera_trap' && <CameraTrapManager />}
                  {fieldToolSubTab === 'wildfire' && <WildfireRiskCalculator />}
                  {fieldToolSubTab === 'offence' && <ForestOffenceBook />}
                  {fieldToolSubTab === 'compass' && <TacticalCompassHUD />}
                </div>
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  currentUserRole={currentRole}
                  onChangeRole={setCurrentRole}
                  onLogout={handleLogout}
                  isOffline={isOffline}
                  onToggleOffline={() => setIsOffline(!isOffline)}
                  onOpenOfflineHub={() => setIsOfflineHubOpen(true)}
                />
              )}
            </div>

            {/* Bottom Nav Bar */}
            <BottomNavBar
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              incidentBadgeCount={pendingIncidentsCount}
            />
          </div>
        )}
      </main>

      {/* Slide Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentUserRole={currentRole}
        onChangeRole={setCurrentRole}
        onOpenAI={() => setIsAIAssistantOpen(true)}
        onOpenCommandCenter={() => setIsCommandCenterOpen(true)}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onOpenOfflineHub={() => setIsOfflineHubOpen(true)}
        onSelectFieldTool={(tool) => {
          fieldAudio.playTap();
          setActiveTab('field_tools');
          setFieldToolSubTab(tool);
        }}
        onOpenChat={() => {
          fieldAudio.playRadioChirp();
          setIsChatOpen(true);
        }}
        onOpenReport={() => setIsGenerateReportOpen(true)}
        onOpenLogs={() => setIsSystemLogsOpen(true)}
        onOpenHierarchy={() => setIsDivisionHierarchyOpen(true)}
        onOpenUsers={() => setIsManageUsersOpen(true)}
        onLogout={handleLogout}
      />

      {/* In-App AI Intelligence Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        currentUserRole={currentRole}
        incidents={incidents}
        teamOfficers={teamOfficers}
        patrolState={patrolState}
        sosAlerts={sosAlerts}
        onNavigateToMap={() => setActiveTab('map')}
        onSelectIncident={(inc) => {
          setSelectedIncident(inc);
          setActiveTab('incidents');
        }}
      />

      {/* Emergency CAD Command Center Modal */}
      <EmergencyCommandCenterModal
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
        sosAlerts={sosAlerts}
        teamOfficers={teamOfficers}
        currentUserRole={currentRole}
        onResolveSOS={handleResolveSOS}
        onNavigateToMap={() => setActiveTab('map')}
      />

      {/* Operations Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifAsRead}
        onMarkAllAsRead={handleMarkAllNotifsAsRead}
        onClearNotifications={handleClearNotifications}
      />

      {/* Global Search & Telemetry Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        incidents={incidents}
        teamOfficers={teamOfficers}
        checkpoints={patrolState.checkpoints}
        geofences={GEOFENCE_ZONES}
        currentUserRole={currentRole}
        onSelectIncident={(inc) => {
          setSelectedIncident(inc);
          setActiveTab('incidents');
        }}
        onNavigateToMap={() => setActiveTab('map')}
      />

      {/* Emergency SOS Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onConfirmDeactivate={() => {
          setIsSOSOpen(false);
        }}
      />

      {/* Range Officer Assign Patrol Modal */}
      <AssignPatrolModal
        isOpen={isAssignPatrolOpen}
        onClose={() => setIsAssignPatrolOpen(false)}
        teamOfficers={teamOfficers}
        onAssign={(officerId, sector, targetKm, notes) => {
          fieldAudio.playCheckpointChime();
          console.log('Assigned patrol:', officerId, sector, targetKm, notes);
        }}
      />

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={isGenerateReportOpen}
        onClose={() => setIsGenerateReportOpen(false)}
      />

      {/* Admin Manage Users Modal */}
      <ManageUsersModal
        isOpen={isManageUsersOpen}
        onClose={() => setIsManageUsersOpen(false)}
        teamOfficers={teamOfficers}
        onAddOfficer={handleAddOfficer}
        onDeleteOfficer={handleDeleteOfficer}
      />

      {/* Admin Division Hierarchy Modal */}
      <DivisionHierarchyModal
        isOpen={isDivisionHierarchyOpen}
        onClose={() => setIsDivisionHierarchyOpen(false)}
      />

      {/* Admin System Logs Modal */}
      <SystemLogsModal
        isOpen={isSystemLogsOpen}
        onClose={() => setIsSystemLogsOpen(false)}
      />

      {/* Radio Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUserRole={currentRole}
      />

      {/* Offline Storage Hub Modal */}
      <OfflineManagerModal
        isOpen={isOfflineHubOpen}
        onClose={() => setIsOfflineHubOpen(false)}
        patrolState={patrolState}
        incidents={incidents}
        checkpoints={patrolState.checkpoints}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
      />
    </div>
  );
}
