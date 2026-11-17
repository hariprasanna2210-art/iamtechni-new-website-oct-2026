import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const CERTIFICATE_WIDTH_PX = 794;
const CERTIFICATE_HEIGHT_PX = 1123;
const CAPTURE_PIXEL_RATIO = 3;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const RECIPIENT_NAME_MAX_WIDTH = 640;
const RECIPIENT_NAME_MIN_FONT_SIZE = 24;
const PDF_ERROR_MESSAGE = 'Could not create the PDF. Please try again.';
const TRANSPARENT_PIXEL_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Exact site Google Fonts families & weights used on the certificate (from index.html)
const SITE_GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=Outfit:wght@800&display=swap';

const CERTIFICATE_FONT_DESCRIPTORS = [
  '400 40px "DM Serif Display"',
  '400 24px "DM Serif Display"',
  '400 52px "DM Serif Display"',
  'italic 400 30px "DM Serif Display"',
  '400 16px "Inter"',
  '500 15px "Inter"',
  '600 14px "Inter"',
  '700 16px "Inter"',
  '800 116px "Outfit"',
];

let cachedFontEmbedCssPromise: Promise<string | undefined> | null = null;

interface SavedStyleSnapshot {
  element: HTMLElement;
  width: string;
  height: string;
  minWidth: string;
  minHeight: string;
  maxWidth: string;
  maxHeight: string;
  margin: string;
  padding: string;
  borderWidth: string;
  boxShadow: string;
  boxSizing: string;
  backgroundColor: string;
  overflow: string;
  transform: string;
  transformOrigin: string;
  zoom: string;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string' && reader.result.startsWith('data:')) {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert font blob to data URL.'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader error'));
    reader.readAsDataURL(blob);
  });
}

function extractLatinFontFaces(cssText: string): string {
  const subsetBlocks = cssText.match(/\/\*\s*latin(?:-ext)?\s*\*\/\s*@font-face\s*\{[^}]*\}/g);
  if (subsetBlocks && subsetBlocks.length > 0) {
    return subsetBlocks.join('\n');
  }
  return cssText;
}

async function buildEmbeddedSiteFontsCss(): Promise<string | undefined> {
  try {
    const cssResponse = await fetch(SITE_GOOGLE_FONTS_URL, { mode: 'cors' });
    if (!cssResponse.ok) return undefined;
    const rawCssText = await cssResponse.text();
    if (!rawCssText) return undefined;

    const cssText = extractLatinFontFaces(rawCssText);
    const urlMatches = Array.from(
      cssText.matchAll(/url\((['"]?)(https?:\/\/[^)'"]+)\1\)/g)
    );
    if (urlMatches.length === 0) return cssText;

    const uniqueUrls = Array.from(new Set(urlMatches.map((m) => m[2])));
    const urlToDataUrl = new Map<string, string>();

    await Promise.all(
      uniqueUrls.map(async (fontUrl) => {
        try {
          const res = await fetch(fontUrl, { mode: 'cors' });
          if (!res.ok) return;
          const blob = await res.blob();
          const dataUrl = await blobToDataUrl(blob);
          urlToDataUrl.set(fontUrl, dataUrl);
        } catch {
          // Leave remote URL intact if a single font subset fails to fetch
        }
      })
    );

    if (urlToDataUrl.size === 0) return undefined;

    return cssText.replace(
      /url\((['"]?)(https?:\/\/[^)'"]+)\1\)/g,
      (fullMatch, _quote, matchedUrl: string) => {
        const inlined = urlToDataUrl.get(matchedUrl);
        return inlined ? `url("${inlined}")` : fullMatch;
      }
    );
  } catch {
    return undefined;
  }
}

async function getEmbeddedSiteFontsCss(): Promise<string | undefined> {
  if (!cachedFontEmbedCssPromise) {
    cachedFontEmbedCssPromise = buildEmbeddedSiteFontsCss().then((css) => {
      if (!css) {
        cachedFontEmbedCssPromise = null;
      }
      return css;
    });
  }
  return cachedFontEmbedCssPromise;
}

async function ensureCertificateFontsLoaded(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;

  if (typeof document.fonts.load === 'function') {
    await Promise.allSettled(
      CERTIFICATE_FONT_DESCRIPTORS.map((descriptor) =>
        document.fonts.load(descriptor)
      )
    );
  }

  if (document.fonts.ready) {
    await document.fonts.ready;
  }
}

async function waitForImagesInContainer(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            if (img.naturalWidth > 0 && typeof img.decode === 'function') {
              img.decode().catch(() => {}).finally(() => resolve());
            } else {
              resolve();
            }
            return;
          }

          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timeoutId);
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', finish);
            resolve();
          };

          const onLoad = () => {
            if (typeof img.decode === 'function') {
              img.decode().catch(() => {}).finally(finish);
            } else {
              finish();
            }
          };

          const timeoutId = window.setTimeout(finish, 8000);
          img.addEventListener('load', onLoad);
          img.addEventListener('error', finish);
        })
    )
  );
}

async function verifyAndFlattenPngDataUrl(dataUrl: string): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,') || dataUrl.length < 500) {
    throw new Error('Generated certificate PNG data URL is invalid or empty.');
  }

  const decodedImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve(img);
      } else {
        reject(new Error('Generated certificate PNG has zero dimensions.'));
      }
    };
    img.onerror = () => reject(new Error('Generated certificate PNG failed to decode.'));
    img.src = dataUrl;
  });

  const targetWidth = CERTIFICATE_WIDTH_PX * CAPTURE_PIXEL_RATIO;
  const targetHeight = CERTIFICATE_HEIGHT_PX * CAPTURE_PIXEL_RATIO;
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return dataUrl;
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(decodedImg, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL('image/png');
}

function lockUnscaledCertificateBox(element: HTMLElement): () => void {
  const snapshots: SavedStyleSnapshot[] = [];

  const captureStyle = (el: HTMLElement) => {
    const s = el.style;
    snapshots.push({
      element: el,
      width: s.width,
      height: s.height,
      minWidth: s.minWidth,
      minHeight: s.minHeight,
      maxWidth: s.maxWidth,
      maxHeight: s.maxHeight,
      margin: s.margin,
      padding: s.padding,
      borderWidth: s.borderWidth,
      boxShadow: s.boxShadow,
      boxSizing: s.boxSizing,
      backgroundColor: s.backgroundColor,
      overflow: s.overflow,
      transform: s.transform,
      transformOrigin: s.transformOrigin,
      zoom: s.zoom,
    });
  };

  captureStyle(element);
  element.style.width = `${CERTIFICATE_WIDTH_PX}px`;
  element.style.height = `${CERTIFICATE_HEIGHT_PX}px`;
  element.style.minWidth = `${CERTIFICATE_WIDTH_PX}px`;
  element.style.minHeight = `${CERTIFICATE_HEIGHT_PX}px`;
  element.style.maxWidth = `${CERTIFICATE_WIDTH_PX}px`;
  element.style.maxHeight = `${CERTIFICATE_HEIGHT_PX}px`;
  element.style.margin = '0';
  element.style.padding = '0';
  element.style.borderWidth = '0';
  element.style.boxShadow = 'none';
  element.style.boxSizing = 'border-box';
  element.style.backgroundColor = '#ffffff';
  element.style.overflow = 'hidden';
  element.style.transform = 'none';
  element.style.transformOrigin = 'top left';
  element.style.zoom = '1';

  // Neutralize any ancestor transform/scale wrapper if an on-screen scaled container is passed
  let parent = element.parentElement;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    const computedTransform = window.getComputedStyle(parent).transform;
    if (
      (computedTransform && computedTransform !== 'none') ||
      (parent.style.transform && parent.style.transform !== 'none') ||
      (parent.style.zoom && parent.style.zoom !== '1')
    ) {
      captureStyle(parent);
      parent.style.transform = 'none';
      parent.style.transformOrigin = 'top left';
      parent.style.zoom = '1';
    }
    parent = parent.parentElement;
  }

  // Ensure the recipient name fits cleanly on a single line inside the unscaled 794px box
  let restoreNameFontSize: (() => void) | null = null;
  const recipientNameEl = element.querySelector<HTMLElement>(
    '[data-cert-recipient-name="true"]'
  );
  if (recipientNameEl) {
    const originalFontSize = recipientNameEl.style.fontSize;
    let parsedSize = parseFloat(window.getComputedStyle(recipientNameEl).fontSize);
    if (Number.isFinite(parsedSize) && parsedSize > RECIPIENT_NAME_MIN_FONT_SIZE) {
      let currentSize = Math.round(parsedSize);
      while (
        currentSize > RECIPIENT_NAME_MIN_FONT_SIZE &&
        recipientNameEl.scrollWidth > RECIPIENT_NAME_MAX_WIDTH
      ) {
        currentSize -= 1;
        recipientNameEl.style.fontSize = `${currentSize}px`;
      }
      if (recipientNameEl.style.fontSize !== originalFontSize) {
        restoreNameFontSize = () => {
          recipientNameEl.style.fontSize = originalFontSize;
        };
      }
    }
  }

  return () => {
    if (restoreNameFontSize) {
      restoreNameFontSize();
    }
    for (let i = snapshots.length - 1; i >= 0; i -= 1) {
      const snap = snapshots[i];
      const s = snap.element.style;
      s.width = snap.width;
      s.height = snap.height;
      s.minWidth = snap.minWidth;
      s.minHeight = snap.minHeight;
      s.maxWidth = snap.maxWidth;
      s.maxHeight = snap.maxHeight;
      s.margin = snap.margin;
      s.padding = snap.padding;
      s.borderWidth = snap.borderWidth;
      s.boxShadow = snap.boxShadow;
      s.boxSizing = snap.boxSizing;
      s.backgroundColor = snap.backgroundColor;
      s.overflow = snap.overflow;
      s.transform = snap.transform;
      s.transformOrigin = snap.transformOrigin;
      s.zoom = snap.zoom;
    }
  };
}

function triggerBlobDownload(blob: Blob, fileName: string): void {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 60_000);
}

/**
 * Captures a 794x1123 CertificateTemplate DOM element using html-to-image (toPng)
 * and saves it as a full-bleed A4 portrait PDF named IAMTECHNI-Certificate-<certificateId>.pdf.
 */
export async function downloadCertificatePdf(
  element: HTMLElement,
  certificateId: string
): Promise<void> {
  try {
    const [, , fontEmbedCSS] = await Promise.all([
      ensureCertificateFontsLoaded(),
      waitForImagesInContainer(element),
      getEmbeddedSiteFontsCss(),
    ]);

    let pngDataUrl = '';
    const restoreStyles = lockUnscaledCertificateBox(element);

    try {
      // Wait two animation frames so unscaled 794x1123 layout, fonts, images, and QR canvas settle
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      const rect = element.getBoundingClientRect();
      const captureWidth =
        Math.round(rect.width) === CERTIFICATE_WIDTH_PX
          ? CERTIFICATE_WIDTH_PX
          : Math.round(rect.width) || CERTIFICATE_WIDTH_PX;
      const captureHeight =
        Math.round(rect.height) === CERTIFICATE_HEIGHT_PX
          ? CERTIFICATE_HEIGHT_PX
          : Math.round(rect.height) || CERTIFICATE_HEIGHT_PX;

      pngDataUrl = await toPng(element, {
        width: captureWidth,
        height: captureHeight,
        canvasWidth: captureWidth,
        canvasHeight: captureHeight,
        pixelRatio: CAPTURE_PIXEL_RATIO,
        cacheBust: true,
        skipAutoScale: true,
        backgroundColor: '#ffffff',
        preferredFontFormat: 'woff2',
        ...(fontEmbedCSS ? { fontEmbedCSS } : {}),
        imagePlaceholder: TRANSPARENT_PIXEL_PNG,
        onImageErrorHandler: () => {
          // Skip failed images without aborting the entire capture
        },
        filter: (domNode) => {
          if (domNode instanceof HTMLLinkElement) {
            return false;
          }
          if (
            domNode instanceof HTMLImageElement &&
            domNode.complete &&
            domNode.naturalWidth === 0
          ) {
            return false;
          }
          return true;
        },
        style: {
          transform: 'none',
          transformOrigin: 'top left',
          zoom: '1',
          position: 'relative',
          top: '0px',
          left: '0px',
          right: 'auto',
          bottom: 'auto',
          width: `${captureWidth}px`,
          height: `${captureHeight}px`,
          minWidth: `${captureWidth}px`,
          minHeight: `${captureHeight}px`,
          maxWidth: `${captureWidth}px`,
          maxHeight: `${captureHeight}px`,
          margin: '0',
          padding: '0',
          border: '0',
          boxShadow: 'none',
          boxSizing: 'border-box',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        },
      });
    } finally {
      restoreStyles();
    }

    const finalPngDataUrl = await verifyAndFlattenPngDataUrl(pngDataUrl);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [A4_WIDTH_MM, A4_HEIGHT_MM],
      compress: true,
    });

    pdf.addImage(finalPngDataUrl, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);

    const pdfBlob = pdf.output('blob');
    if (!pdfBlob || pdfBlob.size === 0) {
      throw new Error('Generated PDF blob is empty.');
    }

    const safeId = (certificateId || 'Certificate').trim() || 'Certificate';
    const fileName = `IAMTECHNI-Certificate-${safeId}.pdf`;
    triggerBlobDownload(pdfBlob, fileName);
  } catch (err) {
    console.error('[certificatePdf] Failed to generate certificate PDF:', err);
    throw new Error(PDF_ERROR_MESSAGE);
  }
}
