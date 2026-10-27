import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  PageRoute,
  ServiceItem,
  IndustryItem,
  ArticleItem,
  SolutionItem,
  CourseItem,
} from '../../types';
import { servicesData, getCanonicalServiceSlug } from '../../data/servicesData';
import { solutionsData } from '../../data/solutionsData';
import { industriesData } from '../../data/industriesData';
import { insightsData } from '../../data/insightsData';
import { projectsData } from '../../data/projectsData';
import { coursesData } from '../../data/coursesData';
import { careersData } from '../../data/careersData';
import { COMPANY_CONTACT } from '../../data/companyInfo';
import { PRIMARY_PHONE, SCHEMA_TELEPHONE } from '../../constants/contact';

const BASE_URL = COMPANY_CONTACT.website; // https://www.iamtechni.in
const DEFAULT_OG_IMAGE = COMPANY_CONTACT.ogImageUrl; // https://www.iamtechni.in/og-image.png

export const FAQ_PAGE_ITEMS = [
  {
    question: 'What core services does IAMTECHNI provide?',
    answer:
      'IAMTECHNI provides 17 engineering and digital growth disciplines spanning Website Design and Development, Custom Software Engineering, AI & Machine Learning, Generative AI Solutions, E-commerce, Mobile Apps, Cloud Computing, DevOps, Data Analytics, Cybersecurity Hardening, and Technical SEO.',
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
}

/**
 * Formats any page description so that it is concise and search-engine friendly (120-160 characters).
 */
export function formatMetaDescription(primaryText: string, extraContext?: string): string {
  const baseSuffix = extraContext
    ? ` ${extraContext} Partner with IAMTECHNI for custom software, AI, and cloud engineering.`
    : ' Partner with IAMTECHNI in Puducherry & Tamil Nadu for enterprise software, AI, and cloud engineering.';

  let combined = primaryText.replace(/\s+/g, ' ').trim();
  if (combined.length < 150) {
    if (!/[.!?]$/.test(combined)) {
      combined += '.';
    }
    combined = `${combined}${baseSuffix}`.replace(/\s+/g, ' ').trim();
  }
  while (combined.length < 150) {
    combined = `${combined} Explore scalable architectures at IAMTECHNI.`.replace(/\s+/g, ' ').trim();
  }

  if (combined.length >= 150 && combined.length <= 160) {
    return combined;
  }

  const slice159 = combined.slice(0, 159);
  const lastSpace = slice159.lastIndexOf(' ');
  if (lastSpace >= 150) {
    const trimmed = slice159.slice(0, lastSpace).replace(/[,;:\-–—\s]+$/, '');
    if (trimmed.length >= 150 && trimmed.length <= 159) {
      return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
    }
  }

  const exact = combined.slice(0, 156).replace(/[,;:\-–—.\s]+$/, '');
  if (exact.length >= 147) {
    return `${exact}...`;
  }
  return `${combined.slice(0, 157)}...`;
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

  // 1. Home Page (/) — Synchronized with root index.html
  if (cleanPath === '/') {
    return {
      ...baseMeta,
      title: 'IAMTECHNI | Digital Solutions for Businesses',
      description:
        'Grow your business with IAMTECHNI. Website development, mobile apps, custom software, SEO, digital marketing and branding.',
      canonicalUrl: 'https://www.iamtechni.in/',
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData: [],
    };
  }

  // 2. Individual Service Detail Page (/services/:slug)
  if (cleanPath.startsWith('/services/')) {
    const slug = cleanPath.replace('/services/', '');
    const service = findServiceBySlug(slug);
    if (service) {
      const serviceCanonicalPath = `/services/${service.slug || service.id}`;
      const serviceCanonicalUrl = `${BASE_URL}${serviceCanonicalPath}`;

      structuredData.push(
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.title, path: serviceCanonicalPath },
        ])
      );

      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${serviceCanonicalUrl}#service`,
        name: service.title,
        serviceType: service.category,
        description: service.summary || service.tagline,
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
          { '@type': 'AdministrativeArea', name: 'Puducherry' },
          { '@type': 'AdministrativeArea', name: 'Tamil Nadu' },
          { '@type': 'Country', name: 'India' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${service.title} Capabilities`,
          itemListElement: service.capabilities.map((cap) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: cap.title,
              description: cap.description,
            },
          })),
        },
      });

      if (service.faqs && service.faqs.length > 0) {
        structuredData.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: service.faqs.map((faq) => ({
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
        title: `${service.title} Services | IAMTECHNI`,
        description: formatMetaDescription(
          `${service.title}: ${service.summary} ${service.tagline}`,
          service.category
        ),
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
      title: 'Services Directory — AI, Web, Cloud & Custom Software | IAMTECHNI',
      description: formatMetaDescription(
        `Explore IAMTECHNI's ${servicesData.length} engineering disciplines across Web Development, AI & Machine Learning, Custom Software, Cloud & DevOps, and Technical SEO.`
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
        title: `${solution.title} — Business Solution | IAMTECHNI`,
        description: formatMetaDescription(
          `${solution.title}: ${solution.summary} ${solution.proposedApproach}`,
          `${solution.category} architecture by IAMTECHNI.`
        ),
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
      title: 'Enterprise Digital Solutions & Business Automation | IAMTECHNI',
      description: formatMetaDescription(
        'End-to-end business solutions including AI document intelligence, workflow automation, cloud infrastructure modernization, and custom KPI dashboards by IAMTECHNI.'
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
      structuredData.push(
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' },
          { name: industry.name, path: cleanPath },
        ])
      );
      return {
        ...baseMeta,
        title: `${industry.name} Technology Solutions | IAMTECHNI`,
        description: formatMetaDescription(
          `${industry.name}: ${industry.summary}`,
          industry.iamtechniSolutions[0]
        ),
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
      title: 'Industry Technology Solutions & Vertical Architectures | IAMTECHNI',
      description: formatMetaDescription(
        `Tailored digital platforms, AI automation, and cloud engineering across ${industriesData.map((i) => i.name).join(', ')} delivered by IAMTECHNI.`
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
        provider: {
          '@type': 'Organization',
          name: COMPANY_CONTACT.name,
          sameAs: `${BASE_URL}/`,
        },
      });
      return {
        ...baseMeta,
        title: `${course.title} Training Course — ${course.category} | IAMTECHNI`,
        description: formatMetaDescription(
          `${course.title} Training: ${course.description} ${course.subtitle}`,
          `${course.category} course at IAMTECHNI.`
        ),
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
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'IAMTECHNI Technical Training Programs',
      itemListElement: coursesData.map((course, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Course',
          name: course.title,
          description: course.subtitle || course.description,
          provider: {
            '@type': 'Organization',
            name: COMPANY_CONTACT.name,
            sameAs: `${BASE_URL}/`,
          },
        },
      })),
    });
    return {
      ...baseMeta,
      title: `IT Training Courses — Full Stack, AI, Cloud & DevOps (${coursesData.length} Programs) | IAMTECHNI`,
      description: formatMetaDescription(
        `Hands-on technical training and corporate upskilling across ${coursesData.length} programs including Full Stack Development, AI & Machine Learning, AWS Cloud, and DevOps.`
      ),
      canonicalUrl: trainingCanonical,
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
        title: `${article.title} | IAMTECHNI Insights`,
        description: formatMetaDescription(
          article.excerpt,
          `${article.category} engineering insights by ${article.author.name}.`
        ),
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
      title: 'Engineering Insights, AI Architecture & Cloud Field Notes | IAMTECHNI',
      description: formatMetaDescription(
        'Deep-dive technical articles on enterprise RAG architectures, cloud FinOps optimization, Core Web Vitals performance, and modern software engineering by IAMTECHNI.'
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
        title: `${project.title} — Case Study | IAMTECHNI`,
        description: formatMetaDescription(
          `${project.title}: ${project.tagline} ${project.challenge}`,
          `${project.industry} case study.`
        ),
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
      title: 'Engineering Case Studies & Reference Architectures | IAMTECHNI',
      description: formatMetaDescription(
        `Explore ${projectsData.length} technical case studies covering headless commerce, enterprise AI assistants, cloud migrations, and high-speed web platforms by IAMTECHNI.`
      ),
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
      title: 'Portfolio & Engineered Digital Products | IAMTECHNI',
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
      title: 'Technology Stack — React, Next.js, Python, AI & Cloud | IAMTECHNI',
      description: formatMetaDescription(
        'Explore the production technologies powering IAMTECHNI solutions: React, Next.js, TypeScript, Python, FastAPI, LangChain, AWS, Azure, Docker, and Kubernetes.'
      ),
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
      title: 'About IAMTECHNI — Software, AI & Cloud Engineering Practice',
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
      title: `Careers & Open Engineering Roles (${careersData.length} Openings) | IAMTECHNI`,
      description: formatMetaDescription(
        `Join IAMTECHNI's engineering team in Puducherry & Tamil Nadu. Explore ${careersData.length} open roles across Full-Stack Development, AI & RAG Engineering, and Cloud DevOps.`
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
      title: 'Request an Architecture & Engineering Consultation | IAMTECHNI',
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
      title: 'Contact IAMTECHNI — Start Your Software, AI or Cloud Project',
      description: formatMetaDescription(
        `Get in touch with IAMTECHNI in Puducherry & Tamil Nadu, India. Call ${PRIMARY_PHONE} or email ${COMPANY_CONTACT.email} for software, AI, and cloud inquiries.`
      ),
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
      title: 'Frequently Asked Questions (FAQ) | IAMTECHNI Engineering',
      description: formatMetaDescription(
        'Find transparent answers about IAMTECHNI’s software engineering services, 100% IP ownership, 7-stage delivery lifecycle, AI data privacy, and engagement models.'
      ),
      canonicalUrl,
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
      title: 'Privacy Policy & Data Protection Standards | IAMTECHNI',
      description: formatMetaDescription(
        'Read IAMTECHNI’s Privacy Policy detailing how we collect, protect, and process inquiry data, cookies, security safeguards, and enterprise client confidentiality.'
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
      title: 'Terms of Use & Service Conditions | IAMTECHNI',
      description: formatMetaDescription(
        'Review IAMTECHNI’s Terms of Use governing website access, intellectual property ownership, software engineering deliverables, and professional technology services.'
      ),
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData,
    };
  }

  // Fallback
  return {
    ...baseMeta,
    title: 'IAMTECHNI | Digital Solutions for Businesses',
    description:
      'Grow your business with IAMTECHNI. Website development, mobile apps, custom software, SEO, digital marketing and branding.',
    canonicalUrl,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    structuredData,
  };
}

export interface SeoHeadProps {
  currentRoute: PageRoute;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ currentRoute }) => {
  const seo = resolveRouteSeo(currentRoute);

  // Remove initial static description/canonical tags once react-helmet-async mounts its managed tags
  useEffect(() => {
    const descTags = document.head.querySelectorAll('meta[name="description"]:not([data-rh])');
    if (document.head.querySelector('meta[name="description"][data-rh]') && descTags.length > 0) {
      descTags.forEach((el) => el.remove());
    }
    const canonicalTags = document.head.querySelectorAll('link[rel="canonical"]:not([data-rh])');
    if (document.head.querySelector('link[rel="canonical"][data-rh]') && canonicalTags.length > 0) {
      canonicalTags.forEach((el) => el.remove());
    }
  }, [currentRoute]);

  return (
    <Helmet prioritizeSeoTags>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonicalUrl} />
      {seo.structuredData.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': seo.structuredData,
          })}
        </script>
      )}
    </Helmet>
  );
};
