import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Award,
  Sparkles,
  ShieldCheck,
  Code2,
  Layers,
} from 'lucide-react';
import { PageRoute } from '../../types';
import { LocationSeoPageData } from '../../data/location-seo/types';
import { COMPANY_CONTACT } from '../../data/companyInfo';
import {
  PRIMARY_PHONE,
  PRIMARY_PHONE_LINK,
  SECONDARY_PHONE,
  SECONDARY_PHONE_LINK,
  WHATSAPP_LINK,
  SCHEMA_TELEPHONE,
} from '../../constants/contact';
import { getCardColorToken } from '../../utils/cardColorTokens';

export interface LocationLandingPageProps {
  page: LocationSeoPageData;
  onNavigate?: (route: PageRoute) => void;
  onStartProject?: (serviceName?: string) => void;
}

const BASE_URL = 'https://www.iamtechni.in';

export const LocationLandingPage: React.FC<LocationLandingPageProps> = ({
  page,
  onNavigate,
  onStartProject,
}) => {
  const routerNavigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
      onStartProject(serviceName || page.h1);
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
  }, [page.slug]);

  // 1. Primary schema (Service or Course)
  const primarySchema =
    page.schemaType === 'Course'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Course',
          '@id': `${page.canonicalUrl}#course`,
          name: page.h1,
          description: page.metaDescription,
          url: page.canonicalUrl,
          provider: {
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
            name: COMPANY_CONTACT.name,
            telephone: SCHEMA_TELEPHONE,
            email: COMPANY_CONTACT.email,
            url: `${BASE_URL}/`,
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${page.canonicalUrl}#service`,
          name: page.h1,
          serviceType: page.h1,
          description: page.metaDescription,
          url: page.canonicalUrl,
          provider: {
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
            name: COMPANY_CONTACT.name,
            telephone: SCHEMA_TELEPHONE,
            email: COMPANY_CONTACT.email,
            url: `${BASE_URL}/`,
          },
          areaServed: [
            { '@type': 'City', name: page.targetLocation.city },
            { '@type': 'AdministrativeArea', name: page.targetLocation.region },
            { '@type': 'AdministrativeArea', name: page.targetLocation.state },
            { '@type': 'Country', name: 'India' },
          ],
        };

  // 2. Breadcrumb schema
  const breadcrumbCategoryPath =
    page.category === 'Training' ? '/training' : '/services';
  const breadcrumbCategoryName =
    page.category === 'Training' ? 'Training & Courses' : 'Services';

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
        name: breadcrumbCategoryName,
        item: `${BASE_URL}${breadcrumbCategoryPath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.h1,
        item: page.canonicalUrl,
      },
    ],
  };

  // 3. FAQPage schema
  const faqSchema =
    page.faqs && page.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: page.faqs.map((faq) => ({
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
        <title>{page.seoTitle}</title>
        <meta name="description" content={page.metaDescription} />
        <link rel="canonical" href={page.canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={page.seoTitle} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:url" content={page.canonicalUrl} />
        <meta name="twitter:title" content={page.seoTitle} />
        <meta name="twitter:description" content={page.metaDescription} />
        <meta name="twitter:url" content={page.canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(primarySchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center flex-wrap gap-2 text-xs font-mono text-slate-400">
              <li>
                <button
                  onClick={() => handleNavigate('/')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>/</li>
              <li>
                <button
                  onClick={() => handleNavigate(breadcrumbCategoryPath as PageRoute)}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  {breadcrumbCategoryName}
                </button>
              </li>
              <li>/</li>
              <li className="text-sky-300 font-semibold">{page.targetLocation.city}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              {/* Regional Location Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  IAMTECHNI · {page.targetLocation.city.toUpperCase()},{' '}
                  {page.targetLocation.state.toUpperCase()}
                </span>
                {page.targetLocation.distanceFromHub && (
                  <span className="hidden sm:inline text-slate-400 font-normal">
                    ({page.targetLocation.distanceFromHub})
                  </span>
                )}
              </div>

              {/* Main H1 */}
              <h1 className="!font-['Outfit','Space_Grotesk',sans-serif] text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {page.h1}
              </h1>

              {/* Intro summary */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-3xl">
                {page.intro}
              </p>

              {/* Call-to-actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => handleStartProject(page.h1)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <span>
                    {page.category === 'Training'
                      ? 'Inquire About Batches'
                      : 'Discuss Your Project'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${PRIMARY_PHONE_LINK}`}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-sky-400" />
                  <span>Call {PRIMARY_PHONE}</span>
                </a>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-sm border border-emerald-500/30 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>

            {/* Quick Contact & Credentials Card */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Regional Contact Details</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-mono text-slate-400">Enquiries:</div>
                    <a
                      href={`tel:${PRIMARY_PHONE_LINK}`}
                      className="font-bold text-white hover:text-sky-300 transition-colors"
                    >
                      {PRIMARY_PHONE}
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-mono text-slate-400">Direct Line:</div>
                    <a
                      href={`tel:${SECONDARY_PHONE_LINK}`}
                      className="font-bold text-white hover:text-emerald-300 transition-colors"
                    >
                      {SECONDARY_PHONE}
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-mono text-slate-400">Engineering Hub:</div>
                    <div className="font-medium text-slate-200">
                      Puducherry &amp; Tamil Nadu, India
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>100% Code Ownership</span>
                <span>·</span>
                <span className="text-sky-400">Zero License Lock-in</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. COURSE DETAILS BANNER (Only for Training Pages)                         */}
      {/* ========================================================================= */}
      {page.courseDetails && (
        <section className="bg-sky-50 border-b border-sky-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 shadow-2xs">
                <div className="text-[11px] font-mono text-sky-700 font-bold uppercase flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Duration</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {page.courseDetails.duration}
                </div>
              </div>

              <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 shadow-2xs">
                <div className="text-[11px] font-mono text-sky-700 font-bold uppercase flex items-center gap-1.5 mb-1">
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  <span>Delivery Mode</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {page.courseDetails.mode}
                </div>
              </div>

              <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 shadow-2xs">
                <div className="text-[11px] font-mono text-sky-700 font-bold uppercase flex items-center gap-1.5 mb-1">
                  <Code2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Prerequisites</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {page.courseDetails.prerequisites}
                </div>
              </div>

              <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 shadow-2xs">
                <div className="text-[11px] font-mono text-sky-700 font-bold uppercase flex items-center gap-1.5 mb-1">
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                  <span>Certification</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {page.courseDetails.certification}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. HIGHLIGHTS & KEY CAPABILITIES                                          */}
      {/* ========================================================================= */}
      {page.highlights && page.highlights.length > 0 && (
        <section className="py-10 sm:py-16 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8">
              <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold mb-1">
                Why Choose IAMTECHNI in {page.targetLocation.city}
              </div>
              <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl font-bold tracking-tight text-[#1E3A8A]">
                Engineering Rigor, Local Proximity &amp; Real Outcomes
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {page.highlights.map((item, idx) => {
                const color = getCardColorToken(idx);
                return (
                  <div
                    key={idx}
                    className={`${color.cardBg} ${color.cardBorder} border rounded-2xl p-5 ${color.cardHoverBorder} transition-all duration-200 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${color.badgeBg} ${color.badgeText} border ${color.badgeBorder}`}
                        >
                          ADVANTAGE 0{idx + 1}
                        </span>
                        <CheckCircle2 className={`w-4 h-4 ${color.accentText}`} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. DEEP-DIVE SECTIONS (H2 + Paragraphs)                                   */}
      {/* ========================================================================= */}
      {page.sections && page.sections.length > 0 && (
        <section className="py-10 sm:py-16 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 sm:space-y-8">
              {page.sections.map((sec, idx) => {
                const color = getCardColorToken(idx + 1);
                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-8 shadow-2xs space-y-3 sm:space-y-4"
                  >
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#2563EB] uppercase">
                      <Sparkles className="w-4 h-4 text-[#2563EB]" />
                      <span>Focus Area 0{idx + 1}</span>
                    </div>
                    <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-lg sm:text-2xl font-bold text-[#1E3A8A] leading-snug">
                      {sec.h2}
                    </h2>
                    <div className="space-y-3">
                      {sec.paragraphs.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[13.5px] sm:text-base text-slate-600 leading-relaxed"
                        >
                          {p}
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

      {/* ========================================================================= */}
      {/* 5. PROCESS WORKFLOW (01 -> 02 -> 03 -> 04)                                */}
      {/* ========================================================================= */}
      {page.processSteps && page.processSteps.length > 0 && (
        <section className="py-10 sm:py-16 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8 sm:mb-12">
              <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold mb-1">
                Structured Execution
              </div>
              <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl font-bold tracking-tight text-[#1E3A8A]">
                Our 4-Stage Delivery Lifecycle
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {page.processSteps.map((step, idx) => {
                const color = getCardColorToken(idx);
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="text-2xl font-mono font-extrabold text-[#2563EB] mb-2">
                        {step.step}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. LOCAL CONTEXT & REGIONAL PRESENCE                                       */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-16 bg-[#EFF6FF] border-b border-blue-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1E3A8A] text-xs font-mono font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Regional Presence &amp; Client Access</span>
          </div>
          <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl font-bold text-[#1E3A8A]">
            Serving {page.targetLocation.city} with Direct Engineering Accountability
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl mx-auto">
            {page.localContext}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              In-Person Scoping Meetings
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Direct Architect Slack / Phone Access
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Transparent Milestone Billing
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FREQUENTLY ASKED QUESTIONS                                             */}
      {/* ========================================================================= */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="py-10 sm:py-16 bg-white border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-bold mb-1">
                Frequently Asked Questions
              </div>
              <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl font-bold text-[#1E3A8A]">
                Answers for {page.targetLocation.city} Clients
              </h2>
            </div>

            <div className="space-y-3">
              {page.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full min-h-[48px] px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                        openFaqIndex === idx ? 'rotate-180 text-[#2563EB]' : ''
                      }`}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-[13.5px] sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. BOTTOM CTA BANNER                                                      */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-16 bg-gradient-to-b from-[#F5F8FC] to-[#FFFFFF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#ECFEFF] border border-[#DBEAFE] rounded-2xl p-6 sm:p-12 text-center space-y-4 sm:space-y-5 shadow-[0_8px_30px_rgba(37,99,235,0.08)]">
            <h2 className="!font-['Outfit','Space_Grotesk',sans-serif] text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1E3A8A]">
              Ready to work with IAMTECHNI in {page.targetLocation.city}?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Contact our engineering team today to review your project scope, timeline, and exact deliverables. Call our direct line or request a callback.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleStartProject(page.h1)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Start Project Discovery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`tel:${PRIMARY_PHONE_LINK}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#1E3A8A] font-semibold text-sm border border-[#DBEAFE] shadow-2xs transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#2563EB]" />
                <span>Call {PRIMARY_PHONE}</span>
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationLandingPage;
