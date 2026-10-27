import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

  return `\n      <main>\n        <h1>${escapeHtml(page.h1)}</h1>\n        <p class="intro">${escapeHtml(page.intro)}</p>\n      <section>\n        <h2>Key Capabilities &amp; Advantages</h2>\n${highlightsHtml}\n      </section>\n${sectionsHtml}\n      <section>\n        <h2>Delivery Lifecycle</h2>\n${processHtml}\n      </section>\n${localContextHtml}\n${faqsHtml}\n      </main>\n    `;
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

function generateSitemapXml(servicePages, locationPages = []) {
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    {
      loc: `${BASE_URL}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0',
    },
    ...servicePages.map((p) => ({
      loc: `${BASE_URL}/services/${p.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    })),
    ...locationPages.map((p) => ({
      loc: p.canonicalUrl, // includes trailing slash e.g. https://www.iamtechni.in/.../
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ];

  const urlEntries = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

function main() {
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

  // 3. Regenerate and write sitemap.xml to dist/ and public/
  const sitemapXml = generateSitemapXml(servicePages, locationPages);
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');

  const publicSitemapPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
  if (fs.existsSync(path.dirname(publicSitemapPath))) {
    fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf-8');
  }

  console.log(
    `[prerender-seo] Prerendered ${servicePages.length} service pages into dist/services/<slug>/index.html.`
  );
  console.log(
    `[prerender-seo] Prerendered ${locationPages.length} location pages into dist/<slug>/index.html.`
  );
  console.log(
    `[prerender-seo] Regenerated sitemap.xml with ${servicePages.length + locationPages.length + 1} URLs.`
  );
}

main();
