import { servicesData } from '../data/servicesData';
import { industriesData } from '../data/industriesData';
import { insightsData } from '../data/insightsData';
import { projectsData } from '../data/projectsData';

export const BASE_SITE_URL = 'https://www.iamtechni.in';

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: string;
}

/**
 * Dynamically generates all sitemap entries from the static routes and
 * existing data files (servicesData, industriesData, insightsData, projectsData).
 * Adding a new item to any data file automatically includes its URL here.
 */
export function getSitemapEntries(): SitemapEntry[] {
  const today = new Date().toISOString().split('T')[0];

  const staticRoutes: { path: string; changefreq: SitemapEntry['changefreq']; priority: string }[] = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/services', changefreq: 'weekly', priority: '0.9' },
    { path: '/solutions', changefreq: 'weekly', priority: '0.9' },
    { path: '/training', changefreq: 'weekly', priority: '0.9' },
    { path: '/industries', changefreq: 'weekly', priority: '0.8' },
    { path: '/portfolio', changefreq: 'weekly', priority: '0.8' },
    { path: '/case-studies', changefreq: 'weekly', priority: '0.8' },
    { path: '/technology', changefreq: 'monthly', priority: '0.8' },
    { path: '/insights', changefreq: 'weekly', priority: '0.8' },
    { path: '/about', changefreq: 'monthly', priority: '0.7' },
    { path: '/careers', changefreq: 'weekly', priority: '0.7' },
    { path: '/contact', changefreq: 'monthly', priority: '0.8' },
    { path: '/contact/consultation', changefreq: 'monthly', priority: '0.8' },
    { path: '/faq', changefreq: 'monthly', priority: '0.7' },
    { path: '/privacy-policy', changefreq: 'monthly', priority: '0.4' },
    { path: '/terms', changefreq: 'monthly', priority: '0.4' },
  ];

  const seenPaths = new Set<string>();
  const entries: SitemapEntry[] = [];

  const addRoute = (path: string, changefreq: SitemapEntry['changefreq'], priority: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (seenPaths.has(cleanPath)) return;
    seenPaths.add(cleanPath);
    entries.push({
      loc: `${BASE_SITE_URL}${cleanPath}`,
      lastmod: today,
      changefreq,
      priority,
    });
  };

  // 1. Add all core static routes
  for (const r of staticRoutes) {
    addRoute(r.path, r.changefreq, r.priority);
  }

  // 2. Dynamically add every service detail page from servicesData.ts
  for (const service of servicesData) {
    const slug = service.slug || service.id;
    if (slug) {
      addRoute(`/services/${slug}`, 'weekly', '0.8');
    }
  }

  // 3. Dynamically add every industry detail page from industriesData.ts
  for (const industry of industriesData) {
    if (industry.id) {
      addRoute(`/industries/${industry.id}`, 'monthly', '0.7');
    }
  }

  // 4. Dynamically add every insight article page from insightsData.ts
  for (const article of insightsData) {
    if (article.slug) {
      addRoute(`/insights/${article.slug}`, 'monthly', '0.7');
    }
  }

  // 5. Dynamically add every case study page from projectsData.ts
  for (const project of projectsData) {
    if (project.id) {
      addRoute(`/case-studies/${project.id}`, 'monthly', '0.7');
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
