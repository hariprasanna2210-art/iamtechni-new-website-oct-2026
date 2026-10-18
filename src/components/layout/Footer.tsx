import React from 'react';
import { ArrowUpRight, ShieldCheck, Mail, Globe, Phone, Clock, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { IamtechniLogo } from '../common/IamtechniLogo';
import { PageRoute } from '../../types';
import { COMPANY_CONTACT } from '../../data/companyInfo';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  onStartProject: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onStartProject }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080B11] text-white border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prominent Direct Contact Highlight Bar */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0e1628] border border-slate-800 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[#04C8E8] font-bold uppercase tracking-wider">
                  Direct Inquiries & Project Discovery
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">Response within 24 hours</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Have a project or technology requirement in mind?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Reach out to our engineering and consulting team directly by phone or email.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Direct Phone */}
              <a
                href={COMPANY_CONTACT.phoneTel}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-teal-950/70 border border-teal-500/40 hover:border-teal-400 text-teal-200 hover:text-white rounded-xl text-xs font-semibold transition-all group shadow-sm"
                title={`Call ${COMPANY_CONTACT.phone}`}
              >
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-teal-400 font-bold">
                    Call Directly
                  </div>
                  <div className="font-mono text-xs font-bold text-white">
                    {COMPANY_CONTACT.phone}
                  </div>
                </div>
              </a>

              {/* Direct Email */}
              <a
                href={COMPANY_CONTACT.emailMailto}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-blue-950/70 border border-blue-500/40 hover:border-blue-400 text-blue-200 hover:text-white rounded-xl text-xs font-semibold transition-all group shadow-sm"
                title={`Email ${COMPANY_CONTACT.email}`}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-blue-400 font-bold">
                    Email Inquiries
                  </div>
                  <div className="font-mono text-xs font-bold text-white">
                    {COMPANY_CONTACT.email}
                  </div>
                </div>
              </a>

              {/* Ask AI Advisor CTA */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('iamtechni:open-chat'))}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 hover:text-white border border-blue-400/40 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-98 cursor-pointer"
                title="Open IAMTECHNI AI Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Ask AI Advisor</span>
              </button>

              {/* Consultation CTA */}
              <button
                onClick={onStartProject}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <IamtechniLogo size="md" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              IAMTECHNI combines software engineering, artificial intelligence, cloud technologies, and digital growth services to help businesses transform ideas into practical digital solutions.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-400">
              Technology that moves your business forward.
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                onClick={onStartProject}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#1266E8] to-[#5427D9] text-white text-xs font-semibold rounded-xl hover:opacity-95 transition-opacity cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-4 py-2 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Contact IAMTECHNI
              </button>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/services/web-development')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Web Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services/ecommerce')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  E-commerce Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services/custom-software')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Custom Software
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services/mobile-apps')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Mobile Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services/ai-machine-learning')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  AI & Machine Learning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services/cloud-devops')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Cloud & DevOps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services/robotics')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Robotics & Emerging Tech
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services')}
                  className="text-[#04C8E8] hover:underline font-semibold text-left pt-1 block cursor-pointer"
                >
                  All 13 Practices →
                </button>
              </li>
            </ul>
          </div>

          {/* Solutions & Industries Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Solutions & Focus
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/solutions')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Process Automation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/solutions')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Enterprise Document RAG
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/solutions')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Executive Dashboards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/industries')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Education & Training
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/industries')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Retail & E-commerce
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/industries')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Healthcare Administration
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/industries')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Manufacturing & Operations
                </button>
              </li>
            </ul>
          </div>

          {/* Organization & Direct Contact Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Company & Inquiries
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  About IAMTECHNI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/portfolio')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Portfolio & Concept Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/technology')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Technology Ecosystem
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/insights')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Insights & Engineering Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/careers')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Careers & Open Roles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>

            <div className="pt-4 mt-4 border-t border-slate-800/60 text-xs space-y-3">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                Direct Contact
              </div>
              
              {/* Phone Link */}
              <a
                href={COMPANY_CONTACT.phoneTel}
                className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors group p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50"
                title={`Call ${COMPANY_CONTACT.phone}`}
              >
                <div className="w-7 h-7 rounded-lg bg-teal-950 border border-teal-800/80 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">Telephone</div>
                  <div className="font-mono text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                    {COMPANY_CONTACT.phone}
                  </div>
                </div>
              </a>

              {/* Email Link */}
              <a
                href={COMPANY_CONTACT.emailMailto}
                className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors group p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50"
                title={`Email ${COMPANY_CONTACT.email}`}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-800/80 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-mono">Email Inquiries</div>
                  <div className="font-mono text-xs font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                    {COMPANY_CONTACT.email}
                  </div>
                </div>
              </a>

              {/* Website */}
              <div className="flex items-center gap-2 text-slate-400 pt-1 text-xs">
                <Globe className="w-3.5 h-3.5 text-[#04C8E8] shrink-0" />
                <a
                  href="https://iamtechni.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-mono"
                >
                  iamtechni.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} IAMTECHNI. All rights reserved. Technology that moves your business forward.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('/privacy-policy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('/terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <span className="text-slate-700">·</span>
            <span className="text-slate-500 font-mono">+91-7418120053</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-500 font-mono">iamtechni.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
