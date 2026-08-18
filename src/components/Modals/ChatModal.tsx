import React, { useState, useRef } from 'react';
import { 
  Send, 
  MapPin, 
  Radio, 
  X, 
  Mic, 
  MicOff, 
  Camera, 
  Image as ImageIcon, 
  Play, 
  Pause, 
  Volume2, 
  Trash2,
  Paperclip
} from 'lucide-react';
import { INITIAL_CHAT_MESSAGES } from '../../data/mockData';
import { ChatMessage, UserRole } from '../../types';
import { useVoiceRecorder } from '../../utils/useVoiceRecorder';
import { fileToBase64 } from '../../utils/imageHandler';
import { fieldAudio } from '../../utils/audioSynth';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const voiceRecorder = useVoiceRecorder();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedImage && !voiceRecorder.audioUrl && !voiceRecorder.transcript) return;

    fieldAudio.playRadioChirp();

    const textPayload = inputText.trim() || (voiceRecorder.transcript ? `[Voice Radio]: ${voiceRecorder.transcript}` : attachedImage ? '[Field Photo Attached]' : '[Voice Dispatch Note]');

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'usr_current',
      senderName: currentUserRole === 'ADMIN' ? 'Chief Warden Vance' : currentUserRole === 'RANGER' ? 'Cmdr. Sarah Jenkins' : 'Officer Ranger',
      senderRole: currentUserRole,
      text: textPayload,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setAttachedImage(null);
    voiceRecorder.clearRecording();
  };

  const handleShareLocation = () => {
    fieldAudio.playRadioChirp();
    const locMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'usr_current',
      senderName: currentUserRole === 'ADMIN' ? 'Chief Warden Vance' : currentUserRole === 'RANGER' ? 'Cmdr. Sarah Jenkins' : 'Officer Ranger',
      senderRole: currentUserRole,
      text: 'Shared live tactical field GPS coordinate checkpoint',
      location: { lat: 37.7550, lng: -119.5600, name: 'Sector 4 - Alpha (Lookout 1)' },
      timestamp: 'Just now'
    };
    setMessages(prev => [...prev, locMsg]);
  };

  const handleImageUploaded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      fieldAudio.playTap();
      const base64 = await fileToBase64(file);
      setAttachedImage(base64);
    }
  };

  const handlePlayVoice = (msgId: string) => {
    fieldAudio.playRadioReceive();
    setPlayingAudioId(msgId);
    setTimeout(() => {
      setPlayingAudioId(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200 h-[85vh] flex flex-col">
        {/* Hidden inputs */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageUploaded}
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleImageUploaded}
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0B4619]">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Field Command Radio</h3>
              <p className="text-[10px] text-slate-500 font-mono">CHANNEL #16 VHF • ENCRYPTED AIRWAVE</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto py-3.5 space-y-3 pr-1 text-xs">
          {messages.map((msg) => {
            const isMe = msg.senderRole === currentUserRole;
            const hasVoice = msg.text.includes('[Voice') || msg.text.includes('dispatch') || msg.text.includes('Radio');

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] font-mono font-bold text-slate-400 mb-1 px-1 uppercase tracking-wider">
                  {msg.senderName} [{msg.senderRole}]
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs space-y-2 ${
                    isMe
                      ? 'bg-[#0B4619] text-white font-medium rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>

                  {/* Audio Dispatch player snippet */}
                  {hasVoice && (
                    <button
                      type="button"
                      onClick={() => handlePlayVoice(msg.id)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        isMe 
                          ? 'bg-black/20 text-emerald-100 hover:bg-black/30' 
                          : 'bg-white text-emerald-800 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {playingAudioId === msg.id ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                          <span>Playing Radio Audio (00:03s)...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Audio Transmission</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Location Attachment */}
                  {msg.location && (
                    <div className={`mt-2 p-2 rounded-xl flex items-center gap-1.5 text-[11px] font-mono ${
                      isMe ? 'bg-black/20 text-emerald-100' : 'bg-white text-[#0B4619] border border-slate-200'
                    }`}>
                      <MapPin className={`w-3.5 h-3.5 ${isMe ? 'text-white' : 'text-[#0B4619]'}`} />
                      <span className="font-bold">{msg.location.name}</span>
                    </div>
                  )}

                  <span className={`text-[9px] font-mono block ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Attached image preview before sending */}
        {attachedImage && (
          <div className="relative mb-2 w-24 h-20 rounded-xl overflow-hidden border border-emerald-500 bg-slate-100">
            <img src={attachedImage} alt="Attachment" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setAttachedImage(null)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Active Voice Recording Status Bar */}
        {voiceRecorder.isRecording && (
          <div className="bg-red-50 border border-red-200 p-2.5 rounded-2xl mb-2 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span className="text-xs font-mono font-bold text-red-700">
                PTT Active: Recording Voice ({voiceRecorder.recordingDuration}s)...
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                voiceRecorder.stopRecording();
                handleSendMessage();
              }}
              className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl cursor-pointer"
            >
              Send Dispatch
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShareLocation}
            title="Share Current GPS"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-[#0B4619] border border-slate-200 rounded-xl cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            title="Attach Field Photo"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>

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
            title="Push to Talk Voice Message"
            className={`p-2 border rounded-xl cursor-pointer transition-all ${
              voiceRecorder.isRecording 
                ? 'bg-red-600 text-white border-red-600 animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 text-amber-700 border-slate-200'
            }`}
          >
            {voiceRecorder.isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Radio message or press mic..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4619]"
          />

          <button
            type="submit"
            className="bg-[#0B4619] hover:bg-emerald-800 text-white p-2 rounded-xl shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
