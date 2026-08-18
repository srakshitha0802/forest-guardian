import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  AlertTriangle, 
  Flame, 
  Radio, 
  ShieldAlert, 
  CloudSun, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  Filter,
  Trash2
} from 'lucide-react';
import { fieldAudio } from '../utils/audioSynth';

export interface AppNotification {
  id: string;
  category: 'SOS' | 'FIRE' | 'INCIDENT' | 'PATROL' | 'GEOFENCE' | 'WEATHER' | 'SYSTEM' | 'CHAT' | 'ADMIN_BROADCAST';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  actionData?: any;
}

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = notifications.filter(n => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'unread') return !n.isRead;
    if (filterCategory === 'emergency') return n.category === 'SOS' || n.category === 'FIRE';
    if (filterCategory === 'patrol') return n.category === 'PATROL' || n.category === 'GEOFENCE';
    if (filterCategory === 'chat') return n.category === 'CHAT' || n.category === 'ADMIN_BROADCAST';
    return true;
  });

  const getCategoryIcon = (cat: AppNotification['category']) => {
    switch (cat) {
      case 'SOS':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'FIRE':
        return <Flame className="w-4 h-4 text-red-600" />;
      case 'INCIDENT':
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      case 'GEOFENCE':
      case 'PATROL':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'WEATHER':
        return <CloudSun className="w-4 h-4 text-sky-600" />;
      case 'CHAT':
      case 'ADMIN_BROADCAST':
        return <Radio className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-md h-[90vh] max-h-[680px] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0B4619] shadow-xs relative">
              <Bell className="w-5 h-5 stroke-[2.2]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                Operations Notification Center
              </h3>
              <p className="text-[10px] font-mono text-slate-500">
                FCM Push Stream • Air-Gapped Cache
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => { fieldAudio.playTap(); onMarkAllAsRead(); }}
              title="Mark All as Read"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-emerald-700" />
            </button>

            <button
              type="button"
              onClick={() => { fieldAudio.playTap(); onClose(); }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1.5 overflow-x-auto text-[11px] font-bold">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'emergency', label: 'Emergency' },
            { id: 'patrol', label: 'Patrol & Geofence' },
            { id: 'chat', label: 'Broadcasts' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => { fieldAudio.playTap(); setFilterCategory(f.id); }}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === f.id 
                  ? 'bg-[#0B4619] text-white shadow-xs' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300" />
              <p>No notifications matching this filter</p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  fieldAudio.playTap();
                  if (!item.isRead) onMarkAsRead(item.id);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  !item.isRead 
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs' 
                    : 'bg-white border-slate-200 hover:border-slate-300 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {item.category} • {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.priority === 'CRITICAL' && (
                      <span className="bg-red-100 text-red-700 text-[8px] font-black px-1.5 py-0.5 rounded font-mono">
                        CRITICAL
                      </span>
                    )}
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 mt-2 font-sans leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
          <button
            type="button"
            onClick={() => { fieldAudio.playTap(); onClearNotifications(); }}
            className="text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cache</span>
          </button>
          <span className="text-slate-400">Total: {notifications.length} logs</span>
        </div>

      </div>
    </div>
  );
};
