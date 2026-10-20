import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, Pause, Play, Square, RotateCcw, Hand } from 'lucide-react';
import { WELCOME_SPEECH_SCRIPT } from './RobotController';

export interface RobotSpeechControlsProps {
  customScript?: string;
  autoPlay?: boolean;
  onSpeakingStateChange: (isSpeaking: boolean, energy: number) => void;
  onTriggerGreeting: () => void;
}

export const RobotSpeechControls: React.FC<RobotSpeechControlsProps> = ({
  customScript,
  autoPlay = true,
  onSpeakingStateChange,
  onTriggerGreeting,
}) => {
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [voiceAvailable, setVoiceAvailable] = useState(true);
  const energyIntervalRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const hasAutoPlayedRef = useRef<boolean>(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scriptToRead = customScript || WELCOME_SPEECH_SCRIPT;

  const stopEnergySimulation = useCallback(() => {
    if (energyIntervalRef.current) {
      window.clearInterval(energyIntervalRef.current);
      energyIntervalRef.current = null;
    }
    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    onSpeakingStateChange(false, 0);
  }, [onSpeakingStateChange]);

  const startEnergySimulation = useCallback(() => {
    stopEnergySimulation();
    onSpeakingStateChange(true, 0.7);
    energyIntervalRef.current = window.setInterval(() => {
      const energy = 0.35 + Math.random() * 0.65;
      onSpeakingStateChange(true, energy);
    }, 110);
  }, [onSpeakingStateChange, stopEnergySimulation]);

  const stopPresentation = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setStatus('idle');
    stopEnergySimulation();
  }, [stopEnergySimulation]);

  const startPresentation = useCallback(
    (text: string) => {
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
                  v.name.includes('Daniel') ||
                  v.name.includes('Alex'))
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

          utterance.onerror = (e) => {
            if (e.error !== 'canceled') {
              console.warn('[SpeechSynthesis error]', e.error);
            }
            setStatus('idle');
            stopEnergySimulation();
          };

          utteranceRef.current = utterance;
          setStatus('playing');
          startEnergySimulation();
          window.speechSynthesis.speak(utterance);
          return;
        } catch (err) {
          console.warn('[SpeechSynthesis exception]', err);
          setVoiceAvailable(false);
        }
      }

      // Visual simulation fallback
      setStatus('playing');
      startEnergySimulation();
      fallbackTimerRef.current = window.setTimeout(() => {
        setStatus('idle');
        stopEnergySimulation();
      }, 9500);
    },
    [onTriggerGreeting, startEnergySimulation, stopEnergySimulation, onSpeakingStateChange]
  );

  const pausePresentation = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (status === 'playing') {
      window.speechSynthesis.pause();
      setStatus('paused');
      stopEnergySimulation();
    }
  }, [status, stopEnergySimulation]);

  const resumePresentation = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (status === 'paused') {
      window.speechSynthesis.resume();
      setStatus('playing');
      startEnergySimulation();
    } else if (status === 'idle') {
      startPresentation(scriptToRead);
    }
  }, [status, startEnergySimulation, startPresentation, scriptToRead]);

  // Check speech synthesis availability
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceAvailable(false);
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        window.speechSynthesis.cancel();
        stopEnergySimulation();
      };
    }

    return () => {
      stopEnergySimulation();
    };
  }, [stopEnergySimulation]);

  // Autoplay voice note on launch + fallback on first user gesture
  useEffect(() => {
    if (!autoPlay || hasAutoPlayedRef.current) return;

    const autoPlayTimer = window.setTimeout(() => {
      if (!hasAutoPlayedRef.current) {
        hasAutoPlayedRef.current = true;
        startPresentation(scriptToRead);
      }
    }, 1200);

    const handleFirstInteraction = () => {
      if (!hasAutoPlayedRef.current || status === 'idle') {
        hasAutoPlayedRef.current = true;
        startPresentation(scriptToRead);
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.clearTimeout(autoPlayTimer);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [autoPlay, scriptToRead, startPresentation, status]);

  return (
    <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_16px_rgba(7,22,56,0.06)] text-xs font-medium">
      {status === 'idle' ? (
        <button
          type="button"
          onClick={() => startPresentation(scriptToRead)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-700 hover:text-[#087BFA] hover:bg-[#F3F8FF] transition-all cursor-pointer"
          title="Play Voice Note"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#087BFA]" />
          <span className="text-[11px] font-semibold">Voice Guide</span>
        </button>
      ) : (
        <div className="inline-flex items-center gap-1 px-1.5 py-0.5">
          {/* Animated sound bars */}
          <div className="flex items-end gap-0.5 h-3 w-3 mr-1">
            <span
              className={`w-0.5 rounded-full bg-[#087BFA] ${
                status === 'playing' ? 'h-3 animate-pulse' : 'h-1'
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-[#00C7F2] ${
                status === 'playing' ? 'h-2.5 animate-pulse delay-75' : 'h-1.5'
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-[#087BFA] ${
                status === 'playing' ? 'h-2 animate-pulse delay-150' : 'h-1'
              }`}
            />
          </div>

          {/* Pause / Resume */}
          {status === 'playing' ? (
            <button
              type="button"
              onClick={pausePresentation}
              className="p-1 rounded-md text-slate-600 hover:text-[#087BFA] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Pause"
              aria-label="Pause"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={resumePresentation}
              className="p-1 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              title="Resume"
              aria-label="Resume"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {/* Stop */}
          <button
            type="button"
            onClick={stopPresentation}
            className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Stop"
            aria-label="Stop"
          >
            <Square className="w-3 h-3 fill-current text-rose-500" />
          </button>

          {/* Replay */}
          <button
            type="button"
            onClick={() => startPresentation(WELCOME_SPEECH_SCRIPT)}
            className="p-1 rounded-md text-slate-500 hover:text-[#087BFA] hover:bg-slate-100 transition-colors cursor-pointer"
            title="Replay"
            aria-label="Replay"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="w-px h-3.5 bg-slate-200" aria-hidden="true" />

      {/* Greet button */}
      <button
        type="button"
        onClick={onTriggerGreeting}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-700 hover:text-[#087BFA] hover:bg-[#F3F8FF] transition-all cursor-pointer"
        title="Wave & Greet"
      >
        <Hand className="w-3.5 h-3.5 text-[#087BFA]" />
        <span className="text-[11px] font-semibold">Greet</span>
      </button>
    </div>
  );
};
