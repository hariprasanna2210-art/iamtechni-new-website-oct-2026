import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X, ArrowRight, Sparkles, Code2, Cloud, ShieldCheck, TrendingUp, Cpu, Phone, Mail } from 'lucide-react';
import { IamtechniLogo } from '../common/IamtechniLogo';
import { PageRoute } from '../../types';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onStartProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, onStartProject }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'services' | 'solutions' | null>(null);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menu: 'services' | 'solutions') => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setActiveMegaMenu(menu);
  };

  const handleMouseLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 180);
  };

  const handleLinkClick = (route: PageRoute) => {
    setActiveMegaMenu(null);
    setIsMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-slate-200/90 py-2.5'
            : 'bg-white border-slate-200/60 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark / Logo */}
          <div className="shrink-0 flex items-center">
            <button
              onClick={() => handleLinkClick('/')}
              className="flex items-center gap-2 text-left focus:outline-hidden group"
              aria-label="IAMTECHNI Home"
            >
              {/* Official IAMTECHNI logo with 100% transparent background */}
              <IamtechniLogo size="sm" />
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {/* Services with Mega Menu */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleLinkClick('/services')}
                className={`flex items-center gap-1 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  currentRoute.startsWith('/services') ? 'text-[#1266E8] font-semibold' : ''
                }`}
                aria-expanded={activeMegaMenu === 'services'}
              >
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Services Mega Menu Dropdown */}
              {activeMegaMenu === 'services' && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="menu"
                >
                  <div className="grid grid-cols-3 gap-6">
                    {/* Column 1: Experiences */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#04C8E8]" /> Digital Experiences
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleLinkClick('/services/web-development')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            Web Development
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            Flagship corporate websites & web apps
                          </div>
                        </button>
                        <button
                          onClick={() => handleLinkClick('/services/ecommerce')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            E-commerce Development
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            Storefronts, checkout & inventory sync
                          </div>
                        </button>
                        <button
                          onClick={() => handleLinkClick('/services/ui-ux-design')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            UI/UX Design Systems
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            User research & accessible prototypes
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Column 2: Software & AI */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-[#1266E8]" /> Software & Intelligence
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleLinkClick('/services/custom-software')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            Custom Software
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            Business portals & workflow systems
                          </div>
                        </button>
                        <button
                          onClick={() => handleLinkClick('/services/mobile-apps')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            Mobile App Engineering
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            Cross-platform & progressive web apps
                          </div>
                        </button>
                        <button
                          onClick={() => handleLinkClick('/services/ai-machine-learning')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            AI & Machine Learning
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            Private RAG & document assistants
                          </div>
                        </button>
                        <button
                          onClick={() => handleLinkClick('/services/data-analytics')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            Data Analytics & BI
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            ETL pipelines & KPI dashboards
                          </div>
                        </button>
                        <button
                          onClick={() => handleLinkClick('/services/robotics')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            Robotics & Emerging Tech
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            Autonomous systems & IoT telemetry
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Column 3: Cloud & Advisory */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                        <Cloud className="w-3.5 h-3.5 text-[#5427D9]" /> Cloud & Growth
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleLinkClick('/services/cloud-devops')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            Cloud & DevOps
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            AWS, Azure & CI/CD automation
                          </div>
                        </button>
                        <button
                          onClick={() => handleLinkClick('/services/cybersecurity')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            Cybersecurity Hardening
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            Defensive audits & secure coding
                          </div>
                        </button>
                        <button
                          onClick={() => handleLinkClick('/services/digital-marketing')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            Digital Marketing & SEO
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            Technical SEO & search rankings
                          </div>
                        </button>
                        <button
                          onClick={() => handleLinkClick('/services/training')}
                          className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                            Technical Training
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            Engineering labs & team upskilling
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>13 Specialized Technical Practices</span>
                    <button
                      onClick={() => handleLinkClick('/services')}
                      className="text-[#1266E8] font-semibold hover:underline flex items-center gap-1"
                    >
                      View All Services Directory <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions with Mega Menu */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleLinkClick('/solutions')}
                className={`flex items-center gap-1 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  currentRoute === '/solutions' ? 'text-[#1266E8] font-semibold' : ''
                }`}
                aria-expanded={activeMegaMenu === 'solutions'}
              >
                <span>Solutions</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Solutions Dropdown */}
              {activeMegaMenu === 'solutions' && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[540px] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="menu"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleLinkClick('/solutions')}
                      className="block text-left p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                        Business Process Automation
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Replace manual spreadsheets and email approval friction.
                      </div>
                    </button>

                    <button
                      onClick={() => handleLinkClick('/solutions')}
                      className="block text-left p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                        AI Knowledge & Document Search
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Private enterprise RAG assistants with verifiable citations.
                      </div>
                    </button>

                    <button
                      onClick={() => handleLinkClick('/solutions')}
                      className="block text-left p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                        Custom Business Dashboards
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Real-time revenue, telemetry, and KPI data integration.
                      </div>
                    </button>

                    <button
                      onClick={() => handleLinkClick('/solutions')}
                      className="block text-left p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                        Cloud Modernization & Migration
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        AWS & Azure topologies with zero-downtime CI/CD.
                      </div>
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Engineered around practical business challenges</span>
                    <button
                      onClick={() => handleLinkClick('/solutions')}
                      className="text-[#1266E8] font-semibold hover:underline flex items-center gap-1"
                    >
                      Explore Solutions Directory <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleLinkClick('/industries')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === '/industries' ? 'text-[#1266E8] font-semibold' : ''
              }`}
            >
              Industries
            </button>

            <button
              onClick={() => handleLinkClick('/portfolio')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === '/portfolio' ? 'text-[#1266E8] font-semibold' : ''
              }`}
            >
              Portfolio
            </button>

            <button
              onClick={() => handleLinkClick('/technology')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === '/technology' ? 'text-[#1266E8] font-semibold' : ''
              }`}
            >
              Technology
            </button>

            <button
              onClick={() => handleLinkClick('/insights')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute.startsWith('/insights') ? 'text-[#1266E8] font-semibold' : ''
              }`}
            >
              Insights
            </button>

            <button
              onClick={() => handleLinkClick('/about')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentRoute === '/about' ? 'text-[#1266E8] font-semibold' : ''
              }`}
            >
              About
            </button>
          </nav>

          {/* Zone 3: Direct Phone Link, Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* AI Advisor Chatbot Trigger */}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('iamtechni:open-chat'));
              }}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F52BA] bg-blue-50/90 hover:bg-blue-100 hover:text-blue-800 transition-colors py-1.5 px-3 rounded-xl border border-blue-200/90 shadow-2xs whitespace-nowrap cursor-pointer"
              title="Chat with IAMTECHNI AI Solutions Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0F52BA]" />
              <span>AI Advisor</span>
            </button>

            {/* Compact direct phone link */}
            <a
              href="tel:+917418120053"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0D9488] transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-50 border border-slate-200/90 shadow-2xs whitespace-nowrap"
              title="Call IAMTECHNI"
            >
              <Phone className="w-3.5 h-3.5 text-[#0D9488]" />
              <span className="font-mono">+91-7418120053</span>
            </a>

            <button
              onClick={onStartProject}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] z-50 bg-white/95 backdrop-blur-md lg:hidden overflow-y-auto p-6 flex flex-col justify-between border-t border-slate-200 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
              Navigation Menu
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleLinkClick('/')}
                className="block text-left w-full py-2 text-base font-semibold text-slate-900"
              >
                Home
              </button>
              <button
                onClick={() => handleLinkClick('/services')}
                className="block text-left w-full py-2 text-base font-semibold text-slate-900"
              >
                Services (All 12 Disciplines)
              </button>
              <button
                onClick={() => handleLinkClick('/solutions')}
                className="block text-left w-full py-2 text-base font-semibold text-slate-900"
              >
                Solutions
              </button>
              <button
                onClick={() => handleLinkClick('/industries')}
                className="block text-left w-full py-2 text-base font-semibold text-slate-900"
              >
                Industries
              </button>
              <button
                onClick={() => handleLinkClick('/portfolio')}
                className="block text-left w-full py-2 text-base font-semibold text-slate-900"
              >
                Portfolio & Projects
              </button>
              <button
                onClick={() => handleLinkClick('/technology')}
                className="block text-left w-full py-2 text-base font-semibold text-slate-900"
              >
                Technology Ecosystem
              </button>
              <button
                onClick={() => handleLinkClick('/insights')}
                className="block text-left w-full py-2 text-base font-semibold text-slate-900"
              >
                Insights & Articles
              </button>
              <button
                onClick={() => handleLinkClick('/about')}
                className="block text-left w-full py-2 text-base font-semibold text-slate-900"
              >
                About IAMTECHNI
              </button>
              <button
                onClick={() => handleLinkClick('/careers')}
                className="block text-left w-full py-2 text-base font-semibold text-slate-900"
              >
                Careers
              </button>
              <button
                onClick={() => handleLinkClick('/contact')}
                className="block text-left w-full py-2 text-base font-semibold text-slate-900"
              >
                Contact & Project Inquiries
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 space-y-3">
            {/* Quick Contact Buttons for Mobile */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold">
              <a
                href="tel:+917418120053"
                className="py-2.5 px-3 bg-teal-50 border border-teal-200 text-[#0D9488] rounded-xl flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Us</span>
              </a>
              <a
                href="mailto:iamtechni.hr@outlook.com"
                className="py-2.5 px-3 bg-blue-50 border border-blue-200 text-[#1266E8] rounded-xl flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Us</span>
              </a>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('iamtechni:open-chat'));
              }}
              className="w-full py-2.5 text-xs font-semibold text-[#0F52BA] bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center gap-2 border border-blue-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0F52BA]" />
              <span>Ask IAMTECHNI AI Advisor</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onStartProject();
              }}
              className="w-full py-3 text-sm font-semibold text-white bg-slate-900 rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              Start a Project <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-center text-xs text-slate-400 font-mono">
              +91-7418120053 · iamtechni.hr@outlook.com
            </div>
          </div>
        </div>
      )}
    </>
  );
};
