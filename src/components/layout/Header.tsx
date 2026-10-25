import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Code2,
  Cloud,
  Phone,
  Mail,
  Layers,
  Globe,
  Palette,
  ShoppingBag,
  Smartphone,
  Cpu,
  Bot,
  Database,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { IamtechniLogo } from '../common/IamtechniLogo';
import { PageRoute } from '../../types';
import { COMPANY_CONTACT } from '../../data/companyInfo';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onStartProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onStartProject,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'services' | 'solutions' | null>(null);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  // Measure header height dynamically for exact mobile panel and 100svh hero alignment
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const h = headerRef.current.offsetHeight;
        setHeaderHeight(h);
        document.documentElement.style.setProperty('--header-height', `${h}px`);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Track scroll state with hysteresis to prevent jitter near threshold
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => (prev ? y > 8 : y > 24));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scrolling when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  // Handle Escape key to close mobile menu or mega-menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        if (activeMegaMenu) setActiveMegaMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, activeMegaMenu]);

  // Automatically close mobile menu when expanding to desktop viewport
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  // Structured Services list for mobile submenu
  const servicesList = [
    {
      title: 'Website Design & Development',
      route: '/services/website-development' as PageRoute,
      icon: Globe,
      desc: 'Flagship corporate sites & performant web applications',
    },
    {
      title: 'UI/UX Design Systems',
      route: '/services/ui-ux-design' as PageRoute,
      icon: Palette,
      desc: 'User research, wireframing & accessible component tokens',
    },
    {
      title: 'E-commerce Platform Development',
      route: '/services/ecommerce-development' as PageRoute,
      icon: ShoppingBag,
      desc: 'Custom storefronts, secure checkout & inventory sync',
    },
    {
      title: 'Custom Software Development',
      route: '/services/custom-software-development' as PageRoute,
      icon: Code2,
      desc: 'Tailored enterprise portals & operational workflow systems',
    },
    {
      title: 'Mobile App Engineering',
      route: '/services/mobile-app-development' as PageRoute,
      icon: Smartphone,
      desc: 'Cross-platform iOS & Android native-feel applications',
    },
    {
      title: 'AI & Machine Learning',
      route: '/services/ai-machine-learning' as PageRoute,
      icon: Bot,
      desc: 'Private RAG architectures & intelligent document processing',
    },
    {
      title: 'Generative AI Solutions',
      route: '/services/generative-ai' as PageRoute,
      icon: Sparkles,
      desc: 'Autonomous agent pipelines & enterprise LLM orchestration',
    },
    {
      title: 'Cloud Computing Infrastructure',
      route: '/services/cloud-computing' as PageRoute,
      icon: Cloud,
      desc: 'AWS & Azure multi-region cloud topologies',
    },
    {
      title: 'DevOps & CI/CD Automation',
      route: '/services/devops' as PageRoute,
      icon: Cpu,
      desc: 'Automated build pipelines & container orchestration',
    },
    {
      title: 'Data Analytics & Business Intelligence',
      route: '/services/data-analytics' as PageRoute,
      icon: Database,
      desc: 'Real-time telemetry pipelines & executive KPI dashboards',
    },
    {
      title: 'Cybersecurity Hardening & Audits',
      route: '/services/cybersecurity' as PageRoute,
      icon: ShieldCheck,
      desc: 'Application defense, vulnerability audits & compliance',
    },
    {
      title: 'Digital Marketing & Technical SEO',
      route: '/services/digital-marketing' as PageRoute,
      icon: TrendingUp,
      desc: 'Search intent optimization & high-intent conversion funnels',
    },
    {
      title: 'Robotics & Emerging Technologies',
      route: '/services/robotics-emerging-tech' as PageRoute,
      icon: Cpu,
      desc: 'Autonomous control software, edge telemetry & IoT',
    },
    {
      title: 'Technical Training & Upskilling',
      route: '/services/training' as PageRoute,
      icon: GraduationCap,
      desc: 'Hands-on engineering labs & developer team curricula',
    },
    {
      title: 'IT Consulting & Technology Roadmaps',
      route: '/services/it-consulting' as PageRoute,
      icon: Briefcase,
      desc: 'Architecture audits & strategic technology advisory',
    },
  ];

  // Structured Solutions list for mobile submenu
  const solutionsList = [
    {
      title: 'Business Process Automation',
      route: '/solutions' as PageRoute,
      badge: 'Operational',
      desc: 'Replace manual spreadsheets with automated web pipelines',
    },
    {
      title: 'AI Knowledge & Document Search',
      route: '/solutions' as PageRoute,
      badge: 'Intelligence',
      desc: 'Private RAG assistants with verifiable source citations',
    },
    {
      title: 'Custom Business & KPI Dashboards',
      route: '/solutions' as PageRoute,
      badge: 'Operational',
      desc: 'Real-time revenue, telemetry, and unit metrics',
    },
    {
      title: 'E-commerce & Digital Commerce Modernization',
      route: '/solutions' as PageRoute,
      badge: 'Commerce',
      desc: 'High-speed checkout engines with live stock sync',
    },
    {
      title: 'Cloud Infrastructure Modernization',
      route: '/solutions' as PageRoute,
      badge: 'Infrastructure',
      desc: 'Transition fragile legacy servers into resilient cloud topologies',
    },
    {
      title: 'Application Modernization & Monolith Refactoring',
      route: '/solutions' as PageRoute,
      badge: 'Operational',
      desc: 'Decompose legacy code into modern React & TypeScript',
    },
    {
      title: 'Lead Generation & Digital Growth Engines',
      route: '/solutions' as PageRoute,
      badge: 'Commerce',
      desc: 'Technical SEO and high-intent conversion architectures',
    },
    {
      title: 'Enterprise System Integration Middleware',
      route: '/solutions' as PageRoute,
      badge: 'Infrastructure',
      desc: 'Unify isolated ERPs, CRMs, and payment gateways',
    },
    {
      title: 'Learning & Technical Training Platforms',
      route: '/solutions' as PageRoute,
      badge: 'Operational',
      desc: 'Syllabus delivery, Git verification & mentor review tools',
    },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-slate-200/90 shadow-[0_6px_24px_-4px_rgba(15,23,42,0.08),0_2px_8px_-2px_rgba(15,23,42,0.04)]'
            : 'bg-white border-slate-200/70 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.04)]'
        }`}
      >
        {/* Main Navbar Row — Aligned with Hero Container (max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8) */}
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 xl:py-3 flex items-center justify-between gap-2 lg:gap-2.5 xl:gap-5 whitespace-nowrap">
          {/* Zone 1: Brand Wordmark / Logo */}
          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => handleLinkClick('/')}
              className="min-h-[44px] min-w-[44px] lg:min-h-0 lg:min-w-0 flex items-center gap-2 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1266E8] rounded-lg group cursor-pointer"
              aria-label="IAMTECHNI Home"
            >
              <IamtechniLogo size="md" />
            </button>
          </div>

          {/* Zone 2: Navigation Links (Zero-Wrap Enforced on 1024px+ Viewports) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center justify-center lg:gap-2.5 xl:gap-5 2xl:gap-6 text-[12px] xl:text-[13px] font-medium text-slate-600 shrink-0"
          >
            {/* Services with Mega Menu */}
            <div
              className="py-1"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleLinkClick('/services')}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveMegaMenu('services');
                  }
                }}
                className={`flex items-center gap-1 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1266E8] rounded-md px-1 py-0.5 ${
                  currentRoute.startsWith('/services') ? 'text-[#1266E8] font-semibold' : ''
                }`}
                aria-expanded={activeMegaMenu === 'services'}
                aria-haspopup="true"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                    activeMegaMenu === 'services' ? 'rotate-180 text-[#1266E8]' : ''
                  }`}
                />
              </button>

              {/* Services Mega Menu Dropdown — Clamped inside viewport */}
              {activeMegaMenu === 'services' && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 pointer-events-auto before:absolute before:-top-4 before:-left-16 before:-right-16 before:h-8 before:content-['']"
                  role="menu"
                >
                  <div className="w-[920px] xl:w-[1040px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-5 xl:p-6 whitespace-normal animate-in fade-in zoom-in-95 duration-150">
                    <div className="grid grid-cols-3 gap-5 xl:gap-6">
                      {/* Column 1: Experiences */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 px-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#1266E8]" /> Digital Experiences
                        </div>
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => handleLinkClick('/services/web-development')}
                            className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                              Web Development
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                              Flagship corporate websites &amp; web apps
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLinkClick('/services/ecommerce')}
                            className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                              E-commerce Development
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                              Storefronts, checkout &amp; inventory sync
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLinkClick('/services/ui-ux-design')}
                            className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                              UI/UX Design Systems
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                              User research &amp; accessible prototypes
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Column 2: Software & AI */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 px-2">
                          <Code2 className="w-3.5 h-3.5 text-indigo-600" /> Software &amp; Intelligence
                        </div>
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => handleLinkClick('/services/custom-software')}
                            className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                              Custom Software
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                              Business portals &amp; workflow systems
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLinkClick('/services/mobile-apps')}
                            className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                              Mobile App Engineering
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                              Cross-platform &amp; progressive web apps
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLinkClick('/services/ai-machine-learning')}
                            className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                              AI &amp; Machine Learning
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                              Private RAG &amp; document assistants
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLinkClick('/services/data-analytics')}
                            className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                              Data Analytics &amp; BI
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                              Telemetry pipelines &amp; KPI dashboards
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Column 3: Cloud, Security & Growth */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 px-2">
                          <Cloud className="w-3.5 h-3.5 text-emerald-600" /> Cloud, Security &amp; Growth
                        </div>
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => handleLinkClick('/services/cloud-devops')}
                            className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                              Cloud &amp; DevOps
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                              AWS, Azure, Docker &amp; CI/CD automation
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLinkClick('/services/cybersecurity')}
                            className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                              Cybersecurity Hardening
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                              Defensive audits &amp; secure coding
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLinkClick('/services/digital-marketing')}
                            className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                              Digital Marketing &amp; SEO
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                              Technical SEO &amp; search rankings
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLinkClick('/services/training')}
                            className="block text-left w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                              Technical Training
                            </div>
                            <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                              Engineering labs &amp; team upskilling
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-2">
                      <span>13 Specialized Technical Practices</span>
                      <button
                        type="button"
                        onClick={() => handleLinkClick('/services')}
                        className="text-[#1266E8] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        View All Services Directory <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions with Mega Menu */}
            <div
              className="py-1"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleLinkClick('/solutions')}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveMegaMenu('solutions');
                  }
                }}
                className={`flex items-center gap-1 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1266E8] rounded-md px-1 py-0.5 ${
                  currentRoute === '/solutions' ? 'text-[#1266E8] font-semibold' : ''
                }`}
                aria-expanded={activeMegaMenu === 'solutions'}
                aria-haspopup="true"
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                    activeMegaMenu === 'solutions' ? 'rotate-180 text-[#1266E8]' : ''
                  }`}
                />
              </button>

              {/* Solutions Dropdown — Clamped inside viewport */}
              {activeMegaMenu === 'solutions' && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 pointer-events-auto before:absolute before:-top-4 before:-left-20 before:-right-20 before:h-8 before:content-['']"
                  role="menu"
                >
                  <div className="w-[580px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-5 xl:p-6 whitespace-normal animate-in fade-in zoom-in-95 duration-150">
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleLinkClick('/solutions')}
                        className="block text-left p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                          Business Process Automation
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Replace manual spreadsheets and email approval friction.
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLinkClick('/solutions')}
                        className="block text-left p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                          AI Knowledge &amp; Document Search
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Private enterprise RAG assistants with verifiable citations.
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLinkClick('/solutions')}
                        className="block text-left p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                          Custom Business Dashboards
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Real-time revenue, telemetry, and KPI data integration.
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLinkClick('/solutions')}
                        className="block text-left p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8]">
                          Cloud Modernization &amp; Migration
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          AWS &amp; Azure topologies with zero-downtime CI/CD.
                        </div>
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-1">
                      <span>Engineered around practical business challenges</span>
                      <button
                        type="button"
                        onClick={() => handleLinkClick('/solutions')}
                        className="text-[#1266E8] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Explore Solutions Directory <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleLinkClick('/training')}
              className={`hover:text-slate-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1266E8] rounded-md px-1 py-0.5 ${
                currentRoute === '/training' || currentRoute === '/courses'
                  ? 'text-[#1266E8] font-semibold'
                  : ''
              }`}
            >
              <span>Training</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold leading-none">
                NEW
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('/industries')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1266E8] rounded-md px-1 py-0.5 ${
                currentRoute === '/industries' ? 'text-[#1266E8] font-semibold' : ''
              }`}
            >
              Industries
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('/portfolio')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1266E8] rounded-md px-1 py-0.5 ${
                currentRoute === '/portfolio' ? 'text-[#1266E8] font-semibold' : ''
              }`}
            >
              Portfolio
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('/technology')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1266E8] rounded-md px-1 py-0.5 ${
                currentRoute === '/technology' ? 'text-[#1266E8] font-semibold' : ''
              }`}
            >
              Technology
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('/insights')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1266E8] rounded-md px-1 py-0.5 ${
                currentRoute.startsWith('/insights') ? 'text-[#1266E8] font-semibold' : ''
              }`}
            >
              Insights
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('/about')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1266E8] rounded-md px-1 py-0.5 ${
                currentRoute === '/about' ? 'text-[#1266E8] font-semibold' : ''
              }`}
            >
              About
            </button>
          </nav>

          {/* Zone 3: Action Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0">
            {/* AI Advisor Chatbot Trigger — Unified Soft Pastel Secondary Button */}
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('iamtechni:open-chat'));
              }}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:text-[#2563EB] bg-gradient-to-r from-[#EEF4FF]/95 via-[#F5F9FF]/95 to-[#ECFEFF]/90 hover:from-white hover:to-[#F0F9FF] transition-all py-2 px-3 rounded-lg border border-[#DBEAFE]/90 shadow-[0_2px_10px_rgba(37,99,235,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] whitespace-nowrap cursor-pointer active:scale-[0.98] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              title="Chat with IAMTECHNI AI Solutions Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span>AI Advisor</span>
            </button>

            {/* Direct Phone Call Button — Unified Soft Secondary Button */}
            <a
              href={COMPANY_CONTACT.phoneTel}
              className="hidden lg:inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:text-[#2563EB] bg-white hover:bg-[#F5F8FC] transition-all py-2 px-3 rounded-lg border border-[#DBEAFE]/90 shadow-2xs whitespace-nowrap active:scale-[0.98] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              title={`Call ${COMPANY_CONTACT.phone}`}
              aria-label={`Call ${COMPANY_CONTACT.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden xl:inline">{COMPANY_CONTACT.phone}</span>
            </a>

            {/* Start a Project CTA Button — Matching Hero Primary Button Layout & Lighter/Softer Hover */}
            <button
              type="button"
              onClick={onStartProject}
              aria-label="Start a Project"
              title="Start a Project"
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 min-h-[44px] lg:min-h-[38px] rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-xs sm:text-[13px] shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] whitespace-nowrap cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <span className="hidden min-[380px]:inline">Start a Project</span>
              <span className="min-[380px]:hidden">Start</span>
              <ArrowRight className="w-3.5 h-3.5 text-white shrink-0" />
            </button>

            {/* Accessible Mobile Menu Hamburger Toggle (Below 1024px) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-slate-700 hover:text-slate-900 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1266E8]"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-panel"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-800" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Full-Height Slide-In Mobile & Tablet Navigation Panel (<1024px) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 lg:hidden flex justify-end"
          style={{ top: `${headerHeight}px` }}
        >
          {/* Tap-outside Backdrop Overlay */}
          <div
            aria-hidden="true"
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-x-0 bottom-0 bg-slate-900/35 backdrop-blur-xs animate-in fade-in duration-200"
            style={{ top: `${headerHeight}px` }}
          />

          {/* Slide-In Drawer Panel */}
          <div
            id="mobile-navigation-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="relative z-10 w-full sm:w-[400px] h-full bg-white flex flex-col justify-between overflow-hidden border-t sm:border-l border-slate-200 shadow-2xl animate-in slide-in-from-right duration-200"
          >
            {/* Scrollable Navigation Links Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 divide-y divide-slate-100">
              {/* Header Status & Quick Close */}
              <div className="pb-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-mono uppercase tracking-wider font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#1266E8] animate-pulse" />
                  <span>IAMTECHNI Navigation</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-h-[44px] px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>

              {/* Vertical Primary Navigation Items (All >=44px tall) */}
              <div className="py-2 space-y-1">
                {/* 1. Services Accordion */}
                <div
                  className={`rounded-xl border transition-all ${
                    isServicesOpen
                      ? 'border-blue-200/90 bg-blue-50/30'
                      : 'border-transparent hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleLinkClick('/services')}
                      className={`flex-1 min-h-[44px] py-2.5 px-3.5 text-left text-base font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        currentRoute.startsWith('/services')
                          ? 'text-[#1266E8]'
                          : 'text-slate-900 hover:text-[#1266E8]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-[#1266E8]" />
                        <span>Services</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-normal pr-1">
                        Directory ↗
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsServicesOpen((prev) => !prev);
                      }}
                      className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-r-xl transition-colors cursor-pointer border-l border-slate-200/50"
                      aria-expanded={isServicesOpen}
                      aria-controls="mobile-services-submenu"
                      aria-label={
                        isServicesOpen ? 'Collapse Services submenu' : 'Expand Services submenu'
                      }
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ease-out ${
                          isServicesOpen ? 'rotate-180 text-[#1266E8]' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  </div>

                  {isServicesOpen && (
                    <div
                      id="mobile-services-submenu"
                      role="region"
                      aria-label="Services Submenu"
                      className="px-3 pt-2 pb-3 border-t border-blue-100/80 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
                    >
                      <button
                        type="button"
                        onClick={() => handleLinkClick('/services')}
                        className="w-full min-h-[44px] text-left py-2 px-3 rounded-lg text-xs font-bold text-[#1266E8] bg-blue-100/70 hover:bg-blue-100 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Code2 className="w-3.5 h-3.5" />
                          <span>All Services Directory (15 Practices)</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="pt-1 space-y-1 border-l-2 border-[#1266E8]/30 ml-2 pl-2.5">
                        {servicesList.map((service, idx) => {
                          const Icon = service.icon;
                          const isCurrent = currentRoute === service.route;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleLinkClick(service.route)}
                              className={`w-full min-h-[44px] text-left py-2 px-2.5 rounded-lg transition-colors group cursor-pointer block ${
                                isCurrent ? 'bg-blue-100/60 text-[#1266E8]' : 'hover:bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-3.5 h-3.5 text-[#1266E8] shrink-0" />
                                <span className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8] leading-snug">
                                  {service.title}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal pl-5">
                                {service.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Solutions Accordion */}
                <div
                  className={`rounded-xl border transition-all ${
                    isSolutionsOpen
                      ? 'border-blue-200/90 bg-blue-50/30'
                      : 'border-transparent hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleLinkClick('/solutions')}
                      className={`flex-1 min-h-[44px] py-2.5 px-3.5 text-left text-base font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        currentRoute === '/solutions'
                          ? 'text-[#1266E8]'
                          : 'text-slate-900 hover:text-[#1266E8]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#1266E8]" />
                        <span>Solutions</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-normal pr-1">
                        Overview ↗
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSolutionsOpen((prev) => !prev);
                      }}
                      className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-r-xl transition-colors cursor-pointer border-l border-slate-200/50"
                      aria-expanded={isSolutionsOpen}
                      aria-controls="mobile-solutions-submenu"
                      aria-label={
                        isSolutionsOpen ? 'Collapse Solutions submenu' : 'Expand Solutions submenu'
                      }
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ease-out ${
                          isSolutionsOpen ? 'rotate-180 text-[#1266E8]' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  </div>

                  {isSolutionsOpen && (
                    <div
                      id="mobile-solutions-submenu"
                      role="region"
                      aria-label="Solutions Submenu"
                      className="px-3 pt-2 pb-3 border-t border-blue-100/80 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
                    >
                      <button
                        type="button"
                        onClick={() => handleLinkClick('/solutions')}
                        className="w-full min-h-[44px] text-left py-2 px-3 rounded-lg text-xs font-bold text-[#1266E8] bg-blue-100/70 hover:bg-blue-100 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5" />
                          <span>All Solutions &amp; Architectures Directory</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="pt-1 space-y-1 border-l-2 border-[#1266E8]/30 ml-2 pl-2.5">
                        {solutionsList.map((sol, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleLinkClick(sol.route)}
                            className="w-full min-h-[44px] text-left py-2 px-2.5 rounded-lg hover:bg-white transition-colors group cursor-pointer block"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-900 group-hover:text-[#1266E8] leading-snug">
                                {sol.title}
                              </span>
                              <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 shrink-0">
                                {sol.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                              {sol.desc}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Training */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/training')}
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    currentRoute === '/training' || currentRoute === '/courses'
                      ? 'text-[#1266E8] bg-blue-50/70 font-bold'
                      : 'text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>Training</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-bold">
                      NEW
                    </span>
                  </div>
                  {(currentRoute === '/training' || currentRoute === '/courses') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1266E8]" />
                  )}
                </button>

                {/* 4. Industries */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/industries')}
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    currentRoute === '/industries'
                      ? 'text-[#1266E8] bg-blue-50/70 font-bold'
                      : 'text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>Industries</span>
                  {currentRoute === '/industries' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1266E8]" />
                  )}
                </button>

                {/* 5. Portfolio */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/portfolio')}
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    currentRoute === '/portfolio'
                      ? 'text-[#1266E8] bg-blue-50/70 font-bold'
                      : 'text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>Portfolio</span>
                  {currentRoute === '/portfolio' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1266E8]" />
                  )}
                </button>

                {/* 6. Technology */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/technology')}
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    currentRoute === '/technology'
                      ? 'text-[#1266E8] bg-blue-50/70 font-bold'
                      : 'text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>Technology</span>
                  {currentRoute === '/technology' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1266E8]" />
                  )}
                </button>

                {/* 7. Insights */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/insights')}
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    currentRoute.startsWith('/insights')
                      ? 'text-[#1266E8] bg-blue-50/70 font-bold'
                      : 'text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>Insights</span>
                  {currentRoute.startsWith('/insights') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1266E8]" />
                  )}
                </button>

                {/* 8. About */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/about')}
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 rounded-xl text-base font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    currentRoute === '/about'
                      ? 'text-[#1266E8] bg-blue-50/70 font-bold'
                      : 'text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>About</span>
                  {currentRoute === '/about' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1266E8]" />
                  )}
                </button>
              </div>
            </div>

            {/* Pinned Bottom Actions: AI Advisor, Phone (+91-7418120053), and Start a Project */}
            <div className="p-4 sm:px-6 bg-slate-50/90 border-t border-slate-200/80 space-y-2.5 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                {/* AI Advisor Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.dispatchEvent(new CustomEvent('iamtechni:open-chat'));
                  }}
                  className="min-h-[44px] px-3 py-2 text-xs font-semibold text-[#0F52BA] bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center gap-1.5 border border-blue-200/90 shadow-2xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#1266E8] shrink-0" />
                  <span>AI Advisor</span>
                </button>

                {/* Direct Phone Button */}
                <a
                  href={COMPANY_CONTACT.phoneTel}
                  className="min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl flex items-center justify-center gap-1.5 border border-slate-200/90 shadow-2xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{COMPANY_CONTACT.phone}</span>
                </a>
              </div>

              {/* Start a Project Primary CTA */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onStartProject();
                }}
                className="w-full min-h-[46px] py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 active:scale-[0.98] rounded-lg flex items-center justify-center gap-2 shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.28)] transition-all duration-200 cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
