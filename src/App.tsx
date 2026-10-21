import React, { useState, useEffect } from 'react';
import { PageRoute, ProjectItem } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProjectModal } from './components/common/ProjectModal';
import { CaseStudyModal } from './components/common/CaseStudyModal';
import { GeminiChatbot } from './components/chat/GeminiChatbot';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesDirectoryPage } from './pages/ServicesDirectoryPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { IndustryDetailPage } from './pages/IndustryDetailPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { CaseStudiesPage } from './pages/CaseStudiesPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { InsightsPage } from './pages/InsightsPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { FaqPage } from './pages/FaqPage';
import { LegalPage } from './pages/LegalPages';
import { TrainingPage } from './pages/TrainingPage';
import { SeoHead } from './components/common/SeoHead';

import { servicesData } from './data/servicesData';
import { insightsData } from './data/insightsData';
import { industriesData } from './data/industriesData';

export default function App() {
  // Normalize initial route from browser window pathname if valid
  const getInitialRoute = (): PageRoute => {
    const path = window.location.pathname as PageRoute;

    // Check dynamic path patterns
    if (
      path === '/' ||
      path === '/about' ||
      path === '/services' ||
      path.startsWith('/services/') ||
      path === '/industries' ||
      path.startsWith('/industries/') ||
      path === '/solutions' ||
      path === '/portfolio' ||
      path === '/case-studies' ||
      path.startsWith('/case-studies/') ||
      path === '/technology' ||
      path === '/insights' ||
      path.startsWith('/insights/') ||
      path === '/careers' ||
      path === '/contact' ||
      path === '/contact/consultation' ||
      path === '/faq' ||
      path === '/training' ||
      path === '/courses' ||
      path === '/privacy-policy' ||
      path === '/terms'
    ) {
      return path;
    }

    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getInitialRoute);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [modalDefaultService, setModalDefaultService] = useState('Web Development');
  const [activeCaseStudy, setActiveCaseStudy] = useState<ProjectItem | null>(null);

  // Sync route with browser history
  const navigate = (route: PageRoute) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to popstate (browser back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route-specific SEO metadata & JSON-LD structured data are managed by <SeoHead currentRoute={currentRoute} />

  const handleOpenProjectModal = (serviceName?: string) => {
    if (serviceName) setModalDefaultService(serviceName);
    setIsProjectModalOpen(true);
  };

  const handleOpenCaseStudy = (project: ProjectItem) => {
    setActiveCaseStudy(project);
  };

  // Helper to find specific service by slug with alias resolution
  const getServiceBySlug = (slug: string) => {
    const exact = servicesData.find((s) => s.slug === slug || s.id === slug);
    if (exact) return exact;

    // Check alias maps
    const aliasMap: Record<string, string> = {
      'website-development': 'web-development',
      'web-development': 'website-development',
      'ecommerce-development': 'ecommerce',
      'ecommerce': 'ecommerce-development',
      'custom-software-development': 'custom-software',
      'custom-software': 'custom-software-development',
      'mobile-app-development': 'mobile-apps',
      'mobile-apps': 'mobile-app-development',
      'cloud-computing': 'cloud-devops',
      'devops': 'cloud-devops',
      'cloud-devops': 'devops',
      'cloud-migration': 'cloud-devops',
      'robotics-emerging-tech': 'robotics',
      'robotics': 'robotics-emerging-tech',
      'seo': 'digital-marketing',
      'social-media-marketing': 'digital-marketing',
      'generative-ai': 'ai-machine-learning',
    };

    const targetSlug = aliasMap[slug];
    if (targetSlug) {
      return servicesData.find((s) => s.slug === targetSlug || s.id === targetSlug);
    }
    return undefined;
  };

  // Helper to find specific insight by slug
  const getInsightBySlug = (slug: string) => {
    return insightsData.find((a) => a.slug === slug);
  };

  // Helper to find specific industry by slug
  const getIndustryBySlug = (slug: string) => {
    return industriesData.find((i) => i.id === slug);
  };

  // Render Page by Route
  const renderPage = () => {
    // 1. Home
    if (currentRoute === '/') {
      return (
        <HomePage
          onNavigate={navigate}
          onOpenProjectModal={handleOpenProjectModal}
          onOpenCaseStudy={handleOpenCaseStudy}
        />
      );
    }

    // 2. About
    if (currentRoute === '/about') {
      return (
        <AboutPage
          onNavigate={navigate}
          onStartProject={() => handleOpenProjectModal('Enterprise Consultation')}
        />
      );
    }

    // 3. Services Directory
    if (currentRoute === '/services') {
      return (
        <ServicesDirectoryPage
          onNavigate={navigate}
          onStartProject={handleOpenProjectModal}
        />
      );
    }

    // 4. Individual Service Pages
    if (currentRoute.startsWith('/services/')) {
      const slug = currentRoute.replace('/services/', '');
      const service = getServiceBySlug(slug);
      if (service) {
        return (
          <ServiceDetailPage
            service={service}
            onNavigate={navigate}
            onStartProject={handleOpenProjectModal}
          />
        );
      }
      return (
        <ServicesDirectoryPage
          onNavigate={navigate}
          onStartProject={handleOpenProjectModal}
        />
      );
    }

    // 5. Industries Directory & Individual Industry
    if (currentRoute === '/industries') {
      return (
        <IndustriesPage
          onNavigate={navigate}
          onStartProject={handleOpenProjectModal}
        />
      );
    }

    if (currentRoute.startsWith('/industries/')) {
      const slug = currentRoute.replace('/industries/', '');
      const industry = getIndustryBySlug(slug);
      if (industry) {
        return (
          <IndustryDetailPage
            industry={industry}
            onNavigate={navigate}
            onStartProject={handleOpenProjectModal}
          />
        );
      }
      return (
        <IndustriesPage
          onNavigate={navigate}
          onStartProject={handleOpenProjectModal}
        />
      );
    }

    // 6. Solutions
    if (currentRoute === '/solutions') {
      return (
        <SolutionsPage
          onNavigate={navigate}
          onStartProject={handleOpenProjectModal}
        />
      );
    }

    // 7. Portfolio
    if (currentRoute === '/portfolio') {
      return (
        <PortfolioPage
          onNavigate={navigate}
          onOpenCaseStudy={handleOpenCaseStudy}
          onStartProject={handleOpenProjectModal}
        />
      );
    }

    // 8. Case Studies Directory & Details
    if (currentRoute === '/case-studies') {
      return (
        <CaseStudiesPage
          onNavigate={navigate}
          onStartProject={handleOpenProjectModal}
        />
      );
    }

    if (currentRoute.startsWith('/case-studies/')) {
      const slug = currentRoute.replace('/case-studies/', '');
      return (
        <CaseStudiesPage
          slug={slug}
          onNavigate={navigate}
          onStartProject={handleOpenProjectModal}
        />
      );
    }

    // 9. Technology Ecosystem
    if (currentRoute === '/technology') {
      return (
        <TechnologyPage
          onNavigate={navigate}
          onStartProject={handleOpenProjectModal}
        />
      );
    }

    // 10. Insights Directory
    if (currentRoute === '/insights') {
      return <InsightsPage onNavigate={navigate} />;
    }

    // 11. Individual Articles
    if (currentRoute.startsWith('/insights/')) {
      const slug = currentRoute.replace('/insights/', '');
      const article = getInsightBySlug(slug);
      if (article) {
        return (
          <ArticleDetailPage
            article={article}
            onNavigate={navigate}
            onStartProject={() => handleOpenProjectModal('Architecture Advisory')}
          />
        );
      }
      return <InsightsPage onNavigate={navigate} />;
    }

    // 12. Careers
    if (currentRoute === '/careers') {
      return <CareersPage onNavigate={navigate} />;
    }

    // 13. Contact & Consultation
    if (currentRoute === '/contact/consultation') {
      return <ConsultationPage onNavigate={navigate} />;
    }

    if (currentRoute === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    // 14. Training & Professional Courses
    if (
      currentRoute === '/training' ||
      currentRoute === '/courses' ||
      currentRoute === '/services/training'
    ) {
      return (
        <TrainingPage
          onNavigate={navigate}
          onOpenProjectModal={handleOpenProjectModal}
        />
      );
    }

    // 15. FAQ
    if (currentRoute === '/faq') {
      return <FaqPage onNavigate={navigate} onOpenProjectModal={handleOpenProjectModal} />;
    }

    // 15. Legal Policies
    if (currentRoute === '/privacy-policy') {
      return <LegalPage type="privacy" onNavigate={navigate} />;
    }

    if (currentRoute === '/terms') {
      return <LegalPage type="terms" onNavigate={navigate} />;
    }

    // Fallback 404
    return (
      <div className="py-24 text-center px-4 max-w-lg mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
        <h2 className="text-lg font-bold text-slate-700">Page Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested route does not exist in the IAMTECHNI directory.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#141A24] w-full overflow-x-clip">
      {/* Dynamic Per-Page Title, Meta Description, Canonical URL, OpenGraph & JSON-LD */}
      <SeoHead currentRoute={currentRoute} />

      {/* Top Global Navigation */}
      <Header
        currentRoute={currentRoute}
        onNavigate={navigate}
        onStartProject={() => handleOpenProjectModal()}
      />

      {/* Main Page Content Body */}
      <main className="flex-1 w-full overflow-x-clip">{renderPage()}</main>

      {/* Shared Global Footer */}
      <Footer
        onNavigate={navigate}
        onStartProject={() => handleOpenProjectModal()}
      />

      {/* Project Quotation / Scope Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        defaultService={modalDefaultService}
      />

      {/* Deep-Dive Case Study Modal */}
      {activeCaseStudy && (
        <CaseStudyModal
          project={activeCaseStudy}
          onClose={() => setActiveCaseStudy(null)}
          onNavigate={navigate}
          onStartProject={handleOpenProjectModal}
        />
      )}

      {/* IAMTECHNI Enterprise AI Chatbot powered by Gemini */}
      <GeminiChatbot
        onNavigate={navigate}
        onOpenProjectModal={handleOpenProjectModal}
      />
    </div>
  );
}
