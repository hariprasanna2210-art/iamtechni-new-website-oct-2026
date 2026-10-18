import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Cpu, Layers } from 'lucide-react';
import { PageRoute, ProjectItem } from '../types';
import { PageHero } from '../components/common/PageHero';
import { projectsData } from '../data/projectsData';
import { getCardColorToken } from '../utils/cardColorTokens';

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
      <section className="py-20 bg-[#F4F7FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold">
                Project Showcase
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Filter by Engineering Domain
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
              {filters.map((flt) => (
                <button
                  key={flt}
                  onClick={() => setSelectedFilter(flt)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    selectedFilter === flt
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => {
              const color = getCardColorToken(idx);

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

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-950 transition-colors leading-snug mb-2 flex items-center justify-between">
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-br from-[#1266E8] via-[#0B5CD5] to-[#5427D9] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Have a custom software or web architecture in mind?</h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto">
            Our engineers can review your business workflow and prepare a detailed architecture plan.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onStartProject()}
              className="px-8 py-3.5 text-xs font-bold text-[#1266E8] bg-white rounded-xl hover:bg-blue-50 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Start Project Discovery
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
