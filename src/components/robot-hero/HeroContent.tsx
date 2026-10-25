import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PageRoute } from '../../types';
import { HeroServiceSlide } from './heroCarouselData';

export interface HeroContentProps {
  slide: HeroServiceSlide;
  totalSlides?: number;
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
  mode?: 'desktop' | 'mobile-top' | 'mobile-bottom';
}

const renderHighlightedHeadline = (headline: string, highlightPhrase: string) => {
  const idx = headline.toLowerCase().indexOf(highlightPhrase.toLowerCase());
  if (idx === -1) {
    return <span className="text-white">{headline}</span>;
  }
  const before = headline.slice(0, idx);
  const match = headline.slice(idx, idx + highlightPhrase.length);
  const after = headline.slice(idx + highlightPhrase.length);

  return (
    <>
      <span className="text-white">{before}</span>
      <span className="bg-gradient-to-r from-[#00D2FF] via-[#38BDF8] to-[#A78BFA] bg-clip-text text-transparent">
        {match}
      </span>
      <span className="text-white">{after}</span>
    </>
  );
};

export const HeroContent: React.FC<HeroContentProps> = ({
  slide,
  onNavigate,
  onOpenProjectModal,
  mode = 'desktop',
}) => {
  const prefersReducedMotion = useReducedMotion();

  const handleExploreServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    } else {
      onNavigate('/services');
    }
  };

  if (mode === 'mobile-top') {
    return (
      <div className="flex flex-col items-center text-center w-full shrink-0">
        {/* Eyebrow + Active Service Counter */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#091834]/90 border border-[#00D2FF]/35 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.14em] text-[#00D2FF] font-bold shadow-[0_0_20px_rgba(0,210,255,0.12)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse shrink-0" />
            <span>INNOVATION • INTELLIGENCE • TECHNOLOGY</span>
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/15 text-[9.5px] sm:text-[10px] font-mono font-bold text-slate-200">
            <span className="text-[#00D2FF]">{slide.counterLabel.split(' / ')[0]}</span>
            <span className="text-slate-500">/</span>
            <span>{slide.counterLabel.split(' / ')[1]}</span>
          </span>
        </div>

        {/* Animated Service Headline & Description */}
        <motion.div
          key={`mobile-text-${slide.id}`}
          initial={prefersReducedMotion ? false : { opacity: 0.9, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#38BDF8] font-semibold mb-0.5">
            {slide.categoryLabel}
          </div>
          <h1 className="text-[clamp(1.15rem,min(4.8vw,2.65dvh),1.95rem)] font-extrabold tracking-tight leading-[1.12] mb-1">
            {renderHighlightedHeadline(slide.headline, slide.highlightPhrase)}
          </h1>
          <p className="text-[clamp(0.7rem,min(3.1vw,1.62dvh),0.875rem)] text-slate-300/90 leading-snug max-w-xl mx-auto line-clamp-2 sm:line-clamp-3">
            {slide.description}
          </p>
        </motion.div>
      </div>
    );
  }

  if (mode === 'mobile-bottom') {
    return (
      <div className="flex flex-col items-center w-full gap-1.5 sm:gap-2 shrink-0">
        {/* Compact Tech Stack Row on Mobile */}
        <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-1.5">
          {slide.techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#08152E]/90 border border-white/10 text-[10px] sm:text-[11px] font-medium text-slate-200"
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: tech.color }} />
                <span>{tech.name}</span>
              </div>
            );
          })}
        </div>

        {/* Two CTA Buttons — Side-by-side on mobile & tablet to preserve vertical viewport fit */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full">
          <button
            type="button"
            onClick={handleExploreServices}
            className="group inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-3 sm:px-5 rounded-xl bg-gradient-to-r from-[#00D2FF] via-[#087BFA] to-[#2563EB] text-white font-bold text-xs sm:text-sm tracking-tight shadow-[0_8px_22px_rgba(0,210,255,0.26)] hover:shadow-[0_12px_28px_rgba(0,210,255,0.4)] transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <span>Explore Our Services</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => onOpenProjectModal(slide.categoryLabel)}
            className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-3 sm:px-5 rounded-xl bg-[#091834]/85 hover:bg-[#0D224A] text-white font-semibold text-xs sm:text-sm border border-[#00D2FF]/40 hover:border-[#00D2FF]/80 shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00D2FF] shrink-0" />
            <span>Let&apos;s Build Together</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop Left Column (~34% width) — Proportionally scaled with viewport height (dvh) & width (vw)
  return (
    <div className="relative z-10 flex flex-col items-start text-left justify-center w-full">
      {/* 1. Eyebrow Label + Active Service Indicator (01 / 08) */}
      <div className="flex flex-wrap items-center gap-2 mb-2 xl:mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 xl:px-3.5 xl:py-1.5 rounded-full bg-[#081632]/90 backdrop-blur-md border border-[#00D2FF]/35 text-[10px] xl:text-[11px] font-mono uppercase tracking-[0.15em] text-[#00D2FF] font-bold shadow-[0_0_24px_rgba(0,210,255,0.14)]">
          <span className="w-1.5 h-1.5 xl:w-2 xl:h-2 rounded-full bg-[#00D2FF] shadow-[0_0_10px_#00D2FF] animate-pulse shrink-0" />
          <span>INNOVATION • INTELLIGENCE • TECHNOLOGY</span>
        </div>

        <div
          aria-label={`Active service ${slide.index} of 8`}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 xl:px-3 xl:py-1 rounded-full bg-[#0A1936]/90 border border-white/15 text-[11px] xl:text-xs font-mono font-bold text-white shadow-inner"
        >
          <span className="text-[#00D2FF]">{slide.counterLabel.split(' / ')[0]}</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-300">{slide.counterLabel.split(' / ')[1]}</span>
        </div>
      </div>

      {/* 2. Dynamic Service Category, Bold Animated Headline & Concise Description */}
      <div className="w-full min-h-[clamp(145px,22dvh,215px)] flex flex-col justify-center">
        <motion.div
          key={`desktop-slide-${slide.id}`}
          initial={prefersReducedMotion ? false : { opacity: 0.9, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div className="inline-flex items-center gap-2 text-[11px] xl:text-xs font-mono uppercase tracking-widest text-[#38BDF8] font-semibold mb-1.5">
            <span>// {slide.categoryLabel}</span>
          </div>

          <h1 className="text-[clamp(1.5rem,min(2.45vw,3.8dvh),2.95rem)] font-extrabold tracking-tight leading-[1.12] mb-2 xl:mb-3">
            {renderHighlightedHeadline(slide.headline, slide.highlightPhrase)}
          </h1>

          <p className="text-[clamp(0.8125rem,min(1vw,1.9dvh),0.96875rem)] text-slate-300/95 leading-relaxed max-w-[54ch] font-normal">
            {slide.description}
          </p>
        </motion.div>
      </div>

      {/* 3. Compact Technology Icons Relevant to the Current Service */}
      <div className="mt-2.5 xl:mt-4 w-full">
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
          <span>Core Stack & Technologies</span>
        </div>
        <motion.div
          key={`tech-${slide.id}`}
          initial={prefersReducedMotion ? false : { opacity: 0.9, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex flex-wrap items-center gap-1.5 xl:gap-2"
        >
          {slide.techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 xl:px-3 xl:py-1.5 rounded-xl bg-[#081630]/90 border border-white/10 hover:border-[#00D2FF]/45 text-[11px] xl:text-xs font-semibold text-slate-200 shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-colors duration-200"
              >
                <Icon
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: tech.color }}
                />
                <span>{tech.name}</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* 4. Primary & Secondary CTA Buttons */}
      <div className="mt-3.5 xl:mt-5 flex flex-nowrap items-center gap-2.5 xl:gap-3.5 w-full">
        <button
          type="button"
          onClick={handleExploreServices}
          className="group inline-flex items-center justify-center gap-2 h-10 xl:h-11 px-4 xl:px-6 rounded-xl bg-gradient-to-r from-[#00D2FF] via-[#087BFA] to-[#2563EB] text-white font-bold text-xs xl:text-sm tracking-tight shadow-[0_12px_32px_rgba(0,210,255,0.28)] hover:shadow-[0_16px_40px_rgba(0,210,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF]"
        >
          <span>Explore Our Services</span>
          <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={() => onOpenProjectModal(slide.categoryLabel)}
          className="group inline-flex items-center justify-center gap-2 h-10 xl:h-11 px-4 xl:px-6 rounded-xl bg-[#081632]/85 hover:bg-[#0D2149] text-white font-semibold text-xs xl:text-sm border border-[#00D2FF]/40 hover:border-[#00D2FF]/85 shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(0,210,255,0.18)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF]"
        >
          <Sparkles className="w-4 h-4 text-[#00D2FF] shrink-0 transition-transform duration-200 group-hover:rotate-12" />
          <span>Let&apos;s Build Together</span>
        </button>
      </div>
    </div>
  );
};
