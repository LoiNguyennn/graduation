/**
 * Nhận xác nhận tham dự từ thiệp và ghi vào Google Sheet.
 * Cách cài: xem README.md, mục "Xác nhận tham dự".
 *
 * Sheet "RSVP": Tên | Xác nhận lần đầu | Xác nhận lần cuối | Số lần
 * Cùng một tên (không phân biệt hoa thường) chỉ có một dòng.
 */
const SHEET_NAME = "RSVP";
const HEADER = ["Tên", "Xác nhận lần đầu", "Xác nhận lần cuối", "Số lần"];

function doPost(e) {
  const name = String((e && e.parameter && e.parameter.name) || "").trim().slice(0, 40);
  if (!name) return json({ ok: false, error: "missing name" });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADER);

    const now = new Date();
    const safe = /^[=+\-@]/.test(name) ? "'" + name : name; // chặn chèn công thức
    const rows = sheet.getLastRow() - 1;
    const names = rows > 0 ? sheet.getRange(2, 1, rows, 1).getDisplayValues() : [];
    const i = names.findIndex((r) => r[0].toLowerCase() === name.toLowerCase());

    if (i === -1) {
      sheet.appendRow([safe, now, now, 1]);
    } else {
      const row = i + 2;
      const count = Number(sheet.getRange(row, 4).getValue()) || 0;
      sheet.getRange(row, 3, 1, 2).setValues([[now, count + 1]]);
    }
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
