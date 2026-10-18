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
  Workflow
} from 'lucide-react';
import { PageRoute, ProjectItem } from '../types';
import { servicesData } from '../data/servicesData';
import { projectsData } from '../data/projectsData';
import { insightsData } from '../data/insightsData';
import { industriesData } from '../data/industriesData';
import { ColorfulMultiServiceHero } from '../components/home/ColorfulMultiServiceHero';
import { getCardColorToken } from '../utils/cardColorTokens';

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
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('All');

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
      {/* 1. COLORFUL MULTI-SERVICE HERO SECTION (8 Animated Distinct Slides)       */}
      {/* ========================================================================= */}
      <ColorfulMultiServiceHero
        onNavigate={onNavigate}
        onOpenProjectModal={onOpenProjectModal}
      />

      {/* ========================================================================= */}
      {/* 2. COLORFUL TRUST & CORE ADVANTAGES (Soft Lavender / Blue Tint Section)   */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-br from-[#EEF4FF] via-[#F4F1FE] to-[#F0FDFA] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold">
              Engineering Disciplines
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              A technology partner for your next stage of growth.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Every business faces distinct operational challenges. IAMTECHNI brings design, full-stack development, artificial intelligence, cloud infrastructure, and growth engineering together into solutions engineered for long-term reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Advantage 1 - Blue (#EAF3FF) */}
            <div className="bg-[#EAF3FF] rounded-2xl p-8 border border-blue-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-[#1266E8] text-white flex items-center justify-center mb-5 shadow-xs">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Modern Software Craftsmanship
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                We write clean, strongly-typed TypeScript and Python code, enforce component modularity, and create architectures designed for maintainability and rapid onboarding.
              </p>
            </div>

            {/* Advantage 2 - Violet (#F0EAFF) */}
            <div className="bg-[#F0EAFF] rounded-2xl p-8 border border-violet-200/90 shadow-xs hover:shadow-md hover:border-violet-300 transition-all relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center mb-5 shadow-xs">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Practical, Grounded Intelligence
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                We deploy Retrieval-Augmented Generation (RAG) and private document search with strict citation traceability, ensuring your proprietary data never leaks into public models.
              </p>
            </div>

            {/* Advantage 3 - Teal (#E1F8F2) */}
            <div className="bg-[#E1F8F2] rounded-2xl p-8 border border-teal-200/90 shadow-xs hover:shadow-md hover:border-teal-300 transition-all relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-[#0D9488] text-white flex items-center justify-center mb-5 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Enterprise Reliability &amp; Security
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Automated CI/CD deployment pipelines, defensive hardening, OWASP security best practices, and proactive cloud FinOps governance that prevent budget surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CAPABILITIES DIRECTORY (Vibrant Card Grid with Color Highlights)        */}
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
                From high-speed web experiences to autonomous robotics, explore our 13 specialized practices built to transform complex business requirements into working software.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/services')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1266E8] hover:text-[#0B5CD5] underline underline-offset-4"
            >
              <span>Explore All 13 Service Practices</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.slice(0, 6).map((service, idx) => {
              const color = getCardColorToken(idx);

              return (
                <div
                  key={service.id}
                  onClick={() => onNavigate(`/services/${service.slug}` as PageRoute)}
                  className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-7 flex flex-col justify-between ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 cursor-pointer group shadow-2xs`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                        {service.category.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono bg-white/80 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/80">
                        0{idx + 1}
                      </span>
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
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED PROJECTS (High-Impact Filterable Showcase)                    */}
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
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
              {['All', 'E-commerce', 'AI & ML', 'Custom Software', 'Cloud & DevOps'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedProjectFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => {
              const color = getCardColorToken(idx + 1);

              return (
                <div
                  key={project.id}
                  onClick={() => onOpenCaseStudy(project)}
                  className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-7 flex flex-col justify-between ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 cursor-pointer group shadow-2xs`}
                >
                  <div>
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
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('/portfolio')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-all shadow-xs"
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
            {/* Step Selector List */}
            <div className="lg:col-span-5 space-y-2">
              {processStages.map((stg, idx) => (
                <button
                  key={stg.step}
                  onClick={() => setActiveProcessStep(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                    activeProcessStep === idx
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-sm ${
                      activeProcessStep === idx
                        ? 'bg-[#04C8E8] text-slate-950'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {stg.step}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{stg.title}</div>
                    <div
                      className={`text-[11px] truncate ${
                        activeProcessStep === idx ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {stg.tagline}
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeProcessStep === idx ? 'text-[#04C8E8]' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Stage Detail Display Card (Clean Light Enterprise Aesthetic) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xl flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1266E8]" />
                    <span className="font-bold text-slate-800">STAGE {processStages[activeProcessStep].step} OF 07</span>
                  </div>
                  <span className="text-[#1266E8] font-bold bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    IAMTECHNI_STANDARD
                  </span>
                </div>

                <div className="mt-8">
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                    {processStages[activeProcessStep].title}
                  </h3>
                  <div className="text-sm font-semibold text-[#1266E8] mb-4">
                    {processStages[activeProcessStep].tagline}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                    {processStages[activeProcessStep].details}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Continuous CI/CD quality gates &amp; peer reviews at every milestone.
                </div>
                <button
                  onClick={() => onOpenProjectModal()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1266E8] hover:underline cursor-pointer"
                >
                  Discuss Your Workflow <ArrowRight className="w-3.5 h-3.5" />
                </button>
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
          <div className="max-w-3xl mb-14">
            <div className="text-xs font-mono uppercase tracking-widest text-[#04C8E8] font-bold mb-2">
              Artificial Intelligence & Scalability
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Put intelligent technology to practical work.
            </h2>
            <p className="text-base text-slate-400 mt-2 leading-relaxed">
              We help enterprises move beyond generic chatbot hype. We build grounded, domain-specific AI applications, automated knowledge assistants, and cost-controlled inference pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#10162A] border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 text-[#04C8E8] flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Private Document RAG</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Query thousands of internal contracts, SOPs, and engineering manuals with verifiable source page citations.
              </p>
            </div>

            <div className="bg-[#10162A] border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-[#1266E8] flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Knowledge Assistants</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Domain-specific assistants trained on your proprietary processes without leaking data to public training sets.
              </p>
            </div>

            <div className="bg-[#10162A] border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-950 text-[#5427D9] flex items-center justify-center mb-4">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Workflow Automation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated document extraction, invoice classification, and human-in-the-loop review queues.
              </p>
            </div>

            <div className="bg-[#10162A] border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Guardrails & Cost FinOps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cost-aware token budgeting, prompt caching, and defensive filters against prompt injection attacks.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>Every AI deployment is backed by privacy compliance, rate-limiting, and evaluation benchmarks.</span>
            <button
              onClick={() => onNavigate('/services/ai-machine-learning')}
              className="text-[#04C8E8] hover:underline font-semibold flex items-center gap-1 shrink-0"
            >
              Explore AI & Machine Learning Practice <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. INDUSTRIES SERVED                                                      */}
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
              className="text-xs font-bold text-[#1266E8] hover:underline flex items-center gap-1"
            >
              View All Industries <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industriesData.slice(0, 6).map((ind, idx) => {
              const color = getCardColorToken(idx + 2);

              return (
                <div
                  key={ind.id}
                  onClick={() => onNavigate('/industries')}
                  className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-7 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between shadow-2xs`}
                >
                  <div>
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
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. LATEST ENGINEERING INSIGHTS                                            */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {insightsData.map((art, idx) => {
              const color = getCardColorToken(idx + 3);

              return (
                <article
                  key={art.slug}
                  onClick={() => onNavigate(`/insights/${art.slug}` as PageRoute)}
                  className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-7 flex flex-col justify-between ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all cursor-pointer group shadow-2xs`}
                >
                  <div>
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
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. STRIKING FINAL CALL TO ACTION (Luminous Gradient Section)               */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#090D1A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1266E8]/15 via-transparent to-[#5427D9]/15 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-mono text-[#04C8E8]">
            <span>READY TO COLLABORATE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Have a challenge? Let’s engineer the solution.
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Tell us what you want to build, improve or transform. Let’s explore the right technology and a practical path forward.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenProjectModal()}
              className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#1266E8] to-[#5427D9] hover:opacity-95 rounded-xl transition-all shadow-lg active:scale-[0.98]"
            >
              <span>Discuss Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
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
