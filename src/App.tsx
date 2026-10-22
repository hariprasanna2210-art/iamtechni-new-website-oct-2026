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

import { servicesData, getCanonicalServiceSlug } from './data/servicesData';
import { insightsData } from './data/insightsData';
import { industriesData } from './data/industriesData';

export default function App() {
  // Normalize route and redirect any duplicate/alias service slug to its canonical slug
  const normalizeRoute = (rawPath: string, replaceBrowserUrl = false): PageRoute => {
    const cleanPath = (rawPath === '/' ? '/' : rawPath.replace(/\/+$/, '')) as PageRoute;

    if (cleanPath.startsWith('/services/')) {
      const slug = cleanPath.replace('/services/', '');
      const canonicalSlug = getCanonicalServiceSlug(slug);
      const canonicalRoute = `/services/${canonicalSlug}` as PageRoute;
      if (replaceBrowserUrl && canonicalRoute !== rawPath && typeof window !== 'undefined') {
        window.history.replaceState({}, '', canonicalRoute);
      }
      return canonicalRoute;
    }

    if (
      cleanPath === '/' ||
      cleanPath === '/about' ||
      cleanPath === '/services' ||
      cleanPath === '/industries' ||
      cleanPath.startsWith('/industries/') ||
      cleanPath === '/solutions' ||
      cleanPath.startsWith('/solutions/') ||
      cleanPath === '/portfolio' ||
      cleanPath === '/case-studies' ||
      cleanPath.startsWith('/case-studies/') ||
      cleanPath === '/technology' ||
      cleanPath === '/insights' ||
      cleanPath.startsWith('/insights/') ||
      cleanPath === '/careers' ||
      cleanPath === '/contact' ||
      cleanPath === '/contact/consultation' ||
      cleanPath === '/faq' ||
      cleanPath === '/training' ||
      cleanPath.startsWith('/training/') ||
      cleanPath === '/courses' ||
      cleanPath === '/privacy-policy' ||
      cleanPath === '/terms'
    ) {
      return cleanPath;
    }

    return '/';
  };

  // Normalize initial route from browser window pathname if valid
  const getInitialRoute = (): PageRoute => {
    return normalizeRoute(window.location.pathname, true);
  };

  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getInitialRoute);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [modalDefaultService, setModalDefaultService] = useState('Web Development');
  const [activeCaseStudy, setActiveCaseStudy] = useState<ProjectItem | null>(null);

  // Sync route with browser history (redirecting any alias service route to its canonical route)
  const navigate = (route: PageRoute) => {
    const canonicalRoute = normalizeRoute(route, false);
    setCurrentRoute(canonicalRoute);
    window.history.pushState({}, '', canonicalRoute);
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

  // Helper to find specific service by slug with canonical alias resolution
  const getServiceBySlug = (slug: string) => {
    const canonicalSlug = getCanonicalServiceSlug(slug);
    return servicesData.find((s) => s.slug === canonicalSlug || s.id === canonicalSlug);
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

    // 6. Solutions & Individual Solution Blueprints
    if (currentRoute === '/solutions') {
      return (
        <SolutionsPage
          onNavigate={navigate}
          onStartProject={handleOpenProjectModal}
        />
      );
    }

    if (currentRoute.startsWith('/solutions/')) {
      const slug = currentRoute.replace('/solutions/', '');
      return (
        <SolutionsPage
          slug={slug}
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
    if (currentRoute.startsWith('/training/')) {
      const courseSlug = currentRoute.replace('/training/', '');
      return (
        <TrainingPage
          courseSlug={courseSlug}
          onNavigate={navigate}
          onOpenProjectModal={handleOpenProjectModal}
        />
      );
    }

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
