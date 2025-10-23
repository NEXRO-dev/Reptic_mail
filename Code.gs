// 設定項目: スプレッドシートの ID とシート名を入力してください
const SPREADSHEET_ID = '1QQ2Asf65pXON7Ho8u44Cj3PZLwYyyNrDmceFyZUhgBA';
const SHEET_NAME = 'Emails';

function ensureSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 2).setValues([["Timestamp", "Email"]]);
  }
  return sheet;
}

function doGet() {
  // IFRAME 埋め込みを許可
  const html = HtmlService.createHtmlOutput('<!doctype html><html><body>Reptic Email Capture Web App</body></html>');
  html.addMetaTag('referrer', 'no-referrer');
  html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return html;
}

function doPost(e) {
  try {
    if (!SPREADSHEET_ID || SPREADSHEET_ID === 'PUT_YOUR_SPREADSHEET_ID') {
      return buildHtmlResponse('error', 'GAS設定未完了: SPREADSHEET_ID を設定してください');
    }
    if (!e || !e.parameter) {
      return buildHtmlResponse('error', 'No parameters');
    }
    const rawEmail = (e.parameter.email || '').toString().trim().toLowerCase();
    const email = rawEmail;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return buildHtmlResponse('error', 'Invalid email');
    }

    const sheet = ensureSheet();
    const lastRow = sheet.getLastRow();
    let existing = [];
    if (lastRow >= 2) {
      // 2列目（Email 列）を取得
      existing = sheet.getRange(2, 2, lastRow - 1, 1).getValues().map(r => (r[0] + '').toLowerCase());
    }

    if (existing.indexOf(email) !== -1) {
      return buildHtmlResponse('duplicate', 'Already exists');
    }

    sheet.appendRow([new Date(), email]);
    return buildHtmlResponse('ok', 'Saved');
  } catch (err) {
    return buildHtmlResponse('error', (err && err.message) ? err.message : 'Unknown error');
  }
}

function buildHtmlResponse(status, message) {
  const payload = JSON.stringify({ source: 'gas-web-app', status: status, message: message });
  const html = `<!doctype html><html><head><meta charset="UTF-8"></head><body><script>\ntry {\n  window.top.postMessage(${payload}, '*');\n} catch (e) {}\n</script>OK</body></html>`;
  const out = HtmlService.createHtmlOutput(html);
  out.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return out;
}

