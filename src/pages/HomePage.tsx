import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import {
  HomeServicesSection,
  ShowcaseCardCarouselSection,
  ShowcaseCarouselItem,
} from '../components/home/HomeServicesSection';
import { EnterpriseSolutionsMatrix } from '../components/home/EnterpriseSolutionsMatrix';
import { ProcessStageVisual, IndustryIllustration } from '../components/common/TechIllustrations';
import { ProjectVisualThumbnail, ArticleGraphic, ServiceCardThumbnail } from '../components/common/ServiceVisualMockups';
import { CompanyIntroVisual, AiNeuralPipelineVisual } from '../components/home/HomeSectionVisuals';
import { AIBookSection } from '../components/home/AIBookSection';
import { BusinessChallengesShowcase } from '../components/home/BusinessChallengesShowcase';
import { EngineeringKnowledgeSection } from '../components/home/EngineeringKnowledgeSection';
import { CollaborateSection } from '../components/home/CollaborateSection';
import { ScrollReveal, ScrollRevealItem, ScrollRevealSection } from '../components/common/ScrollReveal';
import { MobileSectionSkeletonWrapper } from '../components/common/MobileSectionSkeleton';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getServiceIcon, getIndustryIcon, getProcessStepIcon } from '../utils/serviceIcons';
import { getAllUniqueTools } from '../data/heroServiceTools';
import { useSectionInView, useIsWindowScrolling } from '../utils/useViewportActivity';
import {
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiLangchain,
  SiPostgresql,
  SiMeta,
  SiDocker,
  SiKubernetes,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { TbBrandAzure, TbBrandOpenai } from 'react-icons/tb';
import { AnimatePresence, motion, useReducedMotion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
  onOpenCaseStudy: (project: ProjectItem) => void;
}

// Hidden on request, set to true to show again
const SHOW_LEGACY_SERVICES = false;

const LegacyServicesSection: React.FC<{ onNavigate: (route: PageRoute) => void }> = ({
  onNavigate,
}) => (
  <section className="py-24 bg-white border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
        <div className="max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold mb-2">
            Connected Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.12)]">
            Technology capabilities. One connected vision.
          </h2>
          <p className="text-sm bg-gradient-to-r from-[#100C2E] via-[#3A279E] to-[#2557D6] bg-clip-text text-transparent font-medium mt-2 leading-relaxed">
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
);

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenProjectModal,
  onOpenCaseStudy,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [processAutoPlayStopped, setProcessAutoPlayStopped] = useState(false);
  const [processHovered, setProcessHovered] = useState(false);
  const [processSectionRef, isProcessInView] = useSectionInView<HTMLElement>(0.15);
  const isWindowScrolling = useIsWindowScrolling();
  const processStageButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const processMobileChipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const processTimelineButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
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

  const handleSelectProcessStage = (index: number) => {
    setProcessAutoPlayStopped(true);
    setActiveProcessStep(index);
  };

  const handleProcessKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
    refsArray: React.MutableRefObject<(HTMLButtonElement | null)[]>
  ) => {
    const total = processStages.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % total;
      handleSelectProcessStage(nextIndex);
      refsArray.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + total) % total;
      handleSelectProcessStage(prevIndex);
      refsArray.current[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleSelectProcessStage(0);
      refsArray.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      handleSelectProcessStage(total - 1);
      refsArray.current[total - 1]?.focus();
    }
  };

  const isProcessAutoAdvancing =
    !prefersReducedMotion &&
    !processAutoPlayStopped &&
    !processHovered &&
    isProcessInView &&
    !isWindowScrolling;

  useEffect(() => {
    if (!isProcessAutoAdvancing) {
      return;
    }
    const timer = window.setTimeout(() => {
      setActiveProcessStep((curr) => (curr + 1) % processStages.length);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [isProcessAutoAdvancing, activeProcessStep, processStages.length]);

  const allUniqueTools = useMemo(() => getAllUniqueTools(), []);
  const websiteTools = useMemo(() => allUniqueTools.slice(0, 18), [allUniqueTools]);
  const projectCarouselItems = useMemo<ShowcaseCarouselItem[]>(
    () =>
      projectsData.map((project): ShowcaseCarouselItem => {
        const primaryServiceSlug =
          project.relatedServices?.[0]?.route.replace('/services/', '') ||
          project.category;
        return {
          id: project.id,
          slug: project.id,
          title: project.title,
          category: `${project.category} · ${project.industry}`,
          summary: project.tagline,
          icon: getServiceIcon(primaryServiceSlug),
          highlights: (project.verifiedOutcomes || project.keyFeatures || []).slice(0, 2),
          stackLabel: 'Key Stack & Tools',
          tools: project.techStack.slice(0, 4).map((techName) => {
            const matchedTool = allUniqueTools.find(
              (t) =>
                t.name.toLowerCase() === techName.toLowerCase() ||
                techName.toLowerCase().includes(t.name.toLowerCase())
            );
            return {
              name: techName,
              icon: matchedTool?.icon,
              brandColor: matchedTool?.brandColor,
            };
          }),
          ctaLabel: 'View Case Study',
          onCtaClick: () => onOpenCaseStudy(project),
        };
      }),
    [allUniqueTools, onOpenCaseStudy]
  );

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
      <MobileSectionSkeletonWrapper variant="carousel" sectionIndex={0}>
        <HomeServicesSection
          onNavigate={onNavigate}
          selectedServiceSlug={selectedServiceSlug}
          onSelectServiceSlug={setSelectedServiceSlug}
        />
      </MobileSectionSkeletonWrapper>

      {/* ========================================================================= */}
      {/* 3. ENGINEERING DISCIPLINES (Hero-Color-Coded Upper Section + 2 Horizontal Tool Rows) */}
      {/* ========================================================================= */}
      <MobileSectionSkeletonWrapper variant="disciplines" sectionIndex={1}>
      <section className="relative pt-10 pb-6 sm:pt-24 sm:pb-10 bg-gradient-to-b from-[#F8FAFF] via-white to-[#EEF4FF]/60 border-b border-[#DBEAFE]/90 overflow-hidden">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* 1. Upper Section: Eyebrow Pill (Hero Section Color Coding) */}
          <div className="inline-flex items-center gap-2 h-[32px] sm:h-[34px] px-3 sm:px-4 max-w-full rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-[#2563EB] font-['Plus_Jakarta_Sans','Inter',sans-serif] text-[11px] min-[360px]:text-[12px] sm:text-[13px] font-bold tracking-[0.12em] uppercase mb-3.5 sm:mb-5">
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

          {/* 3. Subtitle */}
          <p className="mt-3 sm:mt-5 !font-['Inter',sans-serif] font-medium text-[13.5px] sm:text-[17px] md:text-[18px] text-slate-600 leading-[1.6] sm:leading-[1.7] max-w-[740px] mx-auto line-clamp-3 sm:line-clamp-none">
            Every business faces distinct operational challenges. IAMTECHNI brings design, full-stack development, artificial intelligence, cloud infrastructure, and growth engineering together into solutions engineered for long-term reliability.
          </p>

          {/* 4. Upper Feature Boxes: Strongly Typed & Multi-Cloud */}
          <div className="mt-5 sm:mt-8 grid grid-cols-2 gap-2.5 sm:gap-5 w-full max-w-[720px] mx-auto">
            <div className="rounded-2xl p-3 sm:p-5 bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE] shadow-[0_4px_16px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-left transition-all duration-200 hover:border-[#93C5FD] hover:shadow-[0_8px_24px_rgba(30,58,138,0.12)]">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#1E3A8A] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs sm:text-[15px] mb-1 sm:mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563EB] shrink-0" />
                <span>Strongly Typed</span>
              </div>
              <p className="text-[11px] sm:text-sm text-slate-600 font-medium leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                TypeScript strict mode across API &amp; client contracts.
              </p>
            </div>

            <div className="rounded-2xl p-3 sm:p-5 bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE] shadow-[0_4px_16px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-left transition-all duration-200 hover:border-[#93C5FD] hover:shadow-[0_8px_24px_rgba(30,58,138,0.12)]">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#1E3A8A] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs sm:text-[15px] mb-1 sm:mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563EB] shrink-0" />
                <span>Multi-Cloud</span>
              </div>
              <p className="text-[11px] sm:text-sm text-slate-600 font-medium leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                Zero vendor lock-in across AWS &amp; Azure runtimes.
              </p>
            </div>
          </div>

          {/* 5. Below Tools: Exactly Three Evenly Split Rows of Website Tools */}
          {(() => {
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
                className="mt-7 sm:mt-14 w-full max-w-full pt-1 sm:pt-2 overflow-hidden"
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

                {/* Mobile (<md): Compact 3-Column Core Stack Grid (12 primary tools) */}
                <div className="grid grid-cols-3 md:hidden gap-2 w-full">
                  {toolRows.flat().slice(0, 12).map((tool) => {
                    const ToolIcon = tool.icon;
                    const displayLabel =
                      tool.name === 'Google Cloud'
                        ? 'GCP'
                        : tool.name === 'Tailwind CSS'
                        ? 'Tailwind'
                        : tool.name;
                    return (
                      <div
                        key={`tech-mobile-grid-${tool.name}`}
                        className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/90 border border-[#DBEAFE] shadow-[0_2px_10px_rgba(30,58,138,0.05)] min-w-0"
                      >
                        {ToolIcon && (
                          <span
                            className="shrink-0 flex items-center justify-center"
                            style={{ color: tool.brandColor || '#2563EB' }}
                          >
                            <ToolIcon className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-[#1E3A8A] truncate">
                          {displayLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </section>
      </MobileSectionSkeletonWrapper>

      {/* ========================================================================= */}
      {/* 3.5 CORE ADVANTAGES (Scroll-Animated Pastel Frame + Meadow Cards + Original Content) */}
      {/* ========================================================================= */}
      <MobileSectionSkeletonWrapper variant="principles" sectionIndex={2}>
        <PrinciplesScrollSection
          onNavigate={onNavigate}
          prefersReducedMotion={Boolean(prefersReducedMotion)}
        />
      </MobileSectionSkeletonWrapper>

      {/* ========================================================================= */}
      {/* 2.5 ENTERPRISE SOLUTIONS & ARCHITECTURE MATRIX (Relevant to IAMTECHNI)     */}
      {/* ========================================================================= */}
      <MobileSectionSkeletonWrapper variant="matrix" sectionIndex={3}>
        <EnterpriseSolutionsMatrix
          onNavigate={onNavigate}
          onOpenProjectModal={onOpenProjectModal}
        />
      </MobileSectionSkeletonWrapper>

      {/* ========================================================================= */}
      {/* 3. CAPABILITIES DIRECTORY (Legacy Services Section)                       */}
      {/* Hidden on request, set to true to show again                              */}
      {/* ========================================================================= */}
      {SHOW_LEGACY_SERVICES && <LegacyServicesSection onNavigate={onNavigate} />}

      {/* ========================================================================= */}
      {/* 4. FEATURED PROJECTS (Same Carousel Component as Services Section)        */}
      {/* ========================================================================= */}
      <MobileSectionSkeletonWrapper variant="carousel" sectionIndex={4}>
        <ShowcaseCardCarouselSection
          sectionId="projects"
          eyebrow="Project Showcase"
          heading="Ideas transformed into digital experiences."
          subtitle="Explore architectural concept demonstrations detailing business challenges, solution topologies, and verified outcomes."
          items={projectCarouselItems}
          allItemsLabel="All Projects"
          onAllItemsClick={() => onNavigate('/portfolio')}
        />
      </MobileSectionSkeletonWrapper>

      {/* ========================================================================= */}
      {/* 5. ENGINEERING APPROACH: 7-Stage Interactive Process Timeline             */}
      {/* ========================================================================= */}
      <MobileSectionSkeletonWrapper variant="methodology" sectionIndex={5}>
      <section
        ref={processSectionRef}
        className="py-10 sm:py-24 bg-[#F4F7FE]/70 border-b border-slate-200 overflow-hidden"
        onMouseEnter={() => setProcessHovered(true)}
        onMouseLeave={() => setProcessHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mb-6 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 h-[34px] px-3 sm:px-4 mb-3 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 backdrop-blur-md border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold">
              <span
                className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0"
                aria-hidden="true"
              />
              <span>Methodology</span>
            </div>

            <motion.h2
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] font-bold tracking-[-0.015em] text-[#1E3A8A] leading-[1.2] origin-left cursor-default"
            >
              {['A', 'clear', 'process.', 'Thoughtful', 'execution.'].map((word, i, arr) => {
                const isLast = i === arr.length - 1;
                return (
                  <React.Fragment key={`${word}-${i}`}>
                    <motion.span
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
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
                        delay: prefersReducedMotion ? 0 : 0.06 * i,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`inline-block text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.12)] hover:drop-shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-shadow duration-200 ${
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

            <p className="text-[15px] sm:text-base text-slate-600 font-medium mt-3 leading-relaxed">
              We guide projects from initial requirements discovery through validation and monitored deployment with a disciplined seven-stage methodology.
            </p>
          </motion.div>

          {/* Mobile / Tablet Stage Discoverability Header + Horizontally Scrollable Stage Chip Row */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between gap-2 mb-2.5 px-0.5">
              <div className="inline-flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#1E3A8A] text-white font-mono text-xs font-bold">
                  Stage {processStages[activeProcessStep].step} / 07
                </span>
                <span className="text-xs font-semibold text-[#2563EB]">
                  Swipe or tap stages →
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectProcessStage(
                      (activeProcessStep - 1 + processStages.length) % processStages.length
                    )
                  }
                  aria-label="Previous methodology stage"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#DBEAFE] shadow-xs flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectProcessStage(
                      (activeProcessStep + 1) % processStages.length
                    )
                  }
                  aria-label="Next methodology stage"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white border border-[#1E3A8A] shadow-xs flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative -mx-4 px-4">
              {/* Right-edge scroll fade indicator on mobile/tablet */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#F4F7FE] via-[#F4F7FE]/85 to-transparent z-20"
              />
              <div
                className="overflow-x-auto no-scrollbar pr-8"
                role="tablist"
                aria-label="Methodology stages"
              >
                <div className="flex items-center gap-2.5 min-w-max pb-1">
                  {processStages.map((stg, idx) => {
                    const StepIcon = getProcessStepIcon(stg.step);
                    const isActive = activeProcessStep === idx;
                    return (
                      <button
                        key={stg.step}
                        ref={(el) => {
                          processMobileChipRefs.current[idx] = el;
                        }}
                        type="button"
                        onClick={() => handleSelectProcessStage(idx)}
                        onKeyDown={(e) => handleProcessKeyDown(e, idx, processMobileChipRefs)}
                        aria-label={`${stg.step}. ${stg.title} — ${stg.tagline}`}
                        aria-current={isActive ? 'step' : undefined}
                        className={`group relative px-3.5 py-2.5 min-h-[44px] rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer shrink-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                          isActive
                            ? 'text-white border-[#1E3A8A] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)]'
                            : 'bg-white hover:bg-[#EEF4FF]/80 border-slate-200/90 text-[#1E3A8A] hover:border-[#93C5FD]'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="process-active-stage-mobile-chip"
                            className="absolute inset-0 rounded-2xl bg-[#1E3A8A] group-hover:bg-[#1E3A8A]/80 transition-colors duration-200"
                            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                          />
                        )}
                        <span
                          className={`relative z-10 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                            isActive
                              ? 'bg-white/15 text-white border border-white/20'
                              : 'bg-[#EEF4FF] text-[#1E3A8A]'
                          }`}
                        >
                          <StepIcon className="w-3.5 h-3.5" />
                        </span>
                        <div className="relative z-10 text-xs font-bold whitespace-nowrap">
                          {stg.step}. {stg.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
            {/* Desktop Left Column: 7-Stage Compact Dashboard Card List */}
            <motion.div
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.06 },
                },
              }}
              className="hidden lg:flex lg:col-span-4 flex-col justify-between gap-2.5"
              role="navigation"
              aria-label="7-stage engineering methodology"
            >
              {processStages.map((stg, idx) => {
                const StepIcon = getProcessStepIcon(stg.step);
                const isActive = activeProcessStep === idx;
                return (
                  <motion.div
                    key={stg.step}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  >
                    <button
                      ref={(el) => {
                        processStageButtonRefs.current[idx] = el;
                      }}
                      type="button"
                      onClick={() => handleSelectProcessStage(idx)}
                      onKeyDown={(e) => handleProcessKeyDown(e, idx, processStageButtonRefs)}
                      aria-label={`${stg.step}. ${stg.title}: ${stg.tagline}`}
                      aria-current={isActive ? 'step' : undefined}
                      className={`group relative w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 cursor-pointer overflow-hidden active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                        isActive
                          ? 'text-white border-[#1E3A8A] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)]'
                          : 'bg-white hover:bg-[#EEF4FF]/70 border-slate-200/80 text-[#1E3A8A] shadow-[0_4px_16px_-6px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_24px_-8px_rgba(30,58,138,0.12)] hover:border-[#93C5FD]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="process-active-stage-card"
                          className="absolute inset-0 rounded-2xl bg-[#1E3A8A] group-hover:bg-[#1E3A8A]/80 transition-colors duration-200"
                          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                        />
                      )}
                      {isActive && (
                        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#3B82F6]/20 blur-xl pointer-events-none" />
                      )}

                      <span
                        className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white/15 text-white border border-white/20 shadow-inner'
                            : 'bg-[#EEF4FF] text-[#1E3A8A] border border-blue-100/80'
                        }`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </span>

                      <div className="relative z-10 flex-1 min-w-0">
                        <div
                          className={`text-sm font-bold flex items-center gap-2 ${
                            isActive ? 'text-white' : 'text-[#1E3A8A]'
                          }`}
                        >
                          <span>
                            {stg.step}. {stg.title}
                          </span>
                        </div>
                        <div
                          className={`text-[11px] truncate mt-0.5 ${
                            isActive ? 'text-blue-100/90' : 'text-slate-500'
                          }`}
                        >
                          {stg.tagline}
                        </div>
                      </div>

                      <ChevronRight
                        className={`relative z-10 w-4 h-4 shrink-0 transition-transform ${
                          isActive ? 'text-white translate-x-0.5' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Right Column: Bento Grid Dashboard for Active Stage */}
            <motion.div
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.08 },
                },
              }}
              className="lg:col-span-8 flex flex-col gap-5"
            >
              {/* Top Row: Wide Softer Royal Navy Hero Card (a) */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                className="relative rounded-[26px] bg-gradient-to-br from-[#162D5E] via-[#1C3873] to-[#1E3A8A] text-white p-6 sm:p-8 shadow-[0_18px_42px_-15px_rgba(30,58,138,0.28)] border border-[#60A5FA]/35 overflow-hidden"
              >
                {/* Subtle ambient glow accents inside hero bento card */}
                <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-[#3B82F6]/25 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-[#04C8E8]/15 blur-3xl pointer-events-none" />

                {/* Top chips row */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                    <span className="font-bold text-white tracking-wide">
                      STAGE {processStages[activeProcessStep].step} OF 07
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#DBEAFE] bg-[#2563EB]/35 px-3 py-1 rounded-full border border-[#60A5FA]/40">
                    IAMTECHNI_STANDARD
                  </span>
                </div>

                {/* Animated Stage Hero Copy */}
                <div className="relative z-10 mt-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={processStages[activeProcessStep].step}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 10, scale: 0.99 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -8, scale: 0.99 }
                      }
                      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <motion.h3
                        whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        className="inline-block !font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 origin-left cursor-default"
                      >
                        {processStages[activeProcessStep].title}
                      </motion.h3>
                      <div className="text-sm font-semibold text-[#93C5FD] mb-3">
                        {processStages[activeProcessStep].tagline}
                      </div>
                      <p className="text-sm text-blue-100/90 leading-relaxed max-w-2xl">
                        {processStages[activeProcessStep].details}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Auto-advance subtle progress bar at bottom of hero card */}
                {!processAutoPlayStopped && !prefersReducedMotion && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden"
                    aria-hidden="true"
                  >
                    <div
                      key={`process-progress-${activeProcessStep}`}
                      className="h-full w-full bg-gradient-to-r from-[#38BDF8] to-[#93C5FD] animate-progress-scale"
                      style={{
                        animationDuration: '6000ms',
                        animationPlayState: isProcessAutoAdvancing ? 'running' : 'paused',
                      }}
                    />
                  </div>
                )}
              </motion.div>

              {/* Middle Row: Timeline Card (b) + Progress Ring Card (c) — Hidden on mobile (<md) where top stage chip row + counter already provide instant stage navigation */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* b) Timeline Card: 7-Stage Horizontal Track */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                  className="md:col-span-8 bg-white rounded-[24px] p-5 border border-slate-200/80 shadow-[0_12px_32px_-12px_rgba(15,30,74,0.08)] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#1E3A8A]">
                      Methodology
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#2563EB] bg-[#EEF4FF] px-2.5 py-0.5 rounded-full border border-blue-200/70">
                      STAGE {processStages[activeProcessStep].step} OF 07
                    </span>
                  </div>

                  <div
                    className="grid grid-cols-2 min-[420px]:grid-cols-4 sm:grid-cols-7 gap-2 my-auto"
                    role="group"
                    aria-label="Stage timeline blocks"
                  >
                    {processStages.map((stg, idx) => {
                      const isCompleted = idx < activeProcessStep;
                      const isCurrent = idx === activeProcessStep;
                      return (
                        <button
                          key={stg.step}
                          ref={(el) => {
                            processTimelineButtonRefs.current[idx] = el;
                          }}
                          type="button"
                          onClick={() => handleSelectProcessStage(idx)}
                          onKeyDown={(e) =>
                            handleProcessKeyDown(e, idx, processTimelineButtonRefs)
                          }
                          aria-label={`${stg.step}. ${stg.title}`}
                          aria-current={isCurrent ? 'step' : undefined}
                          className={`relative group rounded-xl p-2.5 border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 min-h-[54px] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                            isCurrent
                              ? 'text-white border-[#1E3A8A] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)]'
                              : isCompleted
                              ? 'bg-[#DBEAFE]/75 border-[#93C5FD] text-[#1E3A8A] hover:bg-[#DBEAFE]'
                              : 'bg-slate-50/70 border-slate-200 text-slate-500 hover:border-[#93C5FD] hover:text-[#1E3A8A]'
                          }`}
                        >
                          {isCurrent && (
                            <motion.div
                              layoutId="process-timeline-active-block"
                              className="absolute inset-0 rounded-xl bg-[#1E3A8A] group-hover:bg-[#1E3A8A]/80 transition-colors duration-200"
                              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                            />
                          )}
                          <span
                            className={`relative z-10 text-xs font-mono font-bold ${
                              isCurrent
                                ? 'text-white'
                                : isCompleted
                                ? 'text-[#1E3A8A]'
                                : 'text-slate-500'
                            }`}
                          >
                            {stg.step}
                          </span>
                          <span
                            className={`relative z-10 text-[11px] font-semibold truncate max-w-full ${
                              isCurrent
                                ? 'text-blue-100'
                                : isCompleted
                                ? 'text-[#1E3A8A]/90'
                                : 'text-slate-500'
                            }`}
                          >
                            {stg.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* c) Progress Ring Card: Current Stage out of 7 */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                  className="md:col-span-4 bg-white rounded-[24px] p-5 border border-slate-200/80 shadow-[0_12px_32px_-12px_rgba(15,30,74,0.08)] flex items-center justify-center"
                >
                  {(() => {
                    const radius = 44;
                    const circumference = 2 * Math.PI * radius;
                    const fraction = (activeProcessStep + 1) / processStages.length;
                    const strokeDashoffset = circumference * (1 - fraction);

                    return (
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                          <svg
                            className="w-24 h-24 -rotate-90"
                            viewBox="0 0 104 104"
                            aria-hidden="true"
                          >
                            <circle
                              cx="52"
                              cy="52"
                              r={radius}
                              fill="none"
                              stroke="#E2E8F0"
                              strokeWidth="8"
                            />
                            <motion.circle
                              cx="52"
                              cy="52"
                              r={radius}
                              fill="none"
                              stroke="url(#processRingGrad)"
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={circumference}
                              initial={false}
                              animate={{ strokeDashoffset }}
                              transition={
                                prefersReducedMotion
                                  ? { duration: 0 }
                                  : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                              }
                            />
                            <defs>
                              <linearGradient
                                id="processRingGrad"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                              >
                                <stop offset="0%" stopColor="#0F1E4A" />
                                <stop offset="50%" stopColor="#1E3A8A" />
                                <stop offset="100%" stopColor="#2563EB" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                            <span className="text-sm font-mono font-extrabold text-[#1E3A8A] leading-none">
                              {activeProcessStep + 1}/{processStages.length}
                            </span>
                            <span className="text-[10px] font-bold text-[#2563EB] mt-1 truncate max-w-[68px]">
                              {processStages[activeProcessStep].title}
                            </span>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="text-[11px] font-mono font-bold text-[#2563EB]">
                            {processStages[activeProcessStep].step} / 07
                          </div>
                          <div className="text-base font-extrabold text-[#1E3A8A] truncate">
                            {processStages[activeProcessStep].title}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            IAMTECHNI_STANDARD
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </div>

              {/* Bottom Row: Detail Card (d) with Stage Visual & Footer Action */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                className="bg-white rounded-[26px] p-5 sm:p-7 border border-slate-200/80 shadow-[0_14px_36px_-12px_rgba(15,30,74,0.08)] flex flex-col justify-between"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProcessStep}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 10, scale: 0.99 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -8, scale: 0.99 }
                    }
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProcessStageVisual stageIndex={activeProcessStep} />
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Continuous CI/CD quality gates &amp; peer reviews at every milestone.
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenProjectModal(
                        `Process Discussion: Stage ${processStages[activeProcessStep].title}`
                      )
                    }
                    className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] transition-all duration-200 active:scale-[0.98] cursor-pointer self-start sm:self-auto"
                  >
                    <span>Discuss Your Workflow</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      </MobileSectionSkeletonWrapper>

      {/* ========================================================================= */}
      {/* 6. SELECTIVE DARK NAVY SECTION: AI & High-Performance Innovation          */}
      {/* ========================================================================= */}
      <MobileSectionSkeletonWrapper variant="dark-book" sectionIndex={6}>
        <AIBookSection onNavigate={onNavigate} />
      </MobileSectionSkeletonWrapper>

      {/* ========================================================================= */}
      {/* 7. INDUSTRIES SERVED (Auto-Changing Stacked Card Showcase)                */}
      {/* ========================================================================= */}
      <MobileSectionSkeletonWrapper variant="showcase" sectionIndex={7}>
        <BusinessChallengesShowcase onNavigate={onNavigate} />
      </MobileSectionSkeletonWrapper>

      {/* ========================================================================= */}
      {/* 8. LATEST ENGINEERING INSIGHTS (Dark Glass 3D Flip Cards)                 */}
      {/* ========================================================================= */}
      <MobileSectionSkeletonWrapper variant="dark-cards" sectionIndex={8}>
        <EngineeringKnowledgeSection onNavigate={onNavigate} />
      </MobileSectionSkeletonWrapper>

      {/* ========================================================================= */}
      {/* 9. UNIFIED COLLABORATE & DIRECT INQUIRIES SECTION                         */}
      {/* ========================================================================= */}
      <MobileSectionSkeletonWrapper variant="collaborate" sectionIndex={9}>
        <CollaborateSection
          onNavigate={onNavigate}
          onOpenProjectModal={onOpenProjectModal}
        />
      </MobileSectionSkeletonWrapper>
    </div>
  );
};

interface PrinciplesScrollSectionProps {
  onNavigate: (route: PageRoute) => void;
  prefersReducedMotion: boolean;
}

const PrinciplesScrollSection: React.FC<PrinciplesScrollSectionProps> = ({
  onNavigate,
  prefersReducedMotion,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRowRef = useRef<HTMLDivElement>(null);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobileScreen(e.matches);
    setIsMobileScreen(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const skipParallax = prefersReducedMotion || isMobileScreen;

  // Trigger widget count-up & inner animations when cards are ~60% visible
  const widgetsVisible = useInView(cardsRowRef, { once: true, amount: 0.35 });

  // Scroll-linked progress across the section with smooth spring physics (desktop/tablet)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.35,
  });

  // 1. Huge faded "IAMTECHNI" wordmark slides horizontally at the bottom
  const wordmarkX = useTransform(
    smoothProgress,
    [0, 1],
    skipParallax ? ['0%', '0%'] : ['12%', '-12%']
  );

  // 2. White frame rises gently on desktop and stays rock-solid on mobile touch scroll
  const frameY = useTransform(
    smoothProgress,
    [0.02, 0.28],
    skipParallax ? [0, 0] : [28, 0]
  );
  const frameOpacity = useTransform(
    smoothProgress,
    [0.0, 0.16],
    skipParallax ? [1, 1] : [0.85, 1]
  );

  // 3. Headline and buttons fade up gently
  const headerY = useTransform(
    smoothProgress,
    [0.04, 0.24],
    skipParallax ? [0, 0] : [18, 0]
  );
  const headerOpacity = useTransform(
    smoothProgress,
    [0.04, 0.2],
    skipParallax ? [1, 1] : [0.85, 1]
  );

  // 4. Photo cards rise smoothly on desktop without fighting vertical touch scrolling on mobile
  const centerCardY = useTransform(
    smoothProgress,
    [0.06, 0.3, 0.85],
    skipParallax ? [0, 0, 0] : [28, 0, -6]
  );
  const centerCardOpacity = useTransform(
    smoothProgress,
    [0.05, 0.22],
    skipParallax ? [1, 1] : [0.85, 1]
  );

  const sideCardY = useTransform(
    smoothProgress,
    [0.1, 0.34, 0.85],
    skipParallax ? [0, 0, 0] : [32, 0, 4]
  );
  const sideCardOpacity = useTransform(
    smoothProgress,
    [0.08, 0.26],
    skipParallax ? [1, 1] : [0.85, 1]
  );

  const leftCardX = useTransform(
    smoothProgress,
    [0.28, 0.82],
    [0, 0]
  );
  const rightCardX = useTransform(
    smoothProgress,
    [0.28, 0.82],
    [0, 0]
  );

  // 5. Each photo moves slower than the page on desktop (scroll parallax)
  const photoParallaxY = useTransform(
    smoothProgress,
    [0, 1],
    skipParallax ? ['0%', '0%'] : ['-8%', '8%']
  );

  // Count-up metrics triggered when cards are ~60% visible
  const [beforeQuality, setBeforeQuality] = useState(prefersReducedMotion ? 72 : 0);
  const [afterQuality, setAfterQuality] = useState(prefersReducedMotion ? 98 : 0);
  const [privateAiPct, setPrivateAiPct] = useState(prefersReducedMotion ? 100 : 0);
  const [litDocs, setLitDocs] = useState(prefersReducedMotion ? 8 : 0);
  const [uptimeVal, setUptimeVal] = useState(prefersReducedMotion ? 99.99 : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setBeforeQuality(72);
      setAfterQuality(98);
      setPrivateAiPct(100);
      setLitDocs(8);
      setUptimeVal(99.99);
      return;
    }
    if (!widgetsVisible) return;

    const duration = 1400;
    let rafId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setBeforeQuality(Math.round(72 * eased));
      setAfterQuality(Math.round(98 * eased));
      setPrivateAiPct(Math.round(100 * eased));
      setLitDocs(Math.min(8, Math.floor(eased * 8.99)));
      setUptimeVal(Number((99.99 * eased).toFixed(2)));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [widgetsVisible, prefersReducedMotion]);

  const active = prefersReducedMotion || widgetsVisible;
  const ringCircumference = 2 * Math.PI * 19;
  const ringOffset = ringCircumference * (1 - (active ? 1 : 0));

  return (
    <section
      ref={sectionRef}
      className="relative py-9 sm:py-24 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF] border-b border-slate-200/70 overflow-hidden"
    >
      {/* Clean Top-to-Bottom Gradient Layer (#F5F8FC -> #FFFFFF) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]"
      />

      {/* Huge Faded "IAMTECHNI" Wordmark Behind the Frame at the Bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-x-0 bottom-[-18px] sm:bottom-[-32px] flex justify-center overflow-hidden z-0"
      >
        <motion.div
          style={{ x: wordmarkX }}
          className="!font-['Plus_Jakarta_Sans','Outfit',sans-serif] font-black text-[76px] sm:text-[138px] lg:text-[196px] tracking-[-0.04em] leading-none text-[#1E3A8A]/[0.05] uppercase whitespace-nowrap"
        >
          IAMTECHNI
        </motion.div>
      </div>

      {/* Large White Rounded Card Holding Everything */}
      <motion.div
        style={{
          y: frameY,
          opacity: frameOpacity,
        }}
        className="relative z-10 max-w-7xl mx-auto bg-white rounded-[26px] sm:rounded-[32px] py-5 px-3.5 sm:pt-[56px] sm:px-[40px] sm:pb-[48px] shadow-[0_24px_64px_rgba(15,23,42,0.08)] border border-white/90"
      >
        {/* 2. HEADER (inside the white card, centered) */}
        <motion.div
          style={{
            y: headerY,
            opacity: headerOpacity,
          }}
          className="flex flex-col items-center text-center mb-6 sm:mb-12"
        >
          {/* Headline — Exact Hero Section Font Family, Pure Dark Blue (#1E3A8A), No Hover Color Change, Zoom-In/Zoom-Out on Hover */}
          <motion.h2
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="!font-['Outfit','Space_Grotesk',sans-serif] font-bold text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] text-[#1E3A8A] tracking-[-0.015em] leading-[1.2] origin-center cursor-default"
          >
            {['Built', 'Right.', 'Built', 'Smart.', 'Built', 'Secure.'].map((word, i, arr) => {
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
                      delay: prefersReducedMotion ? 0 : 0.06 * i,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`inline-block text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.12)] hover:drop-shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-shadow duration-200 ${
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

          {/* Subtitle */}
          <p className="mt-3 text-[15px] sm:text-base text-slate-600 font-medium leading-relaxed max-w-[540px] mx-auto">
            Clean engineering, private AI, and enterprise security, working together so your product grows without surprises.
          </p>

          {/* Buttons — Dark Blue (#1E3A8A) with Softer Hover (#1E3A8A/80) */}
          <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto max-w-[330px] sm:max-w-none">
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/contact');
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span>Start a Project</span>
            </a>
            <a
              href="/services"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/services');
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Services</span>
            </a>
          </div>
        </motion.div>

        {/* 3. PHOTO CARDS + ORIGINAL ICON, TITLE, AND PARAGRAPH DIRECTLY BELOW EACH */}
        <div
          ref={cardsRowRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row lg:items-start gap-5 sm:gap-6 lg:gap-[18px]"
        >
          {/* --------------------------------------------------------------- */}
          {/* LEFT CARD: Modern Software Craftsmanship                        */}
          {/* --------------------------------------------------------------- */}
          <motion.div
            style={{
              y: sideCardY,
              x: leftCardX,
              opacity: sideCardOpacity,
            }}
            className="group/card md:order-2 lg:order-1 lg:w-[29.5%] shrink-0 flex flex-col items-center"
          >
            {/* Card Container */}
            <div className="group w-full h-[170px] sm:h-[220px] lg:h-[240px] rounded-[20px] sm:rounded-[24px] overflow-hidden relative flex items-center justify-center p-3 sm:p-4 bg-gradient-to-b from-[#DBEAFE]/65 via-[#EFF6FF]/75 to-[#F8FAFF] border border-[#DBEAFE]/90 shadow-[0_12px_30px_rgba(30,58,138,0.08)] hover:shadow-[0_20px_42px_rgba(30,58,138,0.16)] transition-all duration-300 ease-out hover:-translate-y-[6px]">
              <motion.div
                style={{ y: photoParallaxY }}
                className="absolute -inset-y-5 inset-x-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9)_0%,rgba(219,234,254,0.45)_60%,rgba(239,246,255,0.8)_100%)] pointer-events-none"
              />

              {/* Compact White Widget */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 18,
                  delay: prefersReducedMotion ? 0 : 0.1,
                }}
                className="relative z-10 w-[84%] sm:w-[68%] lg:w-[74%] max-w-[230px] bg-white rounded-xl p-3 border border-[#DBEAFE]/90 shadow-[0_10px_28px_rgba(30,58,138,0.14)] text-[11px] leading-tight text-left transition-transform duration-300 ease-out group-hover:-translate-y-[4px]"
              >
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span className="font-bold text-[#1E3A8A] truncate">Code quality</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#EEF4FF] text-[#2563EB] border border-[#DBEAFE]/80 text-[9.5px] font-semibold shrink-0">
                    Recommended
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <div className="rounded-lg bg-[#F8FAFF] border border-[#DBEAFE]/80 px-2 py-1.5">
                    <div className="text-[10px] text-[#2563EB] font-medium mb-0.5">Before</div>
                    <div className="text-[13px] font-bold text-[#1E3A8A] tabular-nums">
                      {beforeQuality}%
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#F8FAFF] border border-[#DBEAFE]/80 px-2 py-1.5">
                    <div className="text-[10px] text-[#2563EB] font-medium mb-0.5">After</div>
                    <div className="text-[13px] font-bold text-[#1E3A8A] tabular-nums">
                      {afterQuality}%
                    </div>
                  </div>
                </div>

                <div className="w-full rounded-md bg-gradient-to-r from-[#EEF4FF] to-[#ECFEFF] border border-[#DBEAFE] px-2 py-1 flex items-center justify-center gap-1 text-[10px] font-semibold text-[#1E3A8A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-[0_0_6px_rgba(37,99,235,0.4)]" />
                  <span>Clean &amp; typed</span>
                </div>
              </motion.div>
            </div>

            {/* Original Icon, Title, and Paragraph Directly Below Photo Card */}
            <div className="mt-3 sm:mt-5 flex flex-col items-center text-center px-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#DBEAFE]/85 text-[#1E3A8A] border border-[#DBEAFE] shadow-[0_2px_10px_rgba(37,99,235,0.10)] group-hover/card:bg-[#1E3A8A] group-hover/card:text-white flex items-center justify-center mb-2 sm:mb-3 transition-colors duration-200">
                <Code2 className="w-[18px] h-[18px]" />
              </div>
              <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-[16.5px] sm:text-[19px] font-bold text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)] mb-1.5 sm:mb-2 leading-snug">
                Modern Software Craftsmanship
              </h3>
              <p className="text-[13px] sm:text-[15px] text-slate-600 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
                We write clean, strongly-typed TypeScript and Python code, enforce component modularity, and create architectures designed for maintainability and rapid onboarding.
              </p>
            </div>
          </motion.div>

          {/* --------------------------------------------------------------- */}
          {/* CENTER CARD (Wider & Taller 300px): Practical, Grounded Intelligence */}
          {/* --------------------------------------------------------------- */}
          <motion.div
            style={{
              y: centerCardY,
              opacity: centerCardOpacity,
            }}
            className="group/card md:col-span-2 md:order-1 lg:order-2 lg:w-[41%] shrink-0 flex flex-col items-center"
          >
            {/* Card Container */}
            <div className="group w-full h-[180px] sm:h-[260px] lg:h-[300px] rounded-[20px] sm:rounded-[24px] overflow-hidden relative flex items-center justify-center p-3 sm:p-4 bg-gradient-to-b from-[#DBEAFE]/65 via-[#EFF6FF]/75 to-[#F8FAFF] border border-[#DBEAFE]/90 shadow-[0_16px_38px_rgba(30,58,138,0.10)] hover:shadow-[0_24px_50px_rgba(30,58,138,0.18)] transition-all duration-300 ease-out hover:-translate-y-[6px]">
              <motion.div
                style={{ y: photoParallaxY }}
                className="absolute -inset-y-5 inset-x-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.92)_0%,rgba(219,234,254,0.45)_60%,rgba(239,246,255,0.8)_100%)] pointer-events-none"
              />

              {/* Compact White Widget */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 18,
                  delay: 0,
                }}
                className="relative z-10 w-[86%] sm:w-[62%] lg:w-[68%] max-w-[260px] bg-white rounded-xl p-3 border border-[#DBEAFE]/90 shadow-[0_10px_28px_rgba(30,58,138,0.14)] text-[11px] leading-tight text-left transition-transform duration-300 ease-out group-hover:-translate-y-[4px]"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[12px] text-[#1E3A8A]">Private AI</span>
                    <span className="text-[10px] font-semibold text-[#2563EB]">• Live</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  {/* 100% Progress Ring */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 46 46">
                      <circle
                        cx="23"
                        cy="23"
                        r="19"
                        fill="none"
                        stroke="#DBEAFE"
                        strokeWidth="3.8"
                      />
                      <motion.circle
                        cx="23"
                        cy="23"
                        r="19"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        initial={{
                          strokeDashoffset: prefersReducedMotion ? ringOffset : ringCircumference,
                        }}
                        animate={{
                          strokeDashoffset: active ? ringOffset : ringCircumference,
                        }}
                        transition={{ duration: 1.25, delay: 0.15, ease: 'easeOut' }}
                      />
                    </svg>
                    <span className="absolute text-[11px] font-bold text-[#1E3A8A] tabular-nums">
                      {privateAiPct}%
                    </span>
                  </div>

                  {/* 4x3 Grid of AI Tool Icons */}
                  <div className="grid grid-cols-4 gap-1.5 flex-1 max-w-[124px]">
                    {[
                      { name: 'OpenAI', Icon: TbBrandOpenai, color: '#10A37F' },
                      { name: 'Python', Icon: SiPython, color: '#3776AB' },
                      { name: 'TensorFlow', Icon: SiTensorflow, color: '#FF6F00' },
                      { name: 'PyTorch', Icon: SiPytorch, color: '#EE4C2C' },
                      { name: 'LangChain', Icon: SiLangchain, color: '#1C3C3C' },
                      { name: 'pgvector', Icon: SiPostgresql, color: '#4169E1' },
                      { name: 'Llama / Meta AI', Icon: SiMeta, color: '#0668E1' },
                      { name: 'Azure OpenAI', Icon: TbBrandAzure, color: '#0078D4' },
                      { name: 'AWS Bedrock', Icon: FaAws, color: '#FF9900' },
                      { name: 'Docker Runtime', Icon: SiDocker, color: '#2496ED' },
                      { name: 'Kubernetes Cluster', Icon: SiKubernetes, color: '#326CE5' },
                      { name: 'Generative AI', Icon: Sparkles, color: '#2563EB' },
                    ].map((tool, idx) => {
                      const isFilled = idx < 8 && idx < litDocs;
                      const ToolIcon = tool.Icon;
                      return (
                        <div
                          key={tool.name}
                          title={tool.name}
                          aria-label={tool.name}
                          className={`h-5 rounded-[5px] flex items-center justify-center transition-all duration-300 ${
                            isFilled
                              ? 'bg-[#DBEAFE] text-[#1E3A8A] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]'
                              : 'bg-[#EEF4FF]/90 text-slate-500'
                          }`}
                        >
                          <ToolIcon
                            className="w-3 h-3 shrink-0"
                            style={{ color: isFilled ? tool.color : undefined }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-[#DBEAFE]/70 text-[10px] text-[#2563EB] font-semibold text-center">
                  8 docs indexed · 0 leaks
                </div>
              </motion.div>
            </div>

            {/* Original Icon, Title, and Paragraph Directly Below Photo Card */}
            <div className="mt-3 sm:mt-5 flex flex-col items-center text-center px-2 max-w-[420px]">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#DBEAFE]/85 text-[#1E3A8A] border border-[#DBEAFE] shadow-[0_2px_10px_rgba(37,99,235,0.10)] group-hover/card:bg-[#1E3A8A] group-hover/card:text-white flex items-center justify-center mb-2 sm:mb-3 transition-colors duration-200">
                <Cpu className="w-[18px] h-[18px]" />
              </div>
              <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-[16.5px] sm:text-[19px] font-bold text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)] mb-1.5 sm:mb-2 leading-snug">
                Practical, Grounded Intelligence
              </h3>
              <p className="text-[13px] sm:text-[15px] text-slate-600 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
                We deploy Retrieval-Augmented Generation (RAG) and private document search with strict citation traceability, ensuring your proprietary data never leaks into public models.
              </p>
            </div>
          </motion.div>

          {/* --------------------------------------------------------------- */}
          {/* RIGHT CARD: Enterprise Reliability & Security                   */}
          {/* --------------------------------------------------------------- */}
          <motion.div
            style={{
              y: sideCardY,
              x: rightCardX,
              opacity: sideCardOpacity,
            }}
            className="group/card md:order-3 lg:order-3 lg:w-[29.5%] shrink-0 flex flex-col items-center"
          >
            {/* Card Container */}
            <div className="group w-full h-[170px] sm:h-[220px] lg:h-[240px] rounded-[20px] sm:rounded-[24px] overflow-hidden relative flex items-center justify-center p-3 sm:p-4 bg-gradient-to-b from-[#DBEAFE]/65 via-[#EFF6FF]/75 to-[#F8FAFF] border border-[#DBEAFE]/90 shadow-[0_12px_30px_rgba(30,58,138,0.08)] hover:shadow-[0_20px_42px_rgba(30,58,138,0.16)] transition-all duration-300 ease-out hover:-translate-y-[6px]">
              <motion.div
                style={{ y: photoParallaxY }}
                className="absolute -inset-y-5 inset-x-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.9)_0%,rgba(219,234,254,0.45)_60%,rgba(239,246,255,0.8)_100%)] pointer-events-none"
              />

              {/* Compact White Widget */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 18,
                  delay: prefersReducedMotion ? 0 : 0.2,
                }}
                className="relative z-10 w-[84%] sm:w-[68%] lg:w-[74%] max-w-[230px] bg-white rounded-xl p-3 border border-[#DBEAFE]/90 shadow-[0_10px_28px_rgba(30,58,138,0.14)] text-[11px] leading-tight text-left transition-transform duration-300 ease-out group-hover:-translate-y-[4px]"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10.5px] font-bold text-[#1E3A8A]">Uptime</span>
                  <span className="text-[12.5px] font-bold text-[#2563EB] tabular-nums">
                    {uptimeVal.toFixed(2)}%
                  </span>
                </div>

                {/* Small Hero-Blue Area Chart */}
                <div className="h-7 w-full my-1">
                  <svg viewBox="0 0 180 32" className="w-full h-7 overflow-visible">
                    <defs>
                      <linearGradient id="purpleReliabilityArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M2,24 C28,22 44,14 68,18 C92,22 114,8 140,12 C156,14 168,6 178,5 L178,30 L2,30 Z"
                      fill="url(#purpleReliabilityArea)"
                    />
                    <motion.path
                      d="M2,24 C28,22 44,14 68,18 C92,22 114,8 140,12 C156,14 168,6 178,5"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                      animate={{ pathLength: active ? 1 : 0 }}
                      transition={{ duration: 1.25, delay: 0.2, ease: 'easeOut' }}
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-[#DBEAFE]/70 text-[9.5px] text-[#2563EB] font-medium">
                  <div>
                    <div>Last month</div>
                    <div className="font-bold text-[#1E3A8A] text-[10.5px]">99.97%</div>
                  </div>
                  <div className="text-right">
                    <div>This month</div>
                    <div className="font-bold text-[#1E3A8A] text-[10.5px]">99.99%</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Original Icon, Title, and Paragraph Directly Below Photo Card */}
            <div className="mt-3 sm:mt-5 flex flex-col items-center text-center px-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#DBEAFE]/85 text-[#1E3A8A] border border-[#DBEAFE] shadow-[0_2px_10px_rgba(37,99,235,0.10)] group-hover/card:bg-[#1E3A8A] group-hover/card:text-white flex items-center justify-center mb-2 sm:mb-3 transition-colors duration-200">
                <ShieldCheck className="w-[18px] h-[18px]" />
              </div>
              <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-[16.5px] sm:text-[19px] font-bold text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)] mb-1.5 sm:mb-2 leading-snug">
                Enterprise Reliability &amp; Security
              </h3>
              <p className="text-[13px] sm:text-[15px] text-slate-600 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
                Automated CI/CD deployment pipelines, defensive hardening, OWASP security best practices, and proactive cloud FinOps governance that prevent budget surprises.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

