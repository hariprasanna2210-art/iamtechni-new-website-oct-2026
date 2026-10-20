import React, { useEffect } from 'react';
import { PageRoute, ServiceItem, IndustryItem, ArticleItem } from '../../types';
import { servicesData } from '../../data/servicesData';
import { industriesData } from '../../data/industriesData';
import { insightsData } from '../../data/insightsData';
import { projectsData } from '../../data/projectsData';
import { coursesData } from '../../data/coursesData';
import { careersData } from '../../data/careersData';
import { COMPANY_CONTACT } from '../../data/companyInfo';

const BASE_URL = COMPANY_CONTACT.website; // https://www.iamtechni.in

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

interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'article';
  ogImage: string;
  structuredData: Record<string, unknown>[];
}

function findServiceBySlug(slug: string): ServiceItem | undefined {
  const exact = servicesData.find((s) => s.slug === slug || s.id === slug);
  if (exact) return exact;

  const aliasMap: Record<string, string> = {
    'website-development': 'web-development',
    'web-development': 'website-development',
    'ecommerce-development': 'ecommerce',
    ecommerce: 'ecommerce-development',
    'custom-software-development': 'custom-software',
    'custom-software': 'custom-software-development',
    'mobile-app-development': 'mobile-apps',
    'mobile-apps': 'mobile-app-development',
    'cloud-computing': 'cloud-devops',
    devops: 'cloud-devops',
    'cloud-devops': 'devops',
    'cloud-migration': 'cloud-devops',
    'robotics-emerging-tech': 'robotics',
    robotics: 'robotics-emerging-tech',
    seo: 'digital-marketing',
    'social-media-marketing': 'digital-marketing',
    'generative-ai': 'ai-machine-learning',
  };

  const targetSlug = aliasMap[slug];
  return targetSlug
    ? servicesData.find((s) => s.slug === targetSlug || s.id === targetSlug)
    : undefined;
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

function resolveRouteSeo(route: PageRoute): SeoMetadata {
  const cleanPath = route === '/' ? '/' : route.replace(/\/+$/, '');
  const canonicalUrl = `${BASE_URL}${cleanPath}`;
  const defaultImage = COMPANY_CONTACT.logoUrl;
  const structuredData: Record<string, unknown>[] = [];

  // 1. Home Page
  if (cleanPath === '/') {
    return {
      title: 'IAMTECHNI | Enterprise Software, AI & Cloud Engineering (Puducherry & Tamil Nadu)',
      description:
        'Enterprise software engineering, applied AI & RAG systems, Next.js web platforms, and cloud infrastructure delivered from Puducherry & Tamil Nadu for global teams.',
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData: [],
    };
  }

  // 2. Individual Service Detail Page (/services/:slug)
  if (cleanPath.startsWith('/services/') && cleanPath !== '/services/training') {
    const slug = cleanPath.replace('/services/', '');
    const service = findServiceBySlug(slug);
    if (service) {
      structuredData.push(
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.title, path: cleanPath },
        ])
      );

      // Service Schema
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: service.title,
        serviceType: service.category,
        description: service.summary || service.tagline,
        url: canonicalUrl,
        provider: {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: COMPANY_CONTACT.name,
          telephone: COMPANY_CONTACT.phone,
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

      // Service FAQs if available
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
        title: `${service.title} Services | IAMTECHNI Engineering`,
        description: `${service.tagline} ${service.summary}`.slice(0, 160),
        canonicalUrl,
        ogType: 'website',
        ogImage: defaultImage,
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
      title: 'Services Directory — AI, Web, Cloud & Custom Software | IAMTECHNI',
      description: `Explore IAMTECHNI's ${servicesData.length}+ engineering capabilities across Web Development, AI & Machine Learning, Custom Software, Cloud & DevOps, and Technical SEO.`,
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 4. Individual Industry Detail Page (/industries/:slug)
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
        title: `${industry.name} Technology Solutions | IAMTECHNI`,
        description: industry.summary.slice(0, 160),
        canonicalUrl,
        ogType: 'website',
        ogImage: defaultImage,
        structuredData,
      };
    }
  }

  // 5. Industries Directory (/industries)
  if (cleanPath === '/industries') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
      ])
    );
    return {
      title: 'Industry Technology Solutions & Vertical Architectures | IAMTECHNI',
      description: `Tailored digital platforms, AI automation, and cloud engineering across ${industriesData.map((i) => i.name).join(', ')}.`,
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 6. Individual Insight Article Page (/insights/:slug)
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
        title: `${article.title} | IAMTECHNI Insights`,
        description: article.excerpt.slice(0, 160),
        canonicalUrl,
        ogType: 'article',
        ogImage: defaultImage,
        structuredData,
      };
    }
  }

  // 7. Insights Directory (/insights)
  if (cleanPath === '/insights') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Insights & Research', path: '/insights' },
      ])
    );
    return {
      title: 'Engineering Insights, AI Architecture & Cloud Field Notes | IAMTECHNI',
      description:
        'Deep-dive technical articles on enterprise RAG architectures, cloud FinOps optimization, Core Web Vitals performance, and modern software engineering.',
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 8. Case Study Detail (/case-studies/:slug)
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
        title: `${project.title} — Case Study | IAMTECHNI`,
        description: project.tagline.slice(0, 160),
        canonicalUrl,
        ogType: 'article',
        ogImage: defaultImage,
        structuredData,
      };
    }
  }

  // 9. Case Studies Directory (/case-studies)
  if (cleanPath === '/case-studies') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Case Studies', path: '/case-studies' },
      ])
    );
    return {
      title: 'Engineering Case Studies & Reference Architectures | IAMTECHNI',
      description: `Explore ${projectsData.length} technical case studies covering headless commerce, enterprise AI assistants, cloud migrations, and high-speed web platforms.`,
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 10. Portfolio (/portfolio)
  if (cleanPath === '/portfolio') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/portfolio' },
      ])
    );
    return {
      title: 'Portfolio & Engineered Digital Products | IAMTECHNI',
      description: `Review ${projectsData.length} production architectures and software solutions delivered by IAMTECHNI across AI, e-commerce, cloud, and enterprise portals.`,
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 11. Solutions (/solutions)
  if (cleanPath === '/solutions') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Solutions', path: '/solutions' },
      ])
    );
    return {
      title: 'Enterprise Digital Solutions & Business Automation | IAMTECHNI',
      description:
        'End-to-end business solutions including AI document intelligence, workflow automation, cloud infrastructure modernization, and custom KPI dashboards.',
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 12. Training (/training, /courses, /services/training)
  if (cleanPath === '/training' || cleanPath === '/courses' || cleanPath === '/services/training') {
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
      title: `IT Training Courses — Full Stack, AI, Cloud & DevOps (${coursesData.length} Programs) | IAMTECHNI`,
      description: `Hands-on technical training and corporate upskilling across ${coursesData.length} programs including Full Stack Development, AI & Machine Learning, AWS Cloud, and DevOps.`,
      canonicalUrl: trainingCanonical,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 13. Technology Stack (/technology)
  if (cleanPath === '/technology') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Technology Stack', path: '/technology' },
      ])
    );
    return {
      title: 'Technology Stack — React, Next.js, Python, AI & Cloud | IAMTECHNI',
      description:
        'Explore the production technologies powering IAMTECHNI solutions: React, Next.js, TypeScript, Python, FastAPI, LangChain, AWS, Azure, Docker, and Kubernetes.',
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 14. About (/about)
  if (cleanPath === '/about') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'About IAMTECHNI', path: '/about' },
      ])
    );
    return {
      title: 'About IAMTECHNI — Software, AI & Cloud Engineering Practice',
      description:
        'Learn about IAMTECHNI’s engineering principles, 7-stage agile delivery lifecycle, and commitment to building resilient software, AI, and cloud platforms.',
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 15. Careers (/careers)
  if (cleanPath === '/careers') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Careers', path: '/careers' },
      ])
    );
    return {
      title: `Careers & Open Engineering Roles (${careersData.length} Openings) | IAMTECHNI`,
      description: `Join IAMTECHNI's engineering team. Explore ${careersData.length} open roles across Full-Stack Development, AI & RAG Engineering, and Cloud DevOps.`,
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 16. Contact & Consultation (/contact, /contact/consultation)
  if (cleanPath === '/contact/consultation') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
        { name: 'Request Consultation', path: '/contact/consultation' },
      ])
    );
    return {
      title: 'Request an Architecture & Engineering Consultation | IAMTECHNI',
      description: `Schedule a 1-on-1 technical discovery session with IAMTECHNI architects. Direct phone: ${COMPANY_CONTACT.phone} | Email: ${COMPANY_CONTACT.email}.`,
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
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
      title: 'Contact IAMTECHNI — Start Your Software, AI or Cloud Project',
      description: `Get in touch with IAMTECHNI in Puducherry & Tamil Nadu. Call ${COMPANY_CONTACT.phone} or email ${COMPANY_CONTACT.email} for software, AI, and cloud inquiries.`,
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 17. FAQ Page (/faq) with FAQPage Schema
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
      title: 'Frequently Asked Questions (FAQ) | IAMTECHNI Engineering',
      description:
        'Find transparent answers about IAMTECHNI’s software engineering services, 100% IP ownership, 7-stage delivery lifecycle, AI data privacy, and engagement models.',
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // 18. Legal Pages (/privacy-policy, /terms)
  if (cleanPath === '/privacy-policy') {
    structuredData.push(
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy-policy' },
      ])
    );
    return {
      title: 'Privacy Policy & Data Protection Standards | IAMTECHNI',
      description:
        'Read IAMTECHNI’s Privacy Policy detailing how we handle inquiry data, cookies, security safeguards, and client confidentiality.',
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
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
      title: 'Terms of Use & Service Conditions | IAMTECHNI',
      description:
        'Review IAMTECHNI’s Terms of Use governing website access, intellectual property rights, and professional technology services.',
      canonicalUrl,
      ogType: 'website',
      ogImage: defaultImage,
      structuredData,
    };
  }

  // Fallback
  return {
    title: 'IAMTECHNI | Enterprise Software, AI & Cloud Engineering',
    description:
      'Enterprise software engineering, applied AI & RAG systems, Next.js web platforms, and cloud infrastructure delivered by IAMTECHNI.',
    canonicalUrl,
    ogType: 'website',
    ogImage: defaultImage,
    structuredData,
  };
}

function setOrCreateMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOrCreateLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export interface SeoHeadProps {
  currentRoute: PageRoute;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ currentRoute }) => {
  useEffect(() => {
    const seo = resolveRouteSeo(currentRoute);

    // 1. Update Document Title
    document.title = seo.title;

    // 2. Update Standard Meta & Canonical Link
    setOrCreateMeta('name', 'description', seo.description);
    setOrCreateLink('canonical', seo.canonicalUrl);

    // 3. Update Open Graph Tags
    setOrCreateMeta('property', 'og:title', seo.title);
    setOrCreateMeta('property', 'og:description', seo.description);
    setOrCreateMeta('property', 'og:url', seo.canonicalUrl);
    setOrCreateMeta('property', 'og:type', seo.ogType);
    setOrCreateMeta('property', 'og:image', seo.ogImage);
    setOrCreateMeta('property', 'og:site_name', COMPANY_CONTACT.name);

    // 4. Update Twitter Card Tags
    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', seo.title);
    setOrCreateMeta('name', 'twitter:description', seo.description);
    setOrCreateMeta('name', 'twitter:image', seo.ogImage);

    // 5. Inject/Update Route-Specific JSON-LD (Service, FAQPage, BreadcrumbList, Article)
    const scriptId = 'route-structured-data';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (seo.structuredData.length > 0) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': seo.structuredData,
      });
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [currentRoute]);

  return null;
};
