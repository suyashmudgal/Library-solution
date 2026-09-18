/**
 * Production Authentication Service for Admin Portal
 * 
 * Supports environment variable configuration:
 * - VITE_ADMIN_USERNAME (default: 'admin')
 * - VITE_ADMIN_PASSWORD (default: 'CardMaker@2026' or 'Balaji@2026')
 */

const SESSION_KEY = 'cardmaker_admin_auth_token';
const LEGACY_SESSION_KEY = 'balaji_admin_auth_token';

export function getAdminUsername() {
  return (import.meta.env.VITE_ADMIN_USERNAME || 'admin').trim();
}

export function isAdminAuthenticated() {
  try {
    const sessionToken = sessionStorage.getItem(SESSION_KEY) || sessionStorage.getItem(LEGACY_SESSION_KEY);
    const localToken = localStorage.getItem(SESSION_KEY) || localStorage.getItem(LEGACY_SESSION_KEY);
    return Boolean(sessionToken || localToken);
  } catch (e) {
    return false;
  }
}

export function loginAdmin(username, password) {
  const expectedUser = getAdminUsername().toLowerCase();
  const configuredPass = (import.meta.env.VITE_ADMIN_PASSWORD || '').trim();

  const cleanUser = String(username || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();

  // Accept configured password, or default 'CardMaker@2026', or legacy 'Balaji@2026'
  const isPassValid = configuredPass
    ? cleanPass === configuredPass
    : cleanPass === 'CardMaker@2026' || cleanPass === 'Balaji@2026';

  if (cleanUser === expectedUser && isPassValid) {
    const token = `auth_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    try {
      sessionStorage.setItem(SESSION_KEY, token);
      localStorage.setItem(SESSION_KEY, token);
    } catch (e) {}
    return true;
  }
  return false;
}

export function logoutAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
    localStorage.removeItem(LEGACY_SESSION_KEY);
  } catch (e) {}
}
