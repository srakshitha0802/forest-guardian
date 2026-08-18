import React from 'react';
import { Network, ChevronRight, FolderTree, X } from 'lucide-react';

interface DivisionHierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DivisionHierarchyModal: React.FC<DivisionHierarchyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col animate-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0B4619]">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Administrative Division Tree</h3>
              <p className="text-[10px] text-slate-500 font-mono">CIRCLE &gt; DIVISION &gt; RANGE &gt; BEAT &gt; ZONE</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tree Hierarchy Display */}
        <div className="flex-1 overflow-y-auto py-3.5 space-y-3.5 text-xs">
          {/* Circle Level */}
          <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2 font-extrabold uppercase text-slate-900 text-xs">
              <FolderTree className="w-4 h-4 text-[#0B4619]" />
              <span>State High Sierra Forest Circle (HQ)</span>
            </div>

            {/* Division Level */}
            <div className="ml-3 pl-3 border-l-2 border-[#0B4619]/40 space-y-3">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 font-mono text-[11px]">
                <ChevronRight className="w-3.5 h-3.5 text-[#0B4619]" />
                <span>HIGHLAND NORTH DIVISION (14,200 HA)</span>
              </div>

              {/* Range Level */}
              <div className="ml-3 pl-3 border-l-2 border-slate-200 space-y-2.5">
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="font-bold uppercase tracking-wider text-[#0B4619] font-mono text-xs">Range 7 - Ridge Line & Basin</div>
                  <div className="text-[11px] font-mono text-slate-600 pl-1 space-y-1">
                    <div>• Beat 1: North Watchtower (Officer Hayes - <span className="text-emerald-700 font-bold">ACTIVE</span>)</div>
                    <div>• Beat 2: Double Rock Gorge (Officer Kim - <span className="text-red-600 font-bold">SOS ALERT</span>)</div>
                    <div>• Beat 3: East Ridge Trail (Officer Ranger - <span className="text-emerald-700 font-bold">ACTIVE</span>)</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="font-bold uppercase tracking-wider text-[#0B4619] font-mono text-xs">Range 4 - Valley Core & Riverbed</div>
                  <div className="text-[11px] font-mono text-slate-600 pl-1 space-y-1">
                    <div>• Beat 4: Alpha Stream Crossing (Officer Lin - <span className="text-red-600 font-bold">SOS ALERT</span>)</div>
                    <div>• Beat 5: South Pine Flat (Officer Mendez - <span className="text-emerald-700 font-bold">ACTIVE</span>)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

