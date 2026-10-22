import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Code2,
  Cloud,
  TrendingUp,
  Cpu,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Database,
  Search,
  ExternalLink,
  ChevronRight,
  Layers,
  Zap,
  Globe,
  Radio,
  Server,
  Workflow,
  Activity,
  Compass,
  Palette,
  ShoppingBag,
  Smartphone,
  Lock,
  BarChart3,
  Stethoscope,
  Landmark,
  Factory,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { PageRoute, ProjectItem } from '../types';
import { servicesData } from '../data/servicesData';
import { projectsData } from '../data/projectsData';
import { insightsData } from '../data/insightsData';
import { industriesData } from '../data/industriesData';
import { ColorfulMultiServiceHero } from '../components/home/ColorfulMultiServiceHero';
import { HeroSection } from '../components/robot-hero/HeroSection';
import { HomeServicesSection } from '../components/home/HomeServicesSection';
import { EnterpriseSolutionsMatrix } from '../components/home/EnterpriseSolutionsMatrix';
import { ProcessStageVisual, IndustryIllustration } from '../components/common/TechIllustrations';
import { ProjectVisualThumbnail, ArticleGraphic, ServiceCardThumbnail } from '../components/common/ServiceVisualMockups';
import { CompanyIntroVisual, AiNeuralPipelineVisual, CtaTerminalVisual } from '../components/home/HomeSectionVisuals';
import { ScrollReveal, ScrollRevealItem, ScrollRevealSection } from '../components/common/ScrollReveal';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getServiceIcon, getIndustryIcon, getProcessStepIcon } from '../utils/serviceIcons';
import { getAllUniqueTools } from '../data/heroServiceTools';
import { motion, useReducedMotion } from 'framer-motion';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
  onOpenCaseStudy: (project: ProjectItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenProjectModal,
  onOpenCaseStudy,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('All');
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>(
    servicesData[0]?.slug || 'web-development'
  );

  const processStages = [
    {
      step: '01',
      title: 'Discover',
      tagline: 'Understand the business, users and technical requirements.',
      details:
        'We interview stakeholders, audit existing systems, inspect user workflows, and identify operational constraints before scoping any architectural solutions.',
      color: 'from-[#04C8E8] to-[#1266E8]',
    },
    {
      step: '02',
      title: 'Define',
      tagline: 'Establish scope, priorities, architecture and success criteria.',
      details:
        'We define data schemas, technology selection, API contracts, delivery milestones, and measurable business benchmarks to maintain alignment throughout delivery.',
      color: 'from-[#1266E8] to-[#5427D9]',
    },
    {
      step: '03',
      title: 'Design',
      tagline: 'Develop user flows, interface concepts and system designs.',
      details:
        'We craft accessible wireframes, WCAG 2.2 AA compliant typography hierarchies, and clickable interactive prototypes to validate ergonomics before engineering.',
      color: 'from-[#5427D9] to-[#04C8E8]',
    },
    {
      step: '04',
      title: 'Build',
      tagline: 'Implement maintainable software, APIs and integrations.',
      details:
        'We write strongly-typed TypeScript and Python code, enforce component modularity, configure automated unit tests, and integrate secure third-party endpoints.',
      color: 'from-[#04C8E8] to-[#0EA5E9]',
    },
    {
      step: '05',
      title: 'Validate',
      tagline: 'Test functionality, performance, security and accessibility.',
      details:
        'We perform automated regression testing, sub-second Core Web Vitals audits, OWASP security reviews, and multi-device usability verification.',
      color: 'from-[#1266E8] to-[#3B82F6]',
    },
    {
      step: '06',
      title: 'Deploy',
      tagline: 'Release with containerized infrastructure and CI/CD.',
      details:
        'We manage zero-downtime releases via containerized CI/CD pipelines, configure DNS/SSL certificates, and set up continuous monitoring and error alerting.',
      color: 'from-[#5427D9] to-[#8B5CF6]',
    },
    {
      step: '07',
      title: 'Improve',
      tagline: 'Support ongoing optimization, telemetry and enhancements.',
      details:
        'We review real-world telemetry, monitor cloud utilization for cost efficiency, resolve emerging operational needs, and release incremental feature enhancements.',
      color: 'from-[#0EA5E9] to-[#10B981]',
    },
  ];

  const filteredProjects =
    selectedProjectFilter === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category === selectedProjectFilter);

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* 1. FUTURISTIC 3D HUMANOID ROBOT PRESENTER HERO SECTION                    */}
      {/* ========================================================================= */}
      <HeroSection
        onNavigate={onNavigate}
        onOpenProjectModal={onOpenProjectModal}
        selectedServiceSlug={selectedServiceSlug}
        onSelectServiceSlug={setSelectedServiceSlug}
      />

      {/* ========================================================================= */}
      {/* 2. SERVICES BUILT FOR YOUR NEXT STAGE OF GROWTH (Pill Tabs & Card Carousel)*/}
      {/* ========================================================================= */}
      <HomeServicesSection
        onNavigate={onNavigate}
        selectedServiceSlug={selectedServiceSlug}
        onSelectServiceSlug={setSelectedServiceSlug}
      />

      {/* ========================================================================= */}
      {/* 3. ENGINEERING DISCIPLINES (Hero-Color-Coded Upper Section + 2 Horizontal Tool Rows) */}
      {/* ========================================================================= */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-b from-[#F8FAFF] via-white to-[#EEF4FF]/60 border-b border-[#DBEAFE]/90 overflow-hidden">
        {/* Subtle Dotted Pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#BFDBFE 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Soft Hero-Matched Light-Blue Radial Glow Behind Content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[880px] h-[460px] rounded-full blur-3xl opacity-85"
          style={{
            background:
              'radial-gradient(circle, rgba(219, 234, 254, 0.65) 0%, rgba(238, 244, 255, 0.45) 50%, rgba(255, 255, 255, 0) 75%)',
          }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* 1. Upper Section: Eyebrow Pill (Hero Section Color Coding) */}
          <div className="inline-flex items-center gap-2 h-[34px] px-3 sm:px-4 max-w-full rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-[#2563EB] font-['Plus_Jakarta_Sans','Inter',sans-serif] text-[11px] min-[360px]:text-[12px] sm:text-[13px] font-bold tracking-[0.12em] uppercase mb-5">
            <span
              className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0"
              aria-hidden="true"
            />
            <span className="truncate">Engineering Disciplines</span>
          </div>

          {/* 2. Headline (H2) — Hero Dark Blue (#1E3A8A) + Plus Jakarta Sans 800 + Zoom-In/Zoom-Out Effect */}
          <motion.h2
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="!font-['Plus_Jakarta_Sans','Outfit',sans-serif] font-extrabold text-[26px] min-[360px]:text-[32px] sm:text-[42px] lg:text-[52px] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.12)] tracking-[-0.03em] leading-[1.12] max-w-[900px] mx-auto origin-center cursor-default"
          >
            {[
              'A',
              'technology',
              'partner',
              'for',
              'your',
              'next',
              'stage',
              'of',
              'growth.',
            ].map((word, i, arr) => {
              const isLast = i === arr.length - 1;
              return (
                <React.Fragment key={`${word}-${i}`}>
                  <motion.span
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                    whileHover={
                      prefersReducedMotion
                        ? {}
                        : {
                            scale: 1.07,
                            transition: { duration: 0.22, ease: 'easeOut' },
                          }
                    }
                    transition={{
                      duration: 0.4,
                      delay: prefersReducedMotion ? 0 : 0.05 * i,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`inline-block text-[#1E3A8A] hover:drop-shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 ${
                      isLast ? 'mr-0' : 'mr-[0.24em]'
                    }`}
                  >
                    {word}
                  </motion.span>
                  {!isLast && ' '}
                </React.Fragment>
              );
            })}
          </motion.h2>

          {/* 3. Subtitle — Hero Subtitle Gradient (#100C2E -> #3A279E -> #2557D6) */}
          <p className="mt-5 !font-['Inter',sans-serif] font-medium text-[15px] sm:text-[17px] md:text-[18.5px] bg-gradient-to-r from-[#100C2E] via-[#3A279E] to-[#2557D6] bg-clip-text text-transparent leading-[1.7] max-w-[740px] mx-auto">
            Every business faces distinct operational challenges. IAMTECHNI brings design, full-stack development, artificial intelligence, cloud infrastructure, and growth engineering together into solutions engineered for long-term reliability.
          </p>

          {/* 4. Upper Feature Boxes: Strongly Typed & Multi-Cloud (Hero Pill/Card Color Coding) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full max-w-[720px] mx-auto">
            <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE] shadow-[0_4px_16px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-left transition-all duration-200 hover:border-[#93C5FD] hover:shadow-[0_8px_24px_rgba(30,58,138,0.12)]">
              <div className="flex items-center gap-2 text-[#1E3A8A] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm sm:text-[15px] mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>Strongly Typed</span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#2563EB] font-medium leading-relaxed">
                TypeScript strict mode across API &amp; client contracts.
              </p>
            </div>

            <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE] shadow-[0_4px_16px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-left transition-all duration-200 hover:border-[#93C5FD] hover:shadow-[0_8px_24px_rgba(30,58,138,0.12)]">
              <div className="flex items-center gap-2 text-[#1E3A8A] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm sm:text-[15px] mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>Multi-Cloud</span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#2563EB] font-medium leading-relaxed">
                Zero vendor lock-in across AWS &amp; Azure runtimes.
              </p>
            </div>
          </div>

          {/* 5. Below Tools: Exactly Three Evenly Split Rows of Website Tools */}
          {(() => {
            const websiteTools = getAllUniqueTools().slice(0, 18);
            const perRow = Math.ceil(websiteTools.length / 3);
            const firstRowTools = websiteTools.slice(0, perRow);
            const secondRowTools = websiteTools.slice(perRow, perRow * 2);
            const thirdRowTools = websiteTools.slice(perRow * 2, perRow * 3);
            const toolRows = [firstRowTools, secondRowTools, thirdRowTools];

            const renderToolItem = (tool: (typeof websiteTools)[number], keySuffix = '') => {
              const ToolIcon = tool.icon;
              const displayLabel =
                tool.name === 'Azure' ? 'Microsoft Azure' : tool.name;

              return (
                <div
                  key={`${tool.name}${keySuffix}`}
                  role="img"
                  aria-label={`${displayLabel} logo`}
                  title={displayLabel}
                  className="inline-flex items-center gap-2 md:gap-2 lg:gap-2.5 h-[30px] md:h-[32px] lg:h-[38px] shrink-0 select-none transition-transform duration-200 hover:scale-108 cursor-default"
                >
                  <span
                    className="flex items-center justify-center shrink-0"
                    style={{ color: tool.brandColor }}
                  >
                    <ToolIcon className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] lg:w-[30px] lg:h-[30px]" />
                  </span>
                  <span
                    className="!font-['Plus_Jakarta_Sans','Inter',sans-serif] text-[13.5px] md:text-[14.5px] lg:text-[18px] font-bold tracking-tight whitespace-nowrap"
                    style={{
                      color:
                        tool.name === 'React'
                          ? '#00B4D8'
                          : tool.name === 'TypeScript'
                          ? '#3178C6'
                          : '#1E3A8A',
                    }}
                  >
                    {displayLabel}
                  </span>
                </div>
              );
            };

            return (
              <div
                className="mt-12 sm:mt-14 w-full max-w-full pt-2 overflow-hidden"
                aria-label="IAMTECHNI website technology stack"
              >
                {/* Tablet (md) & Desktop (lg+): Exactly Three Centered Rows with Equal Spacing */}
                <div className="hidden md:flex md:flex-col items-center justify-center md:gap-y-6 lg:gap-y-8 w-full">
                  {toolRows.map((rowTools, rowIdx) => (
                    <div
                      key={`tech-desktop-row-${rowIdx + 1}`}
                      className="flex flex-nowrap items-center justify-center md:gap-x-7 lg:gap-x-12 w-full"
                    >
                      {rowTools.map((tool) => renderToolItem(tool))}
                    </div>
                  ))}
                </div>

                {/* Mobile (<md): Three Scrolling Marquee Rows (Alternating Left, Right, Left, Paused on Hover) */}
                <div className="flex md:hidden flex-col gap-y-5 w-full overflow-hidden">
                  {toolRows.map((rowTools, rowIdx) => {
                    const isReverse = rowIdx === 1;
                    const marqueeClass = prefersReducedMotion
                      ? 'flex items-center justify-center flex-wrap gap-x-5 gap-y-3 w-full'
                      : isReverse
                      ? 'animate-tech-marquee-reverse items-center gap-x-7 pr-7'
                      : 'animate-tech-marquee items-center gap-x-7 pr-7';

                    return (
                      <div
                        key={`tech-mobile-row-${rowIdx + 1}`}
                        className="relative w-full overflow-hidden"
                      >
                        <div className={marqueeClass}>
                          {rowTools.map((tool) => renderToolItem(tool, '-a'))}
                          {!prefersReducedMotion &&
                            rowTools.map((tool) => renderToolItem(tool, '-b'))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3.5 CORE ADVANTAGES                                                       */}
      {/* ========================================================================= */}
      <section className="py-16 bg-gradient-to-br from-[#EEF4FF] via-[#F4F1FE] to-[#F0FDFA] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerChildren={0.15}>
            {/* Advantage 1 - Blue (#EAF3FF) */}
            <ScrollRevealItem className="h-full">
              <div className="bg-[#EAF3FF] h-full rounded-2xl p-6 sm:p-8 border border-blue-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all relative overflow-hidden group interactive-card-lift">
                <div className="w-12 h-12 rounded-xl bg-[#1266E8] text-white flex items-center justify-center mb-5 shadow-xs group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Modern Software Craftsmanship
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  We write clean, strongly-typed TypeScript and Python code, enforce component modularity, and create architectures designed for maintainability and rapid onboarding.
                </p>
              </div>
            </ScrollRevealItem>

            {/* Advantage 2 - Violet (#F0EAFF) */}
            <ScrollRevealItem className="h-full">
              <div className="bg-[#F0EAFF] h-full rounded-2xl p-6 sm:p-8 border border-violet-200/90 shadow-xs hover:shadow-md hover:border-violet-300 transition-all relative overflow-hidden group interactive-card-lift">
                <div className="w-12 h-12 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center mb-5 shadow-xs group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Practical, Grounded Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  We deploy Retrieval-Augmented Generation (RAG) and private document search with strict citation traceability, ensuring your proprietary data never leaks into public models.
                </p>
              </div>
            </ScrollRevealItem>

            {/* Advantage 3 - Teal (#E1F8F2) */}
            <ScrollRevealItem className="h-full">
              <div className="bg-[#E1F8F2] h-full rounded-2xl p-6 sm:p-8 border border-teal-200/90 shadow-xs hover:shadow-md hover:border-teal-300 transition-all relative overflow-hidden group interactive-card-lift">
                <div className="w-12 h-12 rounded-xl bg-[#0D9488] text-white flex items-center justify-center mb-5 shadow-xs group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Enterprise Reliability &amp; Security
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Automated CI/CD deployment pipelines, defensive hardening, OWASP security best practices, and proactive cloud FinOps governance that prevent budget surprises.
                </p>
              </div>
            </ScrollRevealItem>
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2.5 ENTERPRISE SOLUTIONS & ARCHITECTURE MATRIX (Relevant to IAMTECHNI)     */}
      {/* ========================================================================= */}
      <EnterpriseSolutionsMatrix
        onNavigate={onNavigate}
        onOpenProjectModal={onOpenProjectModal}
      />

      {/* ========================================================================= */}
      {/* 3. CAPABILITIES DIRECTORY (Vibrant Card Grid with Staggered ScrollReveal)  */}
      {/* ========================================================================= */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-2">
                Connected Capabilities
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Technology capabilities. One connected vision.
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                From high-speed web experiences to autonomous robotics, explore our 18 specialized practices built to transform complex business requirements into working software.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/services')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1266E8] hover:text-[#0B5CD5] underline underline-offset-4 cursor-pointer"
            >
              <span>Explore All 18 Service Practices</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerChildren={0.1}>
            {servicesData.slice(0, 6).map((service, idx) => {
              const color = getCardColorToken(idx);
              const ServiceIcon = getServiceIcon(service.slug);

              return (
                <ScrollRevealItem key={service.id} className="h-full">
                  <div
                    onClick={() => onNavigate(`/services/${service.slug}` as PageRoute)}
                    className={`${color.cardBg} ${color.cardBorder} h-full border rounded-2xl p-5 sm:p-7 flex flex-col justify-between ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 cursor-pointer group shadow-2xs interactive-card-lift`}
                  >
                    <div>
                      {/* Visual Service Thumbnail */}
                      <ServiceCardThumbnail slug={service.slug} category={service.category} className="mb-4" />

                      {/* Top Row with Category Badge & Icon */}
                      <div className="flex items-center justify-between text-xs mb-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                          {service.category.toUpperCase()}
                        </span>
                        <div className={`w-9 h-9 rounded-xl ${color.iconBg} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                          <ServiceIcon className="w-4.5 h-4.5" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-950 transition-colors mb-2.5 flex items-center justify-between">
                        <span>{service.title}</span>
                        <span className={`w-2 h-2 rounded-full ${color.dotBg} shrink-0 opacity-80 group-hover:scale-125 transition-transform`} />
                      </h3>

                      <p className="text-xs text-slate-700 leading-relaxed mb-6 line-clamp-3">
                        {service.summary}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                          Key Capabilities:
                        </div>
                        {service.capabilities.slice(0, 3).map((cap, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2 text-xs text-slate-700">
                            <span className={`w-1.5 h-1.5 rounded-full ${color.dotBg}`} />
                            <span className="line-clamp-1">{cap.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                      <span className={`${color.accentText} flex items-center gap-1.5 group-hover:translate-x-1 transition-transform`}>
                        View Service Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-slate-500 font-mono text-[11px] bg-white/70 px-2 py-0.5 rounded border border-slate-200/60">
                        {service.technologies[0]}
                      </span>
                    </div>
                  </div>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED PROJECTS (High-Impact Filterable Showcase with ScrollReveal)  */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#F5F8FC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
                Project Showcase
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Ideas transformed into digital experiences.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Explore architectural concept demonstrations detailing business challenges, solution topologies, and verified outcomes.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs w-full md:w-auto overflow-x-auto">
              {['All', 'E-commerce', 'AI & ML', 'Custom Software', 'Cloud & DevOps'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedProjectFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                    selectedProjectFilter === cat
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerChildren={0.12}>
            {filteredProjects.map((project, idx) => {
              const color = getCardColorToken(idx + 1);

              return (
                <ScrollRevealItem key={project.id} className="h-full">
                  <div
                    onClick={() => onOpenCaseStudy(project)}
                    className={`${color.cardBg} ${color.cardBorder} h-full border rounded-2xl p-5 sm:p-7 flex flex-col justify-between ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 cursor-pointer group shadow-2xs interactive-card-lift`}
                  >
                    <div>
                      {/* Interactive Visual Thumbnail */}
                      <ProjectVisualThumbnail projectId={project.id} className="mb-4" />

                      <div className="flex items-center justify-between text-xs mb-3.5">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                          {project.category}
                        </span>
                        <span className="text-[11px] font-mono bg-white/80 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200/80 font-medium">
                          {project.clientBadge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-950 transition-colors leading-snug mb-2">
                        {project.title}
                      </h3>

                      <p className="text-xs text-slate-700 leading-relaxed mb-4 line-clamp-3">
                        {project.tagline}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.techStack.slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[11px] font-mono bg-white/90 text-slate-700 rounded-md border border-slate-200/90"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium text-[11px]">{project.industry}</span>
                      <span className={`${color.accentText} font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
                        View Case Study <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('/portfolio')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <span>Explore Complete Portfolio Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ENGINEERING APPROACH: 7-Stage Interactive Process Timeline             */}
      {/* ========================================================================= */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
              Methodology
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              A clear process. Thoughtful execution.
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              We guide projects from initial requirements discovery through validation and monitored deployment with a disciplined seven-stage methodology.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step Selector List with Icons */}
            <div className="lg:col-span-5 space-y-2">
              {processStages.map((stg, idx) => {
                const StepIcon = getProcessStepIcon(stg.step);
                return (
                  <button
                    key={stg.step}
                    onClick={() => setActiveProcessStep(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                      activeProcessStep === idx
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono font-bold w-7 h-7 flex items-center justify-center rounded-lg shrink-0 ${
                        activeProcessStep === idx
                          ? 'bg-[#04C8E8] text-slate-950'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold flex items-center gap-2">
                        <span>{stg.step}. {stg.title}</span>
                      </div>
                      <div
                        className={`text-[11px] truncate ${
                          activeProcessStep === idx ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {stg.tagline}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        activeProcessStep === idx ? 'text-[#04C8E8]' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Stage Detail Display Card with Visual Illustration */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl p-5 sm:p-8 lg:p-10 border border-slate-200 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1266E8] animate-pulse" />
                      <span className="font-bold text-slate-800">STAGE {processStages[activeProcessStep].step} OF 07</span>
                    </div>
                    <span className="text-[#1266E8] font-bold bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      IAMTECHNI_STANDARD
                    </span>
                  </div>

                  <div className="mt-6 mb-6">
                    <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                      {processStages[activeProcessStep].title}
                    </h3>
                    <div className="text-sm font-semibold text-[#1266E8] mb-4">
                      {processStages[activeProcessStep].tagline}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {processStages[activeProcessStep].details}
                    </p>

                    {/* Integrated Interactive Visual for the Stage */}
                    <ProcessStageVisual stageIndex={activeProcessStep} />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Continuous CI/CD quality gates &amp; peer reviews at every milestone.
                  </div>
                  <button
                    onClick={() => onOpenProjectModal(`Process Discussion: Stage ${processStages[activeProcessStep].title}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1266E8] hover:underline cursor-pointer"
                  >
                    Discuss Your Workflow <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SELECTIVE DARK NAVY SECTION: AI & High-Performance Innovation          */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#090D1A] text-white border-b border-slate-800 relative overflow-hidden">
        {/* Luminous Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#5427D9]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#04C8E8]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-14">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-[#04C8E8] font-bold">
                Artificial Intelligence & Scalability
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Put intelligent technology to practical work.
              </h2>
              <p className="text-base text-slate-400 leading-relaxed">
                We help enterprises move beyond generic chatbot hype. We build grounded, domain-specific AI applications, automated knowledge assistants, and cost-controlled inference pipelines.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-slate-300">
                <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-cyan-400">
                  ✓ pgvector Embeddings
                </span>
                <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-purple-400">
                  ✓ Verifiable Citations
                </span>
                <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-emerald-400">
                  ✓ Zero Model Training Leakage
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <AiNeuralPipelineVisual />
            </div>
          </div>

          <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerChildren={0.1}>
            <ScrollRevealItem className="h-full">
              <div className="bg-[#10162A] h-full border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors interactive-card-lift">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 text-[#04C8E8] flex items-center justify-center mb-4 shadow-sm">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Private Document RAG</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Query thousands of internal contracts, SOPs, and engineering manuals with verifiable source page citations.
                </p>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem className="h-full">
              <div className="bg-[#10162A] h-full border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors interactive-card-lift">
                <div className="w-10 h-10 rounded-xl bg-blue-950 text-[#1266E8] flex items-center justify-center mb-4 shadow-sm">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Knowledge Assistants</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Domain-specific assistants trained on your proprietary processes without leaking data to public training sets.
                </p>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem className="h-full">
              <div className="bg-[#10162A] h-full border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors interactive-card-lift">
                <div className="w-10 h-10 rounded-xl bg-purple-950 text-[#5427D9] flex items-center justify-center mb-4 shadow-sm">
                  <Workflow className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Workflow Automation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated document extraction, invoice classification, and human-in-the-loop review queues.
                </p>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem className="h-full">
              <div className="bg-[#10162A] h-full border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors interactive-card-lift">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-4 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Guardrails & Cost FinOps</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cost-aware token budgeting, prompt caching, and defensive filters against prompt injection attacks.
                </p>
              </div>
            </ScrollRevealItem>
          </ScrollReveal>

          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>Every AI deployment is backed by privacy compliance, rate-limiting, and evaluation benchmarks.</span>
            <button
              onClick={() => onNavigate('/services/ai-machine-learning')}
              className="text-[#04C8E8] hover:underline font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              Explore AI & Machine Learning Practice <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. INDUSTRIES SERVED (Staggered ScrollReveal)                             */}
      {/* ========================================================================= */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
                Domain Solutions
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Technology for different business challenges.
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
                We design and engineer digital systems tailored to the exact regulatory, workflow, and customer contexts of your industry.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/industries')}
              className="text-xs font-bold text-[#1266E8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All Industries <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerChildren={0.1}>
            {industriesData.slice(0, 6).map((ind, idx) => {
              const color = getCardColorToken(idx + 2);
              const IndIcon = getIndustryIcon(ind.name);

              return (
                <ScrollRevealItem key={ind.id} className="h-full">
                  <div
                    onClick={() => onNavigate('/industries')}
                    className={`${color.cardBg} ${color.cardBorder} h-full border rounded-2xl p-7 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between shadow-2xs interactive-card-lift`}
                  >
                    <div>
                      <IndustryIllustration industryId={ind.name} className="mb-4" />

                      <div className="flex items-center justify-between text-xs mb-3.5">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                          SECTOR 0{idx + 1}
                        </span>
                        <div className={`w-9 h-9 rounded-xl ${color.iconBg} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                          <IndIcon className="w-4.5 h-4.5" />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-950 transition-colors mb-2">
                        {ind.name}
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed mb-4">
                        {ind.summary}
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-700">
                        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                          Core Challenge Addressed:
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-2">
                          {ind.coreChallenges[0]}
                        </div>
                      </div>
                    </div>

                    <div className={`pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold ${color.accentText}`}>
                      <span>Explore Industry Solutions</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. LATEST ENGINEERING INSIGHTS (Staggered ScrollReveal)                   */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#F5F8FC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
                Engineering Knowledge
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Ideas, knowledge and practical engineering.
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Technical articles, architecture reviews, and field notes written by our senior engineering team.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/insights')}
              className="text-xs font-bold text-[#1266E8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Browse All Articles <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerChildren={0.15}>
            {insightsData.map((art, idx) => {
              const color = getCardColorToken(idx + 3);

              return (
                <ScrollRevealItem key={art.slug} className="h-full">
                  <article
                    onClick={() => onNavigate(`/insights/${art.slug}` as PageRoute)}
                    className={`${color.cardBg} ${color.cardBorder} h-full border rounded-2xl p-7 flex flex-col justify-between ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all cursor-pointer group shadow-2xs interactive-card-lift`}
                  >
                    <div>
                      {/* Interactive Article Graphic Header */}
                      <ArticleGraphic slug={art.slug} className="mb-4" />

                      <div className="flex items-center gap-2 text-xs mb-3">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                          {art.category}
                        </span>
                        <span className="text-slate-400" aria-hidden="true">·</span>
                        <span className="text-slate-500 font-mono text-[11px]">{art.readTime}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors leading-snug mb-3">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-700 leading-relaxed mb-6 line-clamp-3">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-mono text-[11px]">{art.publishedDate}</span>
                      <span className={`${color.accentText} font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
                        Read Article <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. STRIKING FINAL CALL TO ACTION (Luminous Gradient Section)               */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#090D1A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1266E8]/15 via-transparent to-[#5427D9]/15 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-mono text-[#04C8E8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>READY TO COLLABORATE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Have a challenge? Let’s engineer the solution.
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Tell us what you want to build, improve or transform. Let’s explore the right technology and a practical path forward.
          </p>

          {/* Interactive Engineering Terminal Visual */}
          <CtaTerminalVisual className="my-6" />

          <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3.5 sm:gap-4">
            <button
              onClick={() => onOpenProjectModal()}
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#1266E8] to-[#5427D9] hover:opacity-95 rounded-xl transition-all shadow-lg active:scale-[0.98] cursor-pointer"
            >
              <span>Discuss Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-semibold text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <span>Contact IAMTECHNI</span>
            </button>
          </div>

          <div className="pt-8 text-xs text-slate-500 font-mono">
            IAMTECHNI // https://iamtechni.in
          </div>
        </div>
      </section>
    </div>
  );
};
