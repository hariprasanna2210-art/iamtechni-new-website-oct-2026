import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Code2,
  Cpu,
  ShoppingBag,
  Smartphone,
  Cloud,
  TrendingUp,
  Workflow,
  BarChart3,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Globe,
  Star,
  Activity,
  Layers,
  Search,
  ExternalLink,
} from 'lucide-react';
import { PageRoute } from '../../types';

interface ColorfulMultiServiceHeroProps {
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
}

interface HeroSlide {
  id: string;
  serviceTitle: string;
  category: string;
  serviceRoute: PageRoute;
  headline: string;
  headlineHighlight: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  colorTheme: {
    bgGradient: string;
    ambientGlow: string;
    kickerBg: string;
    kickerText: string;
    kickerBorder: string;
    accentGradient: string;
    buttonGradient: string;
    activeTabBg: string;
    isDark?: boolean;
  };
  icon: React.ComponentType<{ className?: string }>;
}

export const ColorfulMultiServiceHero: React.FC<ColorfulMultiServiceHeroProps> = ({
  onNavigate,
  onOpenProjectModal,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 6000; // 6 seconds per slide
  const PROGRESS_INTERVAL = 50; // update progress every 50ms

  // Touch swipe coordinates for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const slides: HeroSlide[] = [
    // -------------------------------------------------------------------------
    // SLIDE 1 — WEBSITE DESIGN & DEVELOPMENT
    // -------------------------------------------------------------------------
    {
      id: 'web-development',
      serviceTitle: 'Website Design & Development',
      category: 'Digital Experiences',
      serviceRoute: '/services/web-development',
      headline: 'Digital Experiences.',
      headlineHighlight: 'Engineered to Inspire.',
      description:
        'We design and develop modern, responsive websites and powerful web applications that turn your vision into a digital experience.',
      primaryCtaText: 'Explore Web Solutions',
      secondaryCtaText: 'Start Your Project',
      colorTheme: {
        bgGradient: 'from-[#F0F5FF] via-[#F8FAFF] to-[#FAF5FF]',
        ambientGlow: 'from-[#04C8E8]/20 via-[#1266E8]/15 to-[#5427D9]/20',
        kickerBg: 'bg-blue-50/90',
        kickerText: 'text-[#1266E8]',
        kickerBorder: 'border-blue-200/80',
        accentGradient: 'from-[#1266E8] via-[#04C8E8] to-[#5427D9]',
        buttonGradient: 'from-[#1266E8] via-[#0B5CD5] to-[#5427D9]',
        activeTabBg: 'bg-[#1266E8]',
        isDark: false,
      },
      icon: Code2,
    },

    // -------------------------------------------------------------------------
    // SLIDE 2 — ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
    // -------------------------------------------------------------------------
    {
      id: 'ai-machine-learning',
      serviceTitle: 'Artificial Intelligence & Machine Learning',
      category: 'Cognitive Computing',
      serviceRoute: '/services/ai-machine-learning',
      headline: 'Transform Intelligence',
      headlineHighlight: 'Into Innovation.',
      description:
        'Build smarter business solutions with artificial intelligence, machine learning, intelligent automation, and data-driven technology.',
      primaryCtaText: 'Discover AI Solutions',
      secondaryCtaText: 'Talk to Our Team',
      colorTheme: {
        bgGradient: 'from-[#070D1F] via-[#0B1533] to-[#120B2E]',
        ambientGlow: 'from-[#04C8E8]/25 via-[#5427D9]/30 to-[#E11D48]/20',
        kickerBg: 'bg-violet-950/80',
        kickerText: 'text-[#04C8E8]',
        kickerBorder: 'border-violet-700/60',
        accentGradient: 'from-[#04C8E8] via-[#818CF8] to-[#F43F5E]',
        buttonGradient: 'from-[#04C8E8] via-[#1266E8] to-[#7C3AED]',
        activeTabBg: 'bg-[#7C3AED]',
        isDark: true,
      },
      icon: Cpu,
    },

    // -------------------------------------------------------------------------
    // SLIDE 3 — E-COMMERCE SOLUTIONS
    // -------------------------------------------------------------------------
    {
      id: 'ecommerce',
      serviceTitle: 'E-commerce Solutions',
      category: 'Commerce Platforms',
      serviceRoute: '/services/ecommerce',
      headline: 'Build Your Digital Storefront',
      headlineHighlight: 'for Rapid Growth.',
      description:
        'Launch scalable online stores with beautiful product experiences, seamless shopping journeys, and modern commerce technology.',
      primaryCtaText: 'Explore E-commerce',
      secondaryCtaText: 'Build Your Store',
      colorTheme: {
        bgGradient: 'from-[#FFF7F2] via-[#FFF9F5] to-[#F5F3FF]',
        ambientGlow: 'from-[#FF6B4A]/15 via-[#F59E0B]/15 to-[#8B5CF6]/15',
        kickerBg: 'bg-orange-50/90',
        kickerText: 'text-[#EA580C]',
        kickerBorder: 'border-orange-200/80',
        accentGradient: 'from-[#EA580C] via-[#F59E0B] to-[#8B5CF6]',
        buttonGradient: 'from-[#EA580C] via-[#F97316] to-[#7C3AED]',
        activeTabBg: 'bg-[#EA580C]',
        isDark: false,
      },
      icon: ShoppingBag,
    },

    // -------------------------------------------------------------------------
    // SLIDE 4 — MOBILE APP DEVELOPMENT
    // -------------------------------------------------------------------------
    {
      id: 'mobile-apps',
      serviceTitle: 'Mobile App Development',
      category: 'Native & Cross-Platform',
      serviceRoute: '/services/mobile-apps',
      headline: 'Powerful Ideas.',
      headlineHighlight: 'Extraordinary Mobile Experiences.',
      description:
        'Turn your ideas into intuitive mobile applications designed for usability, performance, and business growth.',
      primaryCtaText: 'Explore Mobile Apps',
      secondaryCtaText: 'Discuss Your Idea',
      colorTheme: {
        bgGradient: 'from-[#F5F3FF] via-[#F8FAFF] to-[#EFF6FF]',
        ambientGlow: 'from-[#8B5CF6]/20 via-[#1266E8]/15 to-[#EC4899]/15',
        kickerBg: 'bg-purple-50/90',
        kickerText: 'text-[#7C3AED]',
        kickerBorder: 'border-purple-200/80',
        accentGradient: 'from-[#7C3AED] via-[#1266E8] to-[#EC4899]',
        buttonGradient: 'from-[#7C3AED] via-[#6366F1] to-[#06B6D4]',
        activeTabBg: 'bg-[#7C3AED]',
        isDark: false,
      },
      icon: Smartphone,
    },

    // -------------------------------------------------------------------------
    // SLIDE 5 — CLOUD COMPUTING & DEVOPS
    // -------------------------------------------------------------------------
    {
      id: 'cloud-devops',
      serviceTitle: 'Cloud Computing & DevOps',
      category: 'Infrastructure & Automation',
      serviceRoute: '/services/cloud-devops',
      headline: 'Scale Smarter.',
      headlineHighlight: 'Deploy Faster.',
      description:
        'Build reliable cloud infrastructure and streamline software delivery with modern cloud architecture, DevOps automation, and CI/CD pipelines.',
      primaryCtaText: 'Explore Cloud Solutions',
      secondaryCtaText: 'Plan Your Infrastructure',
      colorTheme: {
        bgGradient: 'from-[#F0FDFA] via-[#F0F9FF] to-[#EEF2FF]',
        ambientGlow: 'from-[#0D9488]/18 via-[#0284C7]/18 to-[#04C8E8]/18',
        kickerBg: 'bg-teal-50/90',
        kickerText: 'text-[#0D9488]',
        kickerBorder: 'border-teal-200/80',
        accentGradient: 'from-[#0284C7] via-[#0D9488] to-[#04C8E8]',
        buttonGradient: 'from-[#0284C7] via-[#0D9488] to-[#0B5CD5]',
        activeTabBg: 'bg-[#0D9488]',
        isDark: false,
      },
      icon: Cloud,
    },

    // -------------------------------------------------------------------------
    // SLIDE 6 — DIGITAL MARKETING & SEO
    // -------------------------------------------------------------------------
    {
      id: 'digital-marketing',
      serviceTitle: 'Digital Marketing & SEO',
      category: 'Growth & Visibility',
      serviceRoute: '/services/digital-marketing',
      headline: 'Make Your Brand',
      headlineHighlight: 'Impossible to Ignore.',
      description:
        'Strengthen your online presence through strategic digital marketing, search engine optimization, social media, and data-driven campaigns.',
      primaryCtaText: 'Explore Digital Growth',
      secondaryCtaText: 'Grow Your Business',
      colorTheme: {
        bgGradient: 'from-[#FFF7ED] via-[#FEF2F2] to-[#F5F3FF]',
        ambientGlow: 'from-[#EA580C]/18 via-[#F43F5E]/18 to-[#7C3AED]/18',
        kickerBg: 'bg-rose-50/90',
        kickerText: 'text-[#E11D48]',
        kickerBorder: 'border-rose-200/80',
        accentGradient: 'from-[#EA580C] via-[#F43F5E] to-[#7C3AED]',
        buttonGradient: 'from-[#EA580C] via-[#E11D48] to-[#2563EB]',
        activeTabBg: 'bg-[#EA580C]',
        isDark: false,
      },
      icon: TrendingUp,
    },

    // -------------------------------------------------------------------------
    // SLIDE 7 — CUSTOM SOFTWARE DEVELOPMENT
    // -------------------------------------------------------------------------
    {
      id: 'custom-software',
      serviceTitle: 'Custom Software Development',
      category: 'Enterprise Engineering',
      serviceRoute: '/services/custom-software',
      headline: 'Software Built Around',
      headlineHighlight: 'Your Business.',
      description:
        'Create tailored software solutions that simplify workflows, connect systems, and help your business operate more efficiently.',
      primaryCtaText: 'Explore Software Solutions',
      secondaryCtaText: 'Discuss Your Requirements',
      colorTheme: {
        bgGradient: 'from-[#EEF2FF] via-[#F5F3FF] to-[#F0FDFA]',
        ambientGlow: 'from-[#4338CA]/18 via-[#06B6D4]/18 to-[#0D9488]/18',
        kickerBg: 'bg-indigo-50/90',
        kickerText: 'text-[#4338CA]',
        kickerBorder: 'border-indigo-200/80',
        accentGradient: 'from-[#4338CA] via-[#06B6D4] to-[#0D9488]',
        buttonGradient: 'from-[#4338CA] via-[#6366F1] to-[#0D9488]',
        activeTabBg: 'bg-[#4338CA]',
        isDark: false,
      },
      icon: Workflow,
    },

    // -------------------------------------------------------------------------
    // SLIDE 8 — DATA ANALYTICS & BUSINESS INTELLIGENCE
    // -------------------------------------------------------------------------
    {
      id: 'data-analytics',
      serviceTitle: 'Data Analytics & Business Intelligence',
      category: 'Intelligence & Insights',
      serviceRoute: '/services/data-analytics',
      headline: 'Turn Data Into',
      headlineHighlight: 'Better Decisions.',
      description:
        'Unlock meaningful insights with modern analytics, interactive dashboards, and intelligent data visualization.',
      primaryCtaText: 'Explore Data Solutions',
      secondaryCtaText: 'Talk to Our Experts',
      colorTheme: {
        bgGradient: 'from-[#ECFDF5] via-[#F0FDF4] to-[#F0F9FF]',
        ambientGlow: 'from-[#059669]/18 via-[#06B6D4]/18 to-[#2563EB]/18',
        kickerBg: 'bg-emerald-50/90',
        kickerText: 'text-[#059669]',
        kickerBorder: 'border-emerald-200/80',
        accentGradient: 'from-[#059669] via-[#06B6D4] to-[#2563EB]',
        buttonGradient: 'from-[#059669] via-[#0284C7] to-[#1266E8]',
        activeTabBg: 'bg-[#059669]',
        isDark: false,
      },
      icon: BarChart3,
    },
  ];

  const current = slides[currentSlide];

  // Manual navigation handlers
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const selectSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  // Carousel timer loop
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNextSlide();
          return 0;
        }
        return prev + (PROGRESS_INTERVAL / SLIDE_DURATION) * 100;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, goToNextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNextSlide();
    } else if (distance < -minSwipeDistance) {
      goToPrevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Render Service-Specific Visual Component
  const renderVisual = () => {
    switch (current.id) {
      // -----------------------------------------------------------------------
      // VISUAL 1: WEBSITE DESIGN & DEVELOPMENT
      // Large realistic browser preview + floating mobile screen + metric chips
      // -----------------------------------------------------------------------
      case 'web-development':
        return (
          <div className="relative w-full max-w-xl mx-auto min-h-[280px] sm:aspect-[16/11] flex items-center justify-center p-2 sm:p-4">
            {/* Desktop Browser Window Mockup */}
            <div className="relative w-full rounded-2xl bg-white shadow-2xl border border-slate-200/90 overflow-hidden transform hover:-translate-y-1 transition-transform duration-500">
              {/* Browser Header Bar */}
              <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="px-4 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-500 flex items-center gap-2 max-w-[200px] truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>https://enterprise.iamtechni.com</span>
                </div>
                <div className="w-10" />
              </div>

              {/* Browser Content Canvas */}
              <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-50/50 to-white space-y-4">
                {/* Micro Navigation */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#1266E8] to-[#04C8E8]" />
                    <span className="text-xs font-bold text-slate-900">IAMTECHNI Studio</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
                    <span>Products</span>
                    <span>Solutions</span>
                    <span>Enterprise</span>
                  </div>
                </div>

                {/* Hero Showcase inside Mockup */}
                <div className="rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-4 text-white shadow-md relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl" />
                  <div className="relative z-10 space-y-1.5 max-w-[260px]">
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-white/20 text-cyan-200">
                      Sub-Second Performance
                    </span>
                    <div className="text-sm sm:text-base font-extrabold leading-tight">
                      Crafting Next-Gen Corporate Portals
                    </div>
                  </div>
                </div>

                {/* Grid of UI Cards */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-100 text-center">
                    <div className="text-xs font-extrabold text-[#1266E8]">100/100</div>
                    <div className="text-[10px] text-slate-500 font-medium">Core Vitals</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cyan-50/80 border border-cyan-100 text-center">
                    <div className="text-xs font-extrabold text-cyan-700">&lt; 0.7s</div>
                    <div className="text-[10px] text-slate-500 font-medium">LCP Metric</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-violet-50/80 border border-violet-100 text-center">
                    <div className="text-xs font-extrabold text-[#5427D9]">WCAG AA</div>
                    <div className="text-[10px] text-slate-500 font-medium">Accessible</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Floating Smartphone Mockup */}
            <div className="absolute -bottom-3 -right-2 sm:-right-4 w-32 sm:w-36 rounded-2xl bg-slate-900 p-1.5 shadow-2xl border-2 border-slate-700 hidden sm:block transform rotate-2 hover:rotate-0 transition-transform">
              <div className="w-full h-48 rounded-xl bg-white overflow-hidden p-2 text-slate-900 space-y-2">
                <div className="w-8 h-1 rounded-full bg-slate-200 mx-auto" />
                <div className="w-full h-14 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-2 text-white text-[9px] font-bold">
                  Responsive Web Apps
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-3/4 bg-slate-200 rounded" />
                  <div className="h-2 w-1/2 bg-slate-200 rounded" />
                </div>
                <div className="pt-2 flex justify-between items-center text-[8px] font-mono text-emerald-600 font-bold">
                  <span>60 FPS</span>
                  <span>100% Mobile Ready</span>
                </div>
              </div>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // VISUAL 2: ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
      // Holographic neural network, glowing data streams, AI inference
      // -----------------------------------------------------------------------
      case 'ai-machine-learning':
        return (
          <div className="relative w-full max-w-xl mx-auto min-h-[280px] sm:aspect-[16/11] flex items-center justify-center p-2 sm:p-4">
            <div className="relative w-full h-full rounded-2xl bg-[#090D1A]/90 border border-violet-800/60 shadow-2xl p-6 overflow-hidden flex flex-col justify-between text-white">
              {/* Background ambient neural grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:18px_18px] opacity-60" />

              {/* Neural Network SVG Composition */}
              <div className="relative z-10 flex-1 flex items-center justify-center">
                <svg viewBox="0 0 460 260" className="w-full h-full">
                  <defs>
                    <linearGradient id="ai-conduit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#04C8E8" />
                      <stop offset="50%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#F43F5E" />
                    </linearGradient>
                  </defs>

                  {/* Neural Interconnecting Lines */}
                  <g stroke="url(#ai-conduit-grad)" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
                    <line x1="70" y1="130" x2="160" y2="70" />
                    <line x1="70" y1="130" x2="160" y2="190" />
                    <line x1="160" y1="70" x2="260" y2="130" />
                    <line x1="160" y1="190" x2="260" y2="130" />
                    <line x1="260" y1="130" x2="360" y2="80" />
                    <line x1="260" y1="130" x2="360" y2="180" />
                    <line x1="160" y1="70" x2="160" y2="190" strokeDasharray="4 3" opacity="0.4" />
                    <line x1="360" y1="80" x2="360" y2="180" strokeDasharray="4 3" opacity="0.4" />
                  </g>

                  {/* Radiating concentric rings around central node */}
                  <circle cx="260" cy="130" r="42" stroke="#04C8E8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" className="animate-spin origin-center" />
                  <circle cx="260" cy="130" r="28" stroke="#7C3AED" strokeWidth="1.5" opacity="0.7" />

                  {/* Nodes */}
                  <circle cx="70" cy="130" r="10" fill="#04C8E8" />
                  <circle cx="70" cy="130" r="4" fill="#FFFFFF" />

                  <circle cx="160" cy="70" r="8" fill="#1266E8" />
                  <circle cx="160" cy="190" r="8" fill="#818CF8" />

                  <circle cx="260" cy="130" r="14" fill="#5427D9" />
                  <circle cx="260" cy="130" r="6" fill="#04C8E8" />

                  <circle cx="360" cy="80" r="8" fill="#F43F5E" />
                  <circle cx="360" cy="180" r="8" fill="#04C8E8" />
                </svg>
              </div>

              {/* Floating AI Status Badges */}
              <div className="relative z-10 grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-xl bg-violet-950/80 border border-violet-800/80 text-[11px] flex items-center justify-between">
                  <span className="text-violet-300 font-medium">Vector Precision</span>
                  <span className="text-cyan-400 font-mono font-bold">99.4% Recall</span>
                </div>
                <div className="p-2.5 rounded-xl bg-violet-950/80 border border-violet-800/80 text-[11px] flex items-center justify-between">
                  <span className="text-violet-300 font-medium">Latency Core</span>
                  <span className="text-emerald-400 font-mono font-bold">&lt; 120ms</span>
                </div>
              </div>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // VISUAL 3: E-COMMERCE SOLUTIONS
      // Storefront mockup, floating product cards, checkout conversion
      // -----------------------------------------------------------------------
      case 'ecommerce':
        return (
          <div className="relative w-full max-w-xl mx-auto min-h-[280px] sm:aspect-[16/11] flex items-center justify-center p-2 sm:p-4">
            <div className="relative w-full rounded-2xl bg-white shadow-2xl border border-orange-200/90 overflow-hidden p-4 sm:p-5 space-y-4">
              {/* Storefront Header */}
              <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs font-bold text-slate-900">AURA Commerce Engine</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-[11px] font-bold text-orange-700 border border-orange-200">
                  <Zap className="w-3 h-3 text-orange-500" /> +142% Conversion
                </div>
              </div>

              {/* Product Grid Mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2.5">
                  <div className="w-full h-24 rounded-lg bg-gradient-to-tr from-orange-400 via-rose-400 to-amber-300 flex items-center justify-center text-white shadow-inner">
                    <ShoppingBag className="w-8 h-8 opacity-90" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Premium Audio Pro Max</div>
                    <div className="text-[11px] text-slate-500">$299.00 • In Stock</div>
                  </div>
                  <button className="w-full py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center gap-1.5">
                    <span>1-Click Checkout</span>
                  </button>
                </div>

                {/* Live Checkout & Order Ingestion Card */}
                <div className="space-y-2.5 flex flex-col justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 space-y-1.5">
                    <div className="text-[11px] font-bold text-orange-900">Headless Architecture</div>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      Shopify Plus & custom Stripe API pipelines with sub-200ms page transitions.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-medium">Cart Abandonment</span>
                      <span className="text-emerald-700 font-bold font-mono">-38% Reduced</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-medium">Global Multi-Currency</span>
                      <span className="text-blue-700 font-bold font-mono">130+ Markets</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // VISUAL 4: MOBILE APP DEVELOPMENT
      // Multi-angle realistic smartphone mockups
      // -----------------------------------------------------------------------
      case 'mobile-apps':
        return (
          <div className="relative w-full max-w-xl mx-auto min-h-[280px] sm:aspect-[16/11] flex items-center justify-center p-2 sm:p-4">
            <div className="relative flex items-center justify-center gap-4 sm:gap-6">
              {/* Phone Mockup 1 (Primary Front Facing) */}
              <div className="w-44 sm:w-52 rounded-3xl bg-slate-900 p-2.5 shadow-2xl border-4 border-slate-800 z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-64 sm:h-72 rounded-2xl bg-white overflow-hidden p-3 flex flex-col justify-between text-slate-900">
                  {/* Dynamic Island Notch */}
                  <div className="w-16 h-3 rounded-full bg-slate-900 mx-auto" />

                  {/* App Screen Content */}
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-extrabold text-slate-900">Mobile Portfolio</div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#1266E8] text-white space-y-1">
                      <div className="text-[10px] opacity-80">Portfolio Balance</div>
                      <div className="text-sm font-extrabold font-mono">$48,290.40</div>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <div className="p-1.5 rounded-lg bg-slate-100 flex justify-between text-[10px]">
                        <span className="font-medium text-slate-700">Native Gestures</span>
                        <span className="text-purple-700 font-bold">120Hz</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-100 flex justify-between text-[10px]">
                        <span className="font-medium text-slate-700">Offline-First</span>
                        <span className="text-emerald-700 font-bold">SQLite Sync</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-slate-400 font-mono">
                    React Native & Swift / Kotlin
                  </div>
                </div>
              </div>

              {/* Phone Mockup 2 (Angled Behind) */}
              <div className="w-40 sm:w-48 rounded-3xl bg-slate-800 p-2 shadow-xl border-2 border-slate-700 transform rotate-6 hidden sm:block opacity-90">
                <div className="w-full h-60 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 p-3 text-white flex flex-col justify-between">
                  <div className="w-12 h-2 rounded-full bg-slate-700 mx-auto" />
                  <div className="space-y-2 text-center py-4">
                    <Smartphone className="w-8 h-8 text-cyan-400 mx-auto" />
                    <div className="text-xs font-bold text-white">App Store & Play Store</div>
                    <div className="text-[10px] text-cyan-300">100% Submission Pass Rate</div>
                  </div>
                  <div className="h-1 bg-slate-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // VISUAL 5: CLOUD COMPUTING & DEVOPS
      // Cloud nodes, Kubernetes topology, CI/CD automated pipeline
      // -----------------------------------------------------------------------
      case 'cloud-devops':
        return (
          <div className="relative w-full max-w-xl mx-auto min-h-[280px] sm:aspect-[16/11] flex items-center justify-center p-2 sm:p-4">
            <div className="relative w-full rounded-2xl bg-white shadow-2xl border border-teal-200/90 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-teal-100">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-slate-900">Kubernetes & Multi-Cloud Mesh</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-[11px] font-bold text-teal-700 border border-teal-200">
                  <CheckCircle2 className="w-3 h-3 text-teal-600" /> 99.99% SLA
                </div>
              </div>

              {/* Cloud Topology Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-center">
                  <div className="text-xs font-extrabold text-slate-800">AWS & Azure</div>
                  <div className="text-[10px] text-slate-500">Multi-Region AZ</div>
                  <div className="text-[10px] font-bold text-teal-700 font-mono">Zero Downtime</div>
                </div>
                <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1.5 text-center">
                  <div className="text-xs font-extrabold text-teal-900">Docker & K8s</div>
                  <div className="text-[10px] text-slate-600">Auto-Scaling Pods</div>
                  <div className="text-[10px] font-bold text-teal-800 font-mono">12 Nodes Live</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-center">
                  <div className="text-xs font-extrabold text-slate-800">Terraform IaC</div>
                  <div className="text-[10px] text-slate-500">Immutable Code</div>
                  <div className="text-[10px] font-bold text-blue-700 font-mono">Automated CI/CD</div>
                </div>
              </div>

              {/* Pipeline Track Visual */}
              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300">Pipeline Status:</span>
                  <span className="text-cyan-400 font-bold">ALL TESTS PASSED</span>
                </div>
                <span className="text-slate-500">Deploy: 2.4 min</span>
              </div>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // VISUAL 6: DIGITAL MARKETING & SEO
      // Upward-trending analytics, search rankings, traffic graphics
      // -----------------------------------------------------------------------
      case 'digital-marketing':
        return (
          <div className="relative w-full max-w-xl mx-auto min-h-[280px] sm:aspect-[16/11] flex items-center justify-center p-2 sm:p-4">
            <div className="relative w-full rounded-2xl bg-white shadow-2xl border border-orange-200/90 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-bold text-slate-900">Growth Telemetry & Organic Rank</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  +240% YoY Surge
                </span>
              </div>

              {/* Upward-Trending SVG Chart */}
              <div className="h-32 w-full bg-gradient-to-b from-orange-50/50 to-white rounded-xl p-2 relative flex items-end">
                <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="growth-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#EA580C" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Fill Under Curve */}
                  <path
                    d="M 10 100 Q 100 85 180 60 T 320 25 T 390 10 L 390 120 L 10 120 Z"
                    fill="url(#growth-fill)"
                  />
                  {/* Curve Line */}
                  <path
                    d="M 10 100 Q 100 85 180 60 T 320 25 T 390 10"
                    fill="none"
                    stroke="#EA580C"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Key Milestone Nodes */}
                  <circle cx="100" cy="85" r="4" fill="#EA580C" />
                  <circle cx="250" cy="40" r="4" fill="#EA580C" />
                  <circle cx="390" cy="10" r="6" fill="#F43F5E" />
                  <circle cx="390" cy="10" r="2" fill="#FFFFFF" />
                </svg>
              </div>

              {/* Metrics Highlights */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-extrabold text-orange-600">Top 3</div>
                  <div className="text-[10px] text-slate-500 font-medium">Target Keywords</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-extrabold text-rose-600">4.8x</div>
                  <div className="text-[10px] text-slate-500 font-medium">ROAS Average</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-extrabold text-purple-600">99.8%</div>
                  <div className="text-[10px] text-slate-500 font-medium">Indexation Rate</div>
                </div>
              </div>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // VISUAL 7: CUSTOM SOFTWARE DEVELOPMENT
      // Enterprise dashboard, workflow diagrams, connected systems
      // -----------------------------------------------------------------------
      case 'custom-software':
        return (
          <div className="relative w-full max-w-xl mx-auto min-h-[280px] sm:aspect-[16/11] flex items-center justify-center p-2 sm:p-4">
            <div className="relative w-full rounded-2xl bg-white shadow-2xl border border-indigo-200/90 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">Custom Enterprise Workflow Suite</span>
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  100% Code Ownership
                </span>
              </div>

              {/* 3 Step Workflow Diagram */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Stage 01</span>
                  <div className="text-xs font-bold text-slate-900">ERP Sync</div>
                  <div className="text-[10px] text-slate-500">Real-time ledger sync</div>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700">Stage 02</span>
                  <div className="text-xs font-bold text-indigo-900">Logic & RBAC</div>
                  <div className="text-[10px] text-indigo-700">Multi-role permissions</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Stage 03</span>
                  <div className="text-xs font-bold text-slate-900">API Gateway</div>
                  <div className="text-[10px] text-slate-500">Automated webhooks</div>
                </div>
              </div>

              {/* Codebase Quality Assurance Bar */}
              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300">Strict TypeScript:</span>
                  <span className="text-emerald-400 font-bold">ZERO RUNTIME ERRORS</span>
                </div>
                <span className="text-purple-300 font-bold">SOC-2 Type II</span>
              </div>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // VISUAL 8: DATA ANALYTICS & BUSINESS INTELLIGENCE
      // BI dashboard, floating charts, 3D data visualization
      // -----------------------------------------------------------------------
      case 'data-analytics':
        return (
          <div className="relative w-full max-w-xl mx-auto min-h-[280px] sm:aspect-[16/11] flex items-center justify-center p-2 sm:p-4">
            <div className="relative w-full rounded-2xl bg-white shadow-2xl border border-emerald-200/90 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Executive BI & Telemetry Engine</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Real-time Data
                </span>
              </div>

              {/* Multi-Dimensional Chart Mockup */}
              <div className="grid grid-cols-2 gap-3">
                {/* Bar Graph Preview */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700">Quarterly Velocity</div>
                  <div className="flex items-end justify-between h-20 pt-2 gap-2">
                    <div className="w-1/4 bg-emerald-300 rounded-t h-[40%]" />
                    <div className="w-1/4 bg-emerald-400 rounded-t h-[65%]" />
                    <div className="w-1/4 bg-emerald-500 rounded-t h-[80%]" />
                    <div className="w-1/4 bg-[#1266E8] rounded-t h-[100%]" />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>Q1</span>
                    <span>Q2</span>
                    <span>Q3</span>
                    <span>Q4 (+34%)</span>
                  </div>
                </div>

                {/* Insight Highlights */}
                <div className="space-y-2 flex flex-col justify-between">
                  <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                    <div className="text-[11px] font-bold text-emerald-900">Anomaly Detection</div>
                    <div className="text-[10px] text-slate-600">Continuous predictive audits over 1.2M rows/sec.</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 space-y-1">
                    <div className="text-[11px] font-bold text-blue-900">Decision Confidence</div>
                    <div className="text-[10px] text-slate-600 font-mono font-bold text-blue-700">99.8% Precision</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section
      className={`relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b ${current.colorTheme.bgGradient} transition-colors duration-700 border-b border-slate-200/80 min-h-[640px] sm:min-h-[700px] flex flex-col justify-between`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="IAMTECHNI Technology Services Showcase"
    >
      {/* Background Colorful Ambient Glows (Custom per Slide) */}
      <div
        className={`absolute top-0 left-1/4 w-[600px] h-[450px] bg-gradient-to-tr ${current.colorTheme.ambientGlow} rounded-full blur-[120px] pointer-events-none transition-all duration-700`}
      />
      <div
        className={`absolute bottom-10 right-10 w-[500px] h-[400px] bg-gradient-to-br ${current.colorTheme.ambientGlow} rounded-full blur-[100px] pointer-events-none transition-all duration-700`}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        {/* Main Grid: Alternate Layout on Even Slides for Visual Richness */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
            currentSlide % 2 === 1 ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* Left / Primary Text Column */}
          <div
            className={`space-y-6 ${
              currentSlide % 2 === 1 ? 'lg:col-span-6 lg:order-2' : 'lg:col-span-6 lg:order-1'
            }`}
          >
            {/* Category Kicker Badge */}
            <div className="flex items-center gap-3">
              <div
                className={`inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-2xl sm:rounded-full ${current.colorTheme.kickerBg} border ${current.colorTheme.kickerBorder} shadow-xs text-xs font-semibold ${current.colorTheme.kickerText} backdrop-blur-md transition-all max-w-full`}
              >
                <current.icon className="w-3.5 h-3.5 shrink-0" />
                <span className="font-bold">{current.serviceTitle}</span>
                <span className="opacity-40 hidden sm:inline">|</span>
                <span className="opacity-90">{current.category}</span>
              </div>
            </div>

            {/* Slide Headline */}
            <h1
              className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-balance transition-all ${
                current.colorTheme.isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {current.headline}{' '}
              <span
                className={`bg-gradient-to-r ${current.colorTheme.accentGradient} bg-clip-text text-transparent block sm:inline`}
              >
                {current.headlineHighlight}
              </span>
            </h1>

            {/* Slide Description */}
            <p
              className={`text-sm sm:text-lg leading-relaxed max-w-xl transition-colors ${
                current.colorTheme.isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {current.description}
            </p>

            {/* Action Buttons: Service Specific Primary + Secondary Contact */}
            <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate(current.serviceRoute)}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r ${current.colorTheme.buttonGradient} hover:opacity-95 rounded-xl transition-all shadow-md active:scale-[0.98] group`}
              >
                <span>{current.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              <button
                onClick={() => onOpenProjectModal(current.serviceTitle)}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl transition-all shadow-xs ${
                  current.colorTheme.isDark
                    ? 'bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-700'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90'
                }`}
              >
                <span>{current.secondaryCtaText}</span>
              </button>
            </div>

            {/* Trust Mini Indicators */}
            <div
              className={`pt-6 border-t flex flex-wrap items-center gap-6 text-xs font-medium ${
                current.colorTheme.isDark
                  ? 'border-slate-800 text-slate-400'
                  : 'border-slate-200/80 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Enterprise SLA Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1266E8]" />
                <span>100% Code Ownership</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Zero Technical Debt</span>
              </div>
            </div>
          </div>

          {/* Right / Visual Composition Column */}
          <div
            className={`relative ${
              currentSlide % 2 === 1 ? 'lg:col-span-6 lg:order-1' : 'lg:col-span-6 lg:order-2'
            }`}
          >
            {renderVisual()}
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* BOTTOM CAROUSEL NAVIGATION STRIP & PROGRESS CONTROLS (All 8 Services)   */}
      {/* ======================================================================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 8 Slide Service Tabs */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 flex-1">
            {slides.map((s, idx) => {
              const isActive = idx === currentSlide;
              const shortTitles = [
                'Web & Apps',
                'AI & ML',
                'E-commerce',
                'Mobile',
                'Cloud',
                'Marketing',
                'Custom SW',
                'Analytics',
              ];

              return (
                <button
                  key={s.id}
                  onClick={() => selectSlide(idx)}
                  className={`relative p-2 rounded-xl text-left transition-all overflow-hidden ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                  aria-label={`Slide ${idx + 1}: ${s.serviceTitle}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className={isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                      0{idx + 1}
                    </span>
                    <s.icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  <div className="text-[11px] font-bold truncate">{shortTitles[idx]}</div>

                  {/* Active Slide Filling Progress Bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#04C8E8] via-[#1266E8] to-[#5427D9] transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Carousel Arrows & Play / Pause Controls */}
          <div className="flex items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title={isPlaying ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
              aria-label={isPlaying ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={goToPrevSlide}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Previous Slide"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono font-bold text-slate-700 px-1">
              0{currentSlide + 1} / 08
            </span>

            <button
              onClick={goToNextSlide}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Next Slide"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
