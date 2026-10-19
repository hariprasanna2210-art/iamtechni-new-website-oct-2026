import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Pause, Play, Square, RotateCcw, Hand } from 'lucide-react';
import { WELCOME_SPEECH_SCRIPT } from './RobotController';

export interface RobotSpeechControlsProps {
  customScript?: string;
  onSpeakingStateChange: (isSpeaking: boolean, energy: number) => void;
  onTriggerGreeting: () => void;
}

export const RobotSpeechControls: React.FC<RobotSpeechControlsProps> = ({
  customScript,
  onSpeakingStateChange,
  onTriggerGreeting,
}) => {
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [voiceAvailable, setVoiceAvailable] = useState(true);
  const energyIntervalRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);

  const scriptToRead = customScript || WELCOME_SPEECH_SCRIPT;

  const stopEnergySimulation = () => {
    if (energyIntervalRef.current) {
      window.clearInterval(energyIntervalRef.current);
      energyIntervalRef.current = null;
    }
    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    onSpeakingStateChange(false, 0);
  };

  const startEnergySimulation = () => {
    stopEnergySimulation();
    onSpeakingStateChange(true, 0.7);
    energyIntervalRef.current = window.setInterval(() => {
      const energy = 0.35 + Math.random() * 0.65;
      onSpeakingStateChange(true, energy);
    }, 110);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceAvailable(false);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      stopEnergySimulation();
    };
  }, []);

  const startPresentation = (text: string) => {
    onTriggerGreeting();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.98;
        utterance.pitch = 1.04;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Google') ||
                v.name.includes('Samantha') ||
                v.name.includes('Daniel'))
          ) || voices.find((v) => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
          setStatus('playing');
          startEnergySimulation();
        };

        utterance.onboundary = () => {
          onSpeakingStateChange(true, 0.55 + Math.random() * 0.45);
        };

        utterance.onend = () => {
          setStatus('idle');
          stopEnergySimulation();
        };

        utterance.onerror = () => {
          setStatus('idle');
          stopEnergySimulation();
        };

        setStatus('playing');
        startEnergySimulation();
        window.speechSynthesis.speak(utterance);
        return;
      } catch {
        setVoiceAvailable(false);
      }
    }

    setStatus('playing');
    startEnergySimulation();
    fallbackTimerRef.current = window.setTimeout(() => {
      setStatus('idle');
      stopEnergySimulation();
    }, 9000);
  };

  const handlePauseResume = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (status === 'playing') {
      window.speechSynthesis.pause();
      setStatus('paused');
      stopEnergySimulation();
    } else if (status === 'paused') {
      window.speechSynthesis.resume();
      setStatus('playing');
      startEnergySimulation();
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setStatus('idle');
    stopEnergySimulation();
  };

  const handleReplay = () => {
    startPresentation(WELCOME_SPEECH_SCRIPT);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {status === 'idle' ? (
        <button
          type="button"
          onClick={() => startPresentation(scriptToRead)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F3F8FF] text-[#071638] border border-[#087BFA]/25 text-xs font-bold shadow-2xs transition-all cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#087BFA]" />
          <span>Voice Guide</span>
        </button>
      ) : (
        <div className="inline-flex flex-wrap items-center gap-1 px-2 py-1 rounded-xl bg-white border border-[#087BFA]/30 shadow-xs">
          <span className="px-2 text-[11px] font-bold text-[#087BFA]">
            {status === 'playing' ? 'Speaking...' : 'Paused'}
          </span>

          {voiceAvailable && (
            <button
              type="button"
              onClick={handlePauseResume}
              className="p-1 rounded-md hover:bg-[#F3F8FF] text-[#071638] text-xs cursor-pointer"
              aria-label={status === 'playing' ? 'Pause speech' : 'Resume speech'}
            >
              {status === 'playing' ? (
                <Pause className="w-3.5 h-3.5 text-[#087BFA]" />
              ) : (
                <Play className="w-3.5 h-3.5 text-[#087BFA]" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleStop}
            className="p-1 rounded-md hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs cursor-pointer"
            aria-label="Stop speech"
          >
            <Square className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleReplay}
            className="p-1 rounded-md hover:bg-[#F3F8FF] text-[#071638] text-xs cursor-pointer"
            aria-label="Replay speech"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#087BFA]" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onTriggerGreeting}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F3F8FF] text-[#071638] border border-[#087BFA]/20 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
      >
        <Hand className="w-3.5 h-3.5 text-[#087BFA]" />
        <span>Greet</span>
      </button>
    </div>
  );
};
