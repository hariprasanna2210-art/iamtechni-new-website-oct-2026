import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Full IAMTECHNI Logo SVG (100% Transparent, No Background)
const fullLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 100" width="420" height="100" fill="none">
  <defs>
    <!-- Brand gradients -->
    <linearGradient id="iam-sym-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00D2FF" />
      <stop offset="45%" stop-color="#1266E8" />
      <stop offset="100%" stop-color="#5427D9" />
    </linearGradient>

    <radialGradient id="iam-dot-grad" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#5CE7FF" />
      <stop offset="60%" stop-color="#00D2FF" />
      <stop offset="100%" stop-color="#1266E8" />
    </radialGradient>

    <linearGradient id="iam-text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00D2FF" />
      <stop offset="25%" stop-color="#0BA5E9" />
      <stop offset="55%" stop-color="#1266E8" />
      <stop offset="80%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#6C28D9" />
    </linearGradient>

    <linearGradient id="iam-wing-grad" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#00D2FF" />
      <stop offset="100%" stop-color="#0072FF" />
    </linearGradient>

    <linearGradient id="iam-tail-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1266E8" />
      <stop offset="100%" stop-color="#5427D9" />
    </linearGradient>

    <filter id="iam-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- ================= BRAND SYMBOL ================= -->
  <g id="iam-symbol" transform="translate(6, 4)">
    <!-- Head Sphere (dot of the 'i') -->
    <circle cx="58" cy="22" r="10.5" fill="url(#iam-dot-grad)" filter="url(#iam-soft-glow)" />

    <!-- Left sweeping curved ribbon ('i' stem) -->
    <path
      d="M26 48 C28 38 35 32 48 31 C56 38 58 50 56 62 C54 74 48 84 38 89 C34 81 33 70 29 60 C26 55 25 51 26 48 Z"
      fill="url(#iam-wing-grad)"
    />

    <!-- Central dynamic torso -->
    <path
      d="M48 33 C42 43 40 56 42 70 C43 79 41 86 33 93 C40 91 47 83 49 74 C52 57 54 44 48 33 Z"
      fill="#1266E8"
    />

    <!-- Cyan inner energetic flare -->
    <path
      d="M31 60 C37 70 41 78 39 88 C43 85 46 80 47 73 C47 62 44 54 39 48 C36 52 33 56 31 60 Z"
      fill="#00D2FF"
    />

    <!-- Right wing swoop ('t' arm) -->
    <path
      d="M54 37 C65 35 77 41 83 52 C81 60 76 67 70 74 C68 70 67 58 64 49 C61 44 57 40 54 37 Z"
      fill="url(#iam-sym-grad)"
    />

    <!-- Dynamic violet sweeping tail -->
    <path
      d="M66 52 C74 52 86 59 89 70 C83 78 74 84 65 88 C71 80 72 71 68 63 C67 59 66 55 66 52 Z"
      fill="url(#iam-tail-grad)"
    />
  </g>

  <!-- ================= WORDMARK: iamtechni ================= -->
  <g id="iam-wordmark" transform="translate(118, 0)">
    <text
      x="0"
      y="66"
      font-family="'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      font-size="48"
      font-weight="800"
      letter-spacing="-0.03em"
      fill="url(#iam-text-grad)"
    >iamtechni</text>
  </g>
</svg>
`.trim();

// Symbol only SVG (Square 100x100, 100% Transparent)
const symbolOnlySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none">
  <defs>
    <linearGradient id="sym-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00D2FF" />
      <stop offset="45%" stop-color="#1266E8" />
      <stop offset="100%" stop-color="#5427D9" />
    </linearGradient>

    <radialGradient id="sym-dot" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#5CE7FF" />
      <stop offset="60%" stop-color="#00D2FF" />
      <stop offset="100%" stop-color="#1266E8" />
    </radialGradient>

    <linearGradient id="sym-wing" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#00D2FF" />
      <stop offset="100%" stop-color="#0072FF" />
    </linearGradient>

    <linearGradient id="sym-tail" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1266E8" />
      <stop offset="100%" stop-color="#5427D9" />
    </linearGradient>

    <filter id="sym-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <g transform="translate(-2, 0)">
    <!-- Glowing Head Dot -->
    <circle cx="56" cy="19" r="10.5" fill="url(#sym-dot)" filter="url(#sym-glow)" />

    <!-- Left sweeping curved ribbon -->
    <path
      d="M24 45 C26 35 33 29 46 28 C54 35 56 47 54 59 C52 71 46 81 36 86 C32 78 31 67 27 57 C24 52 23 48 24 45 Z"
      fill="url(#sym-wing)"
    />

    <!-- Central torso -->
    <path
      d="M46 30 C40 40 38 53 40 67 C41 76 39 83 31 90 C38 88 45 80 47 71 C50 54 52 41 46 30 Z"
      fill="#1266E8"
    />

    <!-- Cyan inner flare -->
    <path
      d="M29 57 C35 67 39 75 37 85 C41 82 44 77 45 70 C45 59 42 51 37 45 C34 49 31 53 29 57 Z"
      fill="#00D2FF"
    />

    <!-- Right wing -->
    <path
      d="M52 34 C63 32 75 38 81 49 C79 57 74 64 68 71 C66 67 65 55 62 46 C59 41 55 37 52 34 Z"
      fill="url(#sym-grad)"
    />

    <!-- Tail curve -->
    <path
      d="M64 49 C72 49 84 56 87 67 C81 75 72 81 63 85 C69 77 70 68 66 60 C65 56 64 52 64 49 Z"
      fill="url(#sym-tail)"
    />
  </g>
</svg>
`.trim();

async function run() {
  console.log('Writing transparent SVG assets...');
  fs.writeFileSync(path.join(publicDir, 'iamtechni-logo.svg'), fullLogoSvg);
  fs.writeFileSync(path.join(publicDir, 'iamtechni-symbol.svg'), symbolOnlySvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), symbolOnlySvg);

  console.log('Generating transparent PNG assets with sharp...');
  
  // 1. Primary transparent logo PNG (840x200 - 2x resolution of 420x100)
  await sharp(Buffer.from(fullLogoSvg))
    .resize(840, 200)
    .png()
    .toFile(path.join(publicDir, 'iamtechni-logo.png'));

  // 2. High-res transparent 4K logo (1680x400)
  await sharp(Buffer.from(fullLogoSvg))
    .resize(1680, 400)
    .png()
    .toFile(path.join(publicDir, 'iamtechni-logo-2x.png'));

  // 3. Default logo.png for SEO, metadata, open graph
  await sharp(Buffer.from(fullLogoSvg))
    .resize(840, 200)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));

  // 4. Square transparent symbol PNG (512x512)
  await sharp(Buffer.from(symbolOnlySvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'iamtechni-symbol.png'));

  // 5. Favicon PNG (64x64)
  await sharp(Buffer.from(symbolOnlySvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('All transparent logo assets successfully generated in /public!');
}

run().catch(err => {
  console.error('Error generating logo assets:', err);
  process.exit(1);
});
