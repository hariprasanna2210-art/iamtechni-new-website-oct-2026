import React, { useState } from 'react';
import {
  ChevronDown,
  Search,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Code2,
  Workflow,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { PageRoute } from '../types';

interface FaqPageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
}

interface FaqCategory {
  category: string;
  items: {
    question: string;
    answer: string;
  }[];
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate, onOpenProjectModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    '0-0': true,
    '1-0': true,
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const faqData: FaqCategory[] = [
    {
      category: 'Services & Technical Capabilities',
      items: [
        {
          question: 'What core services does IAMTECHNI provide?',
          answer:
            'IAMTECHNI provides 17 engineering and digital growth disciplines spanning Website Design and Development, Custom Software Engineering, AI & Machine Learning, Generative AI Solutions, E-commerce, Mobile Apps, Cloud Computing, DevOps, Data Analytics, Cybersecurity Hardening, and Technical SEO.',
        },
        {
          question: 'Do you build on off-the-shelf templates or create custom codebases?',
          answer:
            'We engineer 100% custom, bespoke codebases written in TypeScript, React, Next.js, Python, and Node.js. This ensures zero licensing lock-in, sub-second performance, and complete intellectual property ownership for your business.',
        },
        {
          question: 'Can you work with our existing development team or legacy codebase?',
          answer:
            'Yes. We regularly augment existing in-house engineering departments, perform incremental legacy refactoring, and build decoupled microservices or modern frontends connected to existing backends.',
        },
      ],
    },
    {
      category: 'Engagement Process & Timelines',
      items: [
        {
          question: 'What does your standard development process look like?',
          answer:
            'We operate across a structured 7-stage delivery lifecycle: 01 Discover (requirements & technical audit), 02 Define (scope & architecture blueprint), 03 Design (responsive wireframes & design systems), 04 Build (modular TypeScript/Python engineering), 05 Validate (automated tests & Core Web Vitals audits), 06 Deploy (zero-downtime CI/CD container releases), and 07 Improve (telemetry monitoring & enhancements).',
        },
        {
          question: 'How long does a typical project take to design and launch?',
          answer:
            'Corporate websites and MVPs typically launch in 4 to 8 weeks. Larger enterprise platforms, custom software portals, and complex AI/RAG integrations generally take between 2 to 4 months depending on integration scope.',
        },
        {
          question: 'How do you communicate progress during development?',
          answer:
            'Clients receive dedicated weekly video check-ins, access to real-time staging preview URLs, and shared Slack/Teams channels with lead architects for direct, transparent communication.',
        },
      ],
    },
    {
      category: 'Pricing, Contracts & Ownership',
      items: [
        {
          question: 'Who owns the intellectual property (IP) and source code?',
          answer:
            'You do. Upon project completion and settlement, 100% of the code, documentation, assets, and deployment configurations belong to your company. We never charge ongoing proprietary seat licenses.',
        },
        {
          question: 'What are your contract and payment structures?',
          answer:
            'We offer both milestone-based fixed scope contracts (with clear deliverables) and agile monthly engineering sprints for evolving product requirements. All contracts include upfront transparent pricing with zero surprise charges.',
        },
      ],
    },
    {
      category: 'Security, Privacy & Support',
      items: [
        {
          question: 'How do you protect our proprietary data when building AI solutions?',
          answer:
            'We enforce enterprise zero-retention API contracts and deploy private vector enclaves inside isolated cloud VPCs. Your proprietary documents, customer data, and internal SOPs never leak into public foundation models.',
        },
        {
          question: 'Do you provide ongoing maintenance and technical support after launch?',
          answer:
            'Yes. We provide flexible post-launch SLA maintenance agreements covering cloud infrastructure health, dependency updates, security patches, uptime monitoring, and ongoing feature development.',
        },
      ],
    },
  ];

  const filteredCategories = faqData
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} onNavigate={onNavigate} />
      </div>

      {/* FAQ Hero */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20 bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFF] to-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1266E8]">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Knowledge Base &amp; FAQs</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Frequently Asked Questions
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Find transparent answers about our engineering capabilities, engagement process, code ownership, pricing models, and security standards.
              </p>

              {/* Search Input */}
              <div className="pt-4 max-w-lg relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search questions by keyword (e.g. ownership, AI, timeline)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1266E8]"
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="text-xs font-mono font-bold text-slate-900">TRANSPARENCY_GUARANTEES</div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1266E8] border border-blue-200 text-[10px] font-mono font-bold">
                    VERIFIED ANSWERS
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Source Code &amp; IP Ownership
                    </span>
                    <span className="font-mono font-bold text-emerald-700">100% Client</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-[#1266E8]" /> Delivery Lifecycle
                    </span>
                    <span className="font-mono font-bold text-[#1266E8]">7-Stage Agile</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#5427D9]" /> AI Data Privacy
                    </span>
                    <span className="font-mono font-bold text-[#5427D9]">Zero-Retention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Content */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">No matching questions found</h3>
              <p className="text-xs text-slate-500">
                Try searching with different terms or speak directly with our team.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredCategories.map((cat, catIdx) => {
              const getCategoryIcon = (name: string) => {
                if (name.includes('Services') || name.includes('Technical')) return Code2;
                if (name.includes('Process') || name.includes('Timeline')) return Workflow;
                if (name.includes('Pricing') || name.includes('Ownership')) return Sparkles;
                return ShieldCheck;
              };
              const CatIcon = getCategoryIcon(cat.category);

              return (
                <div key={catIdx} className="space-y-4">
                  <div className="flex items-center gap-2.5 px-1 border-b border-slate-200 pb-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#1266E8] flex items-center justify-center shadow-2xs">
                      <CatIcon className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {cat.category}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {cat.items.map((item, itemIdx) => {
                      const key = `${catIdx}-${itemIdx}`;
                      const isOpen = openItems[key];
                      return (
                        <div
                          key={itemIdx}
                          className={`rounded-2xl border transition-all duration-200 ${
                            isOpen
                              ? 'border-blue-200 bg-white shadow-md'
                              : 'border-slate-200/90 bg-white shadow-2xs hover:border-slate-300'
                          }`}
                        >
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                            aria-expanded={isOpen}
                          >
                            <span className="text-sm sm:text-base font-bold text-slate-900">
                              {item.question}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                                isOpen ? 'rotate-180 text-[#1266E8]' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}

          {/* Have More Questions CTA Box */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Still have questions?</h3>
              <p className="text-xs text-slate-600">
                Our solutions engineering team is available for a direct technical consultation.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenProjectModal('General Inquiry')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
              >
                Ask a Question
              </button>
              <button
                onClick={() => onNavigate('/contact/consultation')}
                className="px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1266E8] text-xs font-semibold border border-blue-200"
              >
                Schedule Call
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
