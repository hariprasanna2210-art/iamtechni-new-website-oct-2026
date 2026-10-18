import React from 'react';
import {
  ArrowRight,
  CheckCircle,
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
  Workflow
} from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { getCardColorToken } from '../utils/cardColorTokens';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
  onStartProject: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onStartProject }) => {
  const values = [
    {
      step: '01 / CLARITY',
      title: 'Clarity & Directness',
      desc: 'We avoid technical jargon, obscure estimates, and buzzwords. We speak in clear, plain language about architecture trade-offs, feasibility, and real costs.',
    },
    {
      step: '02 / CRAFTSMANSHIP',
      title: 'Engineering Craftsmanship',
      desc: 'We write clean, strongly-typed code designed for human readability and automated testability. We don’t cut corners that create technical debt.',
    },
    {
      step: '03 / INNOVATION',
      title: 'Practical Innovation',
      desc: 'We apply artificial intelligence, machine learning, and cloud primitives where they solve real operational problems with demonstrable business return.',
    },
    {
      step: '04 / COLLABORATION',
      title: 'Transparent Collaboration',
      desc: 'We treat our clients as partners in code. Regular demos, shared sprint boards, and clear milestone criteria ensure complete visibility at every stage.',
    },
    {
      step: '05 / LEARNING',
      title: 'Continuous Learning',
      desc: 'Technology evolves rapidly. Our team invests continuous effort in mastering modern framework standards, defensive security practices, and emerging AI architectures.',
    },
    {
      step: '06 / RELIABILITY',
      title: 'Long-Term Reliability',
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
          <div className="relative w-full max-w-md mx-auto aspect-square bg-white rounded-2xl border border-slate-200 shadow-xl p-6 flex flex-col justify-between text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1266E8]" />
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

            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="text-slate-600 font-medium">PRACTICAL INNOVATION</div>
              <div className="text-right text-[#1266E8] font-bold">ZERO SHORTCUTS</div>
            </div>
          </div>
        }
      />

      {/* Mission & Vision with Distinct Coordinated Pastel Cards */}
      <section className="py-20 bg-gradient-to-br from-[#EEF4FF] via-[#F4F1FE] to-[#F0FDFA] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#EAF3FF] rounded-2xl p-8 sm:p-10 border border-blue-200/90 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#1266E8] text-white flex items-center justify-center shadow-xs">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                To turn complex technical challenges into purposeful, reliable digital solutions that advance our clients’ operations, elevate customer experiences, and build long-term business value.
              </p>
            </div>

            <div className="bg-[#F0EAFF] rounded-2xl p-8 sm:p-10 border border-violet-200/90 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shadow-xs">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                To be the trusted engineering partner for forward-looking organizations, recognized for technical discipline, practical artificial intelligence, and software craftsmanship that endures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values with Distinct 8-Color System */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-2">
              Foundational Principles
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              The values that govern our engineering.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const color = getCardColorToken(idx);

              return (
                <div
                  key={idx}
                  className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-7 shadow-xs ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                        {val.step}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${color.dotBg}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1266E8] via-[#0B5CD5] to-[#5427D9] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to discuss your technology requirements?
          </h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto">
            Let’s review what you want to build and explore how our engineering team can help.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartProject}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-[#1266E8] bg-white rounded-xl hover:bg-blue-50 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
