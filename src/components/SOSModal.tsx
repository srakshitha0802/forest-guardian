import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Radio, 
  Battery, 
  MapPin, 
  KeyRound,
} from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeactivate: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  onConfirmDeactivate,
}) => {
  const [countdown, setCountdown] = useState(3);
  const [beaconActive, setBeaconActive] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setBeaconActive(false);
      setShowPinInput(false);
      setPinCode('');
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setBeaconActive(true);
    }
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  const handleDeactivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '1234' || pinCode === '') {
      onConfirmDeactivate();
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-red-500 w-full max-w-sm rounded-3xl p-6 text-slate-900 text-center shadow-2xl animate-in zoom-in duration-200">
        {!beaconActive ? (
          /* Pre-Trigger Countdown Step */
          <div className="space-y-4 py-4">
            <div className="w-20 h-20 rounded-2xl bg-red-50 border-4 border-red-600 mx-auto flex items-center justify-center text-4xl font-black text-red-600 font-mono animate-ping">
              {countdown}
            </div>
            <h3 className="text-xl font-extrabold uppercase text-red-600 tracking-tight">
              Distress Signal...
            </h3>
            <p className="text-xs text-slate-600">
              Hold or tap cancel to abort false alarm. Emergency beacons alert Range Command & Department HQ immediately.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold uppercase tracking-wider py-3.5 rounded-2xl text-xs border border-slate-200 mt-4 cursor-pointer"
            >
              Cancel Emergency Signal
            </button>
          </div>
        ) : (
          /* Active Emergency Beacon State */
          <div className="space-y-4">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-red-500 animate-ping opacity-30" />
              <div className="w-20 h-20 rounded-3xl bg-red-600 text-white flex items-center justify-center shadow-lg border-4 border-white">
                <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
              </div>
            </div>

            <div>
              <span className="bg-red-50 text-red-700 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-200">
                HIGH PRIORITY EMERGENCY TRANSMITTING
              </span>
              <h3 className="text-xl font-extrabold uppercase text-slate-900 mt-2">
                SOS Beacon Active
              </h3>
              <p className="text-xs text-slate-600 font-mono mt-1">
                Continuous high-frequency GPS telemetry enabled.
              </p>
            </div>

            {/* Signal Details */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-600" /> Location</span>
                <span className="text-slate-900 font-bold">37°45'22"N, 119°34'48"W</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5"><Battery className="w-3.5 h-3.5 text-emerald-600" /> Battery Level</span>
                <span className="text-emerald-700 font-bold">94% Stable</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5"><Radio className="w-3.5 h-3.5 text-amber-600" /> Channel</span>
                <span className="text-amber-700 font-bold">VHF Ch 16 (Repeater Alpha)</span>
              </div>
            </div>

            {/* Responding Team Status */}
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-left text-xs">
              <span className="text-emerald-800 font-bold block text-[10px] uppercase font-mono tracking-wider">
                Dispatched Units
              </span>
              <p className="text-slate-700 text-xs mt-0.5 font-medium">
                Officer David Hayes & Drone Unit Alpha-2 acknowledged. Distance: 0.8km (ETA ~4 mins).
              </p>
            </div>

            {/* Cancel with PIN Protection */}
            {!showPinInput ? (
              <button
                type="button"
                onClick={() => setShowPinInput(true)}
                className="w-full bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-800 font-bold uppercase tracking-wider py-3.5 rounded-2xl text-xs border border-slate-300 transition-all cursor-pointer"
              >
                Deactivate SOS Beacon (Requires PIN)
              </button>
            ) : (
              <form onSubmit={handleDeactivate} className="space-y-2 pt-1">
                <div className="flex items-center gap-1.5 justify-center text-xs text-slate-700 font-mono">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Enter Security PIN (Default: 1234)</span>
                </div>
                <input
                  type="password"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="PIN"
                  className="w-32 mx-auto bg-white border border-slate-300 rounded-xl py-2 px-3 text-center text-lg font-mono text-slate-900 tracking-widest focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
                {pinError && <p className="text-[11px] text-red-600 font-bold font-mono">INCORRECT PIN CODE</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPinInput(false)}
                    className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer hover:bg-slate-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
                  >
                    Confirm Stop
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

