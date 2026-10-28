import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';
import { SitemapStream, streamToPromise } from 'sitemap';
import sharp from 'sharp';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOSTNAME = 'https://www.iamtechni.in';
const publicDir = path.resolve(__dirname, 'public');
const sitemapOutputPath = path.resolve(publicDir, 'sitemap.xml');
const ogImageOutputPath = path.resolve(publicDir, 'og-image.png');
const officialLogoPath = path.resolve(publicDir, 'iamtechni-logo.png');

/**
 * Loads a TypeScript data module in pure Node by transpile-stripping types via esbuild.
 */
async function loadTsDataModule(relFilePath) {
  const fullPath = path.resolve(__dirname, relFilePath);
  const tsSource = fs.readFileSync(fullPath, 'utf-8');
  // Replace local relative imports (like companyInfo and contact constants) if needed or inline them
  const cleanedSource = tsSource
    .replace(
      /import\s+\{\s*COMPANY_CONTACT\s*\}\s+from\s+['"]\.\/companyInfo['"];?/g,
      'const COMPANY_CONTACT = { phone: "+91 93859 48951", email: "info@iamtechni.in", website: "https://www.iamtechni.in" };'
    )
    .replace(
      /import\s+\{[^}]*\}\s+from\s+['"]\.\.\/constants\/contact['"];?/g,
      'const PRIMARY_PHONE = "+91 93859 48951"; const PRIMARY_PHONE_LINK = "+919385948951"; const SECONDARY_PHONE = "+91 74181 20053"; const SECONDARY_PHONE_LINK = "+917418120053"; const WHATSAPP_LINK = "https://wa.me/919385948951"; const SCHEMA_TELEPHONE = "+91-9385948951";'
    );
  const { code } = esbuild.transformSync(cleanedSource, {
    loader: 'ts',
    format: 'esm',
  });
  const dataUrl = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
  return import(dataUrl);
}

/**
 * 1. Generate 1200 × 630 px PNG Open Graph Image (public/og-image.png)
 *    - Light blue background (#EAF1FD to #DCE7FA)
 *    - Official logo (public/iamtechni-logo.png)
 *    - Headline: "Build Smarter. Innovate Faster. Grow Further."
 *    - Line: "Websites · Mobile Apps · Custom Software · AI · SEO"
 *    - At least 60px padding from all edges
 */
async function generateOgImage() {
  const width = 1200;
  const height = 630;

  const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EAF1FD" />
          <stop offset="100%" stop-color="#DCE7FA" />
        </linearGradient>
        <radialGradient id="soft-glow-top" cx="18%" cy="18%" r="45%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="soft-glow-bottom" cx="85%" cy="82%" r="45%">
          <stop offset="0%" stop-color="#93C5FD" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#93C5FD" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="accent-bar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2563EB" />
          <stop offset="50%" stop-color="#06B6D4" />
          <stop offset="100%" stop-color="#4F46E5" />
        </linearGradient>
      </defs>

      <!-- Light Blue Background (#EAF1FD to #DCE7FA) -->
      <rect width="${width}" height="${height}" fill="url(#bg-gradient)" />
      <rect width="${width}" height="${height}" fill="url(#soft-glow-top)" />
      <rect width="${width}" height="${height}" fill="url(#soft-glow-bottom)" />

      <!-- Safe Frame Container (80px horizontal padding, 68px vertical padding -> well over 60px minimum) -->
      <rect x="80" y="68" width="1040" height="494" rx="28" fill="#FFFFFF" fill-opacity="0.86" stroke="#BFDBFE" stroke-width="2" />
      <rect x="80" y="68" width="1040" height="8" rx="4" fill="url(#accent-bar)" />

      <!-- Headline (well within 80px+ safe padding on both sides) -->
      <text
        x="600"
        y="348"
        text-anchor="middle"
        font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif"
        font-size="35"
        font-weight="bold"
        fill="#0F172A"
      >
        Build Smarter. Innovate Faster. Grow Further.
      </text>

      <!-- Divider Pill / Services Line -->
      <rect x="210" y="394" width="780" height="54" rx="27" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1.5" />
      <text
        x="600"
        y="428"
        text-anchor="middle"
        font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif"
        font-size="21"
        font-weight="bold"
        fill="#1D4ED8"
      >
        Websites · Mobile Apps · Custom Software · AI · SEO
      </text>

      <!-- Domain Footer inside safe padding -->
      <text
        x="600"
        y="516"
        text-anchor="middle"
        font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif"
        font-size="16"
        font-weight="bold"
        letter-spacing="1"
        fill="#334155"
      >
        www.iamtechni.in
      </text>
    </svg>
  `;

  const composites = [];
  if (fs.existsSync(officialLogoPath)) {
    const logoWidth = 390;
    const logoHeight = 130;
    const resizedLogo = await sharp(officialLogoPath)
      .resize({
        width: logoWidth,
        height: logoHeight,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    composites.push({
      input: resizedLogo,
      top: 125, // >= 60px from top
      left: Math.round((width - logoWidth) / 2), // >= 60px from left/right
    });
  }

  await sharp(Buffer.from(svgOverlay))
    .resize(width, height)
    .composite(composites)
    .png({ quality: 95 })
    .toFile(ogImageOutputPath);

  console.log(`[SEO] Generated ${ogImageOutputPath} (1200x630 PNG)`);
}

/**
 * 2. Build public/sitemap.xml using the "sitemap" package
 *    Priorities:
 *    - home: 1.0 (daily)
 *    - main pages: 0.8 (weekly)
 *    - detail pages: 0.7 (weekly)
 *    - contact: 0.5 (monthly)
 *    - legal: 0.3 (yearly)
 */
async function generateSitemap() {
  const [
    { servicesData, SERVICE_SLUG_REDIRECTS = {} },
    { solutionsData },
    { industriesData },
    { coursesData },
    { insightsData },
    { projectsData },
  ] = await Promise.all([
    loadTsDataModule('src/data/servicesData.ts'),
    loadTsDataModule('src/data/solutionsData.ts'),
    loadTsDataModule('src/data/industriesData.ts'),
    loadTsDataModule('src/data/coursesData.ts'),
    loadTsDataModule('src/data/insightsData.ts'),
    loadTsDataModule('src/data/projectsData.ts'),
  ]);

  const seenUrls = new Set();
  const links = [];

  const addLink = (urlPath, changefreq, priority, lastmod = null) => {
    const normalized = urlPath === '/' ? '/' : urlPath.replace(/\/+$/, '');
    if (seenUrls.has(normalized)) return;
    seenUrls.add(normalized);
    const linkItem = {
      url: normalized,
      changefreq,
      priority,
    };
    if (lastmod) {
      linkItem.lastmod = lastmod;
    }
    links.push(linkItem);
  };

  // Home: 1.0 (daily)
  addLink('/', 'daily', 1.0);

  // Main pages: 0.8 (weekly)
  const mainPages = [
    '/services',
    '/solutions',
    '/training',
    '/industries',
    '/portfolio',
    '/case-studies',
    '/technology',
    '/insights',
    '/about',
    '/careers',
    '/faq',
    '/locations',
  ];
  for (const page of mainPages) {
    addLink(page, 'weekly', 0.8);
  }

  // Contact pages: 0.5 (monthly)
  addLink('/contact', 'monthly', 0.5);
  addLink('/contact/consultation', 'monthly', 0.5);

  // Legal pages: 0.3 (yearly)
  addLink('/privacy-policy', 'yearly', 0.3);
  addLink('/terms', 'yearly', 0.3);

  // Dynamic detail pages: 0.7 (weekly)
  // 1. Services (generated strictly from actual canonical route slugs in servicesData.ts)
  for (const service of servicesData) {
    const slug = (service.slug || service.id || '').trim();
    if (slug && !SERVICE_SLUG_REDIRECTS[slug]) {
      addLink(`/services/${slug}`, 'weekly', 0.7);
    }
  }

  // 2. Solutions
  for (const solution of solutionsData) {
    const id = (solution.id || '').trim();
    if (id) {
      addLink(`/solutions/${id}`, 'weekly', 0.7);
    }
  }

  // 3. Industries
  for (const industry of industriesData) {
    const id = (industry.id || '').trim();
    if (id) {
      addLink(`/industries/${id}`, 'weekly', 0.7);
    }
  }

  // 4. Courses
  for (const course of coursesData) {
    const id = (course.id || '').trim();
    if (id) {
      addLink(`/training/${id}`, 'weekly', 0.7);
    }
  }

  // 5. Insight Articles
  for (const article of insightsData) {
    const slug = (article.slug || '').trim();
    if (slug) {
      let articleDate = null;
      if (article.publishedDate) {
        const parsed = new Date(article.publishedDate);
        if (!isNaN(parsed.getTime())) {
          articleDate = parsed.toISOString().split('T')[0];
        }
      }
      addLink(`/insights/${slug}`, 'weekly', 0.7, articleDate);
    }
  }

  // 6. Projects / Case Studies
  for (const project of projectsData) {
    const id = (project.id || '').trim();
    if (id) {
      addLink(`/case-studies/${id}`, 'weekly', 0.7);
    }
  }

  // 7. Location-Based SEO Landing Pages (strictly with trailing slashes)
  const locationPagesJsonPath = path.resolve(__dirname, 'src/data/location-seo/location-pages.json');
  if (fs.existsSync(locationPagesJsonPath)) {
    const locationPages = JSON.parse(fs.readFileSync(locationPagesJsonPath, 'utf-8'));
    for (const locPage of locationPages) {
      const trailingSlashPath = locPage.path.endsWith('/') ? locPage.path : `${locPage.path}/`;
      if (!seenUrls.has(trailingSlashPath)) {
        seenUrls.add(trailingSlashPath);
        links.push({
          url: trailingSlashPath,
          changefreq: 'weekly',
          priority: 0.8,
        });
      }
    }
  }

  const stream = new SitemapStream({
    hostname: HOSTNAME,
    xmlns: {
      news: false,
      xhtml: false,
      image: false,
      video: false,
    },
  });

  const xmlBuffer = await streamToPromise(Readable.from(links).pipe(stream));
  const rawXml = xmlBuffer.toString('utf-8');

  // Format with clean newlines for readability and strict compliance
  const formattedXml = rawXml
    .replace('?><urlset', '?>\n<urlset')
    .replace(/T00:00:00\.000Z<\/lastmod>/g, '</lastmod>')
    .replace(/<url>/g, '\n  <url>\n    ')
    .replace(/<\/loc><lastmod>/g, '</loc>\n    <lastmod>')
    .replace(/<\/lastmod><changefreq>/g, '</lastmod>\n    <changefreq>')
    .replace(/<\/loc><changefreq>/g, '</loc>\n    <changefreq>')
    .replace(/<\/changefreq><priority>/g, '</changefreq>\n    <priority>')
    .replace(/<\/priority><\/url>/g, '</priority>\n  </url>')
    .replace('</urlset>', '\n</urlset>\n');

  fs.writeFileSync(sitemapOutputPath, formattedXml, 'utf-8');
  console.log(`[SEO] Generated ${sitemapOutputPath} with ${links.length} routes.`);
}

async function main() {
  await generateOgImage();
  await generateSitemap();
}

main().catch((err) => {
  console.error('[SEO] Error in generate-sitemap.mjs:', err);
  process.exit(1);
});
