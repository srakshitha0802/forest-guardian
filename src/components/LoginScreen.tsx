import React, { useState } from 'react';
import { Shield, Smartphone, ArrowRight, Mail, Fingerprint, Sparkles, KeyRound, TreePine } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole, phoneOrEmail?: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [authInput, setAuthInput] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('OFFICER');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authInput.trim()) {
      onLogin(selectedRole, 'FG-8842');
      return;
    }
    setOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole, authInput || 'FG-8842');
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole, emailInput || 'ranger.hq@forestguardian.gov');
    setShowEmailModal(false);
  };

  const handleGoogleSSO = () => {
    onLogin(selectedRole, 'srakshitha912@gmail.com');
  };

  const handleBiometricUnlock = () => {
    if (biometricEnabled) {
      onLogin(selectedRole, 'Biometric Verified');
    }
  };

  return (
    <div className="relative min-h-full w-full flex flex-col items-center justify-between p-4 py-8 bg-slate-50 text-slate-900 overflow-y-auto">
      {/* Background Forest subtle pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80')`
        }}
      />

      {/* Role Quick Selector Banner */}
      <div className="relative z-20 w-full max-w-sm mb-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xs flex items-center justify-between text-xs">
          <span className="text-[#0B4619] font-bold uppercase tracking-wider px-2 flex items-center gap-1.5 text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-[#0B4619]" /> Role:
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setSelectedRole('OFFICER')}
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedRole === 'OFFICER'
                  ? 'bg-[#0B4619] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Officer
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('RANGER')}
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedRole === 'RANGER'
                  ? 'bg-[#0B4619] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ranger
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('ADMIN')}
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedRole === 'ADMIN'
                  ? 'bg-[#0B4619] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Header Emblem & Title */}
      <div className="relative z-10 flex flex-col items-center text-center mt-2 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-xs border-2 border-emerald-600 mb-3 text-[#0B4619]">
          <TreePine className="w-9 h-9 text-[#0B4619] fill-[#0B4619] stroke-[2]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900">
          FOREST GUARDIAN
        </h1>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mt-1 max-w-xs leading-relaxed">
          Tactical Range & Grid Operations
        </p>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl p-5 shadow-xs border border-slate-200 mb-6">
        {/* Permissions Banner */}
        <div className="bg-emerald-50 rounded-2xl p-3.5 flex items-start gap-3 mb-5 border border-emerald-200">
          <Shield className="w-5 h-5 text-[#0B4619] shrink-0 mt-0.5" />
          <p className="text-xs text-slate-700 font-medium leading-snug">
            Access requires active GPS, Camera, and Beacon telemetry permissions for ranger safety.
          </p>
        </div>

        {!otpStep ? (
          <>
            {/* Field Authentication Form */}
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 font-mono">
                Field Authentication
              </span>
              <form onSubmit={handleSendCode} className="space-y-3">
                <div className="relative flex items-center">
                  <Smartphone className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={authInput}
                    onChange={(e) => setAuthInput(e.target.value)}
                    placeholder="Ranger ID or Device Phone"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0B4619] focus:ring-1 focus:ring-[#0B4619] transition-all font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0B4619] hover:bg-emerald-800 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-xs uppercase tracking-wider"
                >
                  <span>Dispatch Access Code</span>
                  <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                </button>
              </form>
            </div>

            {/* OR Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">OR</span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* Headquarters Login Button */}
            <div className="space-y-2.5 mb-4">
              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs transition-all uppercase tracking-wider cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#0B4619]" />
                <span>Headquarters Portal (Email)</span>
              </button>

              {/* Google SSO Button */}
              <button
                type="button"
                onClick={handleGoogleSSO}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 text-xs transition-all uppercase tracking-wider cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google Government SSO</span>
              </button>
            </div>

            {/* Biometric Unlock Toggle */}
            <div 
              onClick={handleBiometricUnlock}
              className="bg-slate-50 rounded-2xl p-3.5 flex items-center justify-between border border-slate-200 cursor-pointer hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-[#0B4619]" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-900">Biometric Vault</div>
                  <div className="text-[10px] font-mono text-slate-500">HARDWARE ENCLAVE VERIFIED</div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBiometricEnabled(!biometricEnabled);
                }}
                className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-hidden cursor-pointer ${
                  biometricEnabled ? 'bg-[#0B4619]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-300 ${
                    biometricEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </>
        ) : (
          /* OTP Verification Step */
          <div className="py-2">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-5 h-5 text-[#0B4619]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Enter Security Token</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-mono">
              A 6-digit access code was dispatched to your registered field hardware.
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="text"
                autoFocus
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="6-Digit OTP (e.g. 749201)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-center text-xl tracking-[0.3em] font-mono text-slate-900 focus:border-[#0B4619] focus:ring-1 focus:ring-[#0B4619] focus:outline-hidden"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider py-3 rounded-2xl cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0B4619] hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-2xl shadow-xs cursor-pointer"
                >
                  Verify & Enter
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer Links */}
      <div className="relative z-10 flex items-center justify-center gap-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider pb-2">
        <button 
          onClick={() => alert('Emergency Field Dispatch Line: +1-800-FOR-HELP (Toll Free). Channel 16 VHF Monitored 24/7.')}
          className="hover:text-[#0B4619] transition-colors cursor-pointer"
        >
          Emergency Support
        </button>
        <span>•</span>
        <button 
          onClick={() => alert('Forest Guardian Privacy Policy: Location and biometric data are encrypted locally and retained according to Forest Department compliance standards.')}
          className="hover:text-[#0B4619] transition-colors cursor-pointer"
        >
          Privacy Policy
        </button>
      </div>

      {/* Headquarters Email Login Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base uppercase tracking-wider">HQ Staff Portal</h3>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Department Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="ranger@forestguardian.gov"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-[#0B4619]"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Security Key / Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-[#0B4619]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0B4619] hover:bg-emerald-800 text-white font-bold uppercase tracking-wider py-3 rounded-2xl text-xs mt-3 cursor-pointer shadow-xs"
              >
                Authorize HQ Access
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

