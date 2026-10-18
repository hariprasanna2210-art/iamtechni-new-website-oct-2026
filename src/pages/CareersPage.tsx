import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Briefcase, MapPin, Clock, X, CheckCircle2 } from 'lucide-react';
import { PageRoute, CareerItem } from '../types';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { careersData } from '../data/careersData';

interface CareersPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState<CareerItem | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [applicant, setApplicant] = useState({ name: '', email: '', portfolio: '', notes: '' });

  const handleApply = (role: CareerItem) => {
    setSelectedRole(role);
    setIsApplying(true);
    setAppSubmitted(false);
  };

  const handleAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicant.name || !applicant.email) return;

    setTimeout(() => {
      setAppSubmitted(true);
    }, 600);
  };

  return (
    <div className="w-full">
      <Breadcrumbs items={[{ label: 'Careers' }]} onNavigate={onNavigate} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFF] to-white border-b border-slate-200 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-mono font-semibold text-[#1266E8]">
                <span className="w-2 h-2 rounded-full bg-[#1266E8]" />
                <span>JOIN THE ENGINEERING PRACTICE</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Build Purposeful Technology with IAMTECHNI
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                We look for curious, disciplined software engineers, UI specialists, and AI practitioners who take pride in craftsmanship, readability, and real business impact.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="text-xs font-mono font-bold text-slate-900">ENGINEERING_CULTURE.TS</div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                    HIRING ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
                    <div className="text-[10px] font-mono text-[#1266E8] font-bold">STACK</div>
                    <div className="font-bold text-slate-900">TypeScript &amp; Python</div>
                    <div className="text-[11px] text-slate-600">Modern strongly-typed repos</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1">
                    <div className="text-[10px] font-mono text-[#5427D9] font-bold">WORKFLOW</div>
                    <div className="font-bold text-slate-900">Direct Architects</div>
                    <div className="text-[11px] text-slate-600">Zero bureaucracy squads</div>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-100 space-y-1">
                    <div className="text-[10px] font-mono text-cyan-700 font-bold">AI &amp; CLOUD</div>
                    <div className="font-bold text-slate-900">Production R&amp;D</div>
                    <div className="text-[11px] text-slate-600">Private RAG &amp; Kubernetes</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                    <div className="text-[10px] font-mono text-emerald-700 font-bold">QUALITY</div>
                    <div className="font-bold text-slate-900">100% Peer Reviewed</div>
                    <div className="text-[11px] text-slate-600">Automated CI/CD pipelines</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Culture Pillars */}
      <section className="py-16 bg-[#F5F7FA] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="text-xs font-mono font-bold text-[#1266E8] mb-2">AUTONOMY & CLARITY</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">High Trust, Low Bureaucracy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Small, focused engineering squads working directly with technical architects without layers of management friction.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="text-xs font-mono font-bold text-[#04C8E8] mb-2">CRAFTSMANSHIP</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Zero Technical Shortcuts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We believe in writing strongly-typed code, robust automated tests, and documenting architectural decisions properly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="text-xs font-mono font-bold text-[#5427D9] mb-2">CONTINUOUS LEARNING</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Dedicated R&D Time</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Continuous opportunities to build internal tools, master emerging RAG architectures, and contribute to knowledge field notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
              Active Opportunities
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Current Open Positions
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Explore open roles across our full-stack engineering, artificial intelligence, and cloud infrastructure practices.
            </p>
          </div>

          <div className="space-y-6">
            {careersData.map((role) => (
              <div
                key={role.id}
                className="bg-[#FAFBFD] border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="text-[#1266E8] font-bold">{role.department}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {role.type}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {role.location}
                    </span>
                    <span>·</span>
                    <span>Exp: {role.experience}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{role.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{role.overview}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {role.skills.map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 text-[11px] font-mono bg-white border border-slate-200 rounded text-slate-700"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => handleApply(role)}
                    className="w-full lg:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Role & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {isApplying && selectedRole && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-[#0A0D14] px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-[#04C8E8] uppercase">
                  {selectedRole.department}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-white mt-1">
                  Apply for {selectedRole.title}
                </h3>
              </div>
              <button
                onClick={() => setIsApplying(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
              {appSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Application Received</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, {applicant.name}. Our engineering practice leaders will review your profile for the {selectedRole.title} position and reply to {applicant.email}.
                  </p>
                  <button
                    onClick={() => setIsApplying(false)}
                    className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAppSubmit} className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-500 font-mono mb-2">
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-600 mb-4">
                      {selectedRole.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[#1266E8] mt-1.5 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase text-slate-500 font-mono mb-3">
                      Your Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={applicant.name}
                          onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#1266E8]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={applicant.email}
                          onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#1266E8]"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        GitHub / Portfolio / LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={applicant.portfolio}
                        onChange={(e) => setApplicant({ ...applicant, portfolio: e.target.value })}
                        placeholder="https://github.com/your-handle"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#1266E8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Brief Note on Your Technical Background
                      </label>
                      <textarea
                        rows={3}
                        value={applicant.notes}
                        onChange={(e) => setApplicant({ ...applicant, notes: e.target.value })}
                        placeholder="Highlight recent projects or technologies you enjoy working with..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#1266E8]"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsApplying(false)}
                      className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                    >
                      Submit Candidate Profile
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
