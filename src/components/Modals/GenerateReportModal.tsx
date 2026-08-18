import React, { useState } from 'react';
import { FileText, Download, CheckCircle, X, FileSpreadsheet, File } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reportType, setReportType] = useState('patrol_range');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [generating, setGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDownloadSuccess(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1600);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0B4619]">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Generate Department Report</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {downloadSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-[#0B4619] mx-auto" />
            <h4 className="font-extrabold uppercase tracking-wider text-slate-900 text-sm">Report Exported Successfully!</h4>
            <p className="text-xs text-slate-500 font-mono">Saved to local device & transmitted to HQ server archive.</p>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="py-3.5 space-y-3.5 text-xs">
            <div>
              <label className="font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1 text-[10px]">Report Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#0B4619] cursor-pointer"
              >
                <option value="patrol_range">Range Patrol Coverage & Officer Performance</option>
                <option value="incident_audit">Incident Log & Ecological Threat Audit</option>
                <option value="fire_hotspot">Fire Risk & Thermal Telemetry Assessment</option>
                <option value="sos_audit">Emergency SOS Response Time Analysis</option>
              </select>
            </div>

            <div>
              <label className="font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1 text-[10px]">Date Interval</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#0B4619] cursor-pointer"
              >
                <option value="Today">Today (Active Patrol Shift)</option>
                <option value="Last 7 Days">Last 7 Days (Standard Cycle)</option>
                <option value="Month-to-Date">Month-to-Date (Aggregated)</option>
                <option value="Annual">Annual Ecological Summary</option>
              </select>
            </div>

            <div>
              <label className="font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1.5 text-[10px]">Export Format</label>
              <div className="grid grid-cols-3 gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setReportFormat('pdf')}
                  className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                    reportFormat === 'pdf' ? 'bg-[#0B4619] border-[#0B4619] text-white shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <File className="w-4 h-4" />
                  <span className="text-[10px]">PDF Doc</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReportFormat('excel')}
                  className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                    reportFormat === 'excel' ? 'bg-[#0B4619] border-[#0B4619] text-white shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="text-[10px]">Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReportFormat('csv')}
                  className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                    reportFormat === 'csv' ? 'bg-[#0B4619] border-[#0B4619] text-white shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[10px]">CSV Raw</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] font-mono text-slate-600 leading-relaxed">
              Includes: Officer GPS breadcrumbs, incident tags, thermal hotspot ratings, and digital timestamp.
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold uppercase tracking-wider py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{generating ? 'Compiling Report...' : `Export ${reportFormat.toUpperCase()} File`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
