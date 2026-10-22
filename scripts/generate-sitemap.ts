import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp, { type OverlayOptions } from 'sharp';
import { generateSitemapXml, getSitemapEntries } from '../src/utils/sitemapGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public');
const publicSitemapPath = path.resolve(publicDir, 'sitemap.xml');
const publicOgImagePath = path.resolve(publicDir, 'og-image.png');
const logoPath = path.resolve(publicDir, 'iamtechni-logo.png');

async function generateAssets() {
  // 1. Generate /public/sitemap.xml
  const xml = generateSitemapXml();
  fs.writeFileSync(publicSitemapPath, xml, 'utf-8');
  console.log(
    `[SEO] Generated /public/sitemap.xml with ${getSitemapEntries().length} URLs from data files.`
  );

  // 2. Generate 1200x630 branded /public/og-image.png on a light blue background (#EAF1FD to #DCE7FA)
  const width = 1200;
  const height = 630;

  const backgroundSvg = `
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

      <rect width="${width}" height="${height}" fill="url(#bg-gradient)" />
      <rect width="${width}" height="${height}" fill="url(#soft-glow-top)" />
      <rect width="${width}" height="${height}" fill="url(#soft-glow-bottom)" />

      <rect x="80" y="68" width="1040" height="494" rx="28" fill="#FFFFFF" fill-opacity="0.86" stroke="#BFDBFE" stroke-width="2" />
      <rect x="80" y="68" width="1040" height="8" rx="4" fill="url(#accent-bar)" />

      <text x="600" y="348" text-anchor="middle" font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif" font-size="35" font-weight="bold" fill="#0F172A">
        Build Smarter. Innovate Faster. Grow Further.
      </text>

      <rect x="210" y="394" width="780" height="54" rx="27" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1.5" />
      <text x="600" y="428" text-anchor="middle" font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif" font-size="21" font-weight="bold" fill="#1D4ED8">
        Websites · Mobile Apps · Custom Software · AI · SEO
      </text>

      <text x="600" y="516" text-anchor="middle" font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif" font-size="16" font-weight="bold" letter-spacing="1" fill="#334155">
        www.iamtechni.in
      </text>
    </svg>
  `;

  const composites: OverlayOptions[] = [];
  if (fs.existsSync(logoPath)) {
    const logoWidth = 390;
    const logoHeight = 130;
    const resizedLogo = await sharp(logoPath)
      .resize({ width: logoWidth, height: logoHeight, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    composites.push({
      input: resizedLogo,
      top: 125,
      left: Math.round((width - logoWidth) / 2),
    });
  }

  await sharp(Buffer.from(backgroundSvg))
    .resize(width, height)
    .composite(composites)
    .png({ quality: 95 })
    .toFile(publicOgImagePath);

  console.log(`[SEO] Generated /public/og-image.png (${width}x${height}).`);
}

generateAssets().catch((err) => {
  console.error('[SEO] Failed to generate SEO assets:', err);
  process.exit(1);
});
