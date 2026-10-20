import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemapXml, getSitemapEntries } from '../src/utils/sitemapGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicSitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
const xml = generateSitemapXml();

fs.writeFileSync(publicSitemapPath, xml, 'utf-8');
console.log(
  `[SEO] Generated /public/sitemap.xml with ${getSitemapEntries().length} URLs from data files.`
);
