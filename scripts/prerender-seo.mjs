import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PAGES_JSON_PATH = path.join(ROOT_DIR, 'src', 'data', 'seo-pages', 'pages.json');
const LOCATION_PAGES_JSON_PATH = path.join(
  ROOT_DIR,
  'src',
  'data',
  'location-seo',
  'location-pages.json'
);

const BASE_URL = 'https://www.iamtechni.in';
const COMPANY_NAME = 'IAMTECHNI';
const COMPANY_TELEPHONE = '+91-9385948951';
const COMPANY_EMAIL = 'info@iamtechni.in';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function replaceOrInsertHeadTag(html, regex, replacementTag) {
  if (regex.test(html)) {
    return html.replace(regex, replacementTag);
  }
  return html.replace('</head>', `    ${replacementTag}\n  </head>`);
}

function buildStaticRootHtml(page) {
  const sectionsHtml = (page.sections || [])
    .map((sec) => {
      const paragraphsHtml = (sec.paragraphs || [])
        .map((p) => `        <p>${escapeHtml(p)}</p>`)
        .join('\n');
      return `      <section>\n        <h2>${escapeHtml(sec.h2)}</h2>\n${paragraphsHtml}\n      </section>`;
    })
    .join('\n');

  const faqsHtml =
    page.faqs && page.faqs.length > 0
      ? `      <section>\n        <h2>Frequently Asked Questions</h2>\n` +
        page.faqs
          .map(
            (faq) =>
              `        <div>\n          <h3>${escapeHtml(faq.question)}</h3>\n          <p>${escapeHtml(faq.answer)}</p>\n        </div>`
          )
          .join('\n') +
        `\n      </section>`
      : '';

  const introHtml = page.intro
    ? `      <p class="intro">${escapeHtml(page.intro)}</p>\n`
    : '';

  return `\n      <main>\n        <h1>${escapeHtml(page.h1)}</h1>\n${introHtml}${sectionsHtml}\n${faqsHtml}\n      </main>\n    `;
}

function buildJsonLdScripts(page, canonicalUrl) {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonicalUrl}#service`,
    name: page.h1,
    serviceType: page.h1,
    description: page.metaDescription,
    url: canonicalUrl,
    provider: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: COMPANY_NAME,
      telephone: COMPANY_TELEPHONE,
      email: COMPANY_EMAIL,
      url: `${BASE_URL}/`,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Puducherry' },
      { '@type': 'AdministrativeArea', name: 'Tamil Nadu' },
      { '@type': 'Country', name: 'India' },
    ],
  };

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
        name: page.h1,
        item: canonicalUrl,
      },
    ],
  };

  const scripts = [
    `<script type="application/ld+json">${JSON.stringify(serviceSchema)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`,
  ];

  if (page.faqs && page.faqs.length > 0) {
    const faqSchema = {
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
    };
    scripts.push(`<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`);
  }

  return scripts.join('\n    ');
}

function renderServiceHtml(templateHtml, page) {
  const canonicalUrl = `${BASE_URL}/services/${page.slug}`;
  const escapedTitle = escapeHtml(page.seoTitle);
  const escapedDesc = escapeHtml(page.metaDescription);
  const escapedUrl = escapeHtml(canonicalUrl);

  let html = templateHtml;

  // 1. Replace <title> in-place
  html = replaceOrInsertHeadTag(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapedTitle}</title>`
  );

  // 2. Replace <meta name="description"> in-place
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="description"[\s\S]*?\/>/i,
    `<meta name="description" content="${escapedDesc}" />`
  );

  // 3. Replace <link rel="canonical"> in-place
  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel="canonical"[\s\S]*?\/>/i,
    `<link rel="canonical" href="${escapedUrl}" />`
  );

  // 4. Replace Open Graph tags in-place
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:url"[\s\S]*?\/>/i,
    `<meta property="og:url" content="${escapedUrl}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:title"[\s\S]*?\/>/i,
    `<meta property="og:title" content="${escapedTitle}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:description"[\s\S]*?\/>/i,
    `<meta property="og:description" content="${escapedDesc}" />`
  );

  // 5. Replace Twitter tags in-place
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:url"[\s\S]*?\/>/i,
    `<meta name="twitter:url" content="${escapedUrl}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:title"[\s\S]*?\/>/i,
    `<meta name="twitter:title" content="${escapedTitle}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:description"[\s\S]*?\/>/i,
    `<meta name="twitter:description" content="${escapedDesc}" />`
  );

  // 6. Inject JSON-LD scripts before </head>
  const jsonLdScripts = buildJsonLdScripts(page, canonicalUrl);
  html = html.replace('</head>', `    ${jsonLdScripts}\n  </head>`);

  // 7. Insert static HTML inside <div id="root">...</div>
  const staticBodyHtml = buildStaticRootHtml(page);
  html = html.replace('<div id="root"></div>', `<div id="root">${staticBodyHtml}</div>`);

  return html;
}

// =============================================================================
// LOCATION LANDING PAGES PRERENDER HELPERS
// =============================================================================

function buildLocationStaticRootHtml(page) {
  const highlightsHtml = (page.highlights || [])
    .map(
      (h) => `        <div>\n          <h3>${escapeHtml(h.title)}</h3>\n          <p>${escapeHtml(h.description)}</p>\n        </div>`
    )
    .join('\n');

  const sectionsHtml = (page.sections || [])
    .map((sec) => {
      const paragraphsHtml = (sec.paragraphs || [])
        .map((p) => `        <p>${escapeHtml(p)}</p>`)
        .join('\n');
      return `      <section>\n        <h2>${escapeHtml(sec.h2)}</h2>\n${paragraphsHtml}\n      </section>`;
    })
    .join('\n');

  const processHtml = (page.processSteps || [])
    .map(
      (step) => `        <div>\n          <h3>${escapeHtml(step.step)}: ${escapeHtml(step.title)}</h3>\n          <p>${escapeHtml(step.description)}</p>\n        </div>`
    )
    .join('\n');

  const faqsHtml =
    page.faqs && page.faqs.length > 0
      ? `      <section>\n        <h2>Frequently Asked Questions</h2>\n` +
        page.faqs
          .map(
            (faq) =>
              `        <div>\n          <h3>${escapeHtml(faq.question)}</h3>\n          <p>${escapeHtml(faq.answer)}</p>\n        </div>`
          )
          .join('\n') +
        `\n      </section>`
      : '';

  const localContextHtml = page.localContext
    ? `      <section>\n        <h2>Regional Commitment in ${escapeHtml(page.targetLocation.city)}</h2>\n        <p>${escapeHtml(page.localContext)}</p>\n      </section>`
    : '';

  const courseLinkHtml = page.matchingCoursePath
    ? `      <section>\n        <h2>Course Curriculum &amp; Syllabus</h2>\n        <p>Explore module details and practical exercises in our main directory: <a href="${page.matchingCoursePath}">View Course in Training Section</a>.</p>\n        <p>Contact our admissions desk via WhatsApp or phone for upcoming batch schedules, duration, and fee details.</p>\n      </section>`
    : '';

  const contactFooterText =
    page.category === 'Training'
      ? 'Hands-on Labs · Live Instructor Support'
      : '100% Code Ownership · Zero License Lock-in';

  const contactDetailsHtml = `      <section>\n        <h2>Regional Contact Details</h2>\n        <div>\n          <span>Enquiries: </span>\n          <a href="tel:+919385948951">+91 93859 48951</a>\n        </div>\n        <div>\n          <span>Direct Line: </span>\n          <a href="tel:+917418120053">+91 74181 20053</a>\n        </div>\n        <p>Engineering Hub: Puducherry &amp; Tamil Nadu, India</p>\n        <p>${escapeHtml(contactFooterText)}</p>\n      </section>`;

  return `\n      <main>\n        <h1>${escapeHtml(page.h1)}</h1>\n        <p class="intro">${escapeHtml(page.intro)}</p>\n${contactDetailsHtml}\n${courseLinkHtml}\n      <section>\n        <h2>Key Capabilities &amp; Advantages</h2>\n${highlightsHtml}\n      </section>\n${sectionsHtml}\n      <section>\n        <h2>Delivery Lifecycle</h2>\n${processHtml}\n      </section>\n${localContextHtml}\n${faqsHtml}\n      </main>\n    `;
}

function buildLocationJsonLdScripts(page, canonicalUrl) {
  const primarySchema =
    page.schemaType === 'Course'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Course',
          '@id': `${canonicalUrl}#course`,
          name: page.h1,
          description: page.metaDescription,
          url: canonicalUrl,
          provider: {
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
            name: COMPANY_NAME,
            telephone: COMPANY_TELEPHONE,
            email: COMPANY_EMAIL,
            url: `${BASE_URL}/`,
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${canonicalUrl}#service`,
          name: page.h1,
          serviceType: page.h1,
          description: page.metaDescription,
          url: canonicalUrl,
          provider: {
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
            name: COMPANY_NAME,
            telephone: COMPANY_TELEPHONE,
            email: COMPANY_EMAIL,
            url: `${BASE_URL}/`,
          },
          areaServed: [
            { '@type': 'City', name: page.targetLocation.city },
            { '@type': 'AdministrativeArea', name: page.targetLocation.region },
            { '@type': 'AdministrativeArea', name: page.targetLocation.state },
            { '@type': 'Country', name: 'India' },
          ],
        };

  const breadcrumbCategoryPath = page.category === 'Training' ? '/training' : '/services';
  const breadcrumbCategoryName = page.category === 'Training' ? 'Training & Courses' : 'Services';

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
        item: canonicalUrl,
      },
    ],
  };

  const scripts = [
    `<script type="application/ld+json">${JSON.stringify(primarySchema)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`,
  ];

  if (page.faqs && page.faqs.length > 0) {
    const faqSchema = {
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
    };
    scripts.push(`<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`);
  }

  return scripts.join('\n    ');
}

function renderLocationHtml(templateHtml, page) {
  // Canonical URL strictly uses trailing slash
  const canonicalUrl = page.canonicalUrl;
  const escapedTitle = escapeHtml(page.seoTitle);
  const escapedDesc = escapeHtml(page.metaDescription);
  const escapedUrl = escapeHtml(canonicalUrl);

  let html = templateHtml;

  // 1. Replace <title> in-place
  html = replaceOrInsertHeadTag(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapedTitle}</title>`
  );

  // 2. Replace <meta name="description"> in-place
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="description"[\s\S]*?\/>/i,
    `<meta name="description" content="${escapedDesc}" />`
  );

  // 3. Replace <link rel="canonical"> in-place
  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel="canonical"[\s\S]*?\/>/i,
    `<link rel="canonical" href="${escapedUrl}" />`
  );

  // 4. Replace Open Graph tags in-place
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:url"[\s\S]*?\/>/i,
    `<meta property="og:url" content="${escapedUrl}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:title"[\s\S]*?\/>/i,
    `<meta property="og:title" content="${escapedTitle}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:description"[\s\S]*?\/>/i,
    `<meta property="og:description" content="${escapedDesc}" />`
  );

  // 5. Replace Twitter tags in-place
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:url"[\s\S]*?\/>/i,
    `<meta name="twitter:url" content="${escapedUrl}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:title"[\s\S]*?\/>/i,
    `<meta name="twitter:title" content="${escapedTitle}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:description"[\s\S]*?\/>/i,
    `<meta name="twitter:description" content="${escapedDesc}" />`
  );

  // 6. Inject JSON-LD scripts before </head>
  const jsonLdScripts = buildLocationJsonLdScripts(page, canonicalUrl);
  html = html.replace('</head>', `    ${jsonLdScripts}\n  </head>`);

  // 7. Insert static HTML inside <div id="root">...</div>
  const staticBodyHtml = buildLocationStaticRootHtml(page);
  html = html.replace('<div id="root"></div>', `<div id="root">${staticBodyHtml}</div>`);

  return html;
}

function normalizeSitemapUrl(rawUrl) {
  let url = String(rawUrl || '').trim();
  url = url.replace(/^http:\/\//i, 'https://');
  if (!url.startsWith('https://')) {
    url = `https://${url.replace(/^\/+/, '')}`;
  }
  url = url.replace(/^https:\/\/iamtechni\.in/i, 'https://www.iamtechni.in');
  return url;
}

function mergeSitemapXml(locationPages = []) {
  const distSitemapPath = path.join(DIST_DIR, 'sitemap.xml');
  const publicSitemapPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
  let sourceXml = '';

  if (fs.existsSync(distSitemapPath)) {
    sourceXml = fs.readFileSync(distSitemapPath, 'utf-8');
  } else if (fs.existsSync(publicSitemapPath)) {
    sourceXml = fs.readFileSync(publicSitemapPath, 'utf-8');
  }

  const urlMap = new Map();

  // 1. Parse existing sitemap XML generated by generate-sitemap.mjs
  if (sourceXml) {
    const urlBlockRegex = /<url>([\s\S]*?)<\/url>/gi;
    let match;
    while ((match = urlBlockRegex.exec(sourceXml)) !== null) {
      const block = match[1];
      const locMatch = block.match(/<loc>([\s\S]*?)<\/loc>/i);
      if (!locMatch) continue;

      const rawLoc = locMatch[1].trim();
      const normalizedLoc = normalizeSitemapUrl(rawLoc);

      const changefreqMatch = block.match(/<changefreq>([\s\S]*?)<\/changefreq>/i);
      const priorityMatch = block.match(/<priority>([\s\S]*?)<\/priority>/i);
      const lastmodMatch = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i);

      urlMap.set(normalizedLoc, {
        loc: normalizedLoc,
        changefreq: changefreqMatch ? changefreqMatch[1].trim() : 'weekly',
        priority: priorityMatch ? priorityMatch[1].trim() : '0.8',
        lastmod: lastmodMatch ? lastmodMatch[1].trim() : undefined,
      });
    }
  }

  // Ensure homepage is present
  const homeUrl = `${BASE_URL}/`;
  if (!urlMap.has(homeUrl)) {
    urlMap.set(homeUrl, {
      loc: homeUrl,
      changefreq: 'daily',
      priority: '1.0',
    });
  } else {
    const homeEntry = urlMap.get(homeUrl);
    homeEntry.priority = '1.0';
    homeEntry.changefreq = 'daily';
  }

  // 2. Append and de-duplicate location pages from location-pages.json
  for (const page of locationPages) {
    const canonical = normalizeSitemapUrl(
      page.canonicalUrl || `${BASE_URL}/${page.slug}/`
    );
    const trailingSlashUrl = canonical.endsWith('/') ? canonical : `${canonical}/`;

    if (!urlMap.has(trailingSlashUrl)) {
      urlMap.set(trailingSlashUrl, {
        loc: trailingSlashUrl,
        changefreq: 'weekly',
        priority: '0.8',
      });
    }
  }

  // 3. Format complete sitemap XML
  const entries = Array.from(urlMap.values());
  const formattedEntries = entries
    .map((entry) => {
      const lines = [`  <url>`, `    <loc>${entry.loc}</loc>`];
      if (entry.lastmod) {
        lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
      }
      if (entry.changefreq) {
        lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      }
      if (entry.priority) {
        lines.push(`    <priority>${entry.priority}</priority>`);
      }
      lines.push(`  </url>`);
      return lines.join('\n');
    })
    .join('\n');

  const finalXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${formattedEntries}
</urlset>
`;

  return { finalXml, count: entries.length, entries };
}

function renderGeneralPageHtml(templateHtml, page) {
  const canonicalUrl = page.canonicalUrl;
  const escapedTitle = escapeHtml(page.seoTitle);
  const escapedDesc = escapeHtml(page.metaDescription);
  const escapedUrl = escapeHtml(canonicalUrl);

  let html = templateHtml;

  // 1. Replace <title> in-place
  html = replaceOrInsertHeadTag(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapedTitle}</title>`
  );

  // 2. Replace <meta name="description"> in-place
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="description"[\s\S]*?\/>/i,
    `<meta name="description" content="${escapedDesc}" />`
  );

  // 3. Replace <link rel="canonical"> in-place
  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel="canonical"[\s\S]*?\/>/i,
    `<link rel="canonical" href="${escapedUrl}" />`
  );

  // 4. Replace Open Graph tags in-place
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:url"[\s\S]*?\/>/i,
    `<meta property="og:url" content="${escapedUrl}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:title"[\s\S]*?\/>/i,
    `<meta property="og:title" content="${escapedTitle}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:description"[\s\S]*?\/>/i,
    `<meta property="og:description" content="${escapedDesc}" />`
  );
  if (page.ogType) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property="og:type"[\s\S]*?\/>/i,
      `<meta property="og:type" content="${escapeHtml(page.ogType)}" />`
    );
  }
  if (page.ogImage) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property="og:image"\s+content="[^"]*"[\s\S]*?\/>/i,
      `<meta property="og:image" content="${escapeHtml(page.ogImage)}" />`
    );
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+property="og:image:secure_url"\s+content="[^"]*"[\s\S]*?\/>/i,
      `<meta property="og:image:secure_url" content="${escapeHtml(page.ogImage)}" />`
    );
  }

  // 5. Replace Twitter tags in-place
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:url"[\s\S]*?\/>/i,
    `<meta name="twitter:url" content="${escapedUrl}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:title"[\s\S]*?\/>/i,
    `<meta name="twitter:title" content="${escapedTitle}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:description"[\s\S]*?\/>/i,
    `<meta name="twitter:description" content="${escapedDesc}" />`
  );
  if (page.ogImage) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name="twitter:image"\s+content="[^"]*"[\s\S]*?\/>/i,
      `<meta name="twitter:image" content="${escapeHtml(page.ogImage)}" />`
    );
  }

  // 6. Inject JSON-LD scripts before </head> if provided
  if (page.structuredData && page.structuredData.length > 0) {
    const jsonLdScript = `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': page.structuredData,
    })}</script>`;
    html = html.replace('</head>', `    ${jsonLdScript}\n  </head>`);
  }

  // 7. Insert static HTML inside <div id="root">...</div>
  const staticBodyHtml = `\n      <main>\n        <h1>${escapeHtml(page.h1)}</h1>\n        <p class="intro">${escapeHtml(page.intro)}</p>\n      </main>\n    `;
  html = html.replace('<div id="root"></div>', `<div id="root">${staticBodyHtml}</div>`);

  return html;
}

const STATIC_PAGE_HEADINGS = {
  '/services': {
    h1: 'Enterprise Engineering Services',
    intro:
      'Explore our specialized engineering disciplines spanning modern web experiences, custom business software, practical artificial intelligence, cloud DevOps, autonomous robotics, and digital growth.',
  },
  '/solutions': {
    h1: 'Business Solutions & Digital Transformation',
    intro:
      'We engineer custom solutions tailored to concrete organizational objectives: automating repetitive administrative operations, deploying verified private AI knowledge search, and modernizing legacy cloud systems.',
  },
  '/training': {
    h1: "Learn Tomorrow's Technology. Build Your Future.",
    intro:
      'Upgrade your skills with practical technology training in software development, cloud computing, artificial intelligence, cybersecurity, and DevOps. Explore your interests and connect with IAMTECHNI to find the right learning path.',
  },
  '/industries': {
    h1: 'Industry Technology Solutions & Specialized Practices',
    intro:
      'We deliver domain-specific digital platforms, automated workflows, and data pipelines engineered around the unique regulatory and operational realities of each sector.',
  },
  '/portfolio': {
    h1: 'Ideas Transformed into Digital Experiences',
    intro:
      'Explore our architectural case studies and demonstration projects. Each project breakdown details the underlying business challenge, architectural topology, technology stack, and verified outcomes.',
  },
  '/case-studies': {
    h1: 'Case Studies & Implementation Blueprints',
    intro:
      'Examine in-depth technical breakdowns of business challenges, solution architectures, tech stacks, and verified measurable outcomes.',
  },
  '/technology': {
    h1: 'The Right Tools for the Right Solution',
    intro:
      'We choose frameworks, databases, cloud runtimes, and models that emphasize durability, developer ergonomics, security, and sub-second performance without unnecessary vendor lock-in.',
  },
  '/insights': {
    h1: 'Ideas, Knowledge & Practical Engineering',
    intro:
      'Explore technical breakdowns, performance engineering studies, and practical lessons learned building modern software systems, written by our senior engineering team.',
  },
  '/about': {
    h1: 'Engineering Better Possibilities Through Technology',
    intro:
      'IAMTECHNI helps businesses and organizations explore, build and improve digital solutions through modern software development, intelligent technologies, cloud engineering and digital growth services.',
  },
  '/careers': {
    h1: 'Build Purposeful Technology with IAMTECHNI',
    intro:
      'We look for curious, disciplined software engineers, UI specialists, and AI practitioners who take pride in craftsmanship, readability, and real business impact.',
  },
  '/faq': {
    h1: 'Frequently Asked Questions',
    intro:
      'Find transparent answers about our engineering capabilities, engagement process, code ownership, pricing models, and security standards.',
  },
  '/contact': {
    h1: 'Let’s Engineer Your Next Digital Solution',
    intro:
      'Tell us what you want to build, modernize or automate. Reach us directly via phone, official email, or submit your project questionnaire below for an architecture discovery session within one business day.',
  },
  '/contact/consultation': {
    h1: 'Request a Technical Architecture Consultation',
    intro:
      'Meet directly with an IAMTECHNI solutions architect to review your technical requirements, architectural dependencies, and realistic timelines.',
  },
  '/privacy-policy': {
    h1: 'Privacy Policy',
    intro: 'How we collect, protect, and respect your personal information.',
  },
  '/terms': {
    h1: 'Terms and Conditions',
    intro:
      'The rules, terms, and agreements governing the use of IAMTECHNI services and website.',
  },
};

async function loadSeoHelperBundle() {
  const tmpPath = path.resolve(ROOT_DIR, 'node_modules', '.cache', 'prerender-helper-bundle.mjs');
  fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
  esbuild.buildSync({
    stdin: {
      contents: `
        export { resolveRouteSeo } from './src/components/common/SeoHead';
        export { solutionsData } from './src/data/solutionsData';
        export { industriesData } from './src/data/industriesData';
        export { coursesData } from './src/data/coursesData';
        export { insightsData } from './src/data/insightsData';
        export { projectsData } from './src/data/projectsData';
      `,
      resolveDir: ROOT_DIR,
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    outfile: tmpPath,
    external: ['react', 'react-helmet-async', 'react-router-dom', 'lucide-react', 'react-icons'],
  });
  return import(tmpPath);
}

async function main() {
  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing build template at ${templatePath}. Run "vite build" first.`);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf-8');
  const servicePages = JSON.parse(fs.readFileSync(PAGES_JSON_PATH, 'utf-8'));
  const locationPages = fs.existsSync(LOCATION_PAGES_JSON_PATH)
    ? JSON.parse(fs.readFileSync(LOCATION_PAGES_JSON_PATH, 'utf-8'))
    : [];

  // 1. Prerender Service pages into dist/services/<slug>/index.html
  for (const page of servicePages) {
    const outDir = path.join(DIST_DIR, 'services', page.slug);
    fs.mkdirSync(outDir, { recursive: true });
    const renderedHtml = renderServiceHtml(templateHtml, page);
    fs.writeFileSync(path.join(outDir, 'index.html'), renderedHtml, 'utf-8');
  }

  // 2. Prerender Location pages into dist/<slug>/index.html
  for (const page of locationPages) {
    const outDir = path.join(DIST_DIR, page.slug);
    fs.mkdirSync(outDir, { recursive: true });
    const renderedHtml = renderLocationHtml(templateHtml, page);
    fs.writeFileSync(path.join(outDir, 'index.html'), renderedHtml, 'utf-8');
  }

  // 3. Merge complete sitemap and write to dist/ and public/
  const { finalXml: sitemapXml, count: sitemapCount, entries: sitemapEntries } = mergeSitemapXml(locationPages);
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');

  const publicSitemapPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
  if (fs.existsSync(path.dirname(publicSitemapPath))) {
    fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf-8');
  }

  // 4. Load helper bundle for SEO metadata and data records
  const seoHelper = await loadSeoHelperBundle();
  const { resolveRouteSeo, solutionsData, industriesData, coursesData, insightsData, projectsData } = seoHelper;

  // Track URLs already handled
  const serviceUrlSet = new Set(servicePages.map((p) => `${BASE_URL}/services/${p.slug}`));
  const locationUrlSet = new Set(
    locationPages.map((p) => {
      const canonical = p.canonicalUrl || `${BASE_URL}/${p.slug}/`;
      return canonical.endsWith('/') ? canonical : `${canonical}/`;
    })
  );
  const homeUrl = `${BASE_URL}/`;

  let generalPrerenderedCount = 0;
  const missingDataRoutes = [];

  for (const entry of sitemapEntries) {
    const loc = entry.loc;
    // Skip homepage, service pages, and location pages (already handled)
    if (loc === homeUrl || serviceUrlSet.has(loc) || locationUrlSet.has(loc)) {
      continue;
    }

    const routePath = loc.replace(BASE_URL, '') || '/';
    const seo = resolveRouteSeo(routePath);

    let h1 = '';
    let intro = '';

    if (STATIC_PAGE_HEADINGS[routePath]) {
      h1 = STATIC_PAGE_HEADINGS[routePath].h1;
      intro = STATIC_PAGE_HEADINGS[routePath].intro;
    } else if (routePath.startsWith('/solutions/')) {
      const slug = routePath.replace('/solutions/', '');
      const s = solutionsData.find((item) => item.id === slug);
      if (s) {
        h1 = s.title;
        intro = s.summary;
      }
    } else if (routePath.startsWith('/industries/')) {
      const slug = routePath.replace('/industries/', '');
      const ind = industriesData.find((item) => item.id === slug);
      if (ind) {
        h1 = `${ind.name} Technology Solutions`;
        intro = ind.summary;
      }
    } else if (routePath.startsWith('/training/')) {
      const slug = routePath.replace('/training/', '');
      const c = coursesData.find((item) => item.id === slug);
      if (c) {
        h1 = `${c.title} Training Course`;
        intro = c.description;
      }
    } else if (routePath.startsWith('/insights/')) {
      const slug = routePath.replace('/insights/', '');
      const art = insightsData.find((item) => item.slug === slug);
      if (art) {
        h1 = art.title;
        intro = art.excerpt;
      }
    } else if (routePath.startsWith('/case-studies/')) {
      const slug = routePath.replace('/case-studies/', '');
      const cs = projectsData.find((item) => item.id === slug);
      if (cs) {
        h1 = cs.title;
        intro = cs.tagline;
      }
    }

    if (!h1 || !intro || !seo || !seo.title || !seo.description) {
      missingDataRoutes.push(routePath);
    }

    const pageData = {
      canonicalUrl: loc,
      seoTitle: seo.title,
      metaDescription: seo.description,
      ogType: seo.ogType,
      ogImage: seo.ogImage,
      structuredData: seo.structuredData,
      h1: h1 || seo.title,
      intro: intro || seo.description,
    };

    // Calculate disk output path: dist/<path-segments>/index.html
    const relSegments = routePath.replace(/^\/+/, '').replace(/\/+$/, '').split('/');
    const outDir = path.join(DIST_DIR, ...relSegments);
    fs.mkdirSync(outDir, { recursive: true });
    const renderedHtml = renderGeneralPageHtml(templateHtml, pageData);
    fs.writeFileSync(path.join(outDir, 'index.html'), renderedHtml, 'utf-8');
    generalPrerenderedCount++;
  }

  const totalPrerendered = servicePages.length + locationPages.length + generalPrerenderedCount;

  console.log(
    `[prerender-seo] Prerendered ${servicePages.length} service pages into dist/services/<slug>/index.html.`
  );
  console.log(
    `[prerender-seo] Prerendered ${locationPages.length} location pages into dist/<slug>/index.html.`
  );
  console.log(
    `[prerender-seo] Prerendered ${generalPrerenderedCount} general site pages into dist/<path>/index.html.`
  );
  console.log(
    `[prerender-seo] Total prerendered pages: ${totalPrerendered} (Total with homepage: ${totalPrerendered + 1}).`
  );
  console.log(
    `[prerender-seo] Merged and wrote complete sitemap.xml with ${sitemapCount} URLs to dist/ and public/.`
  );

  if (missingDataRoutes.length > 0) {
    console.warn(`[prerender-seo] Missing data for ${missingDataRoutes.length} routes:`, missingDataRoutes);
  } else {
    console.log('[prerender-seo] All routes resolved data successfully. Zero missing routes.');
  }
}

main().catch((err) => {
  console.error('[prerender-seo] Error in prerender-seo.mjs:', err);
  process.exit(1);
});

