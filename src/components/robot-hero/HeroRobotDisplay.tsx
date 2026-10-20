import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { mapServiceToOrbitCardId } from './ServiceCards';

export interface HeroRobotDisplayProps {
  activeServiceId?: string;
  parallaxOffset?: { x: number; y: number };
  greetTriggerCount?: number;
  onRobotClick?: () => void;
}

type RobotServiceActionType =
  | 'ai-ml'
  | 'web-dev'
  | 'mobile-apps'
  | 'cloud-devops'
  | 'digital-marketing'
  | 'custom-software'
  | 'robotics'
  | 'ui-ux';

const resolveActionType = (serviceId: string): RobotServiceActionType => {
  const s = (serviceId || '').toLowerCase();
  if (s.includes('robotics')) return 'robotics';
  if (s.includes('ai') || s.includes('machine-learning') || s.includes('generative')) return 'ai-ml';
  if (s.includes('mobile') || s.includes('app')) return 'mobile-apps';
  if (s.includes('cloud') || s.includes('devops') || s.includes('security')) return 'cloud-devops';
  if (s.includes('marketing') || s.includes('seo')) return 'digital-marketing';
  if (s.includes('software')) return 'custom-software';
  if (s.includes('ui') || s.includes('ux') || s.includes('analytics') || s.includes('data')) return 'ui-ux';
  return 'web-dev';
};

export const HeroRobotDisplay: React.FC<HeroRobotDisplayProps> = ({
  activeServiceId = 'ai-machine-learning',
  parallaxOffset = { x: 0, y: 0 },
  greetTriggerCount = 0,
  onRobotClick,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isWaving, setIsWaving] = useState(false);
  const [isActing, setIsActing] = useState(true);

  const actionType = useMemo(() => resolveActionType(activeServiceId), [activeServiceId]);
  const activeOrbitCard = useMemo(() => mapServiceToOrbitCardId(activeServiceId), [activeServiceId]);

  // Trigger service action whenever activeServiceId changes
  useEffect(() => {
    setIsActing(true);
    const timer = window.setTimeout(() => {
      setIsActing(false);
    }, 3200); // 3.2s active reaction before returning to idle float
    return () => window.clearTimeout(timer);
  }, [activeServiceId]);

  // Wave trigger from external count
  useEffect(() => {
    if (greetTriggerCount > 0) {
      setIsWaving(true);
      const timer = window.setTimeout(() => setIsWaving(false), 1400);
      return () => window.clearTimeout(timer);
    }
  }, [greetTriggerCount]);

  // Subtle wave greeting every 9s
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      setIsWaving(true);
      const timer = window.setTimeout(() => setIsWaving(false), 1400);
      return () => window.clearTimeout(timer);
    }, 9000);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const handleRobotClick = () => {
    setIsWaving(true);
    setIsActing(true);
    window.setTimeout(() => setIsWaving(false), 1400);
    window.setTimeout(() => setIsActing(false), 3200);
    if (onRobotClick) onRobotClick();
  };

  // Determine robot transform based on active action
  const getRobotAnimation = () => {
    if (isWaving) {
      return {
        y: [-6, -12, -3, -8, -6],
        rotate: [0, 2.5, -2, 2, 0],
        scale: 1,
      };
    }

    if (isActing && !prefersReducedMotion) {
      switch (actionType) {
        case 'ai-ml':
          // Tilt head, eyes glow brighter
          return {
            rotate: [0, -3.5, 2.5, -2, 0],
            scale: [1, 1.025, 1],
            y: [-6, -10, -6],
          };
        case 'web-dev':
          // Turn slightly toward browser mockup on left
          return {
            rotate: [0, -3, -3, 0],
            scale: [1, 1.015, 1],
            x: [0, 5, 0],
            y: [-6, -4, -6],
          };
        case 'mobile-apps':
          // Lift slightly as phone floats up into raised hand
          return {
            y: [-6, -12, -8, -6],
            rotate: [0, 1.5, -1, 0],
            scale: [1, 1.02, 1],
          };
        case 'cloud-devops':
          // Float upward with cloud expansion
          return {
            y: [-6, -14, -8, -6],
            scale: [1, 1.02, 1],
          };
        case 'digital-marketing':
          // Upward posture as growth chart rises
          return {
            y: [-6, -10, -4, -6],
            rotate: [0, 2, 0],
          };
        case 'custom-software':
          // Subtle tech focus tilt
          return {
            rotate: [0, -2, 2, 0],
            y: [-6, -8, -6],
          };
        case 'robotics':
          // Playful energetic bounce
          return {
            y: [-6, -14, -2, -10, -6],
            scale: [1, 1.03, 0.98, 1.02, 1],
          };
        case 'ui-ux':
          // Inspecting dashboards
          return {
            rotate: [0, 3, -1.5, 0],
            y: [-6, -9, -6],
          };
        default:
          return { y: [-6, 6, -6] };
      }
    }

    return prefersReducedMotion ? {} : { y: [-6, 6, -6] };
  };

  // Coordinates for the glowing light beam to the active floating card
  // Cards are positioned:
  // top-left: ai-ml (x: ~10%, y: ~15%)
  // bottom-left: web-dev (x: ~10%, y: ~75%)
  // top-right: cloud-devops (x: ~90%, y: ~15%)
  // bottom-right: digital-marketing (x: ~90%, y: ~75%)
  const beamCoordinates = useMemo(() => {
    switch (activeOrbitCard) {
      case 'ai-ml':
        return { startX: 250, startY: 230, endX: 70, endY: 70 };
      case 'web-dev':
        return { startX: 250, startY: 260, endX: 70, endY: 330 };
      case 'cloud-devops':
        return { startX: 250, startY: 230, endX: 430, endY: 70 };
      case 'digital-marketing':
      default:
        return { startX: 250, startY: 260, endX: 430, endY: 330 };
    }
  }, [activeOrbitCard]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* ===================================================================== */}
      {/* 1. GLOWING LIGHT BEAM CONNECTING ROBOT TO ACTIVE SERVICE CARD         */}
      {/* ===================================================================== */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full z-15 overflow-visible"
        viewBox="0 0 500 460"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="robot-beam-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#087BFA" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00C7F2" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#174DEB" stopOpacity="0.4" />
          </linearGradient>
          <filter id="beam-filter-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <AnimatePresence>
          {isActing && !prefersReducedMotion && (
            <motion.g
              key={activeOrbitCard}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Outer soft glowing beam */}
              <line
                x1={beamCoordinates.startX}
                y1={beamCoordinates.startY}
                x2={beamCoordinates.endX}
                y2={beamCoordinates.endY}
                stroke="url(#robot-beam-glow)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#beam-filter-blur)"
                strokeDasharray="6 6"
                className="animate-pulse"
              />
              {/* Core crisp beam */}
              <line
                x1={beamCoordinates.startX}
                y1={beamCoordinates.startY}
                x2={beamCoordinates.endX}
                y2={beamCoordinates.endY}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.8"
              />
              {/* Pulse particle moving along beam */}
              <motion.circle
                r="3.5"
                fill="#00C7F2"
                filter="url(#beam-filter-blur)"
                animate={{
                  cx: [beamCoordinates.startX, beamCoordinates.endX],
                  cy: [beamCoordinates.startY, beamCoordinates.endY],
                  opacity: [0.2, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* ===================================================================== */}
      {/* 2. SOFT BLUE GLOW PULSE BEHIND THE ROBOT                              */}
      {/* ===================================================================== */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10"
        style={{
          x: prefersReducedMotion ? 0 : parallaxOffset.x * -10,
          y: prefersReducedMotion ? 0 : parallaxOffset.y * -8,
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: isActing ? [1, 1.15, 1] : [1, 1.08, 1],
                opacity: isActing ? [0.75, 0.95, 0.75] : [0.65, 0.85, 0.65],
              }
        }
        transition={{
          duration: isActing ? 2.5 : 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div
          className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(8, 123, 250, 0.28) 0%, rgba(0, 199, 242, 0.16) 42%, rgba(23, 77, 235, 0.04) 68%, transparent 75%)',
          }}
        />
      </motion.div>

      {/* ===================================================================== */}
      {/* 3. SLOW ROTATING ORBIT RINGS WITH SUBTLE GRADIENT & GLOWING PARTICLES */}
      {/* ===================================================================== */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10"
        style={{
          x: prefersReducedMotion ? 0 : parallaxOffset.x * 8,
          y: prefersReducedMotion ? 0 : parallaxOffset.y * 6,
        }}
      >
        <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[430px] lg:h-[430px]">
          <svg
            className="w-full h-full"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="orbit-grad-a" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#087BFA" stopOpacity="0.30" />
                <stop offset="50%" stopColor="#00C7F2" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#174DEB" stopOpacity="0.26" />
              </linearGradient>
              <linearGradient id="orbit-grad-b" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00C7F2" stopOpacity="0.26" />
                <stop offset="50%" stopColor="#087BFA" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#7200F5" stopOpacity="0.20" />
              </linearGradient>
            </defs>

            {/* Inner Ring (Dashed Orbit) */}
            <ellipse
              cx="250"
              cy="250"
              rx="190"
              ry="175"
              stroke="url(#orbit-grad-a)"
              strokeWidth="1.25"
              strokeDasharray="4 6"
            />

            {/* Outer Continuous Orbit Ring */}
            <ellipse
              cx="250"
              cy="250"
              rx="238"
              ry="218"
              stroke="url(#orbit-grad-b)"
              strokeWidth="1.25"
            />
          </svg>

          {/* Slow rotating particle constellation */}
          <motion.div
            className="absolute inset-0"
            animate={prefersReducedMotion ? {} : { rotate: 360 }}
            transition={{
              duration: 80,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <span className="absolute top-[8%] left-[30%] w-2 h-2 rounded-full bg-[#00C7F2] shadow-[0_0_10px_#00C7F2]" />
            <span className="absolute bottom-[10%] right-[25%] w-2 h-2 rounded-full bg-[#087BFA] shadow-[0_0_10px_#087BFA]" />
            <span className="absolute top-[50%] right-[2%] w-1.5 h-1.5 rounded-full bg-[#00C7F2] shadow-[0_0_8px_#00C7F2]" />
            <span className="absolute top-[60%] left-[3%] w-1.5 h-1.5 rounded-full bg-[#174DEB] shadow-[0_0_8px_#174DEB]" />
          </motion.div>
        </div>
      </motion.div>

      {/* ===================================================================== */}
      {/* 4. SOFT REFLECTION / GLOW PLATFORM UNDER ITS FEET                     */}
      {/* ===================================================================== */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 sm:bottom-6 flex flex-col items-center justify-center z-5"
        style={{
          x: prefersReducedMotion ? 0 : parallaxOffset.x * 12,
          y: prefersReducedMotion ? 0 : parallaxOffset.y * 10,
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 0.93, 1],
                opacity: [0.85, 0.65, 0.85],
              }
        }
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-[190px] sm:w-[230px] h-[28px] sm:h-[34px] rounded-[100%] bg-gradient-to-r from-transparent via-[#00C7F2]/40 to-transparent blur-md" />
        <div className="w-[170px] sm:w-[200px] h-[14px] -mt-3 rounded-[100%] border border-[#00C7F2]/35 shadow-[0_0_10px_rgba(0,199,242,0.25)]" />
      </motion.div>

      {/* ===================================================================== */}
      {/* 5. ROBOT ANIMATED SERVICE ACTION ELEMENTS                             */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isActing && !prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none z-25 flex items-center justify-center">
            {/* AI & ML: Neural Network Pattern & Glow */}
            {actionType === 'ai-ml' && (
              <motion.div
                key="action-ai"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35 }}
                className="absolute top-[8%] sm:top-[6%] flex items-center justify-center"
              >
                <div className="relative w-44 h-24">
                  <svg className="w-full h-full" viewBox="0 0 200 100">
                    <line x1="30" y1="50" x2="70" y2="25" stroke="#00C7F2" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="30" y1="50" x2="70" y2="75" stroke="#087BFA" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="70" y1="25" x2="130" y2="25" stroke="#00C7F2" strokeWidth="1.5" />
                    <line x1="70" y1="25" x2="130" y2="75" stroke="#174DEB" strokeWidth="1.5" />
                    <line x1="70" y1="75" x2="130" y2="75" stroke="#00C7F2" strokeWidth="1.5" />
                    <line x1="130" y1="25" x2="170" y2="50" stroke="#087BFA" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="130" y1="75" x2="170" y2="50" stroke="#00C7F2" strokeWidth="1.5" strokeDasharray="3 3" />
                    {/* Pulsing Nodes */}
                    <circle cx="30" cy="50" r="4" fill="#00C7F2" className="animate-ping" />
                    <circle cx="30" cy="50" r="4" fill="#00C7F2" />
                    <circle cx="70" cy="25" r="4.5" fill="#087BFA" />
                    <circle cx="70" cy="75" r="4.5" fill="#174DEB" />
                    <circle cx="130" cy="25" r="4.5" fill="#00C7F2" />
                    <circle cx="130" cy="75" r="4.5" fill="#087BFA" />
                    <circle cx="170" cy="50" r="4" fill="#00C7F2" className="animate-ping" />
                    <circle cx="170" cy="50" r="4" fill="#00C7F2" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-blue-600/90 text-[9px] font-bold text-white shadow-[0_0_12px_#087BFA]">
                    NEURAL ACTIVE
                  </div>
                </div>
              </motion.div>
            )}

            {/* Web & E-commerce: Floating Mini Browser Pop-up */}
            {actionType === 'web-dev' && (
              <motion.div
                key="action-web"
                initial={{ opacity: 0, x: -25, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.85 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute left-[8%] sm:left-[12%] top-[30%] sm:top-[28%] w-36 sm:w-42 p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#087BFA]/40 shadow-[0_8px_24px_rgba(8,123,250,0.22)]"
              >
                <div className="flex items-center gap-1 mb-1.5 pb-1 border-b border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <div className="ml-1 h-2 flex-1 rounded bg-slate-100 text-[6px] text-slate-400 font-mono px-1 flex items-center">
                    iamtechni.com/app
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-2 rounded bg-blue-500/80 w-3/4 animate-pulse" />
                  <div className="h-1.5 rounded bg-slate-200 w-full" />
                  <div className="h-1.5 rounded bg-slate-200 w-2/3" />
                  <div className="flex gap-1 pt-0.5">
                    <span className="h-4 flex-1 rounded bg-[#00C7F2]/20 border border-[#00C7F2]/40" />
                    <span className="h-4 flex-1 rounded bg-[#087BFA]/20 border border-[#087BFA]/40" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Mobile App Development: Phone Mockup Floating into Raised Hand */}
            {actionType === 'mobile-apps' && (
              <motion.div
                key="action-mobile"
                initial={{ opacity: 0, y: 30, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.7 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute left-[15%] sm:left-[18%] top-[20%] sm:top-[18%] w-24 sm:w-28 p-1.5 rounded-2xl bg-slate-900 border-2 border-cyan-400/80 shadow-[0_10px_30px_rgba(0,199,242,0.36)]"
              >
                <div className="w-6 h-1 bg-slate-800 rounded-full mx-auto mb-1" />
                <div className="bg-slate-950 rounded-xl p-1.5 text-center space-y-1">
                  <div className="w-4 h-4 mx-auto rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 animate-pulse" />
                  <div className="text-[7.5px] font-bold text-white leading-tight">60 FPS Native</div>
                  <div className="h-1 bg-cyan-500/40 rounded w-4/5 mx-auto" />
                  <div className="h-1 bg-blue-500/30 rounded w-3/5 mx-auto" />
                </div>
              </motion.div>
            )}

            {/* Cloud & DevOps: Floating Clouds and Rising Upload Arrows */}
            {actionType === 'cloud-devops' && (
              <motion.div
                key="action-cloud"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  animate={{ y: [-4, -18, -4], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="absolute right-[12%] sm:right-[15%] top-[24%] px-2.5 py-1 rounded-xl bg-white/95 border border-[#087BFA]/40 shadow-md text-[#087BFA] text-[10px] font-bold flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>CI/CD Deployed</span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -12, 0], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: 0.3 }}
                  className="absolute left-[12%] sm:left-[16%] top-[34%] px-2 py-0.5 rounded-lg bg-blue-50/95 border border-blue-200 text-[#087BFA] text-[9px] font-semibold flex items-center gap-1"
                >
                  <span>☁ Kubernetes Cluster</span>
                </motion.div>
              </motion.div>
            )}

            {/* Digital Marketing & SEO: Rising Growth Chart */}
            {actionType === 'digital-marketing' && (
              <motion.div
                key="action-marketing"
                initial={{ opacity: 0, x: 25, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute right-[8%] sm:right-[12%] top-[32%] w-36 sm:w-40 p-2 rounded-xl bg-white/95 backdrop-blur-md border border-purple-300 shadow-[0_8px_24px_rgba(114,0,245,0.22)]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold text-purple-900">Traffic Growth</span>
                  <span className="text-[9px] font-extrabold text-emerald-600">+340% ↗</span>
                </div>
                <div className="flex items-end gap-1.5 h-10 pt-1 border-b border-slate-100">
                  <span className="flex-1 bg-purple-200 rounded-t h-[30%]" />
                  <span className="flex-1 bg-purple-300 rounded-t h-[50%]" />
                  <span className="flex-1 bg-purple-400 rounded-t h-[70%]" />
                  <span className="flex-1 bg-gradient-to-t from-purple-600 to-[#087BFA] rounded-t h-[100%] shadow-[0_0_8px_#7200F5]" />
                </div>
                <div className="text-[7.5px] text-slate-500 mt-1 text-center font-medium">Rank #1 Google SERP</div>
              </motion.div>
            )}

            {/* Custom Software: Code Brackets </> and Lines of Code */}
            {actionType === 'custom-software' && (
              <motion.div
                key="action-software"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  animate={{ y: [-4, -12, -4] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="absolute left-[10%] sm:left-[14%] top-[24%] px-2.5 py-1.5 rounded-xl bg-slate-900/95 border border-cyan-400/50 text-cyan-300 font-mono text-[9px] shadow-[0_4px_16px_rgba(0,199,242,0.28)]"
                >
                  <span className="text-pink-400">const</span> service = <span className="text-emerald-400">&apos;scalable&apos;</span>;
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
                  className="absolute right-[10%] sm:right-[14%] top-[36%] px-2.5 py-1 rounded-xl bg-blue-950/95 border border-blue-400/50 text-blue-200 font-mono text-[9px] shadow-md"
                >
                  &lt;<span className="text-cyan-400">Architecture</span> /&gt;
                </motion.div>
              </motion.div>
            )}

            {/* Robotics & Automation: Rotating Mechanical Gears */}
            {actionType === 'robotics' && (
              <motion.div
                key="action-robotics"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 flex items-center justify-center -z-5"
              >
                {/* Rotating Big Gear */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="absolute right-[16%] top-[22%] text-[#00C7F2]/40"
                >
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm-2 4a2 2 0 114 0 2 2 0 01-4 0z" />
                    <path d="M22 12a10 10 0 00-.18-1.89l-2.07-.35a8 8 0 00-.77-1.86l1.24-1.72a10.08 10.08 0 00-2.67-2.67l-1.72 1.24a8 8 0 00-1.86-.77l-.35-2.07A10 10 0 0012 2a10 10 0 00-1.89.18l-.35 2.07a8 8 0 00-1.86.77L6.18 3.78a10.08 10.08 0 00-2.67 2.67l1.24 1.72a8 8 0 00-.77 1.86l-2.07.35A10 10 0 001.69 12a10 10 0 00.18 1.89l2.07.35a8 8 0 00.77 1.86L3.47 17.82a10.08 10.08 0 002.67 2.67l1.72-1.24a8 8 0 001.86.77l.35 2.07A10 10 0 0012 22a10 10 0 001.89-.18l.35-2.07a8 8 0 001.86-.77l1.72 1.24a10.08 10.08 0 002.67-2.67l-1.24-1.72a8 8 0 00.77-1.86l2.07-.35A10 10 0 0022 12z" opacity="0.3" />
                  </svg>
                </motion.div>
                {/* Rotating Small Gear */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-[18%] top-[32%] text-[#087BFA]/40"
                >
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm-2 4a2 2 0 114 0 2 2 0 01-4 0z" />
                    <path d="M22 12a10 10 0 00-.18-1.89l-2.07-.35a8 8 0 00-.77-1.86l1.24-1.72a10.08 10.08 0 00-2.67-2.67l-1.72 1.24a8 8 0 00-1.86-.77l-.35-2.07A10 10 0 0012 2a10 10 0 00-1.89.18l-.35 2.07a8 8 0 00-1.86.77L6.18 3.78a10.08 10.08 0 00-2.67 2.67l1.24 1.72a8 8 0 00-.77 1.86l-2.07.35A10 10 0 001.69 12a10 10 0 00.18 1.89l2.07.35a8 8 0 00.77 1.86L3.47 17.82a10.08 10.08 0 002.67 2.67l1.72-1.24a8 8 0 001.86.77l.35 2.07A10 10 0 0012 22a10 10 0 001.89-.18l.35-2.07a8 8 0 001.86-.77l1.72 1.24a10.08 10.08 0 002.67-2.67l-1.24-1.72a8 8 0 00.77-1.86l2.07-.35A10 10 0 0022 12z" opacity="0.3" />
                  </svg>
                </motion.div>
              </motion.div>
            )}

            {/* UI/UX & Data Analytics: Dashboard Cards and Chart Bars */}
            {actionType === 'ui-ux' && (
              <motion.div
                key="action-uiux"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="absolute right-[8%] sm:right-[12%] top-[26%] w-36 sm:w-40 p-2 rounded-xl bg-white/95 border border-cyan-400/50 shadow-lg space-y-1">
                  <div className="text-[8px] font-bold text-slate-700 flex justify-between">
                    <span>User Retention</span>
                    <span className="text-[#087BFA]">99.4%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00C7F2] to-[#087BFA] w-[92%]" />
                  </div>
                  <div className="flex gap-1 pt-1">
                    <span className="h-3 w-3 rounded-full bg-[#087BFA]" />
                    <span className="h-3 w-3 rounded-full bg-[#00C7F2]" />
                    <span className="h-3 w-3 rounded-full bg-[#7200F5]" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 6. ROBOT IMAGE (Crisp, Full Body Head-to-Feet, 25% Smaller, Waving)   */}
      {/* ===================================================================== */}
      <motion.div
        onClick={handleRobotClick}
        title="IAMTECHNI AI Ambassador — Click to wave and see action!"
        className="relative z-10 flex flex-col items-center justify-center cursor-pointer select-none"
        style={{
          x: prefersReducedMotion ? 0 : parallaxOffset.x * 15,
          y: prefersReducedMotion ? 0 : parallaxOffset.y * 12,
        }}
        animate={getRobotAnimation()}
        transition={
          isWaving
            ? { duration: 1.3, ease: 'easeInOut' }
            : isActing
            ? { duration: 3.2, ease: 'easeInOut' }
            : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <img
          src="/robot-hero.png"
          alt="IAMTECHNI Cute 3D AI Robot Ambassador"
          className="h-[290px] sm:h-[340px] lg:h-[360px] xl:h-[380px] w-auto max-w-full object-contain pointer-events-auto transition-transform duration-300 hover:scale-[1.02]"
          style={{
            filter: 'drop-shadow(0 14px 28px rgba(8, 123, 250, 0.20))',
          }}
        />
      </motion.div>
    </div>
  );
};
