/**
 * Production Authentication Service for Admin Portal
 * 
 * Supports environment variable configuration:
 * - VITE_ADMIN_USERNAME (default: 'admin')
 * - VITE_ADMIN_PASSWORD (default: 'Balaji@2026')
 */

const SESSION_KEY = 'balaji_admin_auth_token';

export function getAdminUsername() {
  return (import.meta.env.VITE_ADMIN_USERNAME || 'admin').trim();
}

export function isAdminAuthenticated() {
  try {
    const sessionToken = sessionStorage.getItem(SESSION_KEY);
    const localToken = localStorage.getItem(SESSION_KEY);
    return Boolean(sessionToken || localToken);
  } catch (e) {
    return false;
  }
}

export function loginAdmin(username, password) {
  const expectedUser = getAdminUsername().toLowerCase();
  const expectedPass = (import.meta.env.VITE_ADMIN_PASSWORD || 'Balaji@2026').trim();

  const cleanUser = String(username || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();

  if (cleanUser === expectedUser && cleanPass === expectedPass) {
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
  } catch (e) {}
}
