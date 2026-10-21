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
      {/* Neat Pill-Shaped Toolbar: [Play/Stop] | [Mute/Unmute] | [Greet]
          Mobile/Tablet (<1024px): h-9 (36px), text-xs (12px)
          Desktop (>=1024px): lg:h-8 (32px), lg:text-[12.5px] */}
      <div
        role="toolbar"
        aria-label="Robot voice and greeting controls"
        className="inline-flex items-center h-9 lg:h-8 px-1 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]"
      >
        {/* 1. Play / Stop Toggle Button (Fixed width on sm+ so toolbar never jumps) */}
        <button
          type="button"
          onClick={onToggleVoiceGuide}
          aria-label={isSpeaking ? 'Stop Voice Guide' : 'Start Voice Guide'}
          title={isSpeaking ? 'Stop Voice Guide' : 'Start Voice Guide'}
          className={`inline-flex items-center justify-center gap-1.5 h-7 lg:h-[26px] w-8 sm:w-[116px] lg:w-[118px] px-2 sm:px-3 rounded-full text-xs lg:text-[12.5px] font-bold transition-colors duration-200 cursor-pointer shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
            isSpeaking
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'text-[#1E3A8A] hover:text-[#2563EB] hover:bg-[#DBEAFE]/60'
          }`}
        >
          {isSpeaking ? (
            <>
              <Square className="w-3 h-3 fill-current text-white shrink-0" />
              <span className="hidden sm:inline leading-none">Stop</span>
              {/* Small animated sound-wave in soft blue/white */}
              <span
                className="inline-flex items-end gap-0.5 h-3 ml-0.5 shrink-0"
                aria-hidden="true"
              >
                <span
                  className={`w-0.5 h-2.5 rounded-full bg-[#93C5FD] ${
                    prefersReducedMotion ? '' : 'animate-pulse'
                  }`}
                />
                <span
                  className={`w-0.5 h-3 rounded-full bg-white ${
                    prefersReducedMotion ? '' : 'animate-pulse delay-75'
                  }`}
                />
                <span
                  className={`w-0.5 h-2 rounded-full bg-[#93C5FD] ${
                    prefersReducedMotion ? '' : 'animate-pulse delay-150'
                  }`}
                />
              </span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span className="hidden sm:inline leading-none">Voice Guide</span>
            </>
          )}
        </button>

        {/* Thin Divider */}
        <div className="w-px h-4 lg:h-3.5 bg-[#DBEAFE] mx-0.5 shrink-0" aria-hidden="true" />

        {/* 2. Mute / Unmute Icon-Only Button */}
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute robot voice' : 'Mute robot voice'}
          aria-pressed={isMuted}
          title={isMuted ? 'Unmute robot voice' : 'Mute robot voice'}
          className={`inline-flex items-center justify-center h-7 lg:h-[26px] w-8 lg:w-7 rounded-full text-xs lg:text-[12.5px] font-bold transition-colors duration-200 cursor-pointer shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
            isMuted
              ? 'bg-[#DBEAFE]/80 text-[#1E3A8A]'
              : 'text-[#2563EB] hover:text-[#1E3A8A] hover:bg-[#DBEAFE]/60'
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
          )}
        </button>

        {/* Thin Divider */}
        <div className="w-px h-4 lg:h-3.5 bg-[#DBEAFE] mx-0.5 shrink-0" aria-hidden="true" />

        {/* 3. Greet Button */}
        <button
          type="button"
          onClick={onTriggerGreeting}
          aria-label="Greet and wave"
          title="Greet and wave"
          className="inline-flex items-center justify-center gap-1.5 h-7 lg:h-[26px] w-8 sm:w-auto sm:px-3 rounded-full text-xs lg:text-[12.5px] font-bold text-[#1E3A8A] hover:text-[#2563EB] hover:bg-[#DBEAFE]/60 transition-colors duration-200 cursor-pointer shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <Hand className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
          <span className="hidden sm:inline leading-none">Greet</span>
        </button>
      </div>

      {/* Small Tooltip Directly Under Voice Controls Before First Interaction */}
      {showTapToHearHint && (
        <div
          role="note"
          className={`pointer-events-none absolute top-full mt-1.5 whitespace-nowrap inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 text-[#2563EB] text-[10px] font-bold shadow-[0_2px_10px_rgba(37,99,235,0.08)] ${
            prefersReducedMotion ? '' : 'animate-pulse'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0" />
          <span>Tap anywhere to hear me</span>
        </div>
      )}
    </div>
  );
};
