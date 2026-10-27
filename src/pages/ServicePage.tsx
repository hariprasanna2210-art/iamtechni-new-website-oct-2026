import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Compass,
} from 'lucide-react';
import { PageRoute, ServiceItem } from '../types';
import { ServicePageData } from '../data/seo-pages/types';
import { servicesData, getCanonicalServiceSlug } from '../data/servicesData';
import { COMPANY_CONTACT } from '../data/companyInfo';
import { SCHEMA_TELEPHONE } from '../constants/contact';
import { PageHero } from '../components/common/PageHero';
import { getCardColorToken } from '../utils/cardColorTokens';
import { ServiceVisualDispatcher } from '../components/common/ServiceVisualMockups';
import { MobileSectionSkeletonWrapper } from '../components/common/MobileSectionSkeleton';

export interface ServicePageProps extends ServicePageData {
  service?: ServiceItem;
  onNavigate?: (route: PageRoute) => void;
  onStartProject?: (serviceName?: string) => void;
}

const BASE_URL = 'https://www.iamtechni.in';

export const ServicePage: React.FC<ServicePageProps> = ({
  slug,
  seoTitle,
  metaDescription,
  h1,
  sections,
  faqs,
  service: serviceProp,
  onNavigate,
  onStartProject,
}) => {
  const routerNavigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const canonicalSlug = getCanonicalServiceSlug(slug);
  const service =
    serviceProp ||
    servicesData.find((s) => s.slug === canonicalSlug || s.id === canonicalSlug);

  const canonicalUrl = `${BASE_URL}/services/${canonicalSlug}`;

  const handleNavigate = (route: PageRoute) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      routerNavigate(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartProject = (serviceName?: string) => {
    if (onStartProject) {
      onStartProject(serviceName || h1);
    } else {
      handleNavigate('/contact');
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  // Remove initial static meta/canonical tags once react-helmet-async mounts its managed tags
  useEffect(() => {
    const selectors = [
      'meta[name="description"]',
      'link[rel="canonical"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:url"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'meta[name="twitter:url"]',
    ];
    for (const sel of selectors) {
      if (document.head.querySelector(`${sel}[data-rh]`)) {
        document.head
          .querySelectorAll(`${sel}:not([data-rh])`)
          .forEach((el) => el.remove());
      }
    }
  }, [canonicalSlug]);

  // 1. Service JSON-LD Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonicalUrl}#service`,
    name: h1,
    serviceType: service?.category || h1,
    description: metaDescription,
    url: canonicalUrl,
    provider: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: COMPANY_CONTACT.name,
      telephone: SCHEMA_TELEPHONE,
      email: COMPANY_CONTACT.email,
      url: `${BASE_URL}/`,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Puducherry' },
      { '@type': 'AdministrativeArea', name: 'Tamil Nadu' },
      { '@type': 'Country', name: 'India' },
    ],
  };

  // 2. BreadcrumbList JSON-LD Schema (Home > Services > Page)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${BASE_URL}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: h1,
        item: canonicalUrl,
      },
    ],
  };

  // 3. FAQPage JSON-LD Schema built from the faqs array
  const faqSchema =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <div className="w-full">
      <Helmet prioritizeSeoTags>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:url" content={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>

      {/* ========================================================================= */}
      {/* UNIFIED PAGE HERO COMPONENT (Single H1 & Color-Coordinated Accents)       */}
      {/* ========================================================================= */}
      <PageHero
        breadcrumbItems={[
          { label: 'Services', route: '/services' },
          { label: h1 },
        ]}
        onNavigate={handleNavigate}
        kicker="IAMTECHNI PRACTICE"
        category={service?.category || 'Engineering'}
        title={h1}
        tagline={service?.tagline}
        description={service?.summary || metaDescription}
        primaryCtaText={`Discuss Your ${service?.title || h1} Project`}
        onPrimaryCta={() => handleStartProject(service?.title || h1)}
        secondaryCtaText="Explore Other Services"
        onSecondaryCta={() => handleNavigate('/services')}
        slug={canonicalSlug}
      />

      {/* Problem Statement Section with Rich Service Visual Mockup */}
      {service && (
        <MobileSectionSkeletonWrapper variant="split-detail" sectionIndex={0}>
          <section className="py-10 sm:py-16 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF] border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
                {/* Left Column: Problem Statement Narrative */}
                <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-9 shadow-2xs space-y-3 sm:space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#2563EB]" />
                    <span>The Core Challenge</span>
                  </div>
                  <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-2xl font-bold text-[#1E3A8A] leading-snug drop-shadow-[0_2px_8px_rgba(30,58,138,0.08)]">
                    Why traditional approaches fail in {service.title}
                  </h2>
                  <p className="text-[13px] sm:text-base text-slate-600 leading-relaxed line-clamp-4 sm:line-clamp-none">
                    {service.problemStatement}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      IAMTECHNI Engineering Solution
                    </span>
                    <span>·</span>
                    <span className="text-[#2563EB] font-bold">100% Production Rigor</span>
                  </div>
                </div>

                {/* Right Column: Interactive Domain Visual Mockup */}
                <div className="lg:col-span-6 w-full">
                  <ServiceVisualDispatcher slug={service.slug} category={service.category} />
                </div>
              </div>
            </div>
          </section>
        </MobileSectionSkeletonWrapper>
      )}

      {/* Structured SEO Sections (H2 + Paragraphs from src/data/seo-pages/<slug>.ts) */}
      {sections && sections.length > 0 && (
        <section className="py-10 sm:py-16 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
              {sections.map((section, idx) => {
                const color = getCardColorToken(idx);
                return (
                  <div
                    key={idx}
                    className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-5 sm:p-8 ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 space-y-3`}
                  >
                    <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-[#1E3A8A] leading-snug">
                      {section.h2}
                    </h2>
                    <div className="space-y-2.5">
                      {section.paragraphs.map((paragraph, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[13px] sm:text-sm text-slate-600 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Capabilities Section with Distinct Colorful Cards */}
      {service && service.capabilities.length > 0 && (
        <MobileSectionSkeletonWrapper variant="cards-grid" sectionIndex={1}>
          <section className="py-10 sm:py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mb-7 sm:mb-14">
                <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold mb-1">
                  Engineering Disciplines
                </div>
                <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
                  Technical Capabilities &amp; Architecture
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2 leading-relaxed">
                  Our engineering team implements these capabilities with production rigor, automated testing, and comprehensive documentation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                {service.capabilities.map((cap, idx) => {
                  const color = getCardColorToken(idx);
                  return (
                    <div
                      key={idx}
                      className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-4 sm:p-7 ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200 flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}
                          >
                            CAPABILITY 0{idx + 1}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${color.dotBg}`} />
                        </div>
                        <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">
                          {cap.title}
                        </h3>
                        <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed mb-3.5 sm:mb-5 line-clamp-2 sm:line-clamp-none">
                          {cap.description}
                        </p>
                      </div>

                      <div className="space-y-2 sm:space-y-2.5 pt-3 sm:pt-3.5 border-t border-slate-200/60">
                        {cap.points.map((pt, pIdx) => (
                          <div
                            key={pIdx}
                            className={`${
                              pIdx >= 2 ? 'hidden sm:flex' : 'flex'
                            } items-start gap-2.5 text-[13px] sm:text-sm text-slate-700`}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${color.accentText} shrink-0 mt-0.5`} />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </MobileSectionSkeletonWrapper>
      )}

      {/* Illustrative Use Cases with Distinct Colorful Cards */}
      {service && service.useCases.length > 0 && (
        <MobileSectionSkeletonWrapper variant="cards-grid" sectionIndex={2}>
          <section className="py-10 sm:py-20 bg-[#F4F7FC] border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mb-7 sm:mb-12">
                <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
                  Real-World Application
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Representative Deployments &amp; Outcomes
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                {service.useCases.map((uc, i) => {
                  const color = getCardColorToken(i + 2);
                  return (
                    <div
                      key={i}
                      className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-4 sm:p-7 ${color.cardHoverBorder} ${color.cardHoverShadow} transition-all duration-200`}
                    >
                      <span
                        className={`text-[11px] font-mono px-2.5 py-0.5 rounded-md font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}
                      >
                        ILLUSTRATIVE SCENARIO
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2.5 sm:mt-3 mb-1.5 sm:mb-2">
                        {uc.title}
                      </h3>
                      <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed mb-3.5 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                        {uc.description}
                      </p>

                      <div className="bg-white/90 border border-slate-200/90 rounded-xl p-3 sm:p-4 text-[13px] sm:text-sm text-slate-800 font-medium shadow-2xs">
                        <span className={`font-bold ${color.accentText}`}>Measurable Outcome: </span>
                        {uc.outcome}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </MobileSectionSkeletonWrapper>
      )}

      {/* Delivery Process with Color Steps */}
      {service && service.deliverySteps.length > 0 && (
        <MobileSectionSkeletonWrapper variant="cards-grid" sectionIndex={3}>
          <section className="py-10 sm:py-20 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mb-7 sm:mb-12">
                <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
                  Phased Roadmap
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Delivery Workflow &amp; Governance
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2 leading-relaxed">
                  How we take your project from discovery through release and long-term maintenance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                {service.deliverySteps.map((step, idx) => {
                  const color = getCardColorToken(idx);
                  return (
                    <div
                      key={idx}
                      className={`${color.cardBg} ${color.cardBorder} border rounded-xl p-4 sm:p-5 flex flex-col justify-between ${color.cardHoverBorder} transition-all`}
                    >
                      <div>
                        <div className={`text-xs font-mono font-bold ${color.accentText} mb-1.5 sm:mb-2`}>
                          {step.phase}
                        </div>
                        <p className="text-[13px] sm:text-sm text-slate-700 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </MobileSectionSkeletonWrapper>
      )}

      {/* Related Technologies */}
      {service && service.technologies.length > 0 && (
        <MobileSectionSkeletonWrapper variant="split-detail" sectionIndex={4}>
          <section className="py-10 sm:py-16 bg-[#F5F8FC] border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#1266E8]" />
                <span>Supported Technologies &amp; Frameworks</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((tech, idx) => {
                  const color = getCardColorToken(idx);
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 ${color.cardBg} border ${color.cardBorder} rounded-lg text-xs font-mono font-medium text-slate-800 shadow-2xs`}
                    >
                      {tech}
                    </span>
                  );
                })}
              </div>
            </div>
          </section>
        </MobileSectionSkeletonWrapper>
      )}

      {/* Frequently Asked Questions (built from the faqs array) */}
      {faqs && faqs.length > 0 && (
        <MobileSectionSkeletonWrapper variant="faq-accordion" sectionIndex={5}>
          <section className="py-10 sm:py-20 bg-white border-b border-slate-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-7 sm:mb-12">
                <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold mb-1">
                  Common Questions
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full min-h-[48px] sm:min-h-[52px] px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-bold text-slate-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                          openFaqIndex === idx ? 'rotate-180 text-[#1266E8]' : ''
                        }`}
                      />
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-2 text-[13px] sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-[#FAFBFD]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </MobileSectionSkeletonWrapper>
      )}

      {/* Bottom CTA Banner */}
      <MobileSectionSkeletonWrapper variant="split-detail" sectionIndex={6}>
        <section className="py-10 sm:py-20 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#ECFEFF] border border-[#DBEAFE] rounded-2xl p-5 sm:p-12 text-center space-y-4 sm:space-y-5 shadow-[0_8px_30px_rgba(37,99,235,0.08)]">
              <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.015em] text-[#1E3A8A] drop-shadow-[0_2px_8px_rgba(30,58,138,0.10)]">
                Ready to build with IAMTECHNI?
              </h2>
              <p className="text-[13.5px] sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Schedule an exploratory engineering consultation to evaluate project scope, architecture, budget, and implementation timelines.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleStartProject(service?.title || h1)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white font-semibold text-sm shadow-xs hover:shadow-[0_4px_14px_rgba(30,58,138,0.24)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span>Discuss Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleNavigate('/contact')}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#F5F9FF] text-[#1E3A8A] hover:text-[#2563EB] font-semibold text-sm border border-[#DBEAFE] shadow-[0_2px_10px_rgba(37,99,235,0.06)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span>Contact Engineering</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </MobileSectionSkeletonWrapper>
    </div>
  );
};

export default ServicePage;
