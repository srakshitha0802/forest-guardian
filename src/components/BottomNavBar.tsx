import React from 'react';
import { LayoutGrid, Map, AlertTriangle, User, Compass, TreePine } from 'lucide-react';
import { fieldAudio } from '../utils/audioSynth';

export type ActiveTab = 'dashboard' | 'map' | 'incidents' | 'field_tools' | 'profile';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  incidentBadgeCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  incidentBadgeCount = 0,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'map', label: 'Map GIS', icon: Map },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'field_tools', label: 'Field Tools', icon: TreePine },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              fieldAudio.playTap();
              onChangeTab(tab.id);
            }}
            className={`relative flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#0B4619] text-white px-3 py-1.5 rounded-2xl shadow-xs scale-105'
                : 'text-slate-500 hover:text-slate-900 px-2 py-1'
            }`}
          >
            <Icon className="w-4 h-4 stroke-[2.2]" />
            <span className="text-[9px] font-extrabold tracking-tight mt-0.5 whitespace-nowrap">{tab.label}</span>

            {tab.id === 'incidents' && incidentBadgeCount > 0 && !isActive && (
              <span className="absolute -top-1 right-1 bg-red-600 text-white text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                {incidentBadgeCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};


