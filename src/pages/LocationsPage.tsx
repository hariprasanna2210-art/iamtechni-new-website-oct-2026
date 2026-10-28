import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Globe,
  ArrowRight,
  GraduationCap,
  Building2,
  Cpu,
  Monitor,
  Layers,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { PageRoute } from '../types';
import { PageHero } from '../components/common/PageHero';
import { ALL_LOCATION_PAGES, LocationSeoPageData } from '../data/location-seo';
import { PRIMARY_PHONE, PRIMARY_PHONE_LINK } from '../constants/contact';
import { COMPANY_CONTACT } from '../data/companyInfo';

interface LocationsPageProps {
  onNavigate?: (route: PageRoute) => void;
  onStartProject?: (serviceName?: string) => void;
}

const CANONICAL_URL = 'https://www.iamtechni.in/locations';
const SEO_TITLE = 'Locations We Serve | IAMTECHNI – Puducherry, Chennai & Tamil Nadu';
const META_DESCRIPTION =
  'Explore IAMTECHNI services across Puducherry, Chennai, Coimbatore, Madurai, Trichy, Salem, Erode, Vellore, Cuddalore, and Villupuram. Software, web development, digital marketing, and live online training.';

// 4 Groups as specified
const GROUP_DEFINITIONS = [
  {
    id: 'pondicherry-nearby',
    title: 'Pondicherry & Nearby',
    badge: 'Headquarters & Coastal Hub',
    description:
      'Direct local presence and consultation from our Puducherry headquarters, extending services to Cuddalore and Villupuram.',
    icon: Building2,
    gradient: 'from-blue-50 to-indigo-50/40 border-blue-200/80',
    accentText: 'text-blue-700',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    slugs: [
      'web-development-company-pondicherry',
      'custom-software-development-pondicherry',
      'ecommerce-website-development-pondicherry',
      'mobile-app-development-pondicherry',
      'digital-marketing-agency-pondicherry',
      'seo-company-pondicherry',
      'web-development-cuddalore',
      'web-development-villupuram',
    ],
  },
  {
    id: 'chennai',
    title: 'Chennai',
    badge: 'Metropolitan & IT Corridor',
    description:
      'Serving Chennai startups, IT corridor enterprises, retail brands, and industrial manufacturers with remote delivery and in-person meetings on request.',
    icon: Monitor,
    gradient: 'from-sky-50 to-cyan-50/40 border-sky-200/80',
    accentText: 'text-sky-700',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    slugs: [
      'web-development-company-chennai',
      'ecommerce-website-development-chennai',
      'software-development-company-chennai',
      'mobile-app-development-chennai',
      'digital-marketing-agency-chennai',
      'seo-company-chennai',
    ],
  },
  {
    id: 'tamil-nadu-cities',
    title: 'Tamil Nadu Cities',
    badge: 'Industrial & Commercial Hubs',
    description:
      'Remote digital engineering and web platforms for manufacturing, textile, healthcare, and trade leaders in Coimbatore, Madurai, Trichy, Salem, Erode, and Vellore.',
    icon: Cpu,
    gradient: 'from-indigo-50 to-purple-50/40 border-indigo-200/80',
    accentText: 'text-indigo-700',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    slugs: [
      'web-development-coimbatore',
      'digital-marketing-coimbatore',
      'web-development-madurai',
      'web-development-trichy',
      'web-development-salem',
      'web-development-erode',
      'web-development-vellore',
    ],
  },
  {
    id: 'online-training',
    title: 'Online Training',
    badge: 'Live Online, Instructor-Led',
    description:
      'Interactive, mentor-guided online technical programs in AWS, DevOps, Generative AI, and software engineering with hands-on labs for students and professionals across all regions.',
    icon: GraduationCap,
    gradient: 'from-emerald-50 to-teal-50/40 border-emerald-200/80',
    accentText: 'text-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    slugs: [
      'aws-training-pondicherry',
      'devops-training-pondicherry',
      'generative-ai-training-pondicherry',
      'it-training-cuddalore',
      'aws-training-chennai',
      'devops-training-chennai',
      'it-training-madurai',
      'aws-training-coimbatore',
      'generative-ai-training-tamil-nadu',
    ],
  },
];

export const LocationsPage: React.FC<LocationsPageProps> = ({
  onNavigate,
  onStartProject,
}) => {
  // Sync head metadata with react-helmet-async
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Map slug to full page data
  const pageMap = new Map<string, LocationSeoPageData>();
  for (const p of ALL_LOCATION_PAGES) {
    pageMap.set(p.slug, p);
  }

  // Structured schema for the locations directory
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.iamtechni.in/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Locations We Serve',
            item: CANONICAL_URL,
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'IAMTECHNI Locations We Serve',
        description: META_DESCRIPTION,
        numberOfItems: ALL_LOCATION_PAGES.length,
        itemListElement: ALL_LOCATION_PAGES.map((page, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: page.h1,
          url: page.canonicalUrl,
        })),
      },
    ],
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href={CANONICAL_URL} />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.iamtechni.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
        <meta name="twitter:image" content="https://www.iamtechni.in/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Top PageHero using existing design tokens */}
      <PageHero
        kicker="REGIONAL ENGINEERING DIRECTORY"
        title="Locations We Serve"
        tagline="Puducherry Headquartered · Chennai · Tamil Nadu Commercial Hubs"
        description="Explore IAMTECHNI specialized web development, custom software engineering, digital marketing, and live online technical training across Puducherry, Chennai, and key business hubs throughout Tamil Nadu."
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'Locations', route: '/locations' },
        ]}
        slug="locations"
        onNavigate={onNavigate}
        primaryCtaText="Discuss Your Project"
        onPrimaryCta={() =>
          onStartProject ? onStartProject('Regional Consultation') : onNavigate?.('/contact')
        }
        secondaryCtaText="View All 13 Services"
        onSecondaryCta={() => onNavigate?.('/services')}
      />

      {/* Operating Model & Transparency Notice */}
      <section className="py-6 sm:py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#1266E8]/10 text-[#1266E8] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Engineering Headquarters in Puducherry · Serving Tamil Nadu
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  Our core engineering team operates from Puducherry. We serve businesses across
                  Chennai and Tamil Nadu through remote-first collaboration, with in-person
                  discovery and architecture meetings on request. All professional training
                  programs are delivered completely online via live, instructor-led sessions.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto">
              <a
                href={`tel:${PRIMARY_PHONE_LINK}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#1266E8] text-slate-800 text-xs font-semibold shadow-2xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#1266E8]" />
                <span>{PRIMARY_PHONE}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main 4 Group Cards */}
      <section className="py-10 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1266E8] font-bold">
              30 Regional Landing Pages
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              Browse Services by Region &amp; City
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Select a specialized location page to learn how IAMTECHNI delivers modern software,
              tailored digital commerce, performance SEO, and live technical training aligned with
              your local business ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {GROUP_DEFINITIONS.map((group) => {
              const GroupIcon = group.icon;
              const groupPages = group.slugs
                .map((slug) => pageMap.get(slug))
                .filter((p): p is LocationSeoPageData => Boolean(p));

              return (
                <div
                  key={group.id}
                  id={group.id}
                  className={`bg-white rounded-2xl border ${group.gradient} p-5 sm:p-7 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between`}
                >
                  <div>
                    {/* Group Header */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0">
                          <GroupIcon className={`w-4.5 h-4.5 ${group.accentText}`} />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                            {group.title}
                          </h3>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${group.badgeBg} shrink-0`}
                      >
                        {group.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-600 mb-5 leading-relaxed">
                      {group.description}
                    </p>

                    {/* Links List — standard crawlable <Link> / <a> tags */}
                    <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                      {groupPages.map((page) => (
                        <Link
                          key={page.slug}
                          to={page.path}
                          className="py-3 px-2 flex items-center justify-between gap-3 group hover:bg-slate-50/80 rounded-lg transition-colors cursor-pointer"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="text-xs sm:text-[13.5px] font-semibold text-slate-900 group-hover:text-[#1266E8] transition-colors truncate">
                              {page.h1}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                              <span className="inline-flex items-center gap-1 text-slate-600">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                {page.targetLocation.city}
                              </span>
                              <span>·</span>
                              <span className="text-slate-500">
                                {page.category === 'Training' ? 'Live Online' : 'Custom Software'}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#1266E8] text-slate-400 group-hover:text-white transition-all duration-150">
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="mt-4 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{groupPages.length} Dedicated Regional Pages</span>
                    <span className="text-[#1266E8] font-bold">Verified Curriculum &amp; Stack</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Consultation Banner */}
      <section className="py-10 sm:py-16 bg-gradient-to-b from-[#F5F8FC] to-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#EEF4FF] via-[#F5F9FF] to-[#ECFEFF] border border-[#DBEAFE] rounded-2xl p-6 sm:p-10 text-center space-y-4 shadow-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-blue-200 text-xs font-mono font-bold text-[#1266E8]">
              <Sparkles className="w-3.5 h-3.5" /> Regional Engineering Inquiries
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Looking for software development or technical training in your city?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Schedule an architecture call or reach out directly to discuss scope, timelines, and
              custom delivery arrangements for your business or engineering team.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onStartProject ? onStartProject('Regional Consultation') : onNavigate?.('/contact')
                }
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1266E8] hover:bg-[#0E54C2] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>Discuss Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 shadow-2xs transition-colors"
              >
                <span>All 13 Services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationsPage;
