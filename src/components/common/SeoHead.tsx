import React, { useEffect } from 'react';
import {
  PageRoute,
  ServiceItem,
  IndustryItem,
  ArticleItem,
  SolutionItem,
  CourseItem,
} from '../../types';
import { servicesData, getCanonicalServiceSlug } from '../../data/servicesData';
import { getSeoServicePageBySlug } from '../../data/seo-pages';
import { solutionsData } from '../../data/solutionsData';
import { industriesData } from '../../data/industriesData';
import { insightsData } from '../../data/insightsData';
import { projectsData } from '../../data/projectsData';
import { coursesData } from '../../data/coursesData';
import { careersData } from '../../data/careersData';
import { COMPANY_CONTACT } from '../../data/companyInfo';
import { PRIMARY_PHONE, SCHEMA_TELEPHONE } from '../../constants/contact';
import { getLocationSeoPageBySlug } from '../../data/location-seo';

const BASE_URL = COMPANY_CONTACT.website; // https://www.iamtechni.in
const DEFAULT_OG_IMAGE = COMPANY_CONTACT.ogImageUrl; // https://www.iamtechni.in/og-image.png

export const FAQ_PAGE_ITEMS = [
  {
    question: 'What core services does IAMTECHNI provide?',
    answer:
      'IAMTECHNI provides 13 core engineering and digital growth disciplines spanning Website Design and Development, Custom Software Engineering, AI & Machine Learning, E-commerce, Mobile Apps, Cloud & DevOps, Data Analytics, Cybersecurity, UI/UX Design, IT Consulting, Robotics, Technical Training, and Digital Marketing.',
  },
  {
    question: 'Do you build on off-the-shelf templates or create custom codebases?',
    answer:
      'We engineer 100% custom, bespoke codebases written in TypeScript, React, Next.js, Python, and Node.js. This ensures zero licensing lock-in, sub-second performance, and complete intellectual property ownership for your business.',
  },
  {
    question: 'Can you work with our existing development team or legacy codebase?',
    answer:
      'Yes. We regularly augment existing in-house engineering departments, perform incremental legacy refactoring, and build decoupled microservices or modern frontends connected to existing backends.',
  },
  {
    question: 'What does your standard development process look like?',
    answer:
      'We operate across a structured 7-stage delivery lifecycle: 01 Discover (requirements & technical audit), 02 Define (scope & architecture blueprint), 03 Design (responsive wireframes & design systems), 04 Build (modular TypeScript/Python engineering), 05 Validate (automated tests & Core Web Vitals audits), 06 Deploy (zero-downtime CI/CD container releases), and 07 Improve (telemetry monitoring & enhancements).',
  },
  {
    question: 'How long does a typical project take to design and launch?',
    answer:
      'Corporate websites and MVPs typically launch in 4 to 8 weeks. Larger enterprise platforms, custom software portals, and complex AI/RAG integrations generally take between 2 to 4 months depending on integration scope.',
  },
  {
    question: 'How do you communicate progress during development?',
    answer:
      'Clients receive dedicated weekly video check-ins, access to real-time staging preview URLs, and shared Slack/Teams channels with lead architects for direct, transparent communication.',
  },
  {
    question: 'Who owns the intellectual property (IP) and source code?',
    answer:
      'You do. Upon project completion and settlement, 100% of the code, documentation, assets, and deployment configurations belong to your company. We never charge ongoing proprietary seat licenses.',
  },
  {
    question: 'What are your contract and payment structures?',
    answer:
      'We offer both milestone-based fixed scope contracts (with clear deliverables) and agile monthly engineering sprints for evolving product requirements. All contracts include upfront transparent pricing with zero surprise charges.',
  },
  {
    question: 'How do you protect our proprietary data when building AI solutions?',
    answer:
      'We enforce enterprise zero-retention API contracts and deploy private vector enclaves inside isolated cloud VPCs. Your proprietary documents, customer data, and internal SOPs never leak into public foundation models.',
  },
  {
    question: 'Do you provide ongoing maintenance and technical support after launch?',
    answer:
      'Yes. We provide flexible post-launch SLA maintenance agreements covering cloud infrastructure health, dependency updates, security patches, uptime monitoring, and ongoing feature development.',
  },
];

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'article';
  ogImage: string;
  ogSiteName: string;
  ogLocale: string;
  twitterCard: 'summary_large_image';
  structuredData: Record<string, unknown>[];
  noIndex?: boolean;
}

const DESCRIPTION_FILLER_SENTENCES = [
  'Enquire.',
  'Call us.',
  'Book now.',
  'Get a quote.',
  'Enquire now.',
  'Contact us today.',
  'Built by IAMTECHNI.',
  'Enquire with IAMTECHNI.',
  'Delivered by IAMTECHNI.',
  'Built for scale and speed.',
  'Engineered by IAMTECHNI.',
  'Connect with IAMTECHNI today.',
  'Schedule a consultation today.',
  'Partner with IAMTECHNI today.',
  'Built in Pondicherry & Tamil Nadu.',
  'Explore tailored solutions at IAMTECHNI.',
  'Delivered across Pondicherry & Tamil Nadu.',
  'Partner with IAMTECHNI in Pondicherry & Tamil Nadu.',
  'Engineer resilient digital platforms with IAMTECHNI.',
  'Partner with IAMTECHNI for custom software, AI, and cloud.',
  'Partner with IAMTECHNI in Pondicherry & Tamil Nadu for software & AI.',
];

function splitIntoSentences(text: string): string[] {
  const clean = String(text || '')
    .replace(/Puducherry/gi, 'Pondicherry')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return [];
  const matches = clean.match(/[^.!?]+[.!?]+(?=\s|$)/g);
  if (!matches) {
    return [/[.!?]$/.test(clean) ? clean : `${clean}.`];
  }
  const lastMatch = matches[matches.length - 1];
  const lastIdx = clean.lastIndexOf(lastMatch);
  const remainder = clean.slice(lastIdx + lastMatch.length).trim();
  const result = matches.map((s) => s.trim());
  if (remainder) {
    result.push(/[.!?]$/.test(remainder) ? remainder : `${remainder}.`);
  }
  return result;
}

/**
 * Formats any page title to 60 characters or fewer, removing generic suffixes,
 * removing hard-coded counts, using "Pondicherry", and keeping the main keyword first.
 */
export function formatSeoTitle(rawTitle: string): string {
  let t = String(rawTitle || '')
    .replace(/Puducherry/gi, 'Pondicherry')
    .replace(/\s*\(\d+\s+(?:Programs|Openings)\)/gi, '')
    .replace(
      /\s*[—–-]\s*(?:Business Solution|Software Development|Cloud Computing|AI & Data|DevOps & Security|Case Study)/gi,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim();

  if (t.length <= 60) {
    return t;
  }

  const pipeParts = t.split('|').map((s) => s.trim());
  if (pipeParts.length >= 3) {
    const collapsed = `${pipeParts[0]} | IAMTECHNI`;
    if (collapsed.length <= 60) {
      return collapsed;
    }
  }

  const suffix = ' | IAMTECHNI';
  const mainKeyword = pipeParts[0].replace(/\s+\|\s+IAMTECHNI.*$/i, '').trim();
  if (`${mainKeyword}${suffix}`.length <= 60) {
    return `${mainKeyword}${suffix}`;
  }

  const maxMainLen = 60 - suffix.length;
  let shortened = mainKeyword.slice(0, maxMainLen);
  const clauseSep = Math.max(
    shortened.lastIndexOf(':'),
    shortened.lastIndexOf('—'),
    shortened.lastIndexOf('–'),
    shortened.lastIndexOf(',')
  );
  if (clauseSep >= 22) {
    shortened = shortened.slice(0, clauseSep).trim();
  } else {
    const lastSpace = shortened.lastIndexOf(' ');
    if (lastSpace > 15) {
      shortened = shortened.slice(0, lastSpace).trim();
    }
  }
  shortened = shortened.replace(/[,;:\-–—&\s]+$/, '');
  return `${shortened}${suffix}`;
}

/**
 * Formats any page description so that it ends on a full sentence at 150 to 160 characters
 * without mid-sentence hard-cuts or ellipses, and uses "Pondicherry" consistently.
 */
const EXACT_META_DESCRIPTIONS = new Set<string>([
  'Web development services in Pondicherry and Tamil Nadu by IAMTECHNI. Custom React, Next.js and TypeScript websites built to convert visitors into clients.',
  'Full Stack Development training in Pondicherry and Tamil Nadu by IAMTECHNI. Learn front-end and back-end skills through hands-on, instructor-led projects.',
  'Vendor-neutral IT consulting in Pondicherry and Tamil Nadu by IAMTECHNI. Codebase audits, legacy modernization roadmaps and technical due diligence.',
  'UI/UX design services in Pondicherry and Tamil Nadu by IAMTECHNI. User research, interface design, prototyping and design systems for web and mobile.',
  'Technology stack used by IAMTECHNI in Pondicherry and Tamil Nadu: React, Python, FastAPI, LangChain, AWS, Azure, Docker and Kubernetes for modern software.',
  'Contact IAMTECHNI in Pondicherry and Tamil Nadu for software, AI and cloud project enquiries. Share your requirements and our team will reply shortly.',
]);

export function formatMetaDescription(primaryText: string, extraContext?: string): string {
  if (!extraContext && EXACT_META_DESCRIPTIONS.has(primaryText)) {
    return primaryText;
  }
  const raw = extraContext ? `${primaryText} ${extraContext}` : primaryText;
  const sentences = splitIntoSentences(raw);
  let accumulated = '';

  for (const sentence of sentences) {
    const candidate = accumulated ? `${accumulated} ${sentence}` : sentence;
    if (candidate.length <= 160) {
      accumulated = candidate;
    } else if (!accumulated) {
      // Single sentence longer than 160 chars: shorten cleanly at a natural clause boundary and end with a full period
      const clauseWindow = sentence.slice(0, 159);
      const sepIndex = Math.max(
        clauseWindow.lastIndexOf(','),
        clauseWindow.lastIndexOf(';'),
        clauseWindow.lastIndexOf(' and '),
        clauseWindow.lastIndexOf(' with ')
      );
      if (sepIndex >= 110) {
        accumulated = `${clauseWindow.slice(0, sepIndex).replace(/[,;:\s]+$/, '')}.`;
      } else {
        const lastSpace = clauseWindow.lastIndexOf(' ');
        accumulated = `${clauseWindow.slice(0, lastSpace).replace(/[,;:\s]+$/, '')}.`;
      }
      break;
    } else {
      break;
    }
  }

  if (accumulated.length >= 150 && accumulated.length <= 160) {
    return accumulated;
  }

  for (const filler of DESCRIPTION_FILLER_SENTENCES) {
    const candidate = `${accumulated} ${filler}`;
    if (candidate.length >= 150 && candidate.length <= 160) {
      return candidate;
    }
  }

  for (const filler1 of DESCRIPTION_FILLER_SENTENCES) {
    for (const filler2 of DESCRIPTION_FILLER_SENTENCES) {
      const candidate = `${accumulated} ${filler1} ${filler2}`;
      if (candidate.length >= 150 && candidate.length <= 160) {
        return candidate;
      }
    }
  }

  return accumulated;
}

export function resolveOgImageUrl(item?: unknown): string {
  if (item && typeof item === 'object') {
    const record = item as Record<string, unknown>;
    const candidate = record.ogImage || record.image || record.coverImage || record.thumbnailUrl;
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      const trimmed = candidate.trim();
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
      }
      if (trimmed.startsWith('/')) {
        return `${BASE_URL}${trimmed}`;
      }
      return `${BASE_URL}/${trimmed}`;
    }
  }
  return DEFAULT_OG_IMAGE;
}

function findServiceBySlug(slug: string): ServiceItem | undefined {
  const canonicalSlug = getCanonicalServiceSlug(slug);
  return servicesData.find((s) => s.slug === canonicalSlug || s.id === canonicalSlug);
}

function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

export function resolveRouteSeo(route: PageRoute): SeoMetadata {
  const cleanPath = route === '/' ? '/' : route.replace(/\/+$/, '');
  const canonicalUrl = `${BASE_URL}${cleanPath}`;
  const structuredData: Record<string, unknown>[] = [];
  const baseMeta = {
    ogSiteName: 'IAMTECHNI',
    ogLocale: 'en_IN',
    twitterCard: 'summary_large_image' as const,
  };

  // 1. Home Page (/) — Synchronized with root index.html (<= 60 chars, 150-160 char full sentence)
  if (cleanPath === '/') {
    return {
      ...baseMeta,
      title: formatSeoTitle('Web Development & AI Company in Pondicherry | IAMTECHNI'),
      description: formatMetaDescription(
        'IAMTECHNI delivers custom web development, e-commerce, mobile apps, enterprise software, AI, Cloud DevOps & digital marketing in Pondicherry & Tamil Nadu.'
      ),
      canonicalUrl: 'https://www.iamtechni.in/',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData: [],
    };
  }

  // 1b. Location-Based SEO Landing Pages (/:location-slug)
  const locationPage = getLocationSeoPageBySlug(cleanPath);
  if (locationPage) {
    const locCanonical = `${BASE_URL}/${locationPage.slug}`;
    const formattedDesc = formatMetaDescription(locationPage.metaDescription);
    const breadcrumbCategoryPath =
      locationPage.category === 'Training' ? '/training' : '/services';
    const breadcrumbCategoryName =
      locationPage.category === 'Training' ? 'Training & Courses' : 'Services';

    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: breadcrumbCategoryName, path: breadcrumbCategoryPath },
        { name: locationPage.h1, path: `/${locationPage.slug}` },
      ])
    );

    if (locationPage.schemaType === 'Course') {
      structuredData.push({
        '@type': 'Course',
        '@id': `${locCanonical}#course`,
        name: locationPage.h1,
        description: formattedDesc,
        url: locCanonical,
        provider: {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: COMPANY_CONTACT.name,
          telephone: SCHEMA_TELEPHONE,
          email: COMPANY_CONTACT.email,
          url: `${BASE_URL}/`,
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: ['online'],
          courseWorkload: locationPage.courseDetails?.duration || '8–10 Weeks',
        },
      });
    } else {
      structuredData.push({
        '@type': 'Service',
        '@id': `${locCanonical}#service`,
        name: locationPage.h1,
        serviceType: locationPage.h1,
        description: formattedDesc,
        url: locCanonical,
        provider: {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: COMPANY_CONTACT.name,
          telephone: SCHEMA_TELEPHONE,
          email: COMPANY_CONTACT.email,
          url: `${BASE_URL}/`,
        },
        areaServed: [
          { '@type': 'City', name: locationPage.targetLocation.city },
          { '@type': 'AdministrativeArea', name: locationPage.targetLocation.region },
          { '@type': 'AdministrativeArea', name: locationPage.targetLocation.state },
          { '@type': 'Country', name: 'India' },
        ],
      });
    }

    if (locationPage.faqs && locationPage.faqs.length > 0) {
      structuredData.push({
        '@type': 'FAQPage',
        mainEntity: locationPage.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    return {
      ...baseMeta,
      title: formatSeoTitle(locationPage.seoTitle),
      description: formattedDesc,
      canonicalUrl: locCanonical,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 2. Individual Service Detail Page (/services/:slug)
  if (cleanPath.startsWith('/services/')) {
    const slug = cleanPath.replace('/services/', '');
    const seoPage = getSeoServicePageBySlug(slug);
    const service = findServiceBySlug(slug);
    if (seoPage || service) {
      const canonicalSlug = seoPage?.slug || service?.slug || service?.id || slug;
      const serviceCanonicalPath = `/services/${canonicalSlug}`;
      const serviceCanonicalUrl = `${BASE_URL}${serviceCanonicalPath}`;
      const pageTitle = seoPage?.h1 || service?.title || canonicalSlug;
      const pageFaqs = seoPage?.faqs || service?.faqs || [];
      const formattedDesc = formatMetaDescription(
        seoPage?.metaDescription || `${pageTitle}: ${service?.summary || ''}`
      );

      structuredData.push(
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: pageTitle, path: serviceCanonicalPath },
        ])
      );

      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${serviceCanonicalUrl}#service`,
        name: pageTitle,
        serviceType: service?.category || pageTitle,
        description: formattedDesc,
        url: serviceCanonicalUrl,
        provider: {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: COMPANY_CONTACT.name,
          telephone: SCHEMA_TELEPHONE,
          email: COMPANY_CONTACT.email,
          url: `${BASE_URL}/`,
        },
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Pondicherry' },
          { '@type': 'AdministrativeArea', name: 'Tamil Nadu' },
          { '@type': 'Country', name: 'India' },
        ],
      });

      if (pageFaqs.length > 0) {
        structuredData.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: pageFaqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        });
      }

      return {
        ...baseMeta,
        title: formatSeoTitle(seoPage?.seoTitle || `${pageTitle} Services | IAMTECHNI`),
        description: formattedDesc,
        canonicalUrl: serviceCanonicalUrl,
        ogType: 'website',
        ogImage: resolveOgImageUrl(service),
        structuredData,
      };
    }
  }

  // 3. Services Directory (/services)
  if (cleanPath === '/services') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Services Directory', path: '/services' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Engineering Services — Web, AI & Cloud | IAMTECHNI'),
      description: formatMetaDescription(
        'Explore IAMTECHNI engineering services across Web Development, AI & Machine Learning, Custom Software, Cloud & DevOps, and Technical SEO in Pondicherry.'
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 4. Individual Solution Page (/solutions/:slug)
  if (cleanPath.startsWith('/solutions/')) {
    const slug = cleanPath.replace('/solutions/', '');
    const solution: SolutionItem | undefined = solutionsData.find((s) => s.id === slug);
    if (solution) {
      const solutionMetaDescriptionOverrides: Record<string, string> = {
        'ai-document-search':
          'AI-powered knowledge and document search in Pondicherry and Tamil Nadu by IAMTECHNI. Private, retrieval-augmented answers from your manuals and SOPs.',
        'custom-business-dashboards':
          'Custom business dashboards in Pondicherry and Tamil Nadu by IAMTECHNI. Unified KPI telemetry showing real-time revenue, production and customer engagement.',
        'digital-commerce-engines':
          'E-commerce and digital commerce modernization in Pondicherry and Tamil Nadu by IAMTECHNI. Fast, transaction-ready storefronts with real-time stock sync.',
        'business-process-automation':
          'Business process automation in Pondicherry and Tamil Nadu by IAMTECHNI. Replace manual workflows and email approval chains with automated pipelines.',
        'application-modernization':
          'Application modernization in Pondicherry and Tamil Nadu by IAMTECHNI. Incrementally break brittle legacy systems into modern, strongly typed TypeScript.',
        'lead-generation-growth':
          'Lead generation in Pondicherry and Tamil Nadu by IAMTECHNI. Technical SEO, conversion rate optimization and high-intent content funnels.',
      };
      const resolvedSolutionDescription =
        solutionMetaDescriptionOverrides[slug] ??
        formatMetaDescription(`${solution.title}: ${solution.summary}`);

      structuredData.push(
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Solutions', path: '/solutions' },
          { name: solution.title, path: cleanPath },
        ])
      );
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${canonicalUrl}#solution`,
        name: solution.title,
        serviceType: `${solution.category} Solution`,
        description: solution.summary,
        url: canonicalUrl,
        provider: {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: COMPANY_CONTACT.name,
        },
      });
      return {
        ...baseMeta,
        title: formatSeoTitle(`${solution.title} | IAMTECHNI`),
        description: resolvedSolutionDescription,
        canonicalUrl,
        ogType: 'website',
        ogImage: resolveOgImageUrl(solution),
        structuredData,
      };
    }
  }

  // 5. Solutions Directory (/solutions)
  if (cleanPath === '/solutions') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Solutions', path: '/solutions' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Enterprise Digital Solutions & Automation | IAMTECHNI'),
      description: formatMetaDescription(
        'End-to-end business solutions including AI document intelligence, workflow automation, cloud infrastructure modernization, and KPI dashboards by IAMTECHNI.'
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 6. Individual Industry Detail Page (/industries/:slug)
  if (cleanPath.startsWith('/industries/')) {
    const slug = cleanPath.replace('/industries/', '');
    const industry: IndustryItem | undefined = industriesData.find((i) => i.id === slug);
    if (industry) {
      const industryMetaDescriptionOverrides: Record<string, string> = {
        'healthcare-administration':
          'Healthcare administration software in Pondicherry and Tamil Nadu by IAMTECHNI. Privacy-conscious systems for clinics and diagnostic centers.',
        'startups-emerging':
          'Startup and emerging business technology in Pondicherry and Tamil Nadu by IAMTECHNI. Architecting, validating and launching scalable digital products.',
      };
      const resolvedIndustryDescription =
        industryMetaDescriptionOverrides[slug] ??
        formatMetaDescription(`${industry.name}: ${industry.summary}`);

      structuredData.push(
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' },
          { name: industry.name, path: cleanPath },
        ])
      );
      return {
        ...baseMeta,
        title: formatSeoTitle(`${industry.name} Technology Solutions | IAMTECHNI`),
        description: resolvedIndustryDescription,
        canonicalUrl,
        ogType: 'website',
        ogImage: resolveOgImageUrl(industry),
        structuredData,
      };
    }
  }

  // 7. Industries Directory (/industries)
  if (cleanPath === '/industries') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Industry Technology Solutions & Practices | IAMTECHNI'),
      description: formatMetaDescription(
        'Tailored digital platforms, workflow automation, and cloud engineering for education, retail, healthcare, manufacturing, startups, and SMEs by IAMTECHNI.'
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 8. Individual Training Course Page (/training/:slug)
  if (cleanPath.startsWith('/training/')) {
    const slug = cleanPath.replace('/training/', '');
    const course: CourseItem | undefined = coursesData.find((c) => c.id === slug);
    if (course) {
      structuredData.push(
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Technical Training', path: '/training' },
          { name: course.title, path: cleanPath },
        ])
      );
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description,
        url: canonicalUrl,
        provider: {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: COMPANY_CONTACT.name,
          sameAs: `${BASE_URL}/`,
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: ['online', 'onsite'],
          location: {
            '@type': 'Place',
            name: 'Pondicherry & Tamil Nadu (Live Online & Classroom)',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Pondicherry',
              addressRegion: 'Tamil Nadu',
              addressCountry: 'IN',
            },
          },
        },
      });
      return {
        ...baseMeta,
        title: formatSeoTitle(`${course.title} Training Course | IAMTECHNI`),
        description:
          slug === 'full-stack-development'
            ? 'Full Stack Development training in Pondicherry and Tamil Nadu by IAMTECHNI. Learn front-end and back-end skills through hands-on, instructor-led projects.'
            : formatMetaDescription(`${course.title} Training: ${course.description}`),
        canonicalUrl,
        ogType: 'website',
        ogImage: resolveOgImageUrl(course),
        structuredData,
      };
    }
  }

  // 9. Training Directory (/training, /courses)
  if (cleanPath === '/training' || cleanPath === '/courses') {
    const trainingCanonical = `${BASE_URL}/training`;
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Technical Training', path: '/training' },
      ])
    );
    structuredData.push({
      '@type': 'ItemList',
      name: 'IAMTECHNI Technical Training Programs',
      itemListElement: coursesData.map((course, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: course.title,
        url: `${BASE_URL}/training/${course.id}`,
      })),
    });
    for (const course of coursesData) {
      structuredData.push({
        '@type': 'Course',
        '@id': `${BASE_URL}/training/${course.id}#course`,
        name: course.title,
        description: course.description,
        url: `${BASE_URL}/training/${course.id}`,
        provider: {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: COMPANY_CONTACT.name,
          url: `${BASE_URL}/`,
        },
      });
    }
    return {
      ...baseMeta,
      title: formatSeoTitle('IT Training Courses — Full Stack, AI & Cloud | IAMTECHNI'),
      description: formatMetaDescription(
        'Live online, instructor-led, hands-on technical training in Pondicherry and Tamil Nadu by IAMTECHNI. Full Stack, AWS, DevOps, AI and Cybersecurity programs.'
      ),
      canonicalUrl: trainingCanonical,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 9b. Internship Application Pages (/internship/student, /internship/professional)
  if (cleanPath === '/internship/student') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Technical Training', path: '/training' },
        { name: 'Student Internship', path: '/internship/student' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Student Internship Application | IAMTECHNI'),
      description: formatMetaDescription(
        'Apply for the IAMTECHNI Student Internship program for college students seeking hands-on software, AI, and cloud project experience.'
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  if (cleanPath === '/internship/professional') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Technical Training', path: '/training' },
        { name: 'Professional Internship', path: '/internship/professional' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Professional Internship Application | IAMTECHNI'),
      description: formatMetaDescription(
        'Apply for the IAMTECHNI Professional Internship program for graduates and working professionals building practical engineering and industry skills.'
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 10. Individual Insight Article Page (/insights/:slug)
  if (cleanPath.startsWith('/insights/')) {
    const slug = cleanPath.replace('/insights/', '');
    const article: ArticleItem | undefined = insightsData.find((a) => a.slug === slug);
    if (article) {
      structuredData.push(
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
          { name: article.title, path: cleanPath },
        ])
      );
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: article.title,
        description: article.excerpt,
        author: {
          '@type': 'Organization',
          name: article.author.name,
        },
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        mainEntityOfPage: canonicalUrl,
      });
      return {
        ...baseMeta,
        title: formatSeoTitle(`${article.title} | IAMTECHNI`),
        description: formatMetaDescription(article.excerpt),
        canonicalUrl,
        ogType: 'article',
        ogImage: resolveOgImageUrl(article),
        structuredData,
      };
    }
  }

  // 11. Insights Directory (/insights)
  if (cleanPath === '/insights') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Insights & Research', path: '/insights' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Engineering Insights, AI & Cloud Field Notes | IAMTECHNI'),
      description: formatMetaDescription(
        'Deep-dive technical articles on enterprise RAG architectures, cloud FinOps optimization, Core Web Vitals performance, and modern software engineering.'
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 12. Case Study / Project Detail (/case-studies/:slug)
  if (cleanPath.startsWith('/case-studies/')) {
    const slug = cleanPath.replace('/case-studies/', '');
    const project = projectsData.find((p) => p.id === slug);
    if (project) {
      structuredData.push(
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Case Studies', path: '/case-studies' },
          { name: project.title, path: cleanPath },
        ])
      );
      return {
        ...baseMeta,
        title: formatSeoTitle(`${project.title} | IAMTECHNI`),
        description: formatMetaDescription(`${project.title}: ${project.tagline}`),
        canonicalUrl,
        ogType: 'website',
        ogImage: resolveOgImageUrl(project),
        structuredData,
      };
    }
  }

  // 13. Case Studies Directory (/case-studies)
  if (cleanPath === '/case-studies') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Case Studies', path: '/case-studies' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Engineering Case Studies & Architectures | IAMTECHNI'),
      description:
        'Six engineering case studies by IAMTECHNI in Pondicherry and Tamil Nadu. Headless commerce, enterprise AI, cloud migrations and web platforms.',
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 14. Portfolio (/portfolio)
  if (cleanPath === '/portfolio') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/portfolio' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Portfolio & Engineered Digital Products | IAMTECHNI'),
      description: formatMetaDescription(
        `Review ${projectsData.length} production architectures and software solutions delivered by IAMTECHNI across AI, e-commerce, cloud, and enterprise portals.`
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 15. Technology Stack (/technology)
  if (cleanPath === '/technology') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Technology Stack', path: '/technology' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Technology Stack — React, Python, AI & Cloud | IAMTECHNI'),
      description:
        'Technology stack used by IAMTECHNI in Pondicherry and Tamil Nadu: React, Python, FastAPI, LangChain, AWS, Azure, Docker and Kubernetes for modern software.',
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 16. About (/about)
  if (cleanPath === '/about') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'About IAMTECHNI', path: '/about' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('About IAMTECHNI — Software, AI & Cloud Engineering Practice'),
      description: formatMetaDescription(
        'Learn about IAMTECHNI’s engineering principles, 7-stage agile delivery lifecycle, and commitment to building resilient software, AI, and cloud platforms.'
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 17. Careers (/careers)
  if (cleanPath === '/careers') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Careers', path: '/careers' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Careers & Open Engineering Roles | IAMTECHNI'),
      description: formatMetaDescription(
        `Join IAMTECHNI's engineering team in Pondicherry & Tamil Nadu. Explore ${careersData.length} open roles across Full-Stack Development, AI & RAG Engineering, and Cloud DevOps.`
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 18. Contact & Consultation (/contact, /contact/consultation)
  if (cleanPath === '/contact/consultation') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
        { name: 'Request Consultation', path: '/contact/consultation' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Request an Architecture & Tech Consultation | IAMTECHNI'),
      description: formatMetaDescription(
        `Schedule a 1-on-1 technical discovery session with IAMTECHNI architects for software, AI, and cloud projects. Call ${PRIMARY_PHONE} or email ${COMPANY_CONTACT.email}.`
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  if (cleanPath === '/contact') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Contact Us', path: '/contact' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Contact IAMTECHNI — Start Your Software, AI or Cloud Project'),
      description:
        'Contact IAMTECHNI in Pondicherry and Tamil Nadu for software, AI and cloud project enquiries. Share your requirements and our team will reply shortly.',
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 19. FAQ Page (/faq)
  if (cleanPath === '/faq') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Frequently Asked Questions', path: '/faq' },
      ])
    );
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_PAGE_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
    return {
      ...baseMeta,
      title: formatSeoTitle('Frequently Asked Questions (FAQ) | IAMTECHNI Engineering'),
      description: formatMetaDescription(
        'Find transparent answers about IAMTECHNI’s software engineering services, 100% IP ownership, 7-stage delivery lifecycle, AI data privacy, and engagement models.'
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // Locations Directory (/locations)
  if (cleanPath === '/locations') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Locations', path: '/locations' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Locations We Serve in Pondicherry & Tamil Nadu | IAMTECHNI'),
      description: formatMetaDescription(
        'Explore IAMTECHNI software, web development, digital marketing, and live online IT training across Pondicherry, Chennai, Coimbatore, Madurai, and Tamil Nadu.'
      ),
      canonicalUrl: `${BASE_URL}/locations`,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // 20. Legal Pages (/privacy-policy, /terms)
  if (cleanPath === '/privacy-policy') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy-policy' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Privacy Policy & Data Protection Standards | IAMTECHNI'),
      description: formatMetaDescription(
        'Read IAMTECHNI’s Privacy Policy detailing how we collect, protect, and process inquiry data, cookies, security safeguards, and client confidentiality.'
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  if (cleanPath === '/terms') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Terms of Use', path: '/terms' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Terms of Use & Service Conditions | IAMTECHNI'),
      description: formatMetaDescription(
        'Review IAMTECHNI’s Terms of Use governing website access, intellectual property ownership, software engineering deliverables, and technology services.'
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // Public Certificate Verification (/verify and /verify/:certificateId)
  if (cleanPath === '/verify') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Technical Training', path: '/training' },
        { name: 'Verify Certificate', path: '/verify' },
      ])
    );
    return {
      ...baseMeta,
      title: formatSeoTitle('Verify Certificate | IAMTECHNI'),
      description: formatMetaDescription(
        'Enter the certificate number to check that an IAMTECHNI internship or training certificate is genuine and officially issued.'
      ),
      canonicalUrl: `${BASE_URL}/verify`,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  if (cleanPath.startsWith('/verify/')) {
    return {
      ...baseMeta,
      title: formatSeoTitle('Verify Certificate | IAMTECHNI'),
      description: formatMetaDescription(
        'Enter the certificate number to check that an IAMTECHNI internship or training certificate is genuine and officially issued.'
      ),
      canonicalUrl: `${BASE_URL}/verify`,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData: [],
      noIndex: true,
    };
  }

  // Admin Console (/admin) — noindex, nofollow
  if (cleanPath === '/admin') {
    return {
      ...baseMeta,
      title: 'Admin | IAMTECHNI',
      description: 'IAMTECHNI private administration console.',
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData: [],
      noIndex: true,
    };
  }

  // Fallback (404 / Unknown Route)
  return {
    ...baseMeta,
    title: '404 Page Not Found | IAMTECHNI',
    description: formatMetaDescription(
      'The requested page could not be found in the IAMTECHNI directory. Explore our web development, custom software, AI, and digital marketing services.'
    ),
    canonicalUrl: `${BASE_URL}/`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    structuredData,
    noIndex: true,
  };
}

export interface SeoHeadProps {
  currentRoute: PageRoute;
}

function isReactManagedNode(el: Element): boolean {
  if (el.hasAttribute('data-rh')) return true;
  return Object.keys(el).some((key) => key.startsWith('__react'));
}

export const SeoHead: React.FC<SeoHeadProps> = ({ currentRoute }) => {
  const cleanPath = currentRoute === '/' ? '/' : currentRoute.replace(/\/+$/, '');
  const seo = resolveRouteSeo(currentRoute);
  const structuredDataJson =
    seo.structuredData.length > 0
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': seo.structuredData,
        })
      : '';

  // Synchronize head tags and route JSON-LD across all pages from the shared SeoHead template
  useEffect(() => {
    const robotsValue = seo.noIndex
      ? cleanPath.startsWith('/verify/')
        ? 'noindex'
        : 'noindex, nofollow'
      : 'index, follow';

    const syncStaticTags = () => {
      document.title = seo.title;

      const ensureHeadTag = (
        selector: string,
        tagName: 'meta' | 'link',
        createAttrs: Record<string, string>,
        attrName: 'content' | 'href',
        attrValue: string
      ) => {
        const staticMatches = Array.from(document.head.querySelectorAll(selector)).filter(
          (el) => !isReactManagedNode(el)
        );
        if (staticMatches.length > 0) {
          staticMatches[0].setAttribute(attrName, attrValue);
          staticMatches.slice(1).forEach((el) => el.remove());
        } else {
          const el = document.createElement(tagName);
          Object.entries(createAttrs).forEach(([key, val]) => el.setAttribute(key, val));
          el.setAttribute(attrName, attrValue);
          document.head.appendChild(el);
        }
      };

      ensureHeadTag('meta[name="robots"]', 'meta', { name: 'robots' }, 'content', robotsValue);
      ensureHeadTag('meta[name="description"]', 'meta', { name: 'description' }, 'content', seo.description);
      ensureHeadTag('link[rel="canonical"]', 'link', { rel: 'canonical' }, 'href', seo.canonicalUrl);
      ensureHeadTag('meta[property="og:type"]', 'meta', { property: 'og:type' }, 'content', seo.ogType);
      ensureHeadTag('meta[property="og:title"]', 'meta', { property: 'og:title' }, 'content', seo.title);
      ensureHeadTag('meta[property="og:description"]', 'meta', { property: 'og:description' }, 'content', seo.description);
      ensureHeadTag('meta[property="og:url"]', 'meta', { property: 'og:url' }, 'content', seo.canonicalUrl);
      ensureHeadTag('meta[name="twitter:title"]', 'meta', { name: 'twitter:title' }, 'content', seo.title);
      ensureHeadTag('meta[name="twitter:description"]', 'meta', { name: 'twitter:description' }, 'content', seo.description);
      ensureHeadTag('meta[name="twitter:url"]', 'meta', { name: 'twitter:url' }, 'content', seo.canonicalUrl);

      // Remove any duplicate static route JSON-LD scripts (keep #organization-jsonld and React-managed scripts untouched)
      document.head
        .querySelectorAll(
          'script[type="application/ld+json"]:not([id="organization-jsonld"]):not([id="route-jsonld"])'
        )
        .forEach((el) => {
          if (!isReactManagedNode(el)) {
            el.remove();
          }
        });

      let routeJsonLdEl = document.head.querySelector(
        'script#route-jsonld[type="application/ld+json"]'
      ) as HTMLScriptElement | null;
      if (structuredDataJson) {
        if (!routeJsonLdEl) {
          routeJsonLdEl = document.createElement('script');
          routeJsonLdEl.type = 'application/ld+json';
          routeJsonLdEl.id = 'route-jsonld';
          document.head.appendChild(routeJsonLdEl);
        }
        routeJsonLdEl.textContent = structuredDataJson;
      } else if (routeJsonLdEl && !isReactManagedNode(routeJsonLdEl)) {
        routeJsonLdEl.remove();
      }
    };

    syncStaticTags();
    const timer = window.setTimeout(syncStaticTags, 50);
    return () => window.clearTimeout(timer);
  }, [
    currentRoute,
    seo.noIndex,
    cleanPath,
    seo.title,
    seo.description,
    seo.canonicalUrl,
    seo.ogType,
    structuredDataJson,
  ]);

  return null;
};
