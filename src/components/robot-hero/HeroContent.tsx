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
}

export const HeroContent: React.FC<HeroContentProps> = ({
  onNavigate,
  onOpenProjectModal,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Staggered animated words for headline
  const headlineWords = [
    { text: 'Build', isHighlight: false },
    { text: 'Smarter.', isHighlight: true },
    { text: 'Innovate', isHighlight: false },
    { text: 'Faster.', isHighlight: true },
    { text: 'Grow', isHighlight: false },
    { text: 'Further.', isHighlight: true },
  ];

  return (
    <div className="w-full max-w-[580px] flex flex-col justify-center text-left space-y-5 sm:space-y-6">
      {/* 1. Eyebrow Pill */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -6 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-[#E2E8F0] text-[#2563EB] text-[10px] sm:text-xs font-bold tracking-[0.08em] uppercase shadow-2xs whitespace-nowrap shrink-0 max-w-full"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
        <span className="truncate">IAMTECHNI | TECHNOLOGY THAT MOVES YOU FORWARD</span>
      </motion.div>

      {/* 2. Headline with Staggered Word Reveal & Single Gradient on Highlight Words */}
      <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold tracking-tight text-[#0B1B3F] leading-[1.12]">
        {headlineWords.map((word, i) => (
          <motion.span
            key={`${word.text}-${i}`}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: prefersReducedMotion ? 0 : 0.08 * i,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block mr-[0.28em]"
          >
            {word.isHighlight ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                {word.text}
              </span>
            ) : (
              <span className="text-[#0B1B3F]">{word.text}</span>
            )}
          </motion.span>
        ))}
      </h1>

      {/* 3. Subtitle (slate #475569) */}
      <motion.p
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.4, ease: 'easeOut' }}
        className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal"
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
        className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5"
      >
        <button
          type="button"
          onClick={() => onNavigate('/services')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <span>Explore Our Services</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onOpenProjectModal('General Technology Inquiry')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#0B1B3F] font-semibold text-xs sm:text-sm border border-[#E2E8F0] hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-[#2563EB]" />
          <span>Talk to Our Team</span>
        </button>
      </motion.div>

      {/* 5. Trust Row (3 items from existing data separated by thin dividers) */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.65, ease: 'easeOut' }}
        className="pt-2 sm:pt-3 border-t border-[#E2E8F0] flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-[#475569]"
      >
        <div className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>13 Core Disciplines</span>
        </div>

        <div className="hidden xs:block w-px h-3.5 bg-[#E2E8F0]" aria-hidden="true" />

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
