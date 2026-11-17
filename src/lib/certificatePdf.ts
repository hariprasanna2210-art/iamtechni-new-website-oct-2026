import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const CERTIFICATE_WIDTH_PX = 794;
const CERTIFICATE_HEIGHT_PX = 1123;
const PDF_ERROR_MESSAGE = 'Could not create the PDF. Please try again.';

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

/**
 * Captures a 794x1123 CertificateTemplate DOM element and saves it as a full-bleed
 * A4 portrait (210 x 297 mm) PDF named IAMTECHNI-Certificate-<certificateId>.pdf.
 */
export async function downloadCertificatePdf(
  element: HTMLElement,
  certificateId: string
): Promise<void> {
  try {
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      await document.fonts.ready;
    }

    await waitForImagesInContainer(element);

    // Wait one animation frame so fonts, images, and QRCodeCanvas have painted
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: CERTIFICATE_WIDTH_PX,
      height: CERTIFICATE_HEIGHT_PX,
      windowWidth: CERTIFICATE_WIDTH_PX,
      windowHeight: CERTIFICATE_HEIGHT_PX,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc, clonedElement) => {
        // Ensure cloned document root uses plain hex colors rather than Tailwind CSS v4 oklch/oklab
        clonedDoc.documentElement.style.backgroundColor = '#ffffff';
        clonedDoc.body.style.backgroundColor = '#ffffff';
        clonedDoc.body.style.color = '#14205A';

        // Bring off-screen fixed wrapper to (0, 0) inside the cloned viewport
        const parent = clonedElement.parentElement;
        if (parent instanceof HTMLElement && parent !== clonedDoc.body) {
          parent.style.position = 'fixed';
          parent.style.left = '0px';
          parent.style.top = '0px';
          parent.style.width = `${CERTIFICATE_WIDTH_PX}px`;
          parent.style.height = `${CERTIFICATE_HEIGHT_PX}px`;
          parent.style.transform = 'none';
          parent.style.overflow = 'hidden';
          parent.style.zIndex = '99999';
          parent.style.visibility = 'visible';
          parent.style.opacity = '1';
        }

        if (clonedElement instanceof HTMLElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.width = `${CERTIFICATE_WIDTH_PX}px`;
          clonedElement.style.height = `${CERTIFICATE_HEIGHT_PX}px`;
        }

        // Skip any image that failed to load so it cannot break the canvas export
        const clonedImgs = Array.from(clonedElement.querySelectorAll('img'));
        for (const img of clonedImgs) {
          if (img.complete && img.naturalWidth === 0) {
            img.style.display = 'none';
          }
        }

        const pillText = clonedDoc.querySelector('[data-cert-key-areas-pill]');
        if (pillText instanceof HTMLElement) {
          pillText.style.display = 'inline-flex';
          pillText.style.alignItems = 'center';
          pillText.style.justifyContent = 'center';
          pillText.style.height = '24px';
          pillText.style.lineHeight = '1';
          pillText.style.padding = '0 14px';
        }
      },
    });

    if (!canvas || canvas.width <= 0 || canvas.height <= 0) {
      throw new Error('Captured certificate canvas is empty.');
    }

    const imgData = canvas.toDataURL('image/png');
    if (!imgData || !imgData.startsWith('data:image/png')) {
      throw new Error('Captured certificate PNG data URL is invalid.');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

    const safeId = (certificateId || 'Certificate').trim() || 'Certificate';
    const fileName = `IAMTECHNI-Certificate-${safeId}.pdf`;
    await pdf.save(fileName, { returnPromise: true });
  } catch (err) {
    console.error('[certificatePdf] Failed to generate certificate PDF:', err);
    throw new Error(PDF_ERROR_MESSAGE);
  }
}
