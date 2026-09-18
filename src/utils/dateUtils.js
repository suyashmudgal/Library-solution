/**
 * Date utility functions for Study Room Digital Card
 */

/**
 * Safely parses any date string (YYYY-MM-DD, DD/MM/YYYY, or ISO) into a valid Date object
 * @param {string|Date} dateVal
 * @returns {Date|null}
 */
export function parseAnyDate(dateVal) {
  if (!dateVal) return null;
  if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? null : dateVal;

  const str = String(dateVal).trim();
  if (!str) return null;

  // Handle DD/MM/YYYY or DD-MM-YYYY
  if (/^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(str)) {
    const parts = str.split(/[/-]/);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? null : d;
  }

  // Standard constructor (YYYY-MM-DD or ISO)
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  return null;
}

/**
 * Calculates the Valid Till date based on Joining Date and Membership Plan
 * @param {string} joiningDateStr - ISO date string YYYY-MM-DD or DD/MM/YYYY
 * @param {string} plan - '1 Month' | '3 Months' | '6 Months' | '12 Months'
 * @returns {string} ISO date string YYYY-MM-DD
 */
export function calculateValidTill(joiningDateStr, plan) {
  if (!joiningDateStr) return '';

  const date = parseAnyDate(joiningDateStr);
  if (!date) return '';

  let monthsToAdd = 1;
  switch (plan) {
    case '1 Month':
      monthsToAdd = 1;
      break;
    case '3 Months':
      monthsToAdd = 3;
      break;
    case '6 Months':
      monthsToAdd = 6;
      break;
    case '12 Months':
      monthsToAdd = 12;
      break;
    default:
      monthsToAdd = 1;
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const targetDate = new Date(year, month + monthsToAdd, day);
  if (targetDate.getDate() !== day) {
    targetDate.setDate(0);
  }

  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Checks if a membership is expired compared to current date
 * @param {string} validTillStr - YYYY-MM-DD, DD/MM/YYYY, or ISO string
 * @returns {boolean}
 */
export function isMembershipExpired(validTillStr) {
  if (!validTillStr) return false;
  const validDate = parseAnyDate(validTillStr);
  if (!validDate) return false;

  // End of day (23:59:59.999)
  validDate.setHours(23, 59, 59, 999);

  const now = new Date();
  return now.getTime() > validDate.getTime();
}

/**
 * Computes card status: 'ACTIVE' | 'EXPIRED' | 'NOT_READY' | 'PENDING' | 'REJECTED'
 * @param {string} status - Application status ('APPROVED', 'PENDING', 'REJECTED')
 * @param {string} validTill - Date string
 * @param {string} rawCardStatus - Optional cardStatus from backend ('READY', 'NOT_READY', 'ACTIVE')
 * @returns {'ACTIVE' | 'EXPIRED' | 'PENDING' | 'REJECTED' | 'NOT_READY'}
 */
export function determineCardStatus(status, validTill, rawCardStatus) {
  const normStatus = (status || '').toUpperCase();
  const normCardStatus = (rawCardStatus || '').toUpperCase();

  if (normStatus === 'REJECTED') return 'REJECTED';
  if (normStatus === 'PENDING') return 'PENDING';

  if (normStatus === 'APPROVED' || normCardStatus === 'READY' || normCardStatus === 'ACTIVE') {
    return isMembershipExpired(validTill) ? 'EXPIRED' : 'ACTIVE';
  }

  return 'NOT_READY';
}

/**
 * Formats any date into readable Indian standard format (e.g. 18 Sep 2026 or 18/09/2026)
 * @param {string} rawDate
 * @param {'long' | 'short' | 'slash'} formatType
 * @returns {string}
 */
export function formatDate(rawDate, formatType = 'long') {
  if (!rawDate) return '-';
  const date = parseAnyDate(rawDate);
  if (!date) return String(rawDate);

  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  if (formatType === 'slash') {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsLong = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (formatType === 'short') {
    return `${day} ${monthsShort[date.getMonth()]} ${year}`;
  }

  return `${day} ${monthsLong[date.getMonth()]} ${year}`;
}

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns {string}
 */
export function getTodayDateString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
