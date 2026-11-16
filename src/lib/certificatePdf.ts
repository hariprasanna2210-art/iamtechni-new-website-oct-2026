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
 * Use scale 2 on standard devices, or scale 1.5 on devices with < 4 GB memory
 * or screens narrower than 480px to avoid canvas memory crashes on small phones.
 */
function getCaptureScale(): number {
  if (typeof window === 'undefined') return 2;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const isLowMemory =
    typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4;
  const isNarrowScreen =
    window.innerWidth < 480 ||
    (typeof window.screen !== 'undefined' && window.screen.width < 480);
  return isLowMemory || isNarrowScreen ? 1.5 : 2;
}

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /^((?!chrome|crios|fxios|edgios|android).)*safari/i.test(ua);
  return isIOS && isSafari;
}

/**
 * Captures a full 794x1123 off-screen CertificateTemplate DOM element (position: fixed;
 * left: -10000px; top: 0; no transform) and exports an A4 portrait PDF.
 * On iPhone/iPad Safari, if the download is blocked, opens the PDF in a new tab instead.
 */
export async function downloadCertificatePdf(
  element: HTMLElement,
  certificateId: string
): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    await document.fonts.ready;
  }

  await waitForImagesInContainer(element);

  const captureScale = getCaptureScale();

  const canvas = await html2canvas(element, {
    scale: captureScale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FFFFFF',
    width: 794,
    height: 1123,
    windowWidth: 794,
    windowHeight: 1123,
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc, clonedElement) => {
      if (clonedElement instanceof HTMLElement) {
        clonedElement.style.transform = 'none';
        clonedElement.style.width = '794px';
        clonedElement.style.height = '1123px';
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

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const safeId = (certificateId || 'Certificate').trim();
  const fileName = `IAMTECHNI-Certificate-${safeId}.pdf`;
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

  if (isIosSafari()) {
    try {
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // If iOS Safari blocks the download attribute on blob URLs, open in a new tab
      const opened = window.open(blobUrl, '_blank');
      if (!opened) {
        window.location.assign(blobUrl);
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      return;
    } catch {
      const dataUri = pdf.output('dataurlstring');
      window.open(dataUri, '_blank');
      return;
    }
  }

  try {
    pdf.save(fileName);
  } catch {
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  }
}
