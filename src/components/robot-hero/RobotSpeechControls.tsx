import React from 'react';
import { Volume2, VolumeX, Square, Hand } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

export interface RobotSpeechControlsProps {
  isSpeaking: boolean;
  isMuted: boolean;
  showTapToHearHint?: boolean;
  onToggleVoiceGuide: () => void;
  onToggleMute: () => void;
  onTriggerGreeting: () => void;
}

export const RobotSpeechControls: React.FC<RobotSpeechControlsProps> = ({
  isSpeaking,
  isMuted,
  showTapToHearHint = false,
  onToggleVoiceGuide,
  onToggleMute,
  onTriggerGreeting,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      data-robot-control="true"
      className="relative inline-flex flex-col items-center z-30"
    >
      {/* Sleek Dark Glassmorphic Voice & Greeting Toolbar */}
      <div
        role="toolbar"
        aria-label="Robot voice and greeting controls"
        className="inline-flex items-center h-8 sm:h-8.5 px-1.5 rounded-full bg-[#07142C]/90 backdrop-blur-xl border border-[#00D2FF]/35 shadow-[0_8px_24px_rgba(0,0,0,0.45),0_0_16px_rgba(0,210,255,0.12)]"
      >
        {/* 1. Play / Stop Toggle Button */}
        <button
          type="button"
          onClick={onToggleVoiceGuide}
          aria-label={isSpeaking ? 'Stop Voice Guide' : 'Start Voice Guide'}
          title={isSpeaking ? 'Stop Voice Guide' : 'Start Voice Guide'}
          className={`inline-flex items-center justify-center gap-1.5 h-6.5 sm:h-[26px] px-2.5 sm:px-3 rounded-full text-[11px] sm:text-[12px] font-bold transition-all duration-200 cursor-pointer shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
            isSpeaking
              ? 'bg-gradient-to-r from-[#00D2FF] to-[#2563EB] text-white shadow-[0_0_14px_rgba(0,210,255,0.4)]'
              : 'text-slate-200 hover:text-[#00D2FF] hover:bg-white/10'
          }`}
        >
          {isSpeaking ? (
            <>
              <Square className="w-3 h-3 fill-current text-white shrink-0" />
              <span className="leading-none">Stop</span>
              <span
                className="inline-flex items-end gap-0.5 h-3 ml-0.5 shrink-0"
                aria-hidden="true"
              >
                <span
                  className={`w-0.5 h-2.5 rounded-full bg-white/80 ${
                    prefersReducedMotion ? '' : 'animate-pulse'
                  }`}
                />
                <span
                  className={`w-0.5 h-3 rounded-full bg-white ${
                    prefersReducedMotion ? '' : 'animate-pulse delay-75'
                  }`}
                />
                <span
                  className={`w-0.5 h-2 rounded-full bg-white/80 ${
                    prefersReducedMotion ? '' : 'animate-pulse delay-150'
                  }`}
                />
              </span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
              <span className="leading-none">Voice Guide</span>
            </>
          )}
        </button>

        {/* Thin Divider */}
        <div
          className="w-px h-3.5 bg-white/15 mx-0.5 shrink-0"
          aria-hidden="true"
        />

        {/* 2. Mute / Unmute Icon-Only Button */}
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute robot voice' : 'Mute robot voice'}
          aria-pressed={isMuted}
          title={isMuted ? 'Unmute robot voice' : 'Mute robot voice'}
          className={`inline-flex items-center justify-center h-6.5 sm:h-[26px] w-7 rounded-full text-[11px] sm:text-[12px] font-bold transition-colors duration-200 cursor-pointer shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
            isMuted
              ? 'bg-white/15 text-slate-300'
              : 'text-[#00D2FF] hover:text-white hover:bg-white/10'
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
          )}
        </button>

        {/* Thin Divider */}
        <div
          className="w-px h-3.5 bg-white/15 mx-0.5 shrink-0"
          aria-hidden="true"
        />

        {/* 3. Greet Button */}
        <button
          type="button"
          onClick={onTriggerGreeting}
          aria-label="Greet and wave"
          title="Greet and wave"
          className="inline-flex items-center justify-center gap-1.5 h-6.5 sm:h-[26px] px-2.5 sm:px-3 rounded-full text-[11px] sm:text-[12px] font-bold text-slate-200 hover:text-[#00D2FF] hover:bg-white/10 transition-colors duration-200 cursor-pointer shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF]"
        >
          <Hand className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
          <span className="leading-none">Greet</span>
        </button>
      </div>

      {/* Small Tooltip Above Voice Controls Before First Interaction (avoids downward overflow) */}
      {showTapToHearHint && (
        <div
          role="note"
          className={`pointer-events-none absolute bottom-full mb-1 whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#07142C]/95 border border-[#00D2FF]/40 text-[#00D2FF] text-[9.5px] sm:text-[10px] font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.5)] ${
            prefersReducedMotion ? '' : 'animate-pulse'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF] shrink-0" />
          <span>Tap anywhere to hear me</span>
        </div>
      )}
    </div>
  );
};
