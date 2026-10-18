import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Briefcase,
  GraduationCap,
  ShoppingBag,
  Activity,
  Factory,
  Rocket,
  Building2,
} from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { IndustryItem, PageRoute } from '../types';

interface IndustryDetailPageProps {
  industry: IndustryItem;
  onNavigate: (route: PageRoute) => void;
  onStartProject: (serviceName?: string) => void;
}

export const IndustryDetailPage: React.FC<IndustryDetailPageProps> = ({
  industry,
  onNavigate,
  onStartProject,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-8 h-8 text-[#04C8E8]" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-8 h-8 text-orange-500" />;
      case 'Activity':
        return <Activity className="w-8 h-8 text-rose-500" />;
      case 'Briefcase':
        return <Briefcase className="w-8 h-8 text-[#1266E8]" />;
      case 'Factory':
        return <Factory className="w-8 h-8 text-amber-500" />;
      case 'Rocket':
        return <Rocket className="w-8 h-8 text-[#5427D9]" />;
      default:
        return <Building2 className="w-8 h-8 text-[#1266E8]" />;
    }
  };

  return (
    <div className="w-full">
      {/* Breadcrumbs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Industries', route: '/industries' },
            { label: industry.name },
          ]}
          onNavigate={onNavigate}
        />
      </div>

      {/* Dedicated Industry Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20 bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFF] to-[#FFFFFF] border-b border-slate-200">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#04C8E8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#5427D9]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1266E8]">
                <span>Industry Solutions</span>
                <span className="text-slate-300">•</span>
                <span>Specialized Domain Practice</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {industry.name} Technology Solutions
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {industry.summary}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onStartProject(`${industry.name} Consultation`)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md active:scale-[0.98]"
                >
                  <span>Discuss Industry Requirements</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('/contact/consultation')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs"
                >
                  <span>Request Strategy Consultation</span>
                </button>
              </div>
            </div>

            {/* Visual Architecture Representation */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl bg-white p-6 sm:p-7 border border-slate-200 shadow-xl space-y-5 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
                      {getIcon(industry.iconName)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Domain Blueprint</div>
                      <div className="text-[11px] text-slate-500">IAMTECHNI Practice</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Practice
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Recommended Core Disciplines
                  </div>
                  <div className="space-y-2">
                    {industry.suggestedServices.map((service, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate(service.route as PageRoute)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 transition-all text-left flex items-center justify-between group"
                      >
                        <span className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                          {service.name}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1266E8] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Guaranteed Code Ownership</span>
                  <span className="text-emerald-600 font-bold">100% Client-Owned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Opportunities Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Industry Challenges */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
                <AlertCircle className="w-4 h-4" />
                <span>Critical Domain Challenges</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Operational friction we help solve.
              </h2>
              <div className="space-y-4">
                {industry.coreChallenges.map((challenge, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5"
                  >
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {challenge}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Opportunities */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <Sparkles className="w-4 h-4" />
                <span>Transformation Opportunities</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Where technology drives competitive edge.
              </h2>
              <div className="space-y-4">
                {industry.digitalOpportunities.map((opportunity, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-3.5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {opportunity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IAMTECHNI Engineered Solutions for this Industry */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-2">
              Deliverables & Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              What we build for {industry.name}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every deliverable is crafted to address industry regulations, usability expectations, and integration requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.iamtechniSolutions.map((solution, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1266E8] font-bold flex items-center justify-center text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{solution}</h3>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Custom Architecture</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Call to Action Banner */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to engineer your {industry.name} digital transformation?
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto">
            Schedule an architectural discovery session with our senior engineering team to scope timelines, system integrations, and business impact.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onStartProject(`${industry.name} Project Discovery`)}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#04C8E8] to-[#1266E8] hover:opacity-95 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              <span>Schedule Architecture Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/industries')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all"
            >
              <span>View All Industries</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
