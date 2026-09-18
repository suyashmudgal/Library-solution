import { calculateValidTill, determineCardStatus, isMembershipExpired } from '../utils/dateUtils';

// The user's live Google Apps Script Web App URL
export const DEFAULT_GAS_URL =
  'https://script.google.com/macros/s/AKfycbzMNdlxpOBajlksirxKcvXYDqGVzB7b3KE9VNkYTnGWNcmXczTOAwyg4CakfLYcKS5UIw/exec';

const GAS_URL_STORAGE_KEY = 'study_room_gas_url';
const TRACKED_IDS_KEY = 'study_room_tracked_member_ids_v3';
const EVENT_KEY = 'study_room_membership_updated';

// Known initial IDs present in the user's sheet
const DEFAULT_INITIAL_IDS = ['MEM00001', 'MEM00002'];

export function getGoogleAppsScriptUrl() {
  const custom = localStorage.getItem(GAS_URL_STORAGE_KEY);
  if (custom && custom.trim()) return custom.trim();
  return (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || DEFAULT_GAS_URL).trim();
}

export function setGoogleAppsScriptUrl(url) {
  if (!url || !url.trim()) {
    localStorage.removeItem(GAS_URL_STORAGE_KEY);
  } else {
    localStorage.setItem(GAS_URL_STORAGE_KEY, url.trim());
  }
  window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { timestamp: Date.now() } }));
}

export function isGoogleSheetConnected() {
  return true;
}

// Track member IDs discovered or submitted
function getTrackedMemberIds() {
  try {
    const raw = localStorage.getItem(TRACKED_IDS_KEY);
    if (!raw) {
      localStorage.setItem(TRACKED_IDS_KEY, JSON.stringify(DEFAULT_INITIAL_IDS));
      return [...DEFAULT_INITIAL_IDS];
    }
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids : [...DEFAULT_INITIAL_IDS];
  } catch (e) {
    return [...DEFAULT_INITIAL_IDS];
  }
}

function addTrackedMemberId(id) {
  if (!id) return;
  const clean = id.trim().toUpperCase();
  const current = getTrackedMemberIds();
  if (!current.includes(clean)) {
    current.push(clean);
    try {
      localStorage.setItem(TRACKED_IDS_KEY, JSON.stringify(current));
    } catch (e) {}
  }
}

// Low-level fetch wrapper handling text/plain POST for Google Apps Script Web App redirect
async function callGasPost(payload) {
  const url = getGoogleAppsScriptUrl();
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script responded with HTTP ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (err) {
    console.error('GAS POST Error:', err);
    throw err;
  }
}

// Low-level fetch wrapper for GET
async function callGasGet(params = {}) {
  const base = getGoogleAppsScriptUrl();
  const url = new URL(base);
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.set(key, String(params[key]));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script responded with HTTP ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (err) {
    console.error('GAS GET Error:', err);
    throw err;
  }
}

const MEMBER_PROFILE_KEY_PREFIX = 'study_room_profile_';

// Standard demo profiles with Father's Name pre-seeded
const PRESEEDED_PROFILES = {
  MEM00001: { fatherName: 'Ramesh Chandra Sharma' },
  MEM00002: { fatherName: 'Mahesh Kumar Verma' },
  MEM00003: { fatherName: 'Rajesh Sharma' },
  MEM00004: { fatherName: 'Rajesh Sharma' },
  MEM00005: { fatherName: 'Rajesh Sharma' },
};

function saveLocalMemberProfile(member) {
  if (!member || !member.memberId) return;
  const cleanId = String(member.memberId).trim().toUpperCase();
  try {
    const key = MEMBER_PROFILE_KEY_PREFIX + cleanId;
    const existing = getLocalMemberProfile(cleanId) || {};
    const merged = { ...existing, ...member };
    if (!merged.fatherName && existing.fatherName) {
      merged.fatherName = existing.fatherName;
    }
    localStorage.setItem(key, JSON.stringify(merged));
  } catch (e) {}
}

function getLocalMemberProfile(memberId) {
  if (!memberId) return null;
  const cleanId = String(memberId).trim().toUpperCase();
  try {
    const key = MEMBER_PROFILE_KEY_PREFIX + cleanId;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {}
  return PRESEEDED_PROFILES[cleanId] || null;
}

// Normalize member object from Google Apps Script response
function normalizeMember(data, fallbackId = '') {
  if (!data) return null;

  const memberId = data.memberId || fallbackId;
  const status = (data.status || 'PENDING').trim().toUpperCase();
  const rawCardStatus = (data.cardStatus || 'NOT_READY').trim().toUpperCase();
  const validTill = data.validTill || '';
  const effectiveCardStatus = determineCardStatus(status, validTill, rawCardStatus);
  const mob = data.mobileNumber || data.mobile || '';

  // Retrieve cached profile if available to restore fatherName if GAS response omitted it
  const cached = getLocalMemberProfile(memberId);
  const fatherName = String(
    data.fatherName || data.fathersName || (cached && cached.fatherName) || ''
  ).trim();

  const normalized = {
    memberId: memberId,
    name: data.name || (cached && cached.name) || '',
    fatherName: fatherName,
    fathersName: fatherName,
    mobileNumber: String(mob || (cached && cached.mobileNumber) || ''),
    mobile: String(mob || (cached && cached.mobileNumber) || ''),
    seatNumber: data.seatNumber || data.seat || (cached && cached.seatNumber) || '',
    membershipPlan: data.membershipPlan || data.plan || (cached && cached.membershipPlan) || '',
    feePaid: Number(data.feePaid || data.fee || (cached && cached.feePaid)) || 0,
    paymentDate: data.paymentDate || (cached && cached.paymentDate) || '',
    joiningDate: data.joiningDate || (cached && cached.joiningDate) || '',
    validTill: validTill || (cached && cached.validTill) || '',
    status: status,
    cardStatus: effectiveCardStatus,
    rawCardStatus: rawCardStatus,
    cardFileUrl: data.cardFileUrl || `/card/${memberId}`,
    cardUrl: data.cardFileUrl || `/card/${memberId}`,
    createdAt: data.createdAt || (cached && cached.createdAt) || null,
    approvedAt: data.approvedAt || (cached && cached.approvedAt) || null,
  };

  // Cache normalized profile with fatherName
  if (fatherName) {
    saveLocalMemberProfile(normalized);
  }

  return normalized;
}

// ============================================================================
// CORE SERVICE APIS CONNECTED TO USER'S GOOGLE APPS SCRIPT
// ============================================================================

/**
 * Submit student registration form
 * Sends POST { action: "register", ... }
 */
export async function submitMembership(formData) {
  const payload = {
    action: 'register',
    name: String(formData.name || '').trim(),
    fatherName: String(formData.fatherName || '').trim(),
    mobileNumber: String(formData.mobileNumber || formData.mobile || '').trim(),
    mobile: String(formData.mobileNumber || formData.mobile || '').trim(),
    seatNumber: String(formData.seatNumber || '').trim().toUpperCase(),
    membershipPlan: formData.membershipPlan,
    feePaid: Number(formData.feePaid) || 0,
    paymentDate: formData.paymentDate,
    joiningDate: formData.joiningDate,
  };

  const res = await callGasPost(payload);

  if (!res || !res.success) {
    throw new Error((res && res.message) || 'Failed to submit registration to Google Sheets');
  }

  const memberId = res.memberId;
  addTrackedMemberId(memberId);

  const registeredRecord = {
    memberId,
    name: payload.name,
    fatherName: payload.fatherName,
    fathersName: payload.fatherName,
    mobileNumber: payload.mobileNumber,
    mobile: payload.mobileNumber,
    seatNumber: payload.seatNumber,
    membershipPlan: payload.membershipPlan,
    feePaid: payload.feePaid,
    paymentDate: payload.paymentDate,
    joiningDate: payload.joiningDate,
    validTill: formData.validTill || calculateValidTill(payload.joiningDate, payload.membershipPlan),
    status: 'PENDING',
    cardStatus: 'NOT_READY',
    cardFileUrl: `/card/${memberId}`,
    cardUrl: `/card/${memberId}`,
    createdAt: new Date().toISOString(),
    approvedAt: null,
  };

  saveLocalMemberProfile(registeredRecord);

  // Notify active tabs
  window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { timestamp: Date.now() } }));

  return registeredRecord;
}

/**
 * Get membership status by Member ID or Mobile Number
 * Calls GET ?action=status&query=...
 */
export async function getMembershipStatus(query) {
  if (!query) return null;
  const clean = String(query).trim();

  try {
    const res = await callGasGet({ action: 'status', query: clean });
    if (res && res.success && res.memberId) {
      addTrackedMemberId(res.memberId);
      return normalizeMember(res);
    }
  } catch (err) {
    console.warn('getMembershipStatus error:', err);
  }

  // Fallback: If query looks like a memberId, try action=member
  if (clean.toUpperCase().startsWith('MEM') || clean.toUpperCase().startsWith('SR-')) {
    try {
      const res = await callGasGet({ action: 'member', memberId: clean });
      if (res && res.success && res.memberId) {
        addTrackedMemberId(res.memberId);
        return normalizeMember(res);
      }
    } catch (err) {
      console.warn('fallback member lookup error:', err);
    }
  }

  return null;
}

/**
 * Get full member record by member ID
 * Calls GET ?action=member&memberId=... (with fallback to ?action=status&query=...)
 */
export async function getMembershipById(memberId) {
  if (!memberId) return null;
  const clean = String(memberId).trim();

  try {
    const res = await callGasGet({ action: 'member', memberId: clean });
    if (res && res.success && res.memberId) {
      addTrackedMemberId(res.memberId);
      return normalizeMember(res);
    }
  } catch (err) {
    console.warn('getMembershipById error:', err);
  }

  // Fallback to action=status
  return await getMembershipStatus(clean);
}

/**
 * Search memberships by Mobile Number or Member ID
 * Calls GET ?action=status&query=...
 */
export async function searchMemberships(query) {
  if (!query || !query.trim()) return [];
  const clean = query.trim();

  const found = await getMembershipStatus(clean);
  if (found) {
    return [found];
  }
  return [];
}

/**
 * Approve membership request
 * Sends POST { action: "approve", memberId: "..." }
 */
export async function approveMembership(memberId) {
  const clean = String(memberId).trim();
  const res = await callGasPost({
    action: 'approve',
    memberId: clean,
  });

  if (!res || !res.success) {
    throw new Error((res && res.message) || `Failed to approve member ${memberId}`);
  }

  // Fetch updated record from Google Sheets
  const updated = await getMembershipById(clean);
  window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { timestamp: Date.now() } }));
  return updated || { memberId: clean, status: 'APPROVED', cardStatus: 'ACTIVE' };
}

/**
 * Reject membership request
 * Sends POST { action: "reject", memberId: "..." }
 */
export async function rejectMembership(memberId) {
  const clean = String(memberId).trim();
  const res = await callGasPost({
    action: 'reject',
    memberId: clean,
  });

  if (!res || !res.success) {
    throw new Error((res && res.message) || `Failed to reject member ${memberId}`);
  }

  const updated = await getMembershipById(clean);
  window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { timestamp: Date.now() } }));
  return updated || { memberId: clean, status: 'REJECTED', cardStatus: 'NOT_READY' };
}

/**
 * Get all memberships for the admin dashboard
 * Retrieves tracked member IDs and probes for latest IDs in Google Sheets
 */
export async function getAllMemberships() {
  const tracked = getTrackedMemberIds();

  // Find max numeric index (e.g. from MEM00001, MEM00002 -> 2)
  let maxIndex = 2;
  tracked.forEach((id) => {
    const match = id.match(/MEM(\d+)/i);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > maxIndex) maxIndex = n;
    }
  });

  // Probe lookahead buffer (check up to maxIndex + 3 to discover newly submitted IDs from other tabs/browsers)
  const probeIds = [];
  for (let i = 1; i <= maxIndex + 3; i++) {
    const padId = `MEM${String(i).padStart(5, '0')}`;
    probeIds.push(padId);
  }

  const allIdsToFetch = Array.from(new Set([...tracked, ...probeIds]));

  // Fetch in parallel
  const results = await Promise.allSettled(
    allIdsToFetch.map((id) =>
      callGasGet({ action: 'member', memberId: id }).then((res) => {
        if (res && res.success && res.memberId) {
          addTrackedMemberId(res.memberId);
          return normalizeMember(res, id);
        }
        return null;
      })
    )
  );

  const members = results
    .filter((r) => r.status === 'fulfilled' && r.value !== null)
    .map((r) => r.value);

  return members;
}

/**
 * Test connectivity with Google Apps Script endpoint
 */
export async function testGoogleAppsScriptConnection(url) {
  const target = (url || getGoogleAppsScriptUrl()).trim();
  const res = await fetch(target, { method: 'GET' });
  const data = await res.json();
  return data;
}

/**
 * Subscriptions for cross-tab and reactive updates
 */
export function subscribeToMembershipUpdates(callback) {
  const onCustom = () => callback();
  const onStorage = (e) => {
    if (e.key === TRACKED_IDS_KEY || !e.key) {
      callback();
    }
  };

  window.addEventListener(EVENT_KEY, onCustom);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(EVENT_KEY, onCustom);
    window.removeEventListener('storage', onStorage);
  };
}
