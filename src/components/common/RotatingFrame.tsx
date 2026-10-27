import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Folder,
  FileText,
  Lock,
  Pause,
  Phone,
  Mail,
  Send,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { COMPANY_CONTACT } from '../../data/companyInfo';
import { PRIMARY_PHONE } from '../../constants/contact';

export interface RotatingFrameProps {
  variant: 'cta' | 'compact';
  activeIndex?: number;
  onSceneChange?: (index: number) => void;
  externalPaused?: boolean;
}

interface SceneMeta {
  id: string;
  title: string;
  toastText: string;
  toastBgClass: string;
}

const CTA_SCENES: SceneMeta[] = [
  {
    id: 'nda',
    title: 'Mutual NDA Executed',
    toastText: '✓ Mutual NDA Executed',
    toastBgClass: 'bg-emerald-600 text-white border-emerald-400',
  },
  {
    id: 'sprints',
    title: 'Phased Sprints',
    toastText: '✓ Phased Sprints',
    toastBgClass: 'bg-[#1266E8] text-white border-blue-400',
  },
  {
    id: 'ip',
    title: 'Full IP Ownership',
    toastText: '✓ Full IP Ownership',
    toastBgClass: 'bg-purple-600 text-white border-purple-400',
  },
  {
    id: 'sla',
    title: '1 Business Day SLA',
    toastText: '✓ 1 Business Day SLA',
    toastBgClass: 'bg-cyan-600 text-white border-cyan-300',
  },
];

const COMPACT_SCENES: SceneMeta[] = [
  {
    id: 'call',
    title: 'CALL DIRECTLY',
    toastText: '✓ Call Directly',
    toastBgClass: 'bg-emerald-600 text-white border-emerald-400',
  },
  {
    id: 'email',
    title: 'EMAIL INQUIRIES',
    toastText: '✓ Email Inquiries',
    toastBgClass: 'bg-[#1266E8] text-white border-blue-400',
  },
  {
    id: 'advisor',
    title: 'Ask AI Advisor',
    toastText: '✓ Ask AI Advisor',
    toastBgClass: 'bg-indigo-600 text-white border-indigo-400',
  },
  {
    id: 'project',
    title: 'Start a Project',
    toastText: '✓ Start a Project',
    toastBgClass: 'bg-[#0F1B3D] text-white border-slate-600',
  },
];

const SCENE_DURATION_MS = 3500;

export const RotatingFrame: React.FC<RotatingFrameProps> = ({
  variant,
  activeIndex,
  onSceneChange,
  externalPaused = false,
}) => {
  const scenes = variant === 'cta' ? CTA_SCENES : COMPACT_SCENES;
  const [internalScene, setInternalScene] = useState<number>(0);
  const [hoverPaused, setHoverPaused] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(true);
  const [slaSeconds, setSlaSeconds] = useState<number>(1);

  const currentSceneIndex =
    typeof activeIndex === 'number' ? activeIndex : internalScene;
  const isPaused = hoverPaused || externalPaused;

  const setScene = (nextIndex: number) => {
    setInternalScene(nextIndex);
    if (onSceneChange) {
      onSceneChange(nextIndex);
    }
  };

  // Auto-rotate every 3.5s
  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(() => {
      const next = (currentSceneIndex + 1) % scenes.length;
      setScene(next);
    }, SCENE_DURATION_MS);

    return () => window.clearInterval(interval);
  }, [currentSceneIndex, isPaused, scenes.length]);

  // Toast timing: pops in 0.6s after scene starts, fades out 0.4s before scene ends
  useEffect(() => {
    setShowToast(false);
    const showTimer = window.setTimeout(() => {
      setShowToast(true);
    }, 600);
    const hideTimer = window.setTimeout(() => {
      setShowToast(false);
    }, SCENE_DURATION_MS - 400);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [currentSceneIndex]);

  // Live counter for Scene 4 ("1 Business Day SLA")
  useEffect(() => {
    if (variant !== 'cta' || currentSceneIndex !== 3) {
      setSlaSeconds(1);
      return;
    }
    setSlaSeconds(1);
    const timer = window.setInterval(() => {
      setSlaSeconds((prev) => (prev < 59 ? prev + 1 : 1));
    }, 850);
    return () => window.clearInterval(timer);
  }, [variant, currentSceneIndex]);

  const currentScene = scenes[currentSceneIndex] || scenes[0];

  /* ======================================================================== */
  /* LARGE CTA VARIANT ("Have a challenge? Let's engineer the solution.")     */
  /* ======================================================================== */
  if (variant === 'cta') {
    return (
      <div
        className="w-full max-w-[900px] mx-auto select-none"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
      >
        {/* Near-Black (#0B0F1A) Rounded Frame with Fixed Height (460px desktop, 380px mobile) */}
        <div className="relative w-full h-[380px] md:h-[460px] rounded-[24px] bg-[#0B0F1A] border border-slate-800 shadow-[0_28px_70px_-15px_rgba(11,15,26,0.35)] flex flex-col overflow-hidden">
          {/* Hidden SEO labels so all 4 scene titles stay permanently in the DOM */}
          <div className="sr-only">
            <span>Mutual NDA Executed</span>
            <span>Phased Sprints</span>
            <span>Full IP Ownership</span>
            <span>1 Business Day SLA</span>
          </div>

          {/* TOP BAND (Height 72px on desktop, wider than inset screen below to create notched shoulders) */}
          <div className="relative z-20 w-full min-h-[72px] md:h-[72px] px-4 sm:px-6 py-2.5 md:py-0 flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-4 bg-[#0B0F1A] shrink-0">
            {/* Top row on mobile / Left + Right on desktop */}
            <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-mono text-[10px] sm:text-xs text-slate-400 tracking-wide truncate">
                  IAMTECHNI // ENGINEERING_ENGAGEMENT
                </span>
              </div>

              {/* Mobile-only right chip */}
              <span className="md:hidden text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-950/90 px-2.5 py-0.5 rounded-full border border-cyan-800/80 shrink-0">
                1 Business Day SLA
              </span>
            </div>

            {/* Centre: Rotating Title in Large White Text (24px semibold on desktop) */}
            <div
              aria-live="polite"
              className="relative h-8 md:h-10 flex items-center justify-center overflow-hidden px-2"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="text-lg sm:text-xl md:text-[24px] font-semibold text-white tracking-tight whitespace-nowrap text-center"
                >
                  {currentScene.title}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop Right: "1 Business Day SLA" chip */}
            <div className="hidden md:flex items-center justify-end shrink-0">
              <span className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/90 px-3 py-1 rounded-full border border-cyan-800/80 shadow-xs">
                1 Business Day SLA
              </span>
            </div>
          </div>

          {/* Notched Shoulder Cutout Corner Accents */}
          <div className="relative flex-1 mx-3 sm:mx-6 mb-3 sm:mb-5 rounded-[14px] bg-[#F4F6FA] border border-slate-200/90 shadow-inner overflow-hidden flex flex-col">
            {/* Subtle top-band shoulder bevel shadow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-slate-900/8 to-transparent z-10" />

            {/* MAIN LIGHT SCREEN AREA (#F4F6FA) */}
            <div className="relative flex-1 w-full px-3 sm:px-6 pt-3 sm:pt-5 pb-[112px] sm:pb-[126px] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {/* SCENE 1: Mutual NDA Executed */}
                {currentSceneIndex === 0 && (
                  <motion.div
                    key="cta-scene-nda"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="w-[88%] sm:w-[60%] max-w-[460px] mx-auto bg-white rounded-xl border border-slate-200/90 shadow-[0_12px_32px_rgba(15,27,61,0.08)] p-3.5 sm:p-5 text-left"
                  >
                    {/* Document Header Bar */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100">
                      <div className="h-3 w-[40%] bg-slate-700 rounded-md" />
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-700">
                        NDA // EXECUTED
                      </span>
                    </div>

                    {/* 6 Grey Text Lines (#E2E8F0, 8px tall, widths 90%/80%/95%/70%/85%/60%) */}
                    <div className="space-y-2">
                      <div className="h-[8px] w-[90%] bg-[#E2E8F0] rounded-full" />
                      <div className="h-[8px] w-[80%] bg-[#E2E8F0] rounded-full" />
                      <div className="h-[8px] w-[95%] bg-[#E2E8F0] rounded-full" />
                      <div className="h-[8px] w-[70%] bg-[#E2E8F0] rounded-full" />
                      <div className="h-[8px] w-[85%] bg-[#E2E8F0] rounded-full" />
                      <div className="h-[8px] w-[60%] bg-[#E2E8F0] rounded-full" />
                    </div>

                    {/* Signature Line at the Bottom with Self-Drawing SVG Signature */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          SIGN:
                        </span>
                        <svg
                          viewBox="0 0 160 36"
                          className="w-32 sm:w-36 h-7 overflow-visible"
                        >
                          <motion.path
                            d="M 6 26 C 18 8, 28 30, 42 14 C 52 4, 58 28, 72 18 C 84 10, 92 25, 108 12 C 120 4, 134 22, 154 14"
                            fill="none"
                            stroke="#0F1B3D"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, ease: 'easeInOut' }}
                          />
                        </svg>
                      </div>
                      <div className="h-2 w-14 bg-slate-300 rounded-full" />
                    </div>
                  </motion.div>
                )}

                {/* SCENE 2: Phased Sprints */}
                {currentSceneIndex === 1 && (
                  <motion.div
                    key="cta-scene-sprints"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="w-[96%] sm:w-[86%] max-w-[660px] mx-auto grid grid-cols-3 gap-2 sm:gap-3.5 text-left"
                  >
                    {[
                      {
                        label: 'Sprint 1',
                        cards: [
                          { lineW: 'w-4/5', barColor: 'bg-blue-500', barW: 'w-10', delay: 0.05 },
                          { lineW: 'w-3/4', barColor: 'bg-emerald-500', barW: 'w-12', delay: 0.15 },
                          { lineW: 'w-2/3', barColor: 'bg-purple-500', barW: 'w-8', delay: 0.25 },
                        ],
                      },
                      {
                        label: 'Sprint 2',
                        cards: [
                          { lineW: 'w-5/6', barColor: 'bg-purple-500', barW: 'w-11', delay: 0.15 },
                          { lineW: 'w-3/5', barColor: 'bg-blue-500', barW: 'w-9', delay: 0.25 },
                          { lineW: 'w-4/5', barColor: 'bg-emerald-500', barW: 'w-12', delay: 0.35 },
                        ],
                      },
                      {
                        label: 'Sprint 3',
                        cards: [
                          { lineW: 'w-3/4', barColor: 'bg-emerald-500', barW: 'w-12', delay: 0.25 },
                          { lineW: 'w-4/5', barColor: 'bg-blue-500', barW: 'w-10', delay: 0.35 },
                        ],
                      },
                    ].map((col) => (
                      <div
                        key={col.label}
                        className="bg-slate-200/70 rounded-xl p-2 sm:p-2.5 border border-slate-300/70 flex flex-col gap-2"
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] font-mono font-bold text-[#0F1B3D]">
                            {col.label}
                          </span>
                          <span className="h-2 w-5 rounded-full bg-slate-400/70" />
                        </div>

                        {/* 2-3 White Cards sliding in from below */}
                        <div className="space-y-1.5">
                          {col.cards.map((card, cIdx) => (
                            <motion.div
                              key={cIdx}
                              initial={{ opacity: 0, y: 14 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.35,
                                delay: card.delay,
                                ease: 'easeOut',
                              }}
                              className="bg-white rounded-lg p-2 shadow-xs border border-slate-200/90 space-y-1.5"
                            >
                              <div className={`h-2 ${card.lineW} bg-[#CBD5E1] rounded-full`} />
                              <div className={`h-1.5 ${card.barW} ${card.barColor} rounded-full`} />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* SCENE 3: Full IP Ownership */}
                {currentSceneIndex === 2 && (
                  <motion.div
                    key="cta-scene-ip"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-[92%] sm:w-[72%] max-w-[540px] mx-auto bg-white rounded-xl border border-slate-200 shadow-[0_12px_32px_rgba(15,27,61,0.08)] p-3 sm:p-4 text-left"
                  >
                    {/* Purple Badge with Lock Icon Scaling In at Top-Right */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 20,
                        delay: 0.2,
                      }}
                      className="absolute -top-2.5 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-mono font-bold shadow-md"
                    >
                      <Lock className="w-3 h-3" />
                      <span>100% IP LOCK</span>
                    </motion.div>

                    {/* 5 File List Rows */}
                    <div className="divide-y divide-slate-100">
                      {[
                        { isFolder: true, leftW: 'w-36 sm:w-44', rightW: 'w-12', color: 'text-blue-600 bg-blue-50' },
                        { isFolder: true, leftW: 'w-28 sm:w-36', rightW: 'w-14', color: 'text-purple-600 bg-purple-50' },
                        { isFolder: false, leftW: 'w-40 sm:w-48', rightW: 'w-10', color: 'text-emerald-600 bg-emerald-50' },
                        { isFolder: false, leftW: 'w-32 sm:w-40', rightW: 'w-16', color: 'text-indigo-600 bg-indigo-50' },
                        { isFolder: false, leftW: 'w-24 sm:w-32', rightW: 'w-12', color: 'text-blue-600 bg-blue-50' },
                      ].map((row, rIdx) => (
                        <div
                          key={rIdx}
                          className="py-1.5 sm:py-2 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${row.color}`}
                            >
                              {row.isFolder ? (
                                <Folder className="w-3.5 h-3.5" />
                              ) : (
                                <FileText className="w-3.5 h-3.5" />
                              )}
                            </span>
                            <div className={`h-2 ${row.leftW} bg-[#CBD5E1] rounded-full`} />
                          </div>
                          <div className={`h-2 ${row.rightW} bg-[#E2E8F0] rounded-full shrink-0`} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* SCENE 4: 1 Business Day SLA */}
                {currentSceneIndex === 3 && (
                  <motion.div
                    key="cta-scene-sla"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-[92%] sm:w-[74%] max-w-[550px] mx-auto bg-white rounded-xl border border-slate-200 shadow-[0_12px_32px_rgba(15,27,61,0.08)] p-3 sm:p-4 text-left"
                  >
                    {/* Red/Pink Timer Chip with Pause Icon in Top-Right Counting Up Live */}
                    <div className="absolute -top-2.5 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-mono font-bold shadow-md">
                      <Pause className="w-3 h-3 fill-current" />
                      <span>00:00:0{slaSeconds}</span>
                    </div>

                    {/* 4 Inbox Message Rows (First Row Highlighted Light Blue) */}
                    <div className="space-y-1.5 pt-1">
                      {[
                        { highlighted: true, avatarBg: 'bg-blue-600', w1: 'w-40 sm:w-52', w2: 'w-28 sm:w-36' },
                        { highlighted: false, avatarBg: 'bg-slate-400', w1: 'w-32 sm:w-44', w2: 'w-24 sm:w-32' },
                        { highlighted: false, avatarBg: 'bg-indigo-400', w1: 'w-36 sm:w-48', w2: 'w-20 sm:w-28' },
                        { highlighted: false, avatarBg: 'bg-emerald-500', w1: 'w-28 sm:w-36', w2: 'w-24 sm:w-30' },
                      ].map((msg, mIdx) => (
                        <div
                          key={mIdx}
                          className={`p-2 rounded-lg flex items-center gap-3 ${
                            msg.highlighted
                              ? 'bg-blue-50/90 border border-blue-200'
                              : 'bg-slate-50 border border-slate-100'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full ${msg.avatarBg} shrink-0 flex items-center justify-center text-[10px] font-bold text-white`}
                          >
                            {mIdx + 1}
                          </span>
                          <div className="flex-1 space-y-1.5">
                            <div
                              className={`h-2 ${msg.w1} ${
                                msg.highlighted ? 'bg-blue-400/70' : 'bg-[#CBD5E1]'
                              } rounded-full`}
                            />
                            <div
                              className={`h-1.5 ${msg.w2} ${
                                msg.highlighted ? 'bg-blue-300/60' : 'bg-[#E2E8F0]'
                              } rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TOAST (Bottom-Right of Screen, Above the Bottom Overlay) */}
              <AnimatePresence>
                {showToast && (
                  <motion.div
                    key={`cta-toast-${currentScene.id}`}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 4 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                    className={`pointer-events-none absolute right-3 sm:right-5 bottom-[112px] sm:bottom-[124px] z-30 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold shadow-lg ${currentScene.toastBgClass}`}
                  >
                    {currentScene.toastText}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FIXED BOTTOM OVERLAY (Lower ~35% of the Screen) */}
            <div
              style={{
                background:
                  'linear-gradient(180deg, rgba(11,15,26,0) 0%, rgba(11,15,26,0.88) 38%, #0B0F1A 100%)',
              }}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] min-h-[108px] sm:min-h-[122px] px-4 sm:px-7 pb-3.5 sm:pb-4 pt-6 flex flex-col justify-end text-left z-20"
            >
              <div className="text-sm sm:text-lg md:text-[22px] font-semibold text-white tracking-tight leading-snug">
                // Direct collaboration with senior software architects
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs font-mono">
                <span className="text-slate-400">STATUS: ACCEPTING NEW PROJECTS</span>
                <span className="text-[#04C8E8] font-bold">READY TO ARCHITECT</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Progress Dots Under the Frame */}
        <div
          className="mt-4 flex items-center justify-center gap-1 md:gap-2"
          role="tablist"
          aria-label="Scene navigation"
        >
          {scenes.map((scene, idx) => {
            const isActive = currentSceneIndex === idx;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => setScene(idx)}
                aria-label={`Show ${scene.title}`}
                aria-selected={isActive}
                role="tab"
                className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center cursor-pointer"
              >
                <span
                  className={`relative block h-2.5 rounded-full overflow-hidden transition-all duration-300 ${
                    isActive
                      ? 'w-10 bg-slate-200'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      key={`progress-${scene.id}-${isPaused ? 'paused' : 'run'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: isPaused ? '100%' : '100%' }}
                      transition={{
                        duration: isPaused ? 0.2 : SCENE_DURATION_MS / 1000,
                        ease: 'linear',
                      }}
                      className="block h-full bg-[#1266E8] rounded-full"
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ======================================================================== */
  /* COMPACT VARIANT ("DIRECT INQUIRIES & PROJECT DISCOVERY" Card)            */
  /* ======================================================================== */
  return (
    <div
      className="w-full select-none"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
    >
      {/* Near-Black (#0B0F1A) Rounded Frame with Fixed Height 300px */}
      <div className="relative w-full h-[300px] rounded-[20px] bg-[#0B0F1A] border border-slate-800 shadow-[0_20px_50px_-12px_rgba(11,15,26,0.28)] flex flex-col overflow-hidden">
        {/* TOP BAND with Notched Shoulders & Rotating Title */}
        <div className="relative z-20 w-full h-[54px] px-3.5 sm:px-5 flex items-center justify-between gap-2 bg-[#0B0F1A] shrink-0">
          {/* Left Shoulder */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              IAMTECHNI
            </span>
          </div>

          {/* Centre: Rotating Title */}
          <div
            aria-live="polite"
            className="relative h-7 flex items-center justify-center overflow-hidden px-2"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene.id}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="text-sm sm:text-base font-semibold text-white tracking-tight whitespace-nowrap"
              >
                {currentScene.title}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Shoulder: Mini Dots (Interactive on desktop, visual status indicator on mobile where 4 action buttons below control scenes) */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {scenes.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScene(idx)}
                aria-label={`Show ${s.title}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSceneIndex === idx
                    ? 'w-4 bg-[#04C8E8]'
                    : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
          <div className="flex md:hidden items-center gap-1 shrink-0" aria-hidden="true">
            {scenes.map((s, idx) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all ${
                  currentSceneIndex === idx ? 'w-4 bg-[#04C8E8]' : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* INSET LIGHT SCREEN (#F4F6FA, radius 14px) */}
        <div
          aria-hidden="true"
          className="relative flex-1 mx-3 sm:mx-4 mb-3 rounded-[14px] bg-[#F4F6FA] border border-slate-200/90 overflow-hidden flex flex-col justify-between"
        >
          {/* Active Scene Content */}
          <div className="relative flex-1 px-3 sm:px-4 pt-3 pb-11 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {/* 1. CALL DIRECTLY */}
              {currentSceneIndex === 0 && (
                <motion.div
                  key="compact-call"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-[360px] bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                      <motion.span
                        animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full bg-emerald-400/50"
                      />
                      <div className="relative w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                        <Phone className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-[10px] font-mono uppercase font-bold text-emerald-700">
                        CALL DIRECTLY
                      </div>
                      <div className="font-mono text-xs sm:text-sm font-bold text-[#0F1B3D] truncate">
                        {PRIMARY_PHONE}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <div className="h-1.5 w-14 bg-[#CBD5E1] rounded-full" />
                        <div className="h-1.5 w-8 bg-[#E2E8F0] rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pr-1 shrink-0">
                    {[12, 22, 16, 24, 14].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}px` }}
                        className="w-1 rounded-full bg-emerald-500/80"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 2. EMAIL INQUIRIES */}
              {currentSceneIndex === 1 && (
                <motion.div
                  key="compact-email"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-[360px] bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 space-y-2.5 text-left"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Mail className="w-3.5 h-3.5 text-[#1266E8] shrink-0" />
                      <span className="font-mono text-xs font-bold text-[#0F1B3D] truncate">
                        To: {COMPANY_CONTACT.email}
                      </span>
                    </div>
                    <motion.div
                      animate={{
                        x: [0, 0, 14, 26],
                        y: [0, 0, -8, -16],
                        opacity: [1, 1, 0.9, 0],
                      }}
                      transition={{ duration: 2.2, times: [0, 0.5, 0.8, 1] }}
                      className="w-6 h-6 rounded-lg bg-blue-50 text-[#1266E8] flex items-center justify-center shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </motion.div>
                  </div>
                  <div className="space-y-1.5">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 0.4, delay: 0.08 }}
                      className="h-2 bg-[#CBD5E1] rounded-full"
                    />
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 0.4, delay: 0.22 }}
                      className="h-2 bg-[#CBD5E1] rounded-full"
                    />
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '58%' }}
                      transition={{ duration: 0.4, delay: 0.36 }}
                      className="h-2 bg-[#E2E8F0] rounded-full"
                    />
                  </div>
                </motion.div>
              )}

              {/* 3. Ask AI Advisor */}
              {currentSceneIndex === 2 && (
                <motion.div
                  key="compact-advisor"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-[360px] bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-2 text-left"
                >
                  {/* Left Grey Bubble */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <div className="w-[70%] rounded-xl rounded-tl-xs bg-slate-100 border border-slate-200 p-2 space-y-1.5">
                      <div className="h-2 w-4/5 bg-[#CBD5E1] rounded-full" />
                      <div className="h-2 w-3/5 bg-[#E2E8F0] rounded-full" />
                    </div>
                  </div>

                  {/* Right Indigo Bubble + 3-Dot Typing Indicator */}
                  <div className="flex items-center justify-between gap-2 pl-6">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          animate={{ y: [0, -3, 0] }}
                          transition={{
                            duration: 0.6,
                            delay: d * 0.15,
                            repeat: Infinity,
                          }}
                          className="w-1.5 h-1.5 rounded-full bg-indigo-600"
                        />
                      ))}
                    </div>
                    <div className="w-[66%] rounded-xl rounded-tr-xs bg-indigo-600 p-2 space-y-1.5">
                      <div className="h-2 w-4/5 bg-white/85 rounded-full" />
                      <div className="h-2 w-1/2 bg-indigo-200/80 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 4. Start a Project */}
              {currentSceneIndex === 3 && (
                <motion.div
                  key="compact-project"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-[360px] bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-1.5 text-left"
                >
                  {[
                    { w: '82%', delay: 0.06 },
                    { w: '68%', delay: 0.2 },
                    { w: '76%', delay: 0.34 },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="h-5 rounded-md bg-slate-50 border border-slate-200 px-2.5 flex items-center"
                    >
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: row.w }}
                        transition={{ duration: 0.35, delay: row.delay }}
                        className="h-2 bg-[#CBD5E1] rounded-full"
                      />
                    </div>
                  ))}
                  <div className="flex justify-end pt-1">
                    <motion.div
                      animate={{ scale: [1, 0.95, 1] }}
                      transition={{ duration: 0.6, delay: 0.55 }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#1266E8] text-white text-[10px] font-bold shadow-xs"
                    >
                      <span>Start a Project</span>
                      <ArrowRight className="w-3 h-3" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
              {showToast && (
                <motion.div
                  key={`compact-toast-${currentScene.id}`}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 4 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                  className={`pointer-events-none absolute right-2.5 bottom-10 z-20 px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold shadow-md ${currentScene.toastBgClass}`}
                >
                  {currentScene.toastText}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fixed Bottom Bar on Every Scene: "Response within 24 hours" */}
          <div className="px-3.5 py-2 bg-[#0B0F1A]/95 flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Response within 24 hours</span>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#04C8E8] shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
