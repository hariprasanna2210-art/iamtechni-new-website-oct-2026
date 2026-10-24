import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Cpu, Layers, Sparkles } from 'lucide-react';
import { PageRoute, ProjectItem } from '../types';
import { PageHero } from '../components/common/PageHero';
import { projectsData } from '../data/projectsData';
import { getCardColorToken } from '../utils/cardColorTokens';
import { getServiceIcon } from '../utils/serviceIcons';
import { ScrollReveal, ScrollRevealItem } from '../components/common/ScrollReveal';
import { ProjectVisualThumbnail } from '../components/common/ServiceVisualMockups';

interface PortfolioPageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenCaseStudy: (project: ProjectItem) => void;
  onStartProject: (serviceName?: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigate,
  onOpenCaseStudy,
  onStartProject,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const filters = ['All', 'Web', 'E-commerce', 'AI & ML', 'Custom Software', 'Cloud & DevOps'];

  const filteredProjects =
    selectedFilter === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category === selectedFilter);

  return (
    <div className="w-full">
      {/* Reusable PageHero */}
      <PageHero
        breadcrumbItems={[{ label: 'Portfolio & Projects' }]}
        onNavigate={onNavigate}
        kicker="PROVEN ARCHITECTURES"
        category="Case Studies"
        title="Ideas Transformed into Digital Experiences"
        tagline="Production case studies detailing challenge, architecture, and verified business outcomes."
        description="Explore our architectural case studies and demonstration projects. Each project breakdown details the underlying business challenge, architectural topology, technology stack, and verified outcomes."
        primaryCtaText="Start Project Discovery"
        onPrimaryCta={() => onStartProject('Portfolio Architecture Inquiry')}
        secondaryCtaText="Explore All Services"
        onSecondaryCta={() => onNavigate('/services')}
        slug="portfolio"
      />

      {/* Projects Grid Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold">
                Project Showcase
              </div>
              <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl font-bold text-[#1E3A8A] mt-1 drop-shadow-[0_2px_8px_rgba(30,58,138,0.08)]">
                Filter by Engineering Domain
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs max-w-full overflow-x-auto">
              {filters.map((flt) => (
                <button
                  key={flt}
                  onClick={() => setSelectedFilter(flt)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    selectedFilter === flt
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-[#F5F8FC]'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>

          <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerChildren={0.1}>
            {filteredProjects.map((project, idx) => {
              const color = getCardColorToken(idx);
              const ProjectIcon = getServiceIcon(project.category);

              return (
                <ScrollRevealItem key={project.id} className="h-full">
                  <div
                    onClick={() => onOpenCaseStudy(project)}
                    className={`${color.cardBg} ${color.cardBorder} h-full border rounded-2xl p-6 sm:p-7 flex flex-col justify-between ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 cursor-pointer group shadow-2xs interactive-card-lift`}
                  >
                    <div>
                      {/* Interactive Visual Thumbnail */}
                      <ProjectVisualThumbnail projectId={project.id} className="mb-4" />

                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}>
                          {project.category}
                        </span>
                        <div className={`w-8 h-8 rounded-lg ${color.iconBg} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                          <ProjectIcon className="w-4 h-4" />
                        </div>
                      </div>

                      <h2 className="text-lg font-bold text-[#1E3A8A] group-hover:text-[#2563EB] transition-colors leading-snug mb-2 flex items-center justify-between">
                        <span>{project.title}</span>
                        <span className={`w-2 h-2 rounded-full ${color.dotBg} shrink-0 opacity-80 group-hover:scale-125 transition-transform`} />
                      </h2>

                      <p className="text-xs text-slate-700 leading-relaxed mb-4 line-clamp-3">
                        {project.tagline}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                          Technology Stack
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[10px] font-mono bg-white/90 text-slate-700 rounded-md border border-slate-200/90"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium text-[11px]">{project.industry}</span>
                      <span className={`${color.accentText} font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
                        Read Case Study <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#ECFEFF] border border-[#DBEAFE] rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-[0_8px_30px_rgba(37,99,235,0.08)]">
            <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
              Have a custom software or web architecture in mind?
            </h2>
            <p className="text-sm bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent font-medium max-w-xl mx-auto">
              Our engineers can review your business workflow and prepare a detailed architecture plan.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onStartProject('Custom Project Scoping')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 min-h-[40px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Discuss Your Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
