import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function cropAndExportLogo() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Source image from user
  const srcImage = fs.existsSync('logo.jpeg') ? 'logo.jpeg' : path.join('public', 'logo.jpeg');
  if (!fs.existsSync(srcImage)) {
    console.error('Source logo image not found!');
    process.exit(1);
  }

  // Backup original user file in public directory as well
  fs.copyFileSync(srcImage, path.join(publicDir, 'logo.jpeg'));

  // Exact coordinates of the logo
  // minX: 18, minY: 192, maxX: 586, maxY: 372
  const cropLeft = 16;
  const cropTop = 188;
  const cropWidth = 574; // includes all glyphs up to 587
  const cropHeight = 186; // includes full height up to 374

  const fullCrop = await sharp(srcImage)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = fullCrop.info.width;
  const h = fullCrop.info.height;
  const fullRgba = Buffer.alloc(w * h * 4);

  const minThresh = 20;
  const maxThresh = 135;

  for (let i = 0; i < w * h; i++) {
    const r = fullCrop.data[i * 3];
    const g = fullCrop.data[i * 3 + 1];
    const b = fullCrop.data[i * 3 + 2];
    const maxC = Math.max(r, g, b);

    if (maxC <= minThresh) {
      fullRgba[i * 4] = 0;
      fullRgba[i * 4 + 1] = 0;
      fullRgba[i * 4 + 2] = 0;
      fullRgba[i * 4 + 3] = 0;
    } else {
      let alpha = 1.0;
      if (maxC < maxThresh) {
        const t = (maxC - minThresh) / (maxThresh - minThresh);
        alpha = Math.pow(t, 0.82);
      }
      alpha = Math.min(1.0, Math.max(0.0, alpha));

      // De-black anti-aliased edge to prevent dark fringe on light backgrounds
      const boost = 1.0 / Math.max(0.25, alpha);
      fullRgba[i * 4] = Math.min(255, Math.round(r * boost));
      fullRgba[i * 4 + 1] = Math.min(255, Math.round(g * boost));
      fullRgba[i * 4 + 2] = Math.min(255, Math.round(b * boost));
      fullRgba[i * 4 + 3] = Math.round(alpha * 255);
    }
  }

  // 1. Save standard cropped transparent logo
  await sharp(fullRgba, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'logo.png'));

  // Also write iamtechni-logo.png for alias compatibility
  fs.copyFileSync(path.join(publicDir, 'logo.png'), path.join(publicDir, 'iamtechni-logo.png'));

  // 2. High-res 2x version (supersampled / sharpened)
  await sharp(path.join(publicDir, 'logo.png'))
    .resize(w * 2, h * 2, { kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'iamtechni-logo-2x.png'));

  // 3. Extract Symbol only
  // Emblem is from x: 16 to 172 (width 156)
  const symbolLeft = 16;
  const symbolTop = 188;
  const symbolWidth = 158;
  const symbolHeight = 186;

  const symbolCrop = await sharp(srcImage)
    .extract({ left: symbolLeft, top: symbolTop, width: symbolWidth, height: symbolHeight })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const symW = symbolCrop.info.width;
  const symH = symbolCrop.info.height;
  const symRgba = Buffer.alloc(symW * symH * 4);

  for (let i = 0; i < symW * symH; i++) {
    const r = symbolCrop.data[i * 3];
    const g = symbolCrop.data[i * 3 + 1];
    const b = symbolCrop.data[i * 3 + 2];
    const maxC = Math.max(r, g, b);

    if (maxC <= minThresh) {
      symRgba[i * 4] = 0;
      symRgba[i * 4 + 1] = 0;
      symRgba[i * 4 + 2] = 0;
      symRgba[i * 4 + 3] = 0;
    } else {
      let alpha = 1.0;
      if (maxC < maxThresh) {
        const t = (maxC - minThresh) / (maxThresh - minThresh);
        alpha = Math.pow(t, 0.82);
      }
      alpha = Math.min(1.0, Math.max(0.0, alpha));
      const boost = 1.0 / Math.max(0.25, alpha);
      symRgba[i * 4] = Math.min(255, Math.round(r * boost));
      symRgba[i * 4 + 1] = Math.min(255, Math.round(g * boost));
      symRgba[i * 4 + 2] = Math.min(255, Math.round(b * boost));
      symRgba[i * 4 + 3] = Math.round(alpha * 255);
    }
  }

  await sharp(symRgba, { raw: { width: symW, height: symH, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'logo-symbol.png'));

  fs.copyFileSync(path.join(publicDir, 'logo-symbol.png'), path.join(publicDir, 'iamtechni-symbol.png'));

  // 4. Favicon (64x64) and apple-touch-icon
  await sharp(path.join(publicDir, 'logo-symbol.png'))
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  await sharp(path.join(publicDir, 'logo-symbol.png'))
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Successfully cropped and exported logo assets from user file!');
}

cropAndExportLogo().catch(err => {
  console.error(err);
  process.exit(1);
});
