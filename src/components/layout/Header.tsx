import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Award,
  Sparkles,
  Code2,
  Cloud,
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
    const timer = window.setTimeout(updateHeaderHeight, 220);
    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, [isScrolled]);

  // Track scroll state: navbar becomes slightly shorter after scrolling 80px
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => (prev ? y > 64 : y > 80));
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

  // Automatically close mobile menu when expanding to desktop viewport (>= 1100px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1100) {
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

  // Active route for the Gradient Pill Menu (defaults to highlighting Training NEW when on Home '/')
  const activeNavRoute = currentRoute === '/' ? '/training' : currentRoute;
  const isServicesActive = activeNavRoute.startsWith('/services');
  const isSolutionsActive = activeNavRoute === '/solutions';
  const isTrainingActive = activeNavRoute === '/training' || activeNavRoute === '/courses';
  const isIndustriesActive = activeNavRoute === '/industries';
  const isPortfolioActive = activeNavRoute === '/portfolio';
  const isTechnologyActive = activeNavRoute === '/technology';
  const isAboutActive = activeNavRoute === '/about';
  const isVerifyActive = activeNavRoute.startsWith('/verify');

  // Structured Services list for mobile submenu
  const servicesList = [
    {
      title: 'Website Design & Development',
      route: '/services/web-development' as PageRoute,
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
      route: '/services/ecommerce' as PageRoute,
      icon: ShoppingBag,
      desc: 'Custom storefronts, secure checkout & inventory sync',
    },
    {
      title: 'Custom Software Development',
      route: '/services/custom-software' as PageRoute,
      icon: Code2,
      desc: 'Tailored enterprise portals & operational workflow systems',
    },
    {
      title: 'Mobile App Engineering',
      route: '/services/mobile-apps' as PageRoute,
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
      route: '/services/ai-machine-learning' as PageRoute,
      icon: Sparkles,
      desc: 'Autonomous agent pipelines & enterprise LLM orchestration',
    },
    {
      title: 'Cloud Computing Infrastructure',
      route: '/services/cloud-devops' as PageRoute,
      icon: Cloud,
      desc: 'AWS & Azure multi-region cloud topologies',
    },
    {
      title: 'DevOps & CI/CD Automation',
      route: '/services/cloud-devops' as PageRoute,
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
      route: '/services/robotics' as PageRoute,
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

  const pillItemBase =
    'relative inline-flex items-center justify-center h-[32px] rounded-full !text-[14px] font-medium leading-none tracking-[-0.01em] whitespace-nowrap shrink-0 cursor-pointer transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1C35EA]';
  const pillItemActive =
    'bg-gradient-to-r from-[#1C35EA] to-[#4D19EA] text-white font-semibold shadow-[0_2px_10px_rgba(28,53,234,0.28)] px-3';
  const pillItemInactive =
    "px-1 text-[#14205A] hover:text-[#1C35EA] hover:bg-[#EEF4FF] after:content-[''] after:absolute after:bottom-1 after:left-1 after:right-1 after:h-[1.5px] after:rounded-full after:bg-[#1C35EA] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200";

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b border-[#14205A]/10 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(20,32,90,0.08)]'
            : 'bg-white/95 backdrop-blur-sm shadow-[0_2px_12px_rgba(20,32,90,0.08)]'
        }`}
      >
        {/* Main Navbar Row — Vertically Centred, Evenly Aligned & Spaced */}
        <div
          className={`relative w-full max-w-[82rem] mx-auto px-3 sm:px-5 min-[1100px]:px-3 min-[1200px]:px-6 xl:px-8 flex items-center justify-between gap-2 min-[1280px]:gap-[16px] whitespace-nowrap transition-all duration-200 ${
            isScrolled ? 'py-1.5' : 'py-2.5'
          }`}
        >
          {/* Zone 1: Brand Wordmark / Logo (40px height, #EEF4FF 10px radius 8px padding 2% scale-up hover, unchanged logo image) */}
          <div className="shrink-0 flex items-center h-[40px]">
            <button
              type="button"
              onClick={() => handleLinkClick('/')}
              className="relative h-[40px] p-[8px] rounded-[10px] bg-transparent hover:bg-[#EEF4FF] hover:scale-[1.02] transition-all duration-200 flex items-center justify-center text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1C35EA] cursor-pointer before:content-[''] before:absolute before:-inset-y-1 before:inset-x-0 before:rounded-[10px] before:bg-transparent hover:before:bg-[#EEF4FF] before:transition-colors before:duration-200 before:-z-10"
              aria-label="IAMTECHNI Home"
            >
              <IamtechniLogo size="md" />
            </button>
          </div>

          {/* Zone 2: Center Rounded White Pill Menu (7 items, 40px height, 14px spacing) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden min-[1100px]:flex items-center justify-center h-[40px] bg-white rounded-full border border-[#14205A]/12 shadow-[0_2px_10px_rgba(20,32,90,0.05)] px-2 min-[1200px]:px-3 gap-[6px] min-[1200px]:gap-[10px] min-[1280px]:gap-[14px] shrink-0"
          >
            {/* 1. Services (Dropdown) */}
            <div
              className="relative flex items-center h-[32px]"
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
                className={`${pillItemBase} gap-0.5 ${
                  isServicesActive ? pillItemActive : pillItemInactive
                }`}
                aria-expanded={activeMegaMenu === 'services'}
                aria-haspopup="true"
              >
                <span className="leading-none">Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 self-center transition-transform duration-150 ${
                    isServicesActive
                      ? 'text-white'
                      : activeMegaMenu === 'services'
                      ? 'rotate-180 text-[#1C35EA]'
                      : 'text-[#14205A]/70'
                  }`}
                />
              </button>

              {/* Services Mega Menu Dropdown — Unchanged Contents */}
              {activeMegaMenu === 'services' && (
                <div
                  className="fixed left-1/2 -translate-x-1/2 pt-3 z-50 pointer-events-auto before:absolute before:-top-4 before:-left-16 before:-right-16 before:h-8 before:content-['']"
                  style={{ top: `${headerHeight}px` }}
                  role="menu"
                >
                  <div className="w-[57.5rem] xl:w-[65rem] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-5 xl:p-6 whitespace-normal animate-in fade-in zoom-in-95 duration-150">
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
                      <div className="flex items-center gap-3">
                        <span>13 Specialized Technical Practices</span>
                        <span className="text-slate-300">·</span>
                        <button
                          type="button"
                          onClick={() => handleLinkClick('/locations')}
                          className="text-[#1266E8] font-semibold hover:underline cursor-pointer"
                        >
                          Locations We Serve →
                        </button>
                      </div>
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

            {/* 2. Solutions (Dropdown) */}
            <div
              className="relative flex items-center h-[32px]"
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
                className={`${pillItemBase} gap-0.5 ${
                  isSolutionsActive ? pillItemActive : pillItemInactive
                }`}
                aria-expanded={activeMegaMenu === 'solutions'}
                aria-haspopup="true"
              >
                <span className="leading-none">Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 self-center transition-transform duration-150 ${
                    isSolutionsActive
                      ? 'text-white'
                      : activeMegaMenu === 'solutions'
                      ? 'rotate-180 text-[#1C35EA]'
                      : 'text-[#14205A]/70'
                  }`}
                />
              </button>

              {/* Solutions Dropdown — Unchanged Contents */}
              {activeMegaMenu === 'solutions' && (
                <div
                  className="fixed left-1/2 -translate-x-1/2 pt-3 z-50 pointer-events-auto before:absolute before:-top-4 before:-left-20 before:-right-20 before:h-8 before:content-['']"
                  style={{ top: `${headerHeight}px` }}
                  role="menu"
                >
                  <div className="w-[36.25rem] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-5 xl:p-6 whitespace-normal animate-in fade-in zoom-in-95 duration-150">
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

            {/* 3. Training NEW (Active Gradient Pill) */}
            <button
              type="button"
              onClick={() => handleLinkClick('/training')}
              className={`${pillItemBase} ${pillItemActive} gap-1`}
            >
              <span className="leading-none">Training</span>
              <span className="inline-flex items-center justify-center text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold leading-none self-center bg-white/20 text-white border border-white/35">
                NEW
              </span>
            </button>

            {/* React & TypeScript Official Logo Badges (22px each, vertically centred between Training and Industries) */}
            <div
              aria-hidden="true"
              data-testid="navbar-react-ts-badges"
              className="inline-flex items-center gap-1 self-center shrink-0"
            >
              {/* React Official Atom Badge (22px) */}
              <span
                title="React"
                className="w-[22px] h-[22px] rounded-[6px] bg-[#20232A] border border-[#61DAFB]/35 inline-flex items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(20,32,90,0.12)]"
              >
                <svg
                  viewBox="-11.5 -10.23174 23 20.46348"
                  className="w-[15px] h-[15px]"
                  fill="none"
                >
                  <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
                  <g stroke="#61DAFB" strokeWidth="1.15" fill="none">
                    <ellipse rx="11" ry="4.2" />
                    <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                    <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                  </g>
                </svg>
              </span>

              {/* TypeScript Official Blue Square Badge (22px) */}
              <span
                title="TypeScript"
                className="w-[22px] h-[22px] rounded-[5px] bg-[#3178C6] inline-flex items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(20,32,90,0.12)]"
              >
                <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" fill="none">
                  <path
                    d="M5.2 11.2h6.8v1.9H9.6v7.1H7.5v-7.1H5.2v-1.9zm13.4 2.1c-.5-.4-1.2-.7-2-.7-.9 0-1.5.4-1.5 1 0 .7.5.9 1.7 1.4 1.7.6 2.6 1.4 2.6 2.8 0 1.7-1.4 2.7-3.4 2.7-1.2 0-2.3-.4-3-.9l.9-1.6c.6.5 1.4.8 2.1.8.9 0 1.4-.3 1.4-.9 0-.6-.4-.9-1.6-1.3-1.7-.6-2.7-1.3-2.7-2.8 0-1.6 1.3-2.7 3.4-2.7 1.1 0 2.1.3 2.8.8l-.7 1.4z"
                    fill="#FFFFFF"
                  />
                </svg>
              </span>
            </div>

            {/* 4. Industries */}
            <button
              type="button"
              onClick={() => handleLinkClick('/industries')}
              className={`${pillItemBase} ${
                isIndustriesActive ? pillItemActive : pillItemInactive
              }`}
            >
              Industries
            </button>

            {/* 5. Portfolio */}
            <button
              type="button"
              onClick={() => handleLinkClick('/portfolio')}
              className={`${pillItemBase} ${
                isPortfolioActive ? pillItemActive : pillItemInactive
              }`}
            >
              Portfolio
            </button>

            {/* 6. Technology */}
            <button
              type="button"
              onClick={() => handleLinkClick('/technology')}
              className={`${pillItemBase} ${
                isTechnologyActive ? pillItemActive : pillItemInactive
              }`}
            >
              Technology
            </button>

            {/* 7. About */}
            <button
              type="button"
              onClick={() => handleLinkClick('/about')}
              className={`${pillItemBase} ${
                isAboutActive ? pillItemActive : pillItemInactive
              }`}
            >
              About
            </button>

            {/* Hidden from navbar (pages & routes remain active): Insights, Job Finder Pro */}
          </nav>

          {/* Zone 3: Right-Side Action Buttons (Verify Certificate + Start a Project, all 40px height) */}
          {/* Hidden from navbar (functionality preserved): AI Advisor, Phone Call button, Admin link */}
          <div className="flex items-center gap-1.5 min-[1200px]:gap-2.5 h-[40px] shrink-0">
            {/* Verify Certificate Light Outline Button (40px height, desktop right side before Start a Project) */}
            <button
              type="button"
              onClick={() => handleLinkClick('/verify')}
              aria-label="Verify Certificate"
              title="Verify Certificate"
              className={`hidden min-[1100px]:inline-flex items-center justify-center gap-1.5 h-[40px] px-2.5 min-[1200px]:px-3.5 rounded-full border shadow-[0_1px_4px_rgba(20,32,90,0.05)] !text-[14px] font-semibold tracking-[-0.01em] transition-all duration-200 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1C35EA] ${
                isVerifyActive
                  ? 'bg-[#EEF4FF] text-[#1C35EA] border-[#1C35EA]/40'
                  : 'bg-white hover:bg-[#EEF4FF] text-[#14205A] hover:text-[#1C35EA] border-[#14205A]/18 hover:border-[#1C35EA]/35'
              }`}
            >
              <Award className="w-4 h-4 text-[#1C35EA] shrink-0" />
              <span>Verify Certificate</span>
            </button>

            {/* Start a Project CTA Button (40px height, visible at every width) */}
            <button
              type="button"
              onClick={onStartProject}
              aria-label="Start a Project"
              title="Start a Project"
              className="inline-flex items-center justify-center gap-1.5 h-[40px] px-2.5 min-[1200px]:px-3.5 rounded-full bg-gradient-to-r from-[#14205A] via-[#1C35EA] to-[#4D19EA] hover:from-[#1C35EA] hover:to-[#4D19EA] text-white font-semibold tracking-[-0.01em] !text-[14px] shadow-[0_2px_10px_rgba(28,53,234,0.22)] hover:shadow-[0_4px_14px_rgba(28,53,234,0.32)] transition-all duration-200 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1C35EA]"
            >
              <span className="hidden min-[400px]:inline">Start a Project</span>
              <span className="min-[400px]:hidden">Start</span>
              <ArrowRight className="w-3.5 h-3.5 text-white shrink-0" />
            </button>

            {/* Accessible Mobile & Tablet Hamburger Toggle (Below 1100px, 40px height) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="min-[1100px]:hidden h-[40px] w-[40px] p-2 flex items-center justify-center text-[#14205A] hover:text-[#1C35EA] rounded-full border border-[#14205A]/15 bg-white hover:bg-[#EEF4FF] transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1C35EA]"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-panel"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#14205A]" />
              ) : (
                <Menu className="w-5 h-5 text-[#14205A]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Full-Height Slide-In Mobile & Tablet Navigation Drawer (<1100px) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 min-[1100px]:hidden flex justify-end"
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
                <div className="flex items-center gap-2 text-[#14205A] font-mono uppercase tracking-wider font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#1C35EA] animate-pulse" />
                  <span>IAMTECHNI Navigation</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-h-[44px] px-3 py-1.5 inline-flex items-center gap-1.5 !text-[14px] font-medium text-[#14205A] bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>

              {/* Vertical Primary Navigation Items (All >=44px tall) */}
              <div className="py-2 space-y-1.5">
                {/* Verify Certificate (Top of Hamburger Menu on Mobile) */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/verify')}
                  className={`w-full min-h-[44px] py-2.5 px-3.5 rounded-full border !text-[14px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer mb-2 ${
                    isVerifyActive
                      ? 'bg-[#EEF4FF] text-[#1C35EA] border-[#1C35EA]/40'
                      : 'bg-white hover:bg-[#EEF4FF] text-[#14205A] hover:text-[#1C35EA] border-[#14205A]/18 hover:border-[#1C35EA]/35 shadow-2xs'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#1C35EA] shrink-0" />
                  <span>Verify Certificate</span>
                </button>

                {/* 1. Services Accordion */}
                <div
                  className={`rounded-xl border transition-all ${
                    isServicesOpen
                      ? 'border-[#1C35EA]/25 bg-[#1C35EA]/[0.03]'
                      : 'border-transparent hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleLinkClick('/services')}
                      className={`flex-1 min-h-[44px] py-2.5 px-3.5 text-left !text-[14px] font-semibold flex items-center justify-between transition-colors cursor-pointer rounded-l-xl ${
                        isServicesActive
                          ? 'bg-gradient-to-r from-[#1C35EA] to-[#4D19EA] text-white'
                          : 'text-[#14205A] hover:text-[#1C35EA]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Code2 className={`w-4 h-4 ${isServicesActive ? 'text-white' : 'text-[#1C35EA]'}`} />
                        <span>Services</span>
                      </span>
                      <span
                        className={`text-[11px] font-mono font-normal pr-1 inline-flex items-center gap-1 ${
                          isServicesActive ? 'text-white/85' : 'text-slate-400'
                        }`}
                      >
                        <span>Directory</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsServicesOpen((prev) => !prev);
                      }}
                      className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-[#14205A] hover:text-[#1C35EA] hover:bg-slate-200/60 rounded-r-xl transition-colors cursor-pointer border-l border-slate-200/50"
                      aria-expanded={isServicesOpen}
                      aria-controls="mobile-services-submenu"
                      aria-label={
                        isServicesOpen ? 'Collapse Services submenu' : 'Expand Services submenu'
                      }
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ease-out ${
                          isServicesOpen ? 'rotate-180 text-[#1C35EA]' : 'text-slate-400'
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
                        className="w-full min-h-[44px] text-left py-2 px-3 rounded-lg text-xs font-bold text-[#1C35EA] bg-blue-100/70 hover:bg-blue-100 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Code2 className="w-3.5 h-3.5" />
                          <span>All Services Directory (15 Practices)</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLinkClick('/locations')}
                        className="w-full min-h-[44px] text-left py-2 px-3 rounded-lg text-xs font-bold text-[#1C35EA] bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer border border-slate-200/80"
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-[#1C35EA]" />
                          <span>Locations We Serve (Puducherry, Chennai &amp; TN)</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="pt-1 space-y-1 border-l-2 border-[#1C35EA]/30 ml-2 pl-2.5">
                        {servicesList.map((service, idx) => {
                          const Icon = service.icon;
                          const isCurrent = currentRoute === service.route;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleLinkClick(service.route)}
                              className={`w-full min-h-[44px] text-left py-2 px-2.5 rounded-lg transition-colors group cursor-pointer block ${
                                isCurrent ? 'bg-blue-100/60 text-[#1C35EA]' : 'hover:bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-3.5 h-3.5 text-[#1C35EA] shrink-0" />
                                <span className="text-xs font-semibold text-[#14205A] group-hover:text-[#1C35EA] leading-snug">
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
                      ? 'border-[#1C35EA]/25 bg-[#1C35EA]/[0.03]'
                      : 'border-transparent hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleLinkClick('/solutions')}
                      className={`flex-1 min-h-[44px] py-2.5 px-3.5 text-left !text-[14px] font-semibold flex items-center justify-between transition-colors cursor-pointer rounded-l-xl ${
                        isSolutionsActive
                          ? 'bg-gradient-to-r from-[#1C35EA] to-[#4D19EA] text-white'
                          : 'text-[#14205A] hover:text-[#1C35EA]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Layers className={`w-4 h-4 ${isSolutionsActive ? 'text-white' : 'text-[#1C35EA]'}`} />
                        <span>Solutions</span>
                      </span>
                      <span
                        className={`text-[11px] font-mono font-normal pr-1 inline-flex items-center gap-1 ${
                          isSolutionsActive ? 'text-white/85' : 'text-slate-400'
                        }`}
                      >
                        <span>Overview</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSolutionsOpen((prev) => !prev);
                      }}
                      className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-[#14205A] hover:text-[#1C35EA] hover:bg-slate-200/60 rounded-r-xl transition-colors cursor-pointer border-l border-slate-200/50"
                      aria-expanded={isSolutionsOpen}
                      aria-controls="mobile-solutions-submenu"
                      aria-label={
                        isSolutionsOpen ? 'Collapse Solutions submenu' : 'Expand Solutions submenu'
                      }
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ease-out ${
                          isSolutionsOpen ? 'rotate-180 text-[#1C35EA]' : 'text-slate-400'
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
                        className="w-full min-h-[44px] text-left py-2 px-3 rounded-lg text-xs font-bold text-[#1C35EA] bg-blue-100/70 hover:bg-blue-100 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5" />
                          <span>All Solutions &amp; Architectures Directory</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="pt-1 space-y-1 border-l-2 border-[#1C35EA]/30 ml-2 pl-2.5">
                        {solutionsList.map((sol, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleLinkClick(sol.route)}
                            className="w-full min-h-[44px] text-left py-2 px-2.5 rounded-lg hover:bg-white transition-colors group cursor-pointer block"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-[#14205A] group-hover:text-[#1C35EA] leading-snug">
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
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 rounded-full !text-[14px] font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isTrainingActive
                      ? 'bg-gradient-to-r from-[#1C35EA] to-[#4D19EA] text-white shadow-[0_2px_10px_rgba(28,53,234,0.25)]'
                      : 'text-[#14205A] hover:text-[#1C35EA] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>Training</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                        isTrainingActive
                          ? 'bg-white/20 text-white border border-white/35'
                          : 'bg-[#00B0F0]/15 text-[#14205A] border border-[#00B0F0]/40'
                      }`}
                    >
                      NEW
                    </span>
                  </div>
                </button>

                {/* 4. Industries */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/industries')}
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 rounded-full !text-[14px] font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isIndustriesActive
                      ? 'bg-gradient-to-r from-[#1C35EA] to-[#4D19EA] text-white shadow-[0_2px_10px_rgba(28,53,234,0.25)]'
                      : 'text-[#14205A] hover:text-[#1C35EA] hover:bg-slate-50'
                  }`}
                >
                  <span>Industries</span>
                </button>

                {/* 5. Portfolio */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/portfolio')}
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 rounded-full !text-[14px] font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isPortfolioActive
                      ? 'bg-gradient-to-r from-[#1C35EA] to-[#4D19EA] text-white shadow-[0_2px_10px_rgba(28,53,234,0.25)]'
                      : 'text-[#14205A] hover:text-[#1C35EA] hover:bg-slate-50'
                  }`}
                >
                  <span>Portfolio</span>
                </button>

                {/* 6. Technology */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/technology')}
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 rounded-full !text-[14px] font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isTechnologyActive
                      ? 'bg-gradient-to-r from-[#1C35EA] to-[#4D19EA] text-white shadow-[0_2px_10px_rgba(28,53,234,0.25)]'
                      : 'text-[#14205A] hover:text-[#1C35EA] hover:bg-slate-50'
                  }`}
                >
                  <span>Technology</span>
                </button>

                {/* 7. About */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/about')}
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 rounded-full !text-[14px] font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isAboutActive
                      ? 'bg-gradient-to-r from-[#1C35EA] to-[#4D19EA] text-white shadow-[0_2px_10px_rgba(28,53,234,0.25)]'
                      : 'text-[#14205A] hover:text-[#1C35EA] hover:bg-slate-50'
                  }`}
                >
                  <span>About</span>
                </button>

                {/* Hidden from mobile menu (pages & routes remain active): Insights, Job Finder Pro, Admin */}
              </div>
            </div>

            {/* Pinned Bottom Action: Start a Project (AI Advisor and Phone hidden per navbar update) */}
            <div className="p-4 sm:px-6 pb-[max(1rem,env(safe-area-inset-bottom))] bg-slate-50/90 border-t border-slate-200/80 shrink-0">
              {/* Start a Project Primary CTA */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onStartProject();
                }}
                className="w-full min-h-[46px] py-2.5 !text-[14px] font-semibold text-white bg-gradient-to-r from-[#14205A] via-[#1C35EA] to-[#4D19EA] hover:from-[#1C35EA] hover:to-[#4D19EA] active:scale-[0.98] rounded-full flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(28,53,234,0.24)] hover:shadow-[0_4px_14px_rgba(28,53,234,0.32)] transition-all duration-200 cursor-pointer"
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
