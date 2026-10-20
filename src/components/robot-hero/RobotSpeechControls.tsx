import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Pause, Play, Square, RotateCcw, Hand } from 'lucide-react';
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
            // Ignore canceled error which happens when user presses stop
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

      // Visual simulation fallback if Web Speech API is absent or blocked
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

    // Preload voices
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

  // Autoplay voice note on launch + fallback on first user gesture if browser blocks audio
  useEffect(() => {
    if (!autoPlay || hasAutoPlayedRef.current) return;

    // Small delay so initial page layout and mascot greeting wave start first
    const autoPlayTimer = window.setTimeout(() => {
      if (!hasAutoPlayedRef.current) {
        hasAutoPlayedRef.current = true;
        startPresentation(scriptToRead);
      }
    }, 1200);

    // If browser blocks speech until user interaction, start on first click/touch
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
    <div className="flex flex-wrap items-center justify-center gap-2">
      {status === 'idle' ? (
        <button
          type="button"
          onClick={() => startPresentation(scriptToRead)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 hover:bg-[#F3F8FF] text-[#071638] border border-[#087BFA]/30 text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer backdrop-blur-sm"
          title="Play Voice Note"
        >
          <div className="relative flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-[#087BFA]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#087BFA] animate-ping opacity-75" />
          </div>
          <span>Play Voice Note</span>
        </button>
      ) : (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 border border-[#087BFA]/35 shadow-sm backdrop-blur-sm">
          {/* Audio waveform visualization */}
          <div className="flex items-center gap-1 pr-1 border-r border-slate-200">
            <div className="flex items-end gap-0.5 h-3.5 w-3.5">
              <span
                className={`w-0.5 rounded-full bg-[#087BFA] transition-all duration-150 ${
                  status === 'playing' ? 'h-3 animate-pulse' : 'h-1'
                }`}
              />
              <span
                className={`w-0.5 rounded-full bg-[#00C7F2] transition-all duration-150 ${
                  status === 'playing' ? 'h-3.5 animate-pulse delay-75' : 'h-1.5'
                }`}
              />
              <span
                className={`w-0.5 rounded-full bg-[#087BFA] transition-all duration-150 ${
                  status === 'playing' ? 'h-2 animate-pulse delay-150' : 'h-1'
                }`}
              />
            </div>
            <span className="text-[11px] font-bold text-[#087BFA]">
              {status === 'playing' ? 'Voice Note' : 'Paused'}
            </span>
          </div>

          {/* Pause / Resume Button */}
          {status === 'playing' ? (
            <button
              type="button"
              onClick={pausePresentation}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 text-[#071638] text-xs font-medium cursor-pointer transition-colors"
              title="Pause voice note"
              aria-label="Pause voice note"
            >
              <Pause className="w-3.5 h-3.5 text-[#087BFA]" />
              <span className="text-[11px]">Pause</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={resumePresentation}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-emerald-50 text-emerald-700 text-xs font-medium cursor-pointer transition-colors"
              title="Resume voice note"
              aria-label="Resume voice note"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="text-[11px]">Play</span>
            </button>
          )}

          {/* Stop Button */}
          <button
            type="button"
            onClick={stopPresentation}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-medium cursor-pointer transition-colors"
            title="Stop voice note"
            aria-label="Stop voice note"
          >
            <Square className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span className="text-[11px]">Stop</span>
          </button>

          {/* Replay Button */}
          <button
            type="button"
            onClick={() => startPresentation(WELCOME_SPEECH_SCRIPT)}
            className="p-1 rounded-lg hover:bg-[#F3F8FF] text-slate-600 hover:text-[#087BFA] text-xs cursor-pointer transition-colors"
            title="Replay from start"
            aria-label="Replay voice note"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Greet wave trigger */}
      <button
        type="button"
        onClick={onTriggerGreeting}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-[#F3F8FF] text-[#071638] border border-[#087BFA]/20 text-xs font-medium shadow-2xs hover:shadow-xs transition-all cursor-pointer backdrop-blur-sm"
        title="Wave & Greet"
      >
        <Hand className="w-3.5 h-3.5 text-[#087BFA]" />
        <span>Wave</span>
      </button>
    </div>
  );
};
