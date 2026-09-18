/**
 * ============================================================================
 * STUDY ROOM DIGITAL CARD — GOOGLE APPS SCRIPT BACKEND
 * ============================================================================
 * 
 * Google Sheet: LIBRARY'S DATA
 * Sheet Name: Sheet1
 * 
 * EXACT COLUMN STRUCTURE (A:O):
 * Column A (1):  Member ID
 * Column B (2):  Name
 * Column C (3):  Father's Name
 * Column D (4):  Mobile Number
 * Column E (5):  Seat Number
 * Column F (6):  Membership Plan
 * Column G (7):  Fee Paid
 * Column H (8):  Payment Date
 * Column I (9):  Joining Date
 * Column J (10): Valid Till
 * Column K (11): Status
 * Column L (12): Card Status
 * Column M (13): Card File URL
 * Column N (14): Created At
 * Column O (15): Approved At
 * ============================================================================
 */

const SHEET_NAME = 'Sheet1';

/**
 * Handle HTTP GET Requests
 * Supports:
 * - ?action=ping
 * - ?action=member&memberId=MEM00003
 * - ?action=status&query=9826011223 (or query=MEM00003)
 * - ?action=members
 * - ?action=getMemberById&memberId=...
 * - ?action=getMemberStatus&memberId=...
 * - ?action=searchMembers&query=...
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || 'ping').toLowerCase();

    if (action === 'ping') {
      return jsonResponse({
        success: true,
        message: 'Membership API is running',
        columns: [
          'Member ID', 'Name', "Father's Name", 'Mobile Number', 'Seat Number',
          'Membership Plan', 'Fee Paid', 'Payment Date', 'Joining Date', 'Valid Till',
          'Status', 'Card Status', 'Card File URL', 'Created At', 'Approved At'
        ]
      });
    }

    // action=member or action=getmemberbyid
    if (action === 'member' || action === 'getmemberbyid') {
      const memberId = params.memberId || params.id || '';
      if (!memberId) {
        return jsonResponse({ success: false, error: 'Missing memberId parameter' }, 400);
      }
      const member = findMemberById(memberId);
      if (!member) {
        return jsonResponse({ success: false, error: 'Member not found', data: null });
      }
      return jsonResponse({ success: true, ...member });
    }

    // action=status or action=searchmembers or action=getmemberstatus
    if (action === 'status' || action === 'searchmembers' || action === 'getmemberstatus') {
      const query = params.query || params.memberId || params.mobile || '';
      if (!query) {
        return jsonResponse({ success: false, error: 'Missing query parameter' }, 400);
      }
      const member = findMemberByQuery(query);
      if (!member) {
        return jsonResponse({ success: false, error: 'Member not found with query ' + query });
      }
      return jsonResponse({ success: true, ...member });
    }

    // action=members or action=getmembers or action=all
    if (action === 'members' || action === 'getmembers' || action === 'all') {
      const members = getAllMembersFromSheet();
      return jsonResponse({ success: true, members: members, data: members });
    }

    return jsonResponse({ success: true, message: 'Membership API is running' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() }, 500);
  }
}

/**
 * Handle HTTP POST Requests
 * Supports:
 * - action: 'register' or 'submitMember'
 * - action: 'approve' or 'approveMember'
 * - action: 'reject' or 'rejectMember'
 * - action: 'updateCardUrl'
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = (e && e.parameter) || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = String(payload.action || 'register').toLowerCase();

    if (action === 'register' || action === 'submitmember') {
      const created = insertMemberToSheet(payload);
      return jsonResponse({
        success: true,
        memberId: created.memberId,
        status: created.status,
        message: 'Application submitted successfully',
        data: created
      });
    }

    if (action === 'approve' || action === 'approvemember') {
      const memberId = payload.memberId;
      if (!memberId) {
        return jsonResponse({ success: false, error: 'Missing memberId' }, 400);
      }
      const updated = updateMemberStatus(memberId, 'APPROVED', 'READY');
      return jsonResponse({ success: true, message: 'Member approved', memberId: memberId, data: updated });
    }

    if (action === 'reject' || action === 'rejectmember') {
      const memberId = payload.memberId;
      if (!memberId) {
        return jsonResponse({ success: false, error: 'Missing memberId' }, 400);
      }
      const updated = updateMemberStatus(memberId, 'REJECTED', 'NOT_READY');
      return jsonResponse({ success: true, message: 'Member rejected', memberId: memberId, data: updated });
    }

    if (action === 'delete' || action === 'deletemember') {
      const memberId = payload.memberId;
      if (!memberId) {
        return jsonResponse({ success: false, error: 'Missing memberId' }, 400);
      }
      const deleted = deleteMemberFromSheet(memberId);
      return jsonResponse({ success: true, message: 'Member deleted', memberId: memberId });
    }

    if (action === 'updatecardurl') {
      const memberId = payload.memberId;
      const cardFileUrl = payload.cardFileUrl || payload.cardUrl || '';
      const updated = updateCardFileUrl(memberId, cardFileUrl);
      return jsonResponse({ success: true, message: 'Card URL updated', data: updated });
    }

    return jsonResponse({ success: false, error: 'Unknown POST action: ' + action }, 400);
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() }, 500);
  }
}

// ============================================================================
// SHEET OPERATIONS (STRICTLY COLUMNS A:O)
// ============================================================================

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
  }
  return sheet;
}

/**
 * Maps single row array (A:O) to clean JavaScript object
 * data[i][0] -> Member ID
 * data[i][1] -> Name
 * data[i][2] -> Father's Name (EXACT Column C)
 * data[i][3] -> Mobile Number
 * data[i][4] -> Seat Number
 * data[i][5] -> Membership Plan
 * data[i][6] -> Fee Paid
 * data[i][7] -> Payment Date
 * data[i][8] -> Joining Date
 * data[i][9] -> Valid Till
 * data[i][10] -> Status
 * data[i][11] -> Card Status
 * data[i][12] -> Card File URL
 * data[i][13] -> Created At
 * data[i][14] -> Approved At
 */
function mapRowToObject(row, rowIndex) {
  const memberId = String(row[0] || '').trim();
  const name = String(row[1] || '').trim();
  const fatherName = String(row[2] || '').trim(); // Column C: Father's Name
  const mobileNumber = String(row[3] || '').trim();
  const seatNumber = String(row[4] || '').trim();
  const membershipPlan = String(row[5] || '').trim();
  const feePaid = Number(row[6]) || 0;
  const paymentDate = formatSheetDate(row[7]);
  const joiningDate = formatSheetDate(row[8]);
  const validTill = formatSheetDate(row[9]);
  const status = String(row[10] || 'PENDING').trim().toUpperCase();
  let cardStatus = String(row[11] || 'NOT_READY').trim().toUpperCase();
  const cardFileUrl = String(row[12] || '').trim();
  const createdAt = formatSheetDate(row[13]);
  const approvedAt = row[14] ? formatSheetDate(row[14]) : null;

  if (status === 'APPROVED' && isDatePast(validTill)) {
    cardStatus = 'EXPIRED';
  } else if (status === 'APPROVED' && cardStatus !== 'READY' && cardStatus !== 'ACTIVE') {
    cardStatus = 'READY';
  }

  return {
    rowIndex: rowIndex + 1,
    memberId: memberId,
    name: name,
    fatherName: fatherName, // Column C
    fathersName: fatherName,
    mobileNumber: mobileNumber,
    mobile: mobileNumber,
    seatNumber: seatNumber,
    membershipPlan: membershipPlan,
    feePaid: feePaid,
    paymentDate: paymentDate,
    joiningDate: joiningDate,
    validTill: validTill,
    status: status,
    cardStatus: cardStatus,
    cardFileUrl: cardFileUrl,
    createdAt: createdAt,
    approvedAt: approvedAt,
  };
}

/**
 * Get all members from sheet
 */
function getAllMembersFromSheet() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  const data = sheet.getRange(2, 1, lastRow - 1, 15).getValues();
  const members = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i][0]) {
      members.push(mapRowToObject(data[i], i + 1));
    }
  }
  return members;
}

/**
 * Find member by Member ID (Column A)
 */
function findMemberById(memberId) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;

  const targetId = String(memberId).trim().toUpperCase();
  const values = sheet.getRange(2, 1, lastRow - 1, 15).getValues();

  for (let i = 0; i < values.length; i++) {
    const currentId = String(values[i][0]).trim().toUpperCase();
    if (currentId === targetId) {
      return mapRowToObject(values[i], i + 1);
    }
  }
  return null;
}

/**
 * Find member by Mobile Number (Column D) or Member ID (Column A)
 */
function findMemberByQuery(query) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;

  const cleanQuery = String(query).trim().toUpperCase();
  const values = sheet.getRange(2, 1, lastRow - 1, 15).getValues();

  for (let i = 0; i < values.length; i++) {
    const memberId = String(values[i][0]).trim().toUpperCase();
    const mobile = String(values[i][3]).trim();
    if (memberId === cleanQuery || mobile === cleanQuery) {
      return mapRowToObject(values[i], i + 1);
    }
  }

  // Partial match fallback
  for (let i = 0; i < values.length; i++) {
    const memberId = String(values[i][0]).trim().toUpperCase();
    const mobile = String(values[i][3]).trim();
    if (memberId.indexOf(cleanQuery) !== -1 || mobile.indexOf(cleanQuery) !== -1) {
      return mapRowToObject(values[i], i + 1);
    }
  }
  return null;
}

/**
 * Insert new member row into Sheet1 mapping exactly to Columns A:O
 */
function insertMemberToSheet(data) {
  const sheet = getSheet();

  // 1. Generate sequential Member ID: MEM0000X or custom
  const memberId = data.memberId || generateSequentialMemberId(sheet);

  // 2. Extract fields
  const name = String(data.name || '').trim();
  const fatherName = String(data.fatherName || data.fathersName || '').trim(); // Column C
  const mobileNumber = String(data.mobileNumber || data.mobile || '').trim();
  const seatNumber = String(data.seatNumber || '').trim().toUpperCase();
  const membershipPlan = String(data.membershipPlan || '1 Month').trim();
  const feePaid = Number(data.feePaid) || 0;
  const paymentDate = data.paymentDate || getTodayIsoDate();
  const joiningDate = data.joiningDate || getTodayIsoDate();

  // 3. Auto-calculate Valid Till
  const validTill = data.validTill || calculateValidTillDate(joiningDate, membershipPlan);

  // 4. Initial status
  const status = 'PENDING';
  const cardStatus = 'NOT_READY';
  const cardFileUrl = data.cardFileUrl || data.cardUrl || `/card/${memberId}`;
  const createdAt = new Date().toISOString();
  const approvedAt = '';

  // 5. Append EXACT 15-column array (Columns A:O)
  const rowData = [
    memberId,         // A: Member ID
    name,             // B: Name
    fatherName,       // C: Father's Name
    mobileNumber,     // D: Mobile Number
    seatNumber,       // E: Seat Number
    membershipPlan,   // F: Membership Plan
    feePaid,          // G: Fee Paid
    paymentDate,      // H: Payment Date
    joiningDate,      // I: Joining Date
    validTill,        // J: Valid Till
    status,           // K: Status
    cardStatus,       // L: Card Status
    cardFileUrl,      // M: Card File URL
    createdAt,        // N: Created At
    approvedAt        // O: Approved At
  ];

  sheet.appendRow(rowData);

  return {
    memberId: memberId,
    name: name,
    fatherName: fatherName,
    mobileNumber: mobileNumber,
    seatNumber: seatNumber,
    membershipPlan: membershipPlan,
    feePaid: feePaid,
    paymentDate: paymentDate,
    joiningDate: joiningDate,
    validTill: validTill,
    status: status,
    cardStatus: cardStatus,
    cardFileUrl: cardFileUrl,
    createdAt: createdAt,
    approvedAt: null
  };
}

/**
 * Update Status (Column K) and Card Status (Column L)
 */
function updateMemberStatus(memberId, status, cardStatus) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) throw new Error('Sheet is empty');

  const targetId = String(memberId).trim().toUpperCase();
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

  let targetRow = -1;
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim().toUpperCase() === targetId) {
      targetRow = i + 2;
      break;
    }
  }

  if (targetRow === -1) {
    throw new Error('Member ID ' + memberId + ' not found in Sheet');
  }

  // Column K (11): Status
  sheet.getRange(targetRow, 11).setValue(status);

  // Column L (12): Card Status
  const validTillVal = sheet.getRange(targetRow, 10).getValue();
  const validTillStr = formatSheetDate(validTillVal);
  let effectiveCardStatus = cardStatus;
  if (status === 'APPROVED' && isDatePast(validTillStr)) {
    effectiveCardStatus = 'EXPIRED';
  }
  sheet.getRange(targetRow, 12).setValue(effectiveCardStatus);

  // Column O (15): Approved At
  if (status === 'APPROVED') {
    sheet.getRange(targetRow, 15).setValue(new Date().toISOString());
  } else if (status === 'REJECTED') {
    sheet.getRange(targetRow, 15).setValue('');
  }

  const updatedValues = sheet.getRange(targetRow, 1, 1, 15).getValues()[0];
  return mapRowToObject(updatedValues, targetRow - 1);
}

function updateCardFileUrl(memberId, url) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) throw new Error('Sheet is empty');

  const targetId = String(memberId).trim().toUpperCase();
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

  let targetRow = -1;
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim().toUpperCase() === targetId) {
      targetRow = i + 2;
      break;
    }
  }

  if (targetRow === -1) throw new Error('Member ID ' + memberId + ' not found');

  sheet.getRange(targetRow, 13).setValue(url);
  const updatedValues = sheet.getRange(targetRow, 1, 1, 15).getValues()[0];
  return mapRowToObject(updatedValues, targetRow - 1);
}

function deleteMemberFromSheet(memberId) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) throw new Error('Sheet is empty');

  const targetId = String(memberId).trim().toUpperCase();
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

  let targetRow = -1;
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim().toUpperCase() === targetId) {
      targetRow = i + 2;
      break;
    }
  }

  if (targetRow === -1) throw new Error('Member ID ' + memberId + ' not found');

  sheet.deleteRow(targetRow);
  return true;
}

// ============================================================================
// HELPERS
// ============================================================================

function generateSequentialMemberId(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 'MEM00001';

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  let maxNum = 0;
  for (let i = 0; i < ids.length; i++) {
    const str = String(ids[i][0]).trim();
    const match = str.match(/MEM(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return 'MEM' + String(maxNum + 1).padStart(5, '0');
}

function calculateValidTillDate(joiningDateStr, plan) {
  let monthsToAdd = 1;
  if (plan === '3 Months') monthsToAdd = 3;
  else if (plan === '6 Months') monthsToAdd = 6;
  else if (plan === '12 Months') monthsToAdd = 12;

  let date;
  if (joiningDateStr && joiningDateStr.indexOf('/') !== -1) {
    const parts = joiningDateStr.split('/');
    date = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
  } else if (joiningDateStr && joiningDateStr.indexOf('-') !== -1) {
    const parts = joiningDateStr.split('-');
    date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  } else {
    date = new Date();
  }

  if (isNaN(date.getTime())) date = new Date();

  const targetDate = new Date(date.getFullYear(), date.getMonth() + monthsToAdd, date.getDate());
  if (targetDate.getDate() !== date.getDate()) {
    targetDate.setDate(0);
  }

  const dd = String(targetDate.getDate()).padStart(2, '0');
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const yyyy = targetDate.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

function isDatePast(dateStr) {
  if (!dateStr) return false;
  let d;
  if (dateStr.indexOf('/') !== -1) {
    const parts = dateStr.split('/');
    d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
  } else {
    d = new Date(dateStr);
  }
  if (isNaN(d.getTime())) return false;
  d.setHours(23, 59, 59, 999);
  return new Date().getTime() > d.getTime();
}

function formatSheetDate(val) {
  if (!val) return '';
  if (val instanceof Date) {
    const dd = String(val.getDate()).padStart(2, '0');
    const mm = String(val.getMonth() + 1).padStart(2, '0');
    const yyyy = val.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
  }
  return String(val);
}

function getTodayIsoDate() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

function jsonResponse(obj, status) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
