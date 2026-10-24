import React from 'react';
import {
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  ShieldCheck,
  Target,
  Eye,
  Compass,
  BookOpen,
  Users,
  Cpu,
  ArrowUpRight,
  Network,
  Sparkles,
  Layers,
  Workflow,
  Code2,
  GraduationCap,
  Activity,
  Zap,
  Globe
} from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { getCardColorToken } from '../utils/cardColorTokens';
import { ScrollReveal, ScrollRevealItem } from '../components/common/ScrollReveal';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
  onStartProject: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onStartProject }) => {
  const values = [
    {
      step: '01 / CLARITY',
      title: 'Clarity & Directness',
      icon: Compass,
      desc: 'We avoid technical jargon, obscure estimates, and buzzwords. We speak in clear, plain language about architecture trade-offs, feasibility, and real costs.',
    },
    {
      step: '02 / CRAFTSMANSHIP',
      title: 'Engineering Craftsmanship',
      icon: Code2,
      desc: 'We write clean, strongly-typed code designed for human readability and automated testability. We don’t cut corners that create technical debt.',
    },
    {
      step: '03 / INNOVATION',
      title: 'Practical Innovation',
      icon: Cpu,
      desc: 'We apply artificial intelligence, machine learning, and cloud primitives where they solve real operational problems with demonstrable business return.',
    },
    {
      step: '04 / COLLABORATION',
      title: 'Transparent Collaboration',
      icon: Users,
      desc: 'We treat our clients as partners in code. Regular demos, shared sprint boards, and clear milestone criteria ensure complete visibility at every stage.',
    },
    {
      step: '05 / LEARNING',
      title: 'Continuous Learning',
      icon: GraduationCap,
      desc: 'Technology evolves rapidly. Our team invests continuous effort in mastering modern framework standards, defensive security practices, and emerging AI architectures.',
    },
    {
      step: '06 / RELIABILITY',
      title: 'Long-Term Reliability',
      icon: ShieldCheck,
      desc: 'We stand behind our work. From documentation to handover and ongoing maintenance support, we engineer software designed to outlast short-term trends.',
    },
  ];

  return (
    <div className="w-full">
      {/* Unified PageHero */}
      <PageHero
        breadcrumbItems={[{ label: 'About IAMTECHNI' }]}
        onNavigate={onNavigate}
        kicker="ORGANIZATIONAL PURPOSE"
        category="Practice Overview"
        title="Engineering Better Possibilities Through Technology"
        tagline="A digital engineering practice combining craftsmanship, intelligence, and cloud scalability."
        description="IAMTECHNI helps businesses and organizations explore, build and improve digital solutions through modern software development, intelligent technologies, cloud engineering and digital growth services."
        primaryCtaText="Start Project Discovery"
        onPrimaryCta={onStartProject}
        secondaryCtaText="Explore Capabilities Directory"
        onSecondaryCta={() => onNavigate('/services')}
        slug="about"
        customVisual={
          <div className="relative w-full max-w-md mx-auto min-h-[280px] sm:aspect-square bg-white rounded-2xl border border-slate-200 shadow-xl p-4 sm:p-6 flex flex-col justify-between text-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1266E8] animate-pulse shrink-0" />
                <span className="font-bold text-slate-900">CONNECTED_ECOSYSTEM</span>
              </div>
              <span className="text-[#1266E8] font-bold bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                PRACTICE STANDARDS
              </span>
            </div>

            {/* Network Orbit Graphic in Light Palette */}
            <div className="relative flex-1 flex items-center justify-center my-4">
              <svg viewBox="0 0 200 200" className="w-full h-full max-h-52">
                <circle cx="100" cy="100" r="75" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" fill="none" />
                <circle cx="100" cy="100" r="45" stroke="#93C5FD" strokeWidth="1" fill="none" opacity="0.6" />
                <line x1="100" y1="100" x2="40" y2="60" stroke="#04C8E8" strokeWidth="1.5" />
                <line x1="100" y1="100" x2="160" y2="60" stroke="#5427D9" strokeWidth="1.5" />
                <line x1="100" y1="100" x2="60" y2="155" stroke="#1266E8" strokeWidth="1.5" />
                <line x1="100" y1="100" x2="140" y2="155" stroke="#0D9488" strokeWidth="1.5" />

                {/* Nodes */}
                <circle cx="100" cy="100" r="16" fill="url(#about-core-grad)" />
                <defs>
                  <linearGradient id="about-core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#04C8E8" />
                    <stop offset="100%" stopColor="#1266E8" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="8" fill="#FFFFFF" />

                <circle cx="40" cy="60" r="8" fill="#1266E8" />
                <circle cx="160" cy="60" r="8" fill="#7C3AED" />
                <circle cx="60" cy="155" r="7" fill="#04C8E8" />
                <circle cx="140" cy="155" r="7" fill="#0D9488" />
              </svg>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <div className="text-slate-600 font-medium">PRACTICAL INNOVATION</div>
              <div className="text-[#1266E8] font-bold">ZERO SHORTCUTS</div>
            </div>
          </div>
        }
      />

      {/* Mission & Vision with Distinct Coordinated Pastel Cards */}
      <section className="py-20 bg-gradient-to-br from-[#EEF4FF] via-[#F4F1FE] to-[#F0FDFA] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 gap-8" staggerChildren={0.15}>
            <ScrollRevealItem className="h-full">
              <div className="h-full bg-[#EAF3FF] rounded-2xl p-8 sm:p-10 border border-blue-200/90 shadow-sm space-y-4 interactive-card-lift flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1266E8] text-white flex items-center justify-center shadow-xs">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    To turn complex technical challenges into purposeful, reliable digital solutions that advance our clients’ operations, elevate customer experiences, and build long-term business value.
                  </p>
                </div>

                {/* Visual Trajectory */}
                <div className="pt-4 border-t border-blue-200/70">
                  <div className="bg-white/90 rounded-xl p-3.5 border border-blue-200/80 shadow-2xs space-y-2 font-mono">
                    <div className="text-[10px] text-[#1266E8] font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>Delivery Trajectory</span>
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold text-[9px]">
                        Zero Technical Debt
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                      <div className="p-1.5 rounded bg-blue-50/80 border border-blue-100 text-slate-800 font-semibold">
                        01. Scoped
                      </div>
                      <div className="p-1.5 rounded bg-blue-50/80 border border-blue-100 text-slate-800 font-semibold">
                        02. Verified
                      </div>
                      <div className="p-1.5 rounded bg-blue-50/80 border border-blue-100 text-slate-800 font-semibold">
                        03. Scaled
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem className="h-full">
              <div className="h-full bg-[#F0EAFF] rounded-2xl p-8 sm:p-10 border border-violet-200/90 shadow-sm space-y-4 interactive-card-lift flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shadow-xs">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    To be the trusted engineering partner for forward-looking organizations, recognized for technical discipline, practical artificial intelligence, and software craftsmanship that endures.
                  </p>
                </div>

                {/* Visual Pillars */}
                <div className="pt-4 border-t border-violet-200/70">
                  <div className="bg-white/90 rounded-xl p-3.5 border border-violet-200/80 shadow-2xs space-y-2 font-mono">
                    <div className="text-[10px] text-[#7C3AED] font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>Strategic Horizon</span>
                      <span className="text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-semibold text-[9px]">
                        Global Resilience
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                      <div className="p-1.5 rounded bg-purple-50/80 border border-purple-100 text-slate-800 font-semibold">
                        Craft
                      </div>
                      <div className="p-1.5 rounded bg-purple-50/80 border border-purple-100 text-slate-800 font-semibold">
                        Intelligence
                      </div>
                      <div className="p-1.5 rounded bg-purple-50/80 border border-purple-100 text-slate-800 font-semibold">
                        Longevity
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollRevealItem>
          </ScrollReveal>
        </div>
      </section>

      {/* Digital Transformation & Engineering Excellence Visual Showcase */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Engineering Strategy & Governance */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>Modern Software Delivery</span>
              </div>
              <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.015em] text-[#1E3A8A] leading-tight drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
                Architected for resilience, precision, and longevity.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We combine modern frontend architecture, robust backend systems, and containerized cloud pipelines to deliver software that scales predictably. Our teams operate with automated test suites, typed contracts, and continuous security scanning.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#F5F8FC] border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A]">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                    <span>Typed Contracts</span>
                  </div>
                  <p className="text-[11px] text-slate-600">TypeScript strict mode and end-to-end schema validation eliminating runtime bugs.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#F5F8FC] border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cloud Native</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Multi-region container orchestration across AWS and Azure with zero-downtime updates.</p>
                </div>
              </div>
            </div>

            {/* Right: Rich Interactive Engineering Topology Visual */}
            <div className="lg:col-span-6 w-full">
              <div className="bg-gradient-to-br from-[#162D5E] via-[#1C3873] to-[#1E3A8A] rounded-3xl p-6 sm:p-7 border border-[#60A5FA]/35 shadow-xl text-white space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">IAMTECHNI // INFRASTRUCTURE TOPO</span>
                  </div>
                  <span className="text-[10px] text-[#67E8F9] bg-white/10 px-2 py-0.5 rounded border border-[#67E8F9]/30">
                    Active Deployments
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/15">
                    <div className="text-[10px] text-blue-100/80">CI/CD Gate</div>
                    <div className="text-sm font-bold text-emerald-300">100% Pass</div>
                    <div className="text-[9px] text-blue-200/70">Unit + Integration</div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl border border-white/15">
                    <div className="text-[10px] text-blue-100/80">Global P99</div>
                    <div className="text-sm font-bold text-[#67E8F9]">&lt;65ms</div>
                    <div className="text-[9px] text-blue-200/70">Edge CDN Ingest</div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl border border-white/15">
                    <div className="text-[10px] text-blue-100/80">Vulnerability</div>
                    <div className="text-sm font-bold text-indigo-200">0 Critical</div>
                    <div className="text-[9px] text-blue-200/70">Continuous Snyk</div>
                  </div>
                </div>

                <div className="p-3 bg-[#10234A]/80 rounded-xl border border-white/15 text-[11px] text-blue-100 space-y-1">
                  <div className="text-blue-200/70">// Multi-Region Edge Mesh Active</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#67E8F9]">US-East · EU-Central · AP-South</span>
                    <span className="text-emerald-300 font-bold">Encrypted TLS 1.3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values with Distinct 8-Color System */}
      <section className="py-24 bg-[#F5F8FC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-2">
              Foundational Principles
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              The values that govern our engineering.
            </h2>
          </div>

          <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" staggerChildren={0.1}>
            {values.map((val, idx) => {
              const color = getCardColorToken(idx);
              const ValueIcon = val.icon;

              return (
                <ScrollRevealItem key={idx} className="h-full">
                  <div
                    className={`h-full ${color.cardBg} ${color.cardBorder} border rounded-2xl p-7 shadow-xs ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 flex flex-col justify-between interactive-card-lift group`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                          {val.step}
                        </span>
                        <div className={`w-9 h-9 rounded-xl ${color.iconBg} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                          <ValueIcon className="w-4.5 h-4.5" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
                      <p className="text-xs text-slate-700 leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#ECFEFF] border border-[#DBEAFE] rounded-2xl p-8 sm:p-12 text-center space-y-5 shadow-[0_8px_30px_rgba(37,99,235,0.08)]">
            <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
              Ready to discuss your technology requirements?
            </h2>
            <p className="text-sm sm:text-base bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent font-medium max-w-xl mx-auto">
              Let’s review what you want to build and explore how our engineering team can help.
            </p>
            <div className="pt-2">
              <button
                onClick={onStartProject}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 min-h-[40px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
