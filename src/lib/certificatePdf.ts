import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const CERTIFICATE_WIDTH_PX = 794;
const CERTIFICATE_HEIGHT_PX = 1123;
const RECIPIENT_NAME_MAX_WIDTH = 640;
const RECIPIENT_NAME_MIN_FONT_SIZE = 24;
const PDF_ERROR_MESSAGE = 'Could not create the PDF. Please try again.';
const TRANSPARENT_PIXEL_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Same Google Fonts stylesheet loaded in index.html for the rest of the site
const SITE_GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap';

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

async function buildEmbeddedSiteFontsCss(): Promise<string | undefined> {
  try {
    const cssResponse = await fetch(SITE_GOOGLE_FONTS_URL, { mode: 'cors' });
    if (!cssResponse.ok) return undefined;
    const cssText = await cssResponse.text();
    if (!cssText) return undefined;

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

async function verifyPngDataUrl(dataUrl: string): Promise<void> {
  if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,') || dataUrl.length < 500) {
    throw new Error('Generated certificate PNG data URL is invalid or empty.');
  }

  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve();
      } else {
        reject(new Error('Generated certificate PNG has zero dimensions.'));
      }
    };
    img.onerror = () => reject(new Error('Generated certificate PNG failed to decode.'));
    img.src = dataUrl;
  });
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

      pngDataUrl = await toPng(element, {
        width: CERTIFICATE_WIDTH_PX,
        height: CERTIFICATE_HEIGHT_PX,
        canvasWidth: CERTIFICATE_WIDTH_PX,
        canvasHeight: CERTIFICATE_HEIGHT_PX,
        pixelRatio: 3,
        cacheBust: true,
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
          width: `${CERTIFICATE_WIDTH_PX}px`,
          height: `${CERTIFICATE_HEIGHT_PX}px`,
          minWidth: `${CERTIFICATE_WIDTH_PX}px`,
          minHeight: `${CERTIFICATE_HEIGHT_PX}px`,
          maxWidth: `${CERTIFICATE_WIDTH_PX}px`,
          maxHeight: `${CERTIFICATE_HEIGHT_PX}px`,
          margin: '0',
        },
      });
    } finally {
      restoreStyles();
    }

    await verifyPngDataUrl(pngDataUrl);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(pngDataUrl, 'PNG', 0, 0, pageWidth, pageHeight);

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
