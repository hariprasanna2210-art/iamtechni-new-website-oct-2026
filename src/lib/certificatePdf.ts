import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

async function waitForImagesInContainer(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const onDone = () => {
            img.removeEventListener('load', onDone);
            img.removeEventListener('error', onDone);
            resolve();
          };
          img.addEventListener('load', onDone);
          img.addEventListener('error', onDone);
        })
    )
  );
}

/**
 * Captures a 794x1123 CertificateTemplate DOM element at scale 2 using html2canvas
 * after waiting for document.fonts.ready and all images, and saves an A4 portrait PDF.
 */
export async function downloadCertificatePdf(
  element: HTMLElement,
  certificateId: string
): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    await document.fonts.ready;
  }

  await waitForImagesInContainer(element);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FFFFFF',
    width: 794,
    height: 1123,
    windowWidth: 794,
    windowHeight: 1123,
    onclone: (clonedDoc) => {
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

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const safeId = (certificateId || 'Certificate').trim();
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  pdf.save(`IAMTECHNI-Certificate-${safeId}.pdf`);
}
