import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  HelpCircle,
  Cpu,
  Compass,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PageRoute, ServiceItem } from '../types';
import { PageHero } from '../components/common/PageHero';
import { getCardColorToken } from '../utils/cardColorTokens';
import { ServiceVisualDispatcher } from '../components/common/ServiceVisualMockups';

interface ServiceDetailPageProps {
  service: ServiceItem;
  onNavigate: (route: PageRoute) => void;
  onStartProject: (serviceName?: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  service,
  onNavigate,
  onStartProject,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* UNIFIED PAGE HERO COMPONENT (Bespoke Visual & Color-Coordinated Accents)   */}
      {/* ========================================================================= */}
      <PageHero
        breadcrumbItems={[
          { label: 'Services', route: '/services' },
          { label: service.title },
        ]}
        onNavigate={onNavigate}
        kicker="IAMTECHNI PRACTICE"
        category={service.category}
        title={service.title}
        tagline={service.tagline}
        description={service.summary}
        primaryCtaText={`Discuss Your ${service.title} Project`}
        onPrimaryCta={() => onStartProject(service.title)}
        secondaryCtaText="Explore Other Services"
        onSecondaryCta={() => onNavigate('/services')}
        slug={service.slug}
      />

      {/* Problem Statement Section with Rich Service Visual Mockup */}
      <section className="py-16 bg-[#F4F7FC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Problem Statement Narrative */}
            <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-9 shadow-2xs space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#1266E8]" />
                <span>The Core Challenge</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                Why traditional approaches fail in {service.title}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {service.problemStatement}
              </p>
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  IAMTECHNI Engineering Solution
                </span>
                <span>·</span>
                <span className="text-[#1266E8] font-bold">100% Production Rigor</span>
              </div>
            </div>

            {/* Right Column: Interactive Domain Visual Mockup */}
            <div className="lg:col-span-6 w-full">
              <ServiceVisualDispatcher slug={service.slug} category={service.category} />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section with Distinct Colorful Cards */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
              Engineering Disciplines
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Technical Capabilities &amp; Architecture
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Our engineering team implements these capabilities with production rigor, automated testing, and comprehensive documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.capabilities.map((cap, idx) => {
              const color = getCardColorToken(idx);
              return (
                <div
                  key={idx}
                  className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-7 ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                        CAPABILITY 0{idx + 1}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${color.dotBg}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{cap.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-5">{cap.description}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-200/60">
                    {cap.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${color.accentText} shrink-0 mt-0.5`} />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Illustrative Use Cases with Distinct Colorful Cards */}
      {service.useCases.length > 0 && (
        <section className="py-20 bg-[#F4F7FC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
                Real-World Application
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Representative Deployments &amp; Outcomes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.useCases.map((uc, i) => {
                const color = getCardColorToken(i + 2);
                return (
                  <div
                    key={i}
                    className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-7 ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200`}
                  >
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-md font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                      ILLUSTRATIVE SCENARIO
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">{uc.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{uc.description}</p>

                    <div className="bg-white/90 border border-slate-200/90 rounded-xl p-3.5 text-xs text-slate-800 font-medium shadow-2xs">
                      <span className={`font-bold ${color.accentText}`}>Measurable Outcome: </span>
                      {uc.outcome}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Delivery Process with Color Steps */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
              Phased Roadmap
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Delivery Workflow &amp; Governance
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              How we take your project from discovery through release and long-term maintenance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {service.deliverySteps.map((step, idx) => {
              const color = getCardColorToken(idx);
              return (
                <div
                  key={idx}
                  className={`${color.cardBg} ${color.cardBorder} border rounded-xl p-5 flex flex-col justify-between ${color.cardHoverBorder} transition-all`}
                >
                  <div>
                    <div className={`text-xs font-mono font-bold ${color.accentText} mb-2`}>
                      {step.phase}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related Technologies */}
      <section className="py-16 bg-[#F5F8FC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#1266E8]" />
            <span>Supported Technologies &amp; Frameworks</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {service.technologies.map((tech, idx) => {
              const color = getCardColorToken(idx);
              return (
                <span
                  key={idx}
                  className={`px-3 py-1.5 ${color.cardBg} border ${color.cardBorder} rounded-lg text-xs font-mono font-medium text-slate-800 shadow-2xs`}
                >
                  {tech}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
              Common Questions
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {service.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      openFaqIndex === idx ? 'rotate-180 text-[#1266E8]' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-[#FAFBFD]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-gradient-to-br from-[#1266E8] via-[#0B5CD5] to-[#5427D9] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to build with IAMTECHNI?
          </h2>
          <p className="text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Schedule an exploratory engineering consultation to evaluate project scope, architecture, budget, and implementation timelines.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onStartProject(service.title)}
              className="px-8 py-3.5 bg-white text-[#1266E8] hover:bg-blue-50 rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              Discuss Your Project
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition-all border border-white/30 cursor-pointer"
            >
              Contact Engineering
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
