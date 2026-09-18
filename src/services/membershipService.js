import { calculateValidTill, determineCardStatus, isMembershipExpired } from '../utils/dateUtils';

// The user's live Google Apps Script Web App URL
export const DEFAULT_GAS_URL =
  'https://script.google.com/macros/s/AKfycbzMNdlxpOBajlksirxKcvXYDqGVzB7b3KE9VNkYTnGWNcmXczTOAwyg4CakfLYcKS5UIw/exec';

const GAS_URL_STORAGE_KEY = 'study_room_gas_url';
const TRACKED_IDS_KEY = 'study_room_tracked_member_ids_v3';
const EVENT_KEY = 'study_room_membership_updated';
const ERROR_SERVICE_UNAVAILABLE = 'Unable to connect to the membership service. Please try again.';

// In-memory cache to eliminate duplicate network calls and provide instant transitions
let membersCache = {
  data: null,
  timestamp: 0,
};
const CACHE_TTL_MS = 15000; // 15 seconds TTL
let inFlightFetchAllPromise = null;

export function invalidateMembersCache() {
  membersCache.data = null;
  membersCache.timestamp = 0;
}

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
  invalidateMembersCache();
  window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { timestamp: Date.now() } }));
}

export function isGoogleSheetConnected() {
  return true;
}

// Track member IDs discovered or submitted
export function getTrackedMemberIds() {
  try {
    const raw = localStorage.getItem(TRACKED_IDS_KEY);
    if (!raw) return [];
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids : [];
  } catch (e) {
    return [];
  }
}

export function addTrackedMemberId(id) {
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

export function removeTrackedMemberId(id) {
  if (!id) return;
  const clean = id.trim().toUpperCase();
  const current = getTrackedMemberIds();
  const updated = current.filter((x) => x !== clean);
  try {
    localStorage.setItem(TRACKED_IDS_KEY, JSON.stringify(updated));
  } catch (e) {}
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
    throw new Error(ERROR_SERVICE_UNAVAILABLE);
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
    throw new Error(ERROR_SERVICE_UNAVAILABLE);
  }
}

const MEMBER_PROFILE_KEY_PREFIX = 'study_room_profile_';

export function saveLocalMemberProfile(member) {
  if (!member || !member.memberId) return;
  const cleanId = String(member.memberId).trim().toUpperCase();
  try {
    const key = MEMBER_PROFILE_KEY_PREFIX + cleanId;
    const existing = getLocalMemberProfile(cleanId) || {};
    const merged = { ...existing, ...member };
    if (!merged.fatherName && existing.fatherName) {
      merged.fatherName = existing.fatherName;
      merged.fathersName = existing.fatherName;
    }
    localStorage.setItem(key, JSON.stringify(merged));
  } catch (e) {}
}

export function getLocalMemberProfile(memberId) {
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
  return null;
}

export function removeLocalMemberProfile(memberId) {
  if (!memberId) return;
  const cleanId = String(memberId).trim().toUpperCase();
  try {
    const key = MEMBER_PROFILE_KEY_PREFIX + cleanId;
    localStorage.removeItem(key);
  } catch (e) {}
}

// Normalize member object from Google Apps Script response
export function normalizeMember(data, fallbackId = '') {
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
    data.fatherName || data.fathersName || data.father_name || (cached && cached.fatherName) || ''
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
  const fatherName = String(formData.fatherName || formData.fathersName || '').trim();
  const payload = {
    action: 'register',
    name: String(formData.name || '').trim(),
    fatherName: fatherName,
    fathersName: fatherName,
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
    throw new Error((res && res.message) || ERROR_SERVICE_UNAVAILABLE);
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
  invalidateMembersCache();

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

  invalidateMembersCache();

  // Fetch updated record from Google Sheets
  const updated = await getMembershipById(clean);
  window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { timestamp: Date.now() } }));
  return updated || { memberId: clean, status: 'APPROVED', cardStatus: 'READY' };
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

  invalidateMembersCache();

  const updated = await getMembershipById(clean);
  window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { timestamp: Date.now() } }));
  return updated || { memberId: clean, status: 'REJECTED', cardStatus: 'NOT_READY' };
}

/**
 * Delete membership record from Google Sheets and local tracking
 * Sends POST { action: "delete", memberId: "..." }
 */
export async function deleteMembership(memberId) {
  const clean = String(memberId).trim();
  try {
    await callGasPost({
      action: 'delete',
      memberId: clean,
    });
  } catch (e) {
    // If deployed GAS is older version without delete action, proceed with local cleanup
    console.warn('Backend delete response:', e);
  }

  removeTrackedMemberId(clean);
  removeLocalMemberProfile(clean);
  invalidateMembersCache();
  window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { timestamp: Date.now() } }));
  return true;
}

/**
 * Get all memberships for the admin dashboard
 * High-performance implementation:
 * 1. Returns SWR memory cache when valid (instant UI render, 0 network latency).
 * 2. Deduplicates concurrent in-flight requests.
 * 3. Probes ?action=members for single-call bulk retrieval.
 * 4. Gracefully handles legacy backend with targeted sequential lookups.
 */
export async function getAllMemberships({ forceRefresh = false } = {}) {
  // 1. Check in-memory cache
  if (!forceRefresh && membersCache.data && Date.now() - membersCache.timestamp < CACHE_TTL_MS) {
    return membersCache.data;
  }

  // 2. Return existing in-flight promise if currently fetching
  if (inFlightFetchAllPromise) {
    return inFlightFetchAllPromise;
  }

  inFlightFetchAllPromise = (async () => {
    try {
      // 3. Attempt single-call bulk fetch first (?action=members)
      try {
        const bulkRes = await callGasGet({ action: 'members' });
        if (bulkRes && bulkRes.success && (Array.isArray(bulkRes.members) || Array.isArray(bulkRes.data))) {
          const list = bulkRes.members || bulkRes.data;
          const normalizedList = list
            .filter((row) => row && (row.memberId || row.id))
            .map((row) => normalizeMember(row, row.memberId || row.id));

          normalizedList.forEach((m) => addTrackedMemberId(m.memberId));

          membersCache = {
            data: normalizedList,
            timestamp: Date.now(),
          };
          return normalizedList;
        }
      } catch (bulkErr) {
        // Fall back to targeted member lookup
      }

      // 4. Targeted lookup for tracked IDs + probe up to highest ID
      const tracked = getTrackedMemberIds();
      let maxNum = 1;
      tracked.forEach((id) => {
        const match = id.match(/MEM(\d+)/i);
        if (match) {
          const n = parseInt(match[1], 10);
          if (n > maxNum) maxNum = n;
        }
      });

      // Target IDs: tracked IDs plus small lookahead (max 2 beyond highest tracked)
      const idsToFetch = new Set(tracked);
      for (let i = 1; i <= Math.max(maxNum + 1, 2); i++) {
        idsToFetch.add(`MEM${String(i).padStart(5, '0')}`);
      }

      const list = Array.from(idsToFetch);
      const members = [];

      // Fetch in small parallel batch of up to 4 to avoid chocking GAS concurrency limits
      const chunkSize = 4;
      for (let i = 0; i < list.length; i += chunkSize) {
        const chunk = list.slice(i, i + chunkSize);
        const chunkResults = await Promise.allSettled(
          chunk.map((id) =>
            callGasGet({ action: 'member', memberId: id }).then((res) => {
              if (res && res.success && res.memberId) {
                addTrackedMemberId(res.memberId);
                return normalizeMember(res, id);
              }
              return null;
            })
          )
        );

        chunkResults.forEach((r) => {
          if (r.status === 'fulfilled' && r.value) {
            members.push(r.value);
          }
        });
      }

      // Sort by memberId descending (newest first)
      members.sort((a, b) => (b.memberId || '').localeCompare(a.memberId || ''));

      membersCache = {
        data: members,
        timestamp: Date.now(),
      };

      return members;
    } finally {
      inFlightFetchAllPromise = null;
    }
  })();

  return inFlightFetchAllPromise;
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
