import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Flame, 
  ShieldAlert, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  Compass, 
  Radio, 
  AlertTriangle,
  Clock,
  Database,
  Brain
} from 'lucide-react';
import { UserRole, Incident, TeamOfficer, PatrolState, SOSAlert } from '../types';
import { fieldAudio } from '../utils/audioSynth';
import { useVoiceRecorder } from '../utils/useVoiceRecorder';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  incidents: Incident[];
  teamOfficers: TeamOfficer[];
  patrolState: PatrolState;
  sosAlerts: SOSAlert[];
  onNavigateToMap?: () => void;
  onSelectIncident?: (incident: Incident) => void;
}

interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  dataOrigin?: 'LIVE DATA' | 'CACHED DATA' | 'AI PREDICTION' | 'HISTORICAL DATA';
  confidenceScore?: number;
  actionButton?: {
    label: string;
    action: () => void;
  };
  metrics?: { label: string; value: string; color?: string }[];
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  incidents,
  teamOfficers,
  patrolState,
  sosAlerts,
  onNavigateToMap,
  onSelectIncident,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Greetings ${currentUserRole === 'ADMIN' ? 'Chief Warden' : currentUserRole === 'RANGER' ? 'Range Commander' : 'Officer'}. I am **Forest Guardian AI Core** (v4.2-Edge). I can analyze live telemetry, calculate fire danger, detect illegal logging anomalies, optimize patrol paths, and coordinate emergency response.`,
      timestamp: 'Just now',
      dataOrigin: 'LIVE DATA',
      confidenceScore: 99.4,
      metrics: [
        { label: 'ACTIVE OFFICERS', value: `${teamOfficers.filter(o => o.status === 'on_patrol').length} Units`, color: 'text-emerald-700' },
        { label: 'UNRESOLVED INCIDENTS', value: `${incidents.filter(i => i.status === 'pending' || i.status === 'under_review').length}`, color: 'text-amber-700' },
        { label: 'FIRE RISK LEVEL', value: 'ELEVATED (68/100)', color: 'text-red-700' }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceRecorder = useVoiceRecorder();

  useEffect(() => {
    if (voiceRecorder.transcript) {
      setInputQuery(voiceRecorder.transcript);
    }
  }, [voiceRecorder.transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  // Role-specific suggested prompts
  const suggestedQueries = currentUserRole === 'ADMIN' ? [
    'Summarize today forest operational activity',
    'Which beat has the lowest patrol coverage?',
    'Illegal logging hotspot prediction report',
    'Emergency response readiness & SOS status'
  ] : currentUserRole === 'RANGER' ? [
    'Which officers are currently on active patrol?',
    'Show unresolved critical incidents requiring triage',
    'Which nearby unit can respond fastest to emergency?',
    'Patrol gap analysis for Sector 7'
  ] : [
    'What is the fire weather risk for my beat today?',
    'Optimize my remaining patrol route for today',
    'Show nearest active checkpoints to my location',
    'Safety protocol for high-risk smoke anomaly'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    fieldAudio.playTap();
    const userMsg: AIMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    voiceRecorder.clearRecording();
    setIsThinking(true);

    // AI Reasoning Engine (Simulated Edge-AI reasoning with grounded local data)
    setTimeout(() => {
      fieldAudio.playRadioReceive();
      setIsThinking(false);

      const qLower = query.toLowerCase();
      let responseText = '';
      let dataOrigin: 'LIVE DATA' | 'CACHED DATA' | 'AI PREDICTION' | 'HISTORICAL DATA' = 'LIVE DATA';
      let confidence = 96.5;
      let actionBtn: { label: string; action: () => void } | undefined = undefined;
      let metrics: { label: string; value: string; color?: string }[] | undefined = undefined;

      if (qLower.includes('fire') || qLower.includes('smoke') || qLower.includes('risk')) {
        dataOrigin = 'AI PREDICTION';
        confidence = 94.2;
        responseText = `**Wildfire Risk Assessment (Sector 4 - Alpha & Sector 7)**:\n\n• **Fire Weather Index (FWI)**: **68/100 (HIGH RISK)**\n• **Key Factors**: Ambient Temp **28°C**, Relative Humidity **14% (Critically Dry)**, Wind **18 km/h NW**.\n• **Vegetation Dryness**: 82% Fine Fuel Moisture Deficit.\n• **AI Recommendation**: Increase aerial thermal sweep over Ridge Line B-12. Prohibit all controlled burns and alert Rapid Response Crew 3.`;
        metrics = [
          { label: 'FWI SCORE', value: '68 / 100', color: 'text-red-700' },
          { label: 'HUMIDITY', value: '14% (Dry)', color: 'text-amber-700' },
          { label: 'WIND', value: '18 km/h NW', color: 'text-slate-800' }
        ];
        if (onNavigateToMap) {
          actionBtn = { label: 'View Fire Hotspot Map', action: () => { onClose(); onNavigateToMap(); } };
        }
      } else if (qLower.includes('officer') || qLower.includes('patrol') || qLower.includes('who')) {
        const onPatrolOfficers = teamOfficers.filter(o => o.status === 'on_patrol');
        dataOrigin = 'LIVE DATA';
        confidence = 99.8;
        responseText = `**Active Field Personnel Telemetry**:\n\n• **Currently on Active Patrol**: **${onPatrolOfficers.length} of ${teamOfficers.length} Officers**\n• ${onPatrolOfficers.map(o => `**${o.name}** (${o.badgeId}) — ${o.sector} • Battery: ${o.battery}% • Last ping: ${o.lastCheckIn}`).join('\n• ')}\n\n**Patrol State**: Total team coverage is on track for 88% of scheduled sector routes.`;
        metrics = [
          { label: 'ACTIVE PATROL UNITS', value: `${onPatrolOfficers.length}`, color: 'text-emerald-700' },
          { label: 'AVG BATTERY', value: '91%', color: 'text-slate-800' },
          { label: 'GPS LOCK ACCURACY', value: '3.4m', color: 'text-emerald-700' }
        ];
      } else if (qLower.includes('gap') || qLower.includes('coverage') || qLower.includes('beat')) {
        dataOrigin = 'AI PREDICTION';
        confidence = 92.0;
        responseText = `**Patrol Coverage Gap Analysis**:\n\n• **Under-Patrolled Zone Detected**: **Sector 2 - West Basin (Beat 4)** has received **42% less patrol coverage** than its weekly baseline.\n• **Identified Risk**: Increased acoustic anomaly probability (unauthorized chainsaw frequency) and isolated waterholes.\n• **Recommendation**: Re-route Officer FG-8842 or deploy Reserve Patrol Unit B to cover Checkpoints CP-4 & CP-5 this afternoon.`;
        metrics = [
          { label: 'COVERAGE DEFICIT', value: '-42% Gaps', color: 'text-red-700' },
          { label: 'PRIORITY BEAT', value: 'Beat 4 (West)', color: 'text-amber-700' },
          { label: 'RECOVERY TIME', value: '~45 mins', color: 'text-emerald-700' }
        ];
      } else if (qLower.includes('incident') || qLower.includes('unresolved') || qLower.includes('critical')) {
        const pending = incidents.filter(i => i.status === 'pending' || i.status === 'under_review');
        dataOrigin = 'LIVE DATA';
        confidence = 98.6;
        responseText = `**Unresolved Incident Queue (${pending.length} cases)**:\n\n` + pending.map((inc, i) => `**${i + 1}. [${inc.urgency.toUpperCase()}] ${inc.title}**\n• Location: ${inc.sector}\n• AI Risk Score: **${inc.aiRiskScore}/10**\n• Classification: ${inc.aiClassification || 'General Threat'}`).join('\n\n');
        if (pending[0] && onSelectIncident) {
          actionBtn = { label: `Inspect ${pending[0].title}`, action: () => { onClose(); onSelectIncident(pending[0]); } };
        }
      } else if (qLower.includes('sos') || qLower.includes('emergency') || qLower.includes('respond')) {
        dataOrigin = 'LIVE DATA';
        confidence = 99.9;
        const activeSos = sosAlerts.filter(s => s.active);
        if (activeSos.length > 0) {
          responseText = `**CRITICAL EMERGENCY DISPATCH ALERT**:\n\n• **Active SOS**: ${activeSos[0].officerName} (${activeSos[0].badgeId}) in **${activeSos[0].sector}**\n• **Recommended Closest Responder**: **Officer Marcus Vance (FG-8842)** (~1.4 km away, ETA 8 mins via Trail 3).\n• **Immediate Action**: Dispatch alert broadcasted on Tactical Radio Ch 1.`;
        } else {
          responseText = `**Emergency Readiness Status**:\n\n• All units reporting normal telemetry. No active SOS distress beacons.\n• **Emergency Quick Response Team**: On standby at Range HQ with medical kit & off-road rescue vehicle.`;
        }
        metrics = [
          { label: 'ACTIVE SOS', value: `${activeSos.length}`, color: activeSos.length > 0 ? 'text-red-700' : 'text-emerald-700' },
          { label: 'DISPATCH READINESS', value: '100% STANDBY', color: 'text-emerald-700' }
        ];
      } else if (qLower.includes('optimize') || qLower.includes('route')) {
        dataOrigin = 'AI PREDICTION';
        confidence = 95.8;
        responseText = `**AI Optimized Patrol Route (Dijkstra + Risk Weighted)**:\n\n1. **Start**: CP-1 North Ridge Lookout (Checked)\n2. **Next Priority**: CP-4 Valley Pass (High Fire Risk Buffer — 2.4 km)\n3. **Waypoint**: Sector 2 West Perimeter (Close patrol gap — 1.8 km)\n4. **Finish**: CP-5 East Timber Perimeter (Check camera trap CT-02)\n\n• **Estimated Distance**: **6.2 km** (Saves 1.8 km vs standard loop)\n• **Estimated Time**: **1h 25m**\n• **Risk Coverage Score**: **94%**`;
        if (onNavigateToMap) {
          actionBtn = { label: 'Load Optimized Path onto GIS Map', action: () => { onClose(); onNavigateToMap(); } };
        }
      } else if (qLower.includes('logging') || qLower.includes('hotspot') || qLower.includes('poaching')) {
        dataOrigin = 'HISTORICAL DATA';
        confidence = 91.5;
        responseText = `**Illegal Logging & Poaching Hotspot Prediction**:\n\n• **High Probability Hotspot**: **Grid B-14 / Sector 2 River Basin**.\n• **Correlation Factors**: Low night-time patrol density, proximity to abandoned timber road (Access Gate 4), recent acoustic chainsaw decibel spike.\n• **AI Prediction**: 78% probability of illegal nocturnal felling activity within 48 hours.\n• **Suggested Operation**: Deploy 2 acoustic sensor arrays and schedule a 02:00 AM joint night patrol.`;
        metrics = [
          { label: 'HOTSPOT RISK', value: '78% PROBABILITY', color: 'text-red-700' },
          { label: 'TARGET ZONE', value: 'Grid B-14', color: 'text-slate-900' }
        ];
      } else {
        dataOrigin = 'CACHED DATA';
        confidence = 93.0;
        responseText = `**Forest Intelligence Analysis for "${query}"**:\n\nBased on current operational logs, beat telemetry, and GIS layers:\n• Forest ecosystem stability is currently rated **NORMAL** with elevated dry weather precautions.\n• All ${teamOfficers.length} officers are accounted for.\n• AI recommends maintaining regular patrol frequencies and ensuring all waterhole checkpoints are verified before 16:00.`;
      }

      const aiMsg: AIMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dataOrigin,
        confidenceScore: confidence,
        actionButton: actionBtn,
        metrics
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg h-[92vh] max-h-[720px] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0B4619] shadow-xs">
              <Brain className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                  Forest Guardian AI Core
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-md">
                  v4.2-EDGE
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Air-Gapped Real-Time Decision Support
              </span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => { fieldAudio.playTap(); onClose(); }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Disclaimer Bar */}
        <div className="bg-amber-50 border-b border-amber-200/70 px-4 py-1.5 flex items-center justify-between text-[10px] font-mono text-amber-900">
          <span className="flex items-center gap-1 font-bold">
            <Sparkles className="w-3 h-3 text-amber-600" />
            AI Decision Support • Human verification required
          </span>
          <span className="text-amber-700 font-extrabold uppercase">
            ROLE: {currentUserRole}
          </span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Origin Badge */}
              {msg.dataOrigin && (
                <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
                  <Database className="w-2.5 h-2.5 text-[#0B4619]" />
                  <span>DATA SOURCE: {msg.dataOrigin}</span>
                  {msg.confidenceScore && (
                    <span className="text-emerald-700 ml-1">({msg.confidenceScore}% CONFIDENCE)</span>
                  )}
                </div>
              )}

              <div 
                className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs ${
                  msg.sender === 'user' 
                    ? 'bg-[#0B4619] text-white rounded-br-xs' 
                    : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-bl-xs'
                }`}
              >
                {/* Content formatted with basic markdown line breaks */}
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text.split('\n').map((line, idx) => {
                    if (line.startsWith('• ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                      return <p key={idx} className="my-1 pl-2 border-l-2 border-emerald-500/40">{line}</p>;
                    }
                    if (line.startsWith('**') && line.endsWith('**:')) {
                      return <p key={idx} className="font-extrabold text-slate-900 mt-2 mb-1">{line.replace(/\*\*/g, '')}</p>;
                    }
                    return <p key={idx} className="my-0.5">{line.replace(/\*\*/g, '')}</p>;
                  })}
                </div>

                {/* Optional Telemetry Metrics Grid */}
                {msg.metrics && msg.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-200">
                    {msg.metrics.map((met, mIdx) => (
                      <div key={mIdx} className="bg-white p-2 rounded-xl border border-slate-200 text-center">
                        <span className="text-[8px] font-mono text-slate-400 block font-bold truncate">{met.label}</span>
                        <span className={`text-xs font-mono font-extrabold ${met.color || 'text-slate-900'}`}>{met.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Optional Action Button */}
                {msg.actionButton && (
                  <button
                    type="button"
                    onClick={() => {
                      fieldAudio.playTap();
                      msg.actionButton?.action();
                    }}
                    className="mt-3 w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <span>{msg.actionButton.label}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <span className="text-[9px] font-mono text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-2xl w-fit animate-pulse text-xs font-mono text-slate-600">
              <Bot className="w-4 h-4 text-[#0B4619] animate-spin" />
              <span>Analyzing forest database & telemetry...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Query Chips */}
        <div className="p-2 border-t border-slate-100 bg-slate-50 flex gap-1.5 overflow-x-auto no-scrollbar">
          {suggestedQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#0B4619] border border-slate-200 text-[11px] font-bold px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer shadow-2xs flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#0B4619]" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Input Bar with Voice & Send */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            {/* Voice Dictation Button */}
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
              title="Voice Dictation"
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                voiceRecorder.isRecording 
                  ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {voiceRecorder.isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#0B4619]" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Forest Guardian AI..."
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#0B4619] rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 font-sans outline-hidden placeholder:text-slate-400"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="bg-[#0B4619] hover:bg-emerald-800 disabled:opacity-50 text-white p-2.5 rounded-2xl cursor-pointer shadow-xs transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
