import React, { useState, useEffect, useCallback } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { PageRoute, ProjectItem } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProjectModal } from './components/common/ProjectModal';
import { CaseStudyModal } from './components/common/CaseStudyModal';
import { GeminiChatbot } from './components/chat/GeminiChatbot';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesDirectoryPage } from './pages/ServicesDirectoryPage';
import { ServicePage } from './pages/ServicePage';
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
import {
  webDevelopmentSeoPage,
  ecommerceSeoPage,
  customSoftwareSeoPage,
  mobileAppsSeoPage,
  aiMachineLearningSeoPage,
  dataAnalyticsSeoPage,
  cloudDevopsSeoPage,
  cybersecuritySeoPage,
  digitalMarketingSeoPage,
  uiUxDesignSeoPage,
  itConsultingSeoPage,
  trainingSeoPage,
  roboticsSeoPage,
  getSeoServicePageBySlug,
} from './data/seo-pages';
import { insightsData } from './data/insightsData';
import { industriesData } from './data/industriesData';
import { LocationLandingPage } from './components/seo/LocationLandingPage';
import {
  ALL_LOCATION_PAGES,
  getLocationSeoPageBySlug,
} from './data/location-seo';

interface RoutePageWrapperProps {
  onNavigate: (route: PageRoute) => void;
  onStartProject: (serviceName?: string) => void;
}

const DynamicServiceRoute: React.FC<RoutePageWrapperProps> = ({
  onNavigate,
  onStartProject,
}) => {
  const { slug = '' } = useParams<{ slug: string }>();
  const canonicalSlug = getCanonicalServiceSlug(slug);

  if (canonicalSlug !== slug) {
    return <Navigate to={`/services/${canonicalSlug}`} replace />;
  }

  const seoPage = getSeoServicePageBySlug(canonicalSlug);
  const service = servicesData.find(
    (s) => s.slug === canonicalSlug || s.id === canonicalSlug
  );

  if (seoPage) {
    return (
      <ServicePage
        {...seoPage}
        service={service}
        onNavigate={onNavigate}
        onStartProject={onStartProject}
      />
    );
  }

  if (service) {
    return (
      <ServicePage
        slug={service.slug}
        seoTitle={`${service.title} Services | IAMTECHNI`}
        metaDescription={service.summary}
        h1={service.title}
        sections={[]}
        faqs={service.faqs}
        service={service}
        onNavigate={onNavigate}
        onStartProject={onStartProject}
      />
    );
  }

  return (
    <ServicesDirectoryPage
      onNavigate={onNavigate}
      onStartProject={onStartProject}
    />
  );
};

const DynamicIndustryRoute: React.FC<RoutePageWrapperProps> = ({
  onNavigate,
  onStartProject,
}) => {
  const { slug = '' } = useParams<{ slug: string }>();
  const industry = industriesData.find((i) => i.id === slug);
  if (industry) {
    return (
      <IndustryDetailPage
        industry={industry}
        onNavigate={onNavigate}
        onStartProject={onStartProject}
      />
    );
  }
  return <IndustriesPage onNavigate={onNavigate} onStartProject={onStartProject} />;
};

const DynamicSolutionRoute: React.FC<RoutePageWrapperProps> = ({
  onNavigate,
  onStartProject,
}) => {
  const { slug = '' } = useParams<{ slug: string }>();
  return (
    <SolutionsPage
      slug={slug}
      onNavigate={onNavigate}
      onStartProject={onStartProject}
    />
  );
};

const DynamicCaseStudyRoute: React.FC<RoutePageWrapperProps> = ({
  onNavigate,
  onStartProject,
}) => {
  const { slug = '' } = useParams<{ slug: string }>();
  return (
    <CaseStudiesPage
      slug={slug}
      onNavigate={onNavigate}
      onStartProject={onStartProject}
    />
  );
};

const DynamicArticleRoute: React.FC<RoutePageWrapperProps> = ({
  onNavigate,
  onStartProject,
}) => {
  const { slug = '' } = useParams<{ slug: string }>();
  const article = insightsData.find((a) => a.slug === slug);
  if (article) {
    return (
      <ArticleDetailPage
        article={article}
        onNavigate={onNavigate}
        onStartProject={() => onStartProject('Architecture Advisory')}
      />
    );
  }
  return <InsightsPage onNavigate={onNavigate} />;
};

const DynamicTrainingCourseRoute: React.FC<{
  onNavigate: (route: PageRoute) => void;
  onOpenProjectModal: (serviceName?: string) => void;
}> = ({ onNavigate, onOpenProjectModal }) => {
  const { slug = '' } = useParams<{ slug: string }>();
  return (
    <TrainingPage
      courseSlug={slug}
      onNavigate={onNavigate}
      onOpenProjectModal={onOpenProjectModal}
    />
  );
};

export default function App() {
  const location = useLocation();
  const routerNavigate = useNavigate();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [modalDefaultService, setModalDefaultService] = useState('Web Development');
  const [activeCaseStudy, setActiveCaseStudy] = useState<ProjectItem | null>(null);

  const normalizeRoute = useCallback((rawPath: string): PageRoute => {
    const cleanPath = (rawPath === '/' ? '/' : rawPath.replace(/\/+$/, '')) as PageRoute;
    if (cleanPath.startsWith('/services/')) {
      const slug = cleanPath.replace('/services/', '');
      const canonicalSlug = getCanonicalServiceSlug(slug);
      return `/services/${canonicalSlug}` as PageRoute;
    }
    const locPage = getLocationSeoPageBySlug(cleanPath);
    if (locPage) {
      return locPage.path as PageRoute;
    }
    return cleanPath;
  }, []);

  const currentRoute: PageRoute = normalizeRoute(location.pathname);

  // Dismiss branded preloader as soon as React has mounted
  useEffect(() => {
    const preloader = document.getElementById('iamtechni-preloader');
    if (preloader) {
      const winWithTimer = window as unknown as { __clearPreloaderFallbackTimer?: () => void };
      if (typeof winWithTimer.__clearPreloaderFallbackTimer === 'function') {
        winWithTimer.__clearPreloaderFallbackTimer();
      }
      preloader.classList.add('iamtechni-preloader-hidden');
      const timer = setTimeout(() => {
        if (preloader && preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  // Redirect any #services/xyz hash URL to /services/xyz
  useEffect(() => {
    const redirectHashService = () => {
      const hash = window.location.hash || location.hash || '';
      const match = hash.match(/#\/?services\/([^/?#]+)/i);
      if (match && match[1]) {
        const rawSlug = decodeURIComponent(match[1].trim());
        const canonicalSlug = getCanonicalServiceSlug(rawSlug);
        routerNavigate(`/services/${canonicalSlug}`, { replace: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    redirectHashService();
    window.addEventListener('hashchange', redirectHashService);
    return () => window.removeEventListener('hashchange', redirectHashService);
  }, [location.hash, routerNavigate]);

  // Navigate helper keeping all existing onNavigate(route) calls working
  const navigate = useCallback(
    (route: PageRoute) => {
      const strRoute = String(route || '/');
      const hashMatch = strRoute.match(/#\/?services\/([^/?#]+)/i);
      if (hashMatch && hashMatch[1]) {
        const canonicalSlug = getCanonicalServiceSlug(decodeURIComponent(hashMatch[1].trim()));
        routerNavigate(`/services/${canonicalSlug}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const canonicalRoute = normalizeRoute(strRoute);
      routerNavigate(canonicalRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [normalizeRoute, routerNavigate]
  );

  const handleOpenProjectModal = useCallback((serviceName?: string) => {
    if (serviceName) setModalDefaultService(serviceName);
    setIsProjectModalOpen(true);
  }, []);

  const handleOpenCaseStudy = useCallback((project: ProjectItem) => {
    setActiveCaseStudy(project);
  }, []);

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

      {/* Main Page Content Body via react-router-dom Routes */}
      <main className="flex-1 w-full overflow-x-clip">
        <Routes>
          {/* 1. Home */}
          <Route
            path="/"
            element={
              <HomePage
                onNavigate={navigate}
                onOpenProjectModal={handleOpenProjectModal}
                onOpenCaseStudy={handleOpenCaseStudy}
              />
            }
          />

          {/* 2. About */}
          <Route
            path="/about"
            element={
              <AboutPage
                onNavigate={navigate}
                onStartProject={() => handleOpenProjectModal('Enterprise Consultation')}
              />
            }
          />

          {/* 3. Services Directory */}
          <Route
            path="/services"
            element={
              <ServicesDirectoryPage
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />

          {/* 4. Explicit Route per Existing Service using ServicePage template */}
          <Route
            path="/services/web-development"
            element={
              <ServicePage
                {...webDevelopmentSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/ecommerce"
            element={
              <ServicePage
                {...ecommerceSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/custom-software"
            element={
              <ServicePage
                {...customSoftwareSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/mobile-apps"
            element={
              <ServicePage
                {...mobileAppsSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/ai-machine-learning"
            element={
              <ServicePage
                {...aiMachineLearningSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/data-analytics"
            element={
              <ServicePage
                {...dataAnalyticsSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/cloud-devops"
            element={
              <ServicePage
                {...cloudDevopsSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/cybersecurity"
            element={
              <ServicePage
                {...cybersecuritySeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/digital-marketing"
            element={
              <ServicePage
                {...digitalMarketingSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/ui-ux-design"
            element={
              <ServicePage
                {...uiUxDesignSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/it-consulting"
            element={
              <ServicePage
                {...itConsultingSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/training"
            element={
              <ServicePage
                {...trainingSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/services/robotics"
            element={
              <ServicePage
                {...roboticsSeoPage}
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />

          {/* Dynamic fallback & canonical redirect for service alias slugs */}
          <Route
            path="/services/:slug"
            element={
              <DynamicServiceRoute
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />

          {/* 5. Industries Directory & Individual Industry */}
          <Route
            path="/industries"
            element={
              <IndustriesPage
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/industries/:slug"
            element={
              <DynamicIndustryRoute
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />

          {/* 6. Solutions & Individual Solution Blueprints */}
          <Route
            path="/solutions"
            element={
              <SolutionsPage
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/solutions/:slug"
            element={
              <DynamicSolutionRoute
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />

          {/* 7. Portfolio */}
          <Route
            path="/portfolio"
            element={
              <PortfolioPage
                onNavigate={navigate}
                onOpenCaseStudy={handleOpenCaseStudy}
                onStartProject={handleOpenProjectModal}
              />
            }
          />

          {/* 8. Case Studies Directory & Details */}
          <Route
            path="/case-studies"
            element={
              <CaseStudiesPage
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/case-studies/:slug"
            element={
              <DynamicCaseStudyRoute
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />

          {/* 9. Technology Ecosystem */}
          <Route
            path="/technology"
            element={
              <TechnologyPage
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />

          {/* 10. Insights Directory & Individual Articles */}
          <Route
            path="/insights"
            element={<InsightsPage onNavigate={navigate} />}
          />
          <Route
            path="/insights/:slug"
            element={
              <DynamicArticleRoute
                onNavigate={navigate}
                onStartProject={handleOpenProjectModal}
              />
            }
          />

          {/* 11. Careers */}
          <Route
            path="/careers"
            element={<CareersPage onNavigate={navigate} />}
          />

          {/* 12. Contact & Consultation */}
          <Route
            path="/contact/consultation"
            element={<ConsultationPage onNavigate={navigate} />}
          />
          <Route
            path="/contact"
            element={<ContactPage onNavigate={navigate} />}
          />

          {/* 13. Training & Professional Courses */}
          <Route
            path="/training/:slug"
            element={
              <DynamicTrainingCourseRoute
                onNavigate={navigate}
                onOpenProjectModal={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/training"
            element={
              <TrainingPage
                onNavigate={navigate}
                onOpenProjectModal={handleOpenProjectModal}
              />
            }
          />
          <Route
            path="/courses"
            element={
              <TrainingPage
                onNavigate={navigate}
                onOpenProjectModal={handleOpenProjectModal}
              />
            }
          />

          {/* 14. FAQ */}
          <Route
            path="/faq"
            element={
              <FaqPage
                onNavigate={navigate}
                onOpenProjectModal={handleOpenProjectModal}
              />
            }
          />

          {/* 15. Legal Policies */}
          <Route
            path="/privacy-policy"
            element={<LegalPage type="privacy" onNavigate={navigate} />}
          />
          <Route
            path="/terms"
            element={<LegalPage type="terms" onNavigate={navigate} />}
          />

          {/* 16. Location-Based Landing Pages (Batch 1 & 2: Routes 1–20) */}
          {ALL_LOCATION_PAGES.map((locPage) => (
            <React.Fragment key={locPage.slug}>
              <Route
                path={`/${locPage.slug}/`}
                element={
                  <LocationLandingPage
                    page={locPage}
                    onNavigate={navigate}
                    onStartProject={handleOpenProjectModal}
                  />
                }
              />
              <Route
                path={`/${locPage.slug}`}
                element={
                  <LocationLandingPage
                    page={locPage}
                    onNavigate={navigate}
                    onStartProject={handleOpenProjectModal}
                  />
                }
              />
            </React.Fragment>
          ))}

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
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
            }
          />
        </Routes>
      </main>

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
