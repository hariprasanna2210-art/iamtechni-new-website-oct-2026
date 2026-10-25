import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  Code2,
  Compass,
} from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { projectsData } from '../data/projectsData';
import { ProjectItem, PageRoute } from '../types';
import { getCardColorToken } from '../utils/cardColorTokens';
import { ScrollReveal, ScrollRevealItem } from '../components/common/ScrollReveal';
import { ProjectVisualThumbnail } from '../components/common/ServiceVisualMockups';
import { MobileSectionSkeletonWrapper } from '../components/common/MobileSectionSkeleton';

interface CaseStudiesPageProps {
  slug?: string;
  onNavigate: (route: PageRoute) => void;
  onStartProject: (serviceName?: string) => void;
}

export const CaseStudiesPage: React.FC<CaseStudiesPageProps> = ({
  slug,
  onNavigate,
  onStartProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // If a slug is specified, render the individual case study
  if (slug) {
    const project = projectsData.find((p) => p.id === slug);

    if (!project) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-3xl font-extrabold text-slate-900">Case Study Not Found</h1>
          <p className="text-slate-600">The requested case study could not be located.</p>
          <button
            onClick={() => onNavigate('/case-studies')}
            className="min-h-[44px] min-w-[44px] px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Back to Case Studies
          </button>
        </div>
      );
    }

    return (
      <div className="w-full">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumbs
            items={[
              { label: 'Case Studies', route: '/case-studies' },
              { label: project.title },
            ]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Individual Case Study Hero with Interactive Project Visual */}
        <section className="relative overflow-hidden pt-6 pb-10 sm:pt-8 sm:pb-16 lg:pt-14 lg:pb-20 bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFF] to-[#FFFFFF] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
              <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100/80 text-[#1266E8]">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {project.industry}
                  </span>
                  {project.isDemonstration && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                      Concept Demonstration
                    </span>
                  )}
                </div>

                <h1 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-bold text-[#1E3A8A] tracking-[-0.015em] leading-[1.18] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
                  {project.title}
                </h1>

                <p className="text-[13.5px] sm:text-base lg:text-[17px] text-slate-600 leading-relaxed">
                  {project.tagline}
                </p>

                <div className="pt-1 sm:pt-2 flex flex-wrap gap-2.5 sm:gap-3">
                  <button
                    onClick={() => onStartProject(`Architecture: ${project.title}`)}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-sm shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Discuss Similar Architecture</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('/case-studies')}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 hover:from-white hover:to-[#F0F9FF] text-[#1E3A8A] hover:text-[#2563EB] font-semibold text-sm border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <span>All Case Studies</span>
                  </button>
                </div>
              </div>

              {/* Right Hero Visual: Realistic Solution Mockup */}
              <div className="lg:col-span-5 w-full">
                <ProjectVisualThumbnail projectId={project.id} className="shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown */}
        <MobileSectionSkeletonWrapper variant="split-detail" sectionIndex={0}>
        <section className="py-10 sm:py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-16">
            {/* The Challenge & Objectives */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
              <div className="lg:col-span-6 space-y-3 sm:space-y-5">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  01 // The Problem Statement
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Business Challenge & Operating Friction
                </h2>
                <p className="text-slate-600 text-[13px] sm:text-sm leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              <div className="lg:col-span-6 space-y-3 sm:space-y-5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#1266E8]">
                  02 // Project Objectives
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Target Engineering Milestones
                </h2>
                <div className="space-y-2.5 sm:space-y-3">
                  {project.objectives.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-[#1266E8] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-700 leading-snug">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Architecture Solution */}
            <div className="p-5 sm:p-10 rounded-2xl bg-gradient-to-br from-[#162D5E] via-[#1C3873] to-[#1E3A8A] text-white space-y-4 sm:space-y-6 border border-[#60A5FA]/35 shadow-lg">
              <div className="flex items-center gap-2 text-[#67E8F9] text-xs font-mono uppercase tracking-wider">
                <Cpu className="w-4 h-4" /> 03 // Solution Architecture
              </div>
              <h3 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-white">
                Technical Blueprint & System Design
              </h3>
              <p className="text-blue-100/90 text-[13px] sm:text-base leading-relaxed max-w-4xl">
                {project.solutionArchitecture}
              </p>

              <div className="pt-3 sm:pt-4 border-t border-white/15 space-y-2.5 sm:space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-blue-200">
                  Production Tech Stack
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 sm:px-3 py-1 rounded-md bg-white/10 text-white text-xs font-mono border border-white/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Verified Outcomes */}
            <div className="space-y-4 sm:space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                04 // Measurable Results
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Verified Outcomes & Benchmark Performance
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6">
                {project.verifiedOutcomes.map((outcome, idx) => (
                  <div key={idx} className="p-4 sm:p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5 sm:space-y-2">
                    <CheckCircle2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-600" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {outcome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        </MobileSectionSkeletonWrapper>
      </div>
    );
  }

  // Listing View for /case-studies
  const categories = ['All', 'Web', 'E-commerce', 'AI & ML', 'Custom Software', 'Cloud & DevOps', 'Growth'];

  const filtered = projectsData.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[{ label: 'Case Studies' }]}
          onNavigate={onNavigate}
        />
      </div>

      {/* Case Studies Header */}
      <section className="relative overflow-hidden pt-5 pb-8 sm:pt-8 sm:pb-16 lg:pt-14 lg:pb-20 bg-gradient-to-b from-[#F5F8FC] via-[#F8FAFF] to-[#FFFFFF] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-5">
          <div className="inline-flex items-center gap-2 h-[32px] sm:h-[34px] px-3 sm:px-4 rounded-full bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 border border-[#DBEAFE]/90 shadow-[0_2px_12px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] text-xs font-bold text-[#2563EB]">
            <Compass className="w-3.5 h-3.5" />
            <span>Architecture Field Notes</span>
          </div>

          <h1 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-bold text-[#1E3A8A] tracking-[-0.015em] leading-[1.18] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)] max-w-3xl">
            Case Studies & Implementation Blueprints
          </h1>

          <p className="text-[13.5px] sm:text-base lg:text-[17px] text-slate-600 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
            Examine in-depth technical breakdowns of business challenges, solution architectures, tech stacks, and verified measurable outcomes.
          </p>

          {/* Search & Category Filter Bar */}
          <div className="pt-2 sm:pt-4 flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search case studies by keyword or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[42px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[44px] min-w-[44px] md:min-h-[38px] md:min-w-0 px-3.5 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'bg-white hover:bg-[#F5F8FC] text-slate-600 hover:text-[#1E3A8A] border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Case Studies */}
      <MobileSectionSkeletonWrapper variant="cards-grid" sectionIndex={0} cardCount={3}>
      <section className="py-10 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8" staggerChildren={0.12}>
            {filtered.map((project, idx) => {
              const color = getCardColorToken(idx);

              return (
                <ScrollRevealItem key={project.id} className="h-full">
                  <div
                    className={`${color.cardBg} ${color.cardBorder} h-full border rounded-2xl shadow-xs ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 p-4 sm:p-7 flex flex-col justify-between space-y-4 sm:space-y-5 group interactive-card-lift`}
                  >
                    <div className="space-y-3 sm:space-y-4">
                      {/* Interactive Visual Thumbnail */}
                      <ProjectVisualThumbnail projectId={project.id} className="mb-2" />

                      <div className="flex items-center justify-between gap-3">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                          {project.category}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">{project.industry}</span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                        {project.title}
                      </h2>

                      <p className="text-[13px] sm:text-sm text-slate-700 leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {project.tagline}
                      </p>

                      <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
                        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                          Key Highlights
                        </div>
                        <div className="space-y-1.5">
                          {project.keyFeatures.slice(0, 3).map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className={`${fIdx === 2 ? 'hidden sm:flex' : 'flex'} items-center gap-2 text-[13px] sm:text-[13.5px] text-slate-700`}
                            >
                              <CheckCircle2 className={`w-4 h-4 ${color.accentText} shrink-0`} />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-slate-200/80 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5 max-w-[60%]">
                        {project.techStack.slice(0, 3).map((tech, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/90 text-slate-700 border border-slate-200/80">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => onNavigate(`/case-studies/${project.id}` as PageRoute)}
                        className={`min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center gap-1 text-xs font-bold ${color.accentText} hover:underline group-hover:translate-x-1 transition-all cursor-pointer`}
                      >
                        <span>Read Study</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </div>
      </section>
      </MobileSectionSkeletonWrapper>
    </div>
  );
};
