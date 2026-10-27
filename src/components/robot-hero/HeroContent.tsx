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
  isHeadingH1?: boolean;
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

const MOBILE_CONCISE_DESCRIPTIONS: Record<string, string> = {
  'ai-generative':
    'Deploy custom LLMs, private RAG knowledge assistants, and enterprise AI copilots.',
  'ml-automation':
    'Turn operational data into real-time predictive models and automated workflows.',
  'robotics-systems':
    'Connect edge AI vision, ROS 2 motion control, and real-time hardware telemetry.',
  'web-ecommerce':
    'Build ultra-fast web platforms and scalable e-commerce storefronts engineered to convert.',
  'mobile-apps':
    'Deliver sleek iOS, Android, and cross-platform apps with native 60fps performance.',
  'custom-software':
    'Replace legacy tools with custom enterprise platforms, SaaS products, and secure APIs.',
  'cloud-devops':
    'Scale on AWS and Azure with Kubernetes orchestration and zero-downtime CI/CD.',
  'digital-marketing':
    'Accelerate qualified pipeline with technical SEO, conversion optimization, and analytics.',
};

export const HeroContent: React.FC<HeroContentProps> = ({
  slide,
  onNavigate,
  onOpenProjectModal,
  mode = 'desktop',
  isHeadingH1 = true,
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
    const mobileDescription =
      MOBILE_CONCISE_DESCRIPTIONS[slide.id] || slide.description;
    const MobileHeadingTag = isHeadingH1 ? 'h1' : 'div';

    return (
      <div className="flex flex-col items-center text-center w-full shrink-0 pt-1">
        {/* Single Compact Service Pill (Counter + Short Service Name) */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#091834]/90 border border-[#00D2FF]/35 text-[10.5px] sm:text-xs font-mono font-bold text-slate-200 mb-2 shadow-[0_0_18px_rgba(0,210,255,0.12)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse shrink-0" />
          <span className="text-[#00D2FF]">{slide.counterLabel}</span>
          <span className="text-slate-500" aria-hidden="true">•</span>
          <span className="text-[#38BDF8] uppercase tracking-wider">
            {slide.shortTitle}
          </span>
        </div>

        {/* Essential Service Headline & Concise Supporting Description */}
        <motion.div
          key={`mobile-text-${slide.id}`}
          initial={prefersReducedMotion ? false : { opacity: 0.9, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md sm:max-w-xl mx-auto px-1"
        >
          <MobileHeadingTag className="text-[clamp(1.25rem,min(5.2vw,3.15dvh),1.95rem)] sm:text-[clamp(1.55rem,min(4vw,3.5dvh),2.25rem)] font-extrabold tracking-tight leading-[1.15] mb-1.5">
            {renderHighlightedHeadline(slide.headline, slide.highlightPhrase)}
          </MobileHeadingTag>
          <p className="text-[clamp(0.78rem,min(3.4vw,1.85dvh),0.9rem)] text-slate-300/95 leading-snug max-w-[40ch] mx-auto">
            {mobileDescription}
          </p>
        </motion.div>
      </div>
    );
  }

  if (mode === 'mobile-bottom') {
    return (
      <div className="flex flex-col items-center w-full shrink-0 pt-0.5">
        {/* Essential CTA Buttons — Clean, prominent, and easy to tap on all mobile widths */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-md sm:max-w-lg mx-auto">
          <button
            type="button"
            onClick={handleExploreServices}
            className="group inline-flex items-center justify-center gap-1.5 h-10 sm:h-11 px-3 sm:px-5 rounded-xl bg-gradient-to-r from-[#00D2FF] via-[#087BFA] to-[#2563EB] text-white font-bold text-xs sm:text-sm tracking-tight shadow-[0_8px_22px_rgba(0,210,255,0.26)] hover:shadow-[0_12px_28px_rgba(0,210,255,0.4)] active:scale-[0.99] transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => onOpenProjectModal(slide.categoryLabel)}
            className="inline-flex items-center justify-center gap-1.5 h-10 sm:h-11 px-3 sm:px-5 rounded-xl bg-[#091834]/90 hover:bg-[#0D224A] text-white font-semibold text-xs sm:text-sm border border-[#00D2FF]/45 hover:border-[#00D2FF]/80 shadow-[0_6px_18px_rgba(0,0,0,0.35)] active:scale-[0.99] transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00D2FF] shrink-0" />
            <span>Let&apos;s Build</span>
          </button>
        </div>
      </div>
    );
  }

  const DesktopHeadingTag = isHeadingH1 ? 'h1' : 'div';

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

          <DesktopHeadingTag className="text-[clamp(1.5rem,min(2.45vw,3.8dvh),2.95rem)] font-extrabold tracking-tight leading-[1.12] mb-2 xl:mb-3">
            {renderHighlightedHeadline(slide.headline, slide.highlightPhrase)}
          </DesktopHeadingTag>

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
