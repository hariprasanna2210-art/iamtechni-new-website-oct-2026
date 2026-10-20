import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HeroBrandCardConfig } from '../../data/heroOrbitData';

export interface HeroRobotEnvironmentProps {
  activeCard?: HeroBrandCardConfig;
  parallaxOffset?: { x: number; y: number };
}

export const HeroRobotEnvironment: React.FC<HeroRobotEnvironmentProps> = ({
  activeCard,
  parallaxOffset = { x: 0, y: 0 },
}) => {
  const prefersReducedMotion = useReducedMotion();

  const beamEnd = activeCard?.beamTarget || { x: 75, y: 75 };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full flex items-center justify-center select-none overflow-visible"
    >
      {/* ===================================================================== */}
      {/* 1. SOFT RADIAL GLOW (#2563EB AT ~8% OPACITY) BEHIND ROBOT             */}
      {/* ===================================================================== */}
      <div
        className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full blur-3xl transition-transform duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.09) 0%, rgba(6, 182, 212, 0.05) 45%, transparent 72%)',
          transform: prefersReducedMotion
            ? 'none'
            : `translate3d(${parallaxOffset.x * -10}px, ${parallaxOffset.y * -8}px, 0)`,
        }}
      />

      {/* ===================================================================== */}
      {/* 2. SUBTLE CIRCUIT-BOARD LINES LIGHTING UP IN SEQUENCE & ORBIT RINGS   */}
      {/* ===================================================================== */}
      <svg
        className="absolute inset-0 w-full h-full max-w-[520px] max-h-[480px] m-auto overflow-visible"
        viewBox="0 0 500 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="circuit-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.06" />
          </linearGradient>

          <linearGradient id="active-beam-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Orbit Rings */}
        <ellipse
          cx="250"
          cy="225"
          rx="165"
          ry="150"
          stroke="#06B6D4"
          strokeOpacity="0.16"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <ellipse
          cx="250"
          cy="225"
          rx="215"
          ry="195"
          stroke="#2563EB"
          strokeOpacity="0.12"
          strokeWidth="1"
        />

        {/* Subtle Circuit Board Traces Behind Robot */}
        <g stroke="url(#circuit-line-grad)" strokeWidth="1.2" strokeLinecap="round">
          {/* Trace 1: Top-Left */}
          <path d="M 190 150 L 145 150 L 125 130 L 95 130" />
          <circle cx="95" cy="130" r="2.5" fill="#06B6D4" fillOpacity="0.35" />

          {/* Trace 2: Bottom-Left */}
          <path d="M 185 270 L 140 270 L 120 295 L 90 295" />
          <circle cx="90" cy="295" r="2.5" fill="#06B6D4" fillOpacity="0.35" />

          {/* Trace 3: Top-Right */}
          <path d="M 310 150 L 355 150 L 375 130 L 405 130" />
          <circle cx="405" cy="130" r="2.5" fill="#06B6D4" fillOpacity="0.35" />

          {/* Trace 4: Bottom-Right */}
          <path d="M 315 270 L 360 270 L 380 295 L 410 295" />
          <circle cx="410" cy="295" r="2.5" fill="#06B6D4" fillOpacity="0.35" />
        </g>

        {/* Sequential circuit pulse animations */}
        {!prefersReducedMotion && (
          <g>
            <motion.circle
              r="2.5"
              fill="#06B6D4"
              animate={{
                cx: [190, 145, 125, 95],
                cy: [150, 150, 130, 130],
                opacity: [0, 0.85, 0.85, 0],
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', delay: 0 }}
            />
            <motion.circle
              r="2.5"
              fill="#06B6D4"
              animate={{
                cx: [310, 355, 375, 405],
                cy: [150, 150, 130, 130],
                opacity: [0, 0.85, 0.85, 0],
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', delay: 1.6 }}
            />
          </g>
        )}

        {/* =================================================================== */}
        {/* 3. THIN LIGHT BEAM FROM ROBOT TO ACTIVE HIGHLIGHTED BRAND CARD      */}
        {/* =================================================================== */}
        <AnimatePresence mode="wait">
          {activeCard && (
            <motion.g
              key={activeCard.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* Soft outer cyan beam */}
              <line
                x1="250"
                y1="215"
                x2={beamEnd.x}
                y2={beamEnd.y}
                stroke="url(#active-beam-grad)"
                strokeWidth="2.5"
                strokeDasharray="5 5"
              />
              {/* Travelling energy pulse */}
              {!prefersReducedMotion && (
                <motion.circle
                  r="3"
                  fill="#06B6D4"
                  animate={{
                    cx: [250, beamEnd.x],
                    cy: [215, beamEnd.y],
                    opacity: [0.2, 0.9, 0],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              )}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* ===================================================================== */}
      {/* 4. FEW TINY DATA PARTICLES DRIFTING UPWARD                            */}
      {/* ===================================================================== */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {[
            { left: '34%', bottom: '20%', delay: 0, duration: 5.5 },
            { left: '64%', bottom: '24%', delay: 1.4, duration: 6.2 },
            { left: '42%', bottom: '16%', delay: 2.6, duration: 5.8 },
            { left: '58%', bottom: '18%', delay: 0.8, duration: 6.5 },
          ].map((p, i) => (
            <motion.span
              key={i}
              style={{ left: p.left, bottom: p.bottom }}
              animate={{
                y: [0, -90],
                opacity: [0, 0.55, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut',
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#06B6D4]"
            />
          ))}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. HOLOGRAPHIC FLOOR RING WITH SMALL "iamtechni" LOGO GLOW BADGE      */}
      {/* ===================================================================== */}
      <div
        className="absolute bottom-[42px] sm:bottom-[46px] flex flex-col items-center justify-center z-10"
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `translate3d(${parallaxOffset.x * 8}px, ${parallaxOffset.y * 6}px, 0)`,
        }}
      >
        {/* Holographic perspective grid floor ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-[180px] sm:w-[220px] h-[26px] sm:h-[32px] rounded-[100%] bg-[#06B6D4]/10 border border-[#06B6D4]/35 shadow-[0_0_20px_rgba(6,182,212,0.22)] flex items-center justify-center">
            <div className="w-[130px] sm:w-[160px] h-[14px] sm:h-[18px] rounded-[100%] border border-[#2563EB]/25" />
          </div>

          {/* Small "iamtechni" logo glow badge on the floor ring under the robot */}
          <div className=" -mt-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-[#06B6D4]/40 shadow-[0_0_12px_rgba(6,182,212,0.28)] flex items-center gap-1.5">
            <img
              src="/iamtechni-symbol.svg"
              alt="IAMTECHNI Brand Emblem"
              width={12}
              height={12}
              decoding="async"
              className="w-3 h-3 object-contain"
            />
            <span className="text-[9px] font-extrabold tracking-wider lowercase text-[#0B1B3F]">
              iamtechni
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
