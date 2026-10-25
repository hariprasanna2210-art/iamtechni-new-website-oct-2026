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
import { IndustryIllustration } from '../components/common/TechIllustrations';
import { MobileSectionSkeletonWrapper } from '../components/common/MobileSectionSkeleton';

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
      <section className="relative overflow-hidden pt-5 pb-10 sm:pt-8 sm:pb-16 lg:pt-14 lg:pb-20 bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFF] to-[#FFFFFF] border-b border-slate-200">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#04C8E8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#5427D9]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 h-[32px] sm:h-[34px] px-3 sm:px-4 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-xs font-bold text-[#2563EB]">
                <span>Industry Solutions</span>
                <span className="text-slate-300">•</span>
                <span>Specialized Domain Practice</span>
              </div>

              <h1 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-bold text-[#1E3A8A] tracking-[-0.015em] leading-[1.18] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
                {industry.name} Technology Solutions
              </h1>

              <p className="text-[13.5px] sm:text-base lg:text-[17px] text-slate-600 leading-relaxed max-w-2xl">
                {industry.summary}
              </p>

              <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => onStartProject(`${industry.name} Consultation`)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-sm shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span>Discuss Industry Requirements</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('/contact/consultation')}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 hover:from-white hover:to-[#F0F9FF] text-[#1E3A8A] hover:text-[#2563EB] font-semibold text-sm border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span>Request Strategy Consultation</span>
                </button>
              </div>
            </div>

            {/* Visual Architecture Representation */}
            <div className="lg:col-span-5 relative space-y-4">
              <IndustryIllustration industryId={industry.name} className="shadow-lg" />

              <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <span>Recommended Disciplines</span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    100% Client-Owned
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {industry.suggestedServices.map((service, idx) => (
                    <button
                      key={idx}
                      onClick={() => onNavigate(service.route as PageRoute)}
                      className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 transition-all text-left flex items-center justify-between group cursor-pointer"
                    >
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8] truncate">
                        {service.name}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1266E8] shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Opportunities Section */}
      <MobileSectionSkeletonWrapper variant="split-detail" sectionIndex={0}>
      <section className="py-10 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
            {/* Industry Challenges */}
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
                <AlertCircle className="w-4 h-4" />
                <span>Critical Domain Challenges</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
                Operational friction we help solve.
              </h2>
              <div className="space-y-2.5 sm:space-y-4">
                {industry.coreChallenges.map((challenge, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 sm:gap-3.5"
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
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <Sparkles className="w-4 h-4" />
                <span>Transformation Opportunities</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
                Where technology drives competitive edge.
              </h2>
              <div className="space-y-2.5 sm:space-y-4">
                {industry.digitalOpportunities.map((opportunity, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-3 sm:gap-3.5"
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
      </MobileSectionSkeletonWrapper>

      {/* IAMTECHNI Engineered Solutions for this Industry */}
      <MobileSectionSkeletonWrapper variant="cards-grid" sectionIndex={1}>
      <section className="py-10 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
          <div className="max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1.5 sm:mb-2">
              Deliverables & Capabilities
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
              What we build for {industry.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2">
              Every deliverable is crafted to address industry regulations, usability expectations, and integration requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {industry.iamtechniSolutions.map((solution, idx) => (
              <div
                key={idx}
                className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 sm:space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1266E8] font-bold flex items-center justify-center text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{solution}</h3>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Custom Architecture</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </MobileSectionSkeletonWrapper>

      {/* Industry Call to Action Banner */}
      <MobileSectionSkeletonWrapper variant="split-detail" sectionIndex={2}>
      <section className="py-10 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#ECFEFF] border border-[#DBEAFE] rounded-2xl p-5 sm:p-12 text-center space-y-4 sm:space-y-5 shadow-[0_8px_30px_rgba(37,99,235,0.08)]">
            <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
              Ready to engineer your {industry.name} digital transformation?
            </h2>
            <p className="text-[13.5px] sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
              Schedule an architectural discovery session with our senior engineering team to scope timelines, system integrations, and business impact.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => onStartProject(`${industry.name} Project Discovery`)}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-sm shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Schedule Architecture Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/industries')}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#F5F9FF] text-[#1E3A8A] hover:text-[#2563EB] font-semibold text-sm border border-[#DBEAFE] shadow-[0_2px_10px_rgba(37,99,235,0.06)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>View All Industries</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      </MobileSectionSkeletonWrapper>
    </div>
  );
};
