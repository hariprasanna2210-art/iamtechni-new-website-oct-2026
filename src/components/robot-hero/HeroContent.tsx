import React from 'react';
import { ArrowRight, MessageSquare, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PageRoute } from '../../types';

export interface HeroContentProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
  activeServiceSlug?: string;
  onSelectService?: (serviceSlugOrId: string) => void;
  isAutoPlaying?: boolean;
  forceDesktop?: boolean;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  onNavigate,
  onOpenProjectModal,
  forceDesktop = false,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const headlineWords = [
    { text: 'Build', isHighlight: false },
    { text: 'Smarter.', isHighlight: true },
    { text: 'Innovate', isHighlight: false, lineBreakAfter: true },
    { text: 'Faster.', isHighlight: true },
    { text: 'Grow', isHighlight: false },
    { text: 'Further.', isHighlight: true, isLast: true },
  ];

  return (
    <div
      className={`w-full max-w-[580px] flex flex-col justify-center ${
        forceDesktop
          ? 'items-start text-left space-y-6'
          : 'items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-5 lg:space-y-6'
      }`}
    >
      {/* 1. Eyebrow Pill */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -6 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className={`inline-flex items-center gap-2 ${
          forceDesktop ? 'self-start text-xs' : 'self-center lg:self-start text-[10px] sm:text-xs'
        } px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-[#E2E8F0] text-[#2563EB] font-bold tracking-[0.08em] uppercase shadow-2xs whitespace-nowrap shrink-0 max-w-full`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
        <span className="truncate">IAMTECHNI | TECHNOLOGY THAT MOVES YOU FORWARD</span>
      </motion.div>

      {/* 2. Headline — Matches exact 2-line desktop break: "Build Smarter. Innovate" / "Faster. Grow Further." */}
      <h1
        className={`${
          forceDesktop
            ? 'text-[48px]'
            : 'text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px]'
        } font-extrabold tracking-tight text-[#0B1B3F] leading-[1.12]`}
      >
        {headlineWords.map((word, i) => (
          <React.Fragment key={`${word.text}-${i}`}>
            <motion.span
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: prefersReducedMotion ? 0 : 0.08 * i,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`inline-block ${
                word.isLast || word.lineBreakAfter ? 'mr-[0.26em] lg:mr-0' : 'mr-[0.26em]'
              }`}
            >
              {word.isHighlight ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                  {word.text}
                </span>
              ) : (
                <span className="text-[#0B1B3F]">{word.text}</span>
              )}
            </motion.span>
            {word.lineBreakAfter && (
              <br className={forceDesktop ? 'block' : 'hidden lg:block'} />
            )}
          </React.Fragment>
        ))}
      </h1>

      {/* 3. Subtitle */}
      <motion.p
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.4, ease: 'easeOut' }}
        className={`${
          forceDesktop
            ? 'text-base max-w-none'
            : 'text-sm sm:text-base max-w-[540px] lg:max-w-none'
        } text-[#475569] leading-relaxed font-normal`}
      >
        We transform ideas into intelligent digital solutions through AI,
        software engineering, modern web experiences, cloud technologies, and
        digital growth.
      </motion.p>

      {/* 4. Primary & Secondary CTA Buttons */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.52, ease: 'easeOut' }}
        className={`w-full pt-1 flex ${
          forceDesktop
            ? 'flex-row items-center justify-start gap-3.5'
            : 'flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-3.5'
        }`}
      >
        <button
          type="button"
          onClick={() => onNavigate('/services')}
          className={`${
            forceDesktop ? 'w-auto text-sm' : 'w-full sm:w-auto text-xs sm:text-sm'
          } inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer`}
        >
          <span>Explore Our Services</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onOpenProjectModal('General Technology Inquiry')}
          className={`${
            forceDesktop ? 'w-auto text-sm' : 'w-full sm:w-auto text-xs sm:text-sm'
          } inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#0B1B3F] font-semibold border border-[#E2E8F0] hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer`}
        >
          <MessageSquare className="w-4 h-4 text-[#2563EB]" />
          <span>Talk to Our Team</span>
        </button>
      </motion.div>

      {/* 5. Trust Row */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.65, ease: 'easeOut' }}
        className={`w-full pt-2 sm:pt-3 border-t border-[#E2E8F0] flex items-center ${
          forceDesktop ? 'justify-start' : 'justify-center lg:justify-start'
        } flex-wrap gap-x-4 gap-y-2 text-xs text-[#475569]`}
      >
        <div className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>13 Core Disciplines</span>
        </div>

        <div className="hidden sm:block w-px h-3.5 bg-[#E2E8F0]" aria-hidden="true" />

        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
          <span>AI · Cloud · Web · Growth</span>
        </div>

        <div className="hidden sm:block w-px h-3.5 bg-[#E2E8F0]" aria-hidden="true" />

        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          <span>India &amp; Global Delivery</span>
        </div>
      </motion.div>
    </div>
  );
};
