import React from 'react';
import { X, CheckCircle2, ArrowRight, Layers, Cpu, Compass } from 'lucide-react';
import { ProjectItem, PageRoute } from '../../types';
import { ProjectVisualThumbnail } from './ServiceVisualMockups';

interface CaseStudyModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onNavigate: (route: PageRoute) => void;
  onStartProject: (serviceName?: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onNavigate,
  onStartProject,
}) => {
  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header Bar */}
        <div className="bg-[#0A0D14] px-6 py-6 text-white border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#04C8E8] uppercase">{project.category}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">{project.industry}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-sm">
                {project.clientBadge}
              </span>
            </div>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 p-1.5 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 id="case-study-title" className="text-2xl font-bold tracking-tight text-white">
            {project.title}
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {project.tagline}
          </p>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Solution Interface Mockup */}
          <div>
            <ProjectVisualThumbnail projectId={project.id} className="shadow-md" />
          </div>
          {/* Business Challenge */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#1266E8]" /> Business Challenge
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
              {project.challenge}
            </p>
          </div>

          {/* Objectives & Approach */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#1266E8]" /> Solution Architecture
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              {project.solutionArchitecture}
            </p>

            <div className="space-y-1.5">
              {project.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1266E8] mt-1.5 shrink-0" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Key Technical Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.keyFeatures.map((feat, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-700 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#04C8E8] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#1266E8]" /> Technology Ecosystem
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-mono bg-[#0A0D14] text-slate-300 rounded-md border border-slate-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Verified Outcomes */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              Verified Project Outcomes & Benchmarks
            </h4>
            <ul className="space-y-1.5">
              {project.verifiedOutcomes.map((out, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-emerald-900 font-medium">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Related Services:</span>
              {project.relatedServices.map((rel, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onClose();
                    onNavigate(rel.route);
                  }}
                  className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center px-2 md:px-0 text-[#1266E8] hover:underline font-medium"
                >
                  {rel.title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onStartProject(project.relatedServices[0]?.title);
                }}
                className="flex-1 sm:flex-none min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Engineer Similar Solution <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
