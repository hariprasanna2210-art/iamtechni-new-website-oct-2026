import { servicesData, SERVICE_SLUG_REDIRECTS } from '../data/servicesData';
import { solutionsData } from '../data/solutionsData';
import { industriesData } from '../data/industriesData';
import { coursesData } from '../data/coursesData';
import { insightsData } from '../data/insightsData';
import { projectsData } from '../data/projectsData';

export const BASE_SITE_URL = 'https://www.iamtechni.in';

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
}

/**
 * Dynamically generates all sitemap entries from the static routes and
 * existing data files (servicesData, solutionsData, industriesData, coursesData, insightsData, projectsData).
 * Priorities:
 * - Home: 1.0 (daily)
 * - Main pages: 0.8 (weekly)
 * - Detail pages (service, solution, industry, course, article, project): 0.7 (weekly)
 * - Contact pages: 0.5 (monthly)
 * - Legal pages: 0.3 (yearly)
 */
export function getSitemapEntries(): SitemapEntry[] {
  const today = new Date().toISOString().split('T')[0];

  const mainRoutes: { path: string; changefreq: SitemapEntry['changefreq']; priority: string }[] = [
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/services', changefreq: 'weekly', priority: '0.8' },
    { path: '/solutions', changefreq: 'weekly', priority: '0.8' },
    { path: '/training', changefreq: 'weekly', priority: '0.8' },
    { path: '/industries', changefreq: 'weekly', priority: '0.8' },
    { path: '/portfolio', changefreq: 'weekly', priority: '0.8' },
    { path: '/case-studies', changefreq: 'weekly', priority: '0.8' },
    { path: '/technology', changefreq: 'weekly', priority: '0.8' },
    { path: '/insights', changefreq: 'weekly', priority: '0.8' },
    { path: '/about', changefreq: 'weekly', priority: '0.8' },
    { path: '/careers', changefreq: 'weekly', priority: '0.8' },
    { path: '/faq', changefreq: 'weekly', priority: '0.8' },
  ];

  const contactRoutes: { path: string; changefreq: SitemapEntry['changefreq']; priority: string }[] = [
    { path: '/contact', changefreq: 'monthly', priority: '0.5' },
    { path: '/contact/consultation', changefreq: 'monthly', priority: '0.5' },
  ];

  const legalRoutes: { path: string; changefreq: SitemapEntry['changefreq']; priority: string }[] = [
    { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
    { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  ];

  const seenPaths = new Set<string>();
  const entries: SitemapEntry[] = [];

  const addRoute = (path: string, changefreq: SitemapEntry['changefreq'], priority: string) => {
    const rawPath = path.startsWith('/') ? path : `/${path}`;
    const cleanPath = rawPath === '/' ? '/' : rawPath.replace(/\/+$/, '');
    if (seenPaths.has(cleanPath)) return;
    seenPaths.add(cleanPath);
    entries.push({
      loc: `${BASE_SITE_URL}${cleanPath}`,
      lastmod: today,
      changefreq,
      priority,
    });
  };

  // 1. Home (1.0 daily) & Main Pages (0.8 weekly)
  for (const r of mainRoutes) {
    addRoute(r.path, r.changefreq, r.priority);
  }

  // 2. Contact Pages (0.5 monthly)
  for (const r of contactRoutes) {
    addRoute(r.path, r.changefreq, r.priority);
  }

  // 3. Legal Pages (0.3 yearly)
  for (const r of legalRoutes) {
    addRoute(r.path, r.changefreq, r.priority);
  }

  // 4. Dynamically add every canonical service detail page strictly from servicesData.ts (0.7 weekly)
  for (const service of servicesData) {
    const slug = (service.slug || service.id || '').trim();
    if (slug && !SERVICE_SLUG_REDIRECTS[slug]) {
      addRoute(`/services/${slug}`, 'weekly', '0.7');
    }
  }

  // 5. Dynamically add every solution detail page from solutionsData.ts (0.7 weekly)
  for (const solution of solutionsData) {
    const id = (solution.id || '').trim();
    if (id) {
      addRoute(`/solutions/${id}`, 'weekly', '0.7');
    }
  }

  // 6. Dynamically add every industry detail page from industriesData.ts (0.7 weekly)
  for (const industry of industriesData) {
    const id = (industry.id || '').trim();
    if (id) {
      addRoute(`/industries/${id}`, 'weekly', '0.7');
    }
  }

  // 7. Dynamically add every course detail page from coursesData.ts (0.7 weekly)
  for (const course of coursesData) {
    const id = (course.id || '').trim();
    if (id) {
      addRoute(`/training/${id}`, 'weekly', '0.7');
    }
  }

  // 8. Dynamically add every insight article page from insightsData.ts (0.7 weekly)
  for (const article of insightsData) {
    const slug = (article.slug || '').trim();
    if (slug) {
      addRoute(`/insights/${slug}`, 'weekly', '0.7');
    }
  }

  // 9. Dynamically add every project / case study page from projectsData.ts (0.7 weekly)
  for (const project of projectsData) {
    const id = (project.id || '').trim();
    if (id) {
      addRoute(`/case-studies/${id}`, 'weekly', '0.7');
    }
  }

  return entries;
}

/**
 * Generates the complete XML string for sitemap.xml
 */
export function generateSitemapXml(): string {
  const entries = getSitemapEntries();
  const urlNodes = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>
`;
}
