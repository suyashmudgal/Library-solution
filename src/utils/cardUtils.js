import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Generates a unique Member ID in format: SR-YYYY-XXXXX
 * @returns {string} e.g. SR-2026-00124
 */
export function generateMemberId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SR-${year}-${randomNum}`;
}

/**
 * Generates and downloads a real PDF of the membership card
 * Using jsPDF with an in-memory high-res render of the DOM element
 * Output: Balaji-Library-Membership-[MEMBER_ID].pdf
 * 
 * @param {HTMLElement} element - The DOM element containing the card
 * @param {string} memberId - Real member ID
 * @returns {Promise<boolean>}
 */
export async function downloadCardAsPdf(element, memberId = 'MEMBER') {
  if (!element) {
    throw new Error('Card element not found');
  }

  try {
    // 1. Capture in-memory high-res rasterization (pixelRatio 2: crisp, fast, memory-efficient)
    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      quality: 0.95,
      backgroundColor: '#ffffff',
      cacheBust: false,
    });

    // 2. Measure actual aspect ratio of the card
    const elWidth = element.offsetWidth || 560;
    const elHeight = element.offsetHeight || 350;
    const aspect = elHeight / elWidth;

    // 3. ID-1 Standard Landscape Card Size: 85.6mm width
    const pdfWidth = 85.6;
    const pdfHeight = Number((pdfWidth * aspect).toFixed(2));

    // 4. Initialize single-page PDF exactly matching card dimensions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // 5. Place in-memory image onto PDF page
    pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');

    // 6. Format exact expected filename: Balaji-Library-Membership-[MEMBER_ID].pdf
    const cleanId = String(memberId || 'MEMBER').replace(/[^a-zA-Z0-9-_]/g, '');
    const fileName = `Balaji-Library-Membership-${cleanId}.pdf`;

    // 7. Explicit PDF Blob download mechanism to guarantee correct extension and no UUID names
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // 8. Clean up temporary object URL and element
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      URL.revokeObjectURL(blobUrl);
    }, 1500);

    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
}

/**
 * Format fee as Indian Rupee (₹)
 * @param {number|string} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '₹0';
  const num = Number(amount);
  return `₹${num.toLocaleString('en-IN')}`;
}
