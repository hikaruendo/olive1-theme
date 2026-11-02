/**
 * Olive1 予約台帳（Google スプレッドシートに紐づく Apps Script）
 *
 * - 予約サイト（olive.kando1.com）からの予約を1行ずつ追加する
 * - 追加の前にロックをかけて残り本数を数える＝同時に予約が来ても TOTAL 本を超えない
 * - Stripe の入金（Vercel の webhook 経由）を「入金済み」にする
 * - メニュー「Olive1」から本番号を振る・残り本数を見る
 *
 * 設定手順は apps-script/README.md。SECRET は Vercel の SHEET_SECRET と同じ値。
 */

const TOTAL = 50; // 今年の本数（本番号 n/50）
const INIT_SECRET = ""; // 初回の setup() で Script Properties に移す。空のままコミットする

const HEADERS = [
  "予約番号", "受付日時", "状態", "名前", "メール", "本数", "受け取り", "発送先", "支払い",
  "紹介", "メモ", "言語", "入金日時", "決済本数", "決済額", "本番号", "備考", "Stripe決済ID",
];
const COL = {
  id: 1, at: 2, status: 3, name: 4, email: 5, qty: 6, receive: 7, address: 8, payment: 9,
  referrer: 10, note: 11, lang: 12, paidAt: 13, paidQty: 14, paidAmount: 15, bottleNo: 16,
  remark: 17, stripe: 18,
};
const STATUS = { reserved: "予約", paid: "入金済み", cancelled: "キャンセル" };

// ---------- 初回だけ実行 ----------
function setup() {
  const sh = sheet_();
  sh.setName("予約");
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold").setBackground("#eef1e2");
  sh.setFrozenRows(1);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList([STATUS.reserved, STATUS.paid, STATUS.cancelled], true)
    .setAllowInvalid(false)
    .build();
  sh.getRange(2, COL.status, 1000, 1).setDataValidation(rule);
  sh.getRange(2, COL.at, 1000, 1).setNumberFormat("yyyy/mm/dd hh:mm");
  sh.getRange(2, COL.paidAt, 1000, 1).setNumberFormat("yyyy/mm/dd hh:mm");
  sh.getRange(2, COL.paidAmount, 1000, 1).setNumberFormat("¥#,##0");
  sh.setColumnWidth(COL.id, 150);
  sh.setColumnWidth(COL.address, 260);
  sh.setColumnWidth(COL.note, 200);
  sh.setColumnWidth(COL.remark, 220);
  if (INIT_SECRET) PropertiesService.getScriptProperties().setProperty("SECRET", INIT_SECRET);
  // エディタから実行するとダイアログは出せないので、実行ログに出す
  Logger.log(
    "設定しました。SECRET: " + (PropertiesService.getScriptProperties().getProperty("SECRET") ? "登録済み" : "未登録（INIT_SECRET を入れて再実行）"),
  );
}

// ---------- メニュー ----------
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Olive1")
    .addItem("残り本数を見る", "showRemaining")
    .addItem("入金済みに本番号を振る", "assignBottleNumbers")
    .addToUi();
}

function showRemaining() {
  const used = reservedCount_(sheet_());
  SpreadsheetApp.getUi().alert(`予約済み ${used} 本 / ${TOTAL} 本\n残り ${Math.max(0, TOTAL - used)} 本`);
}

// 「入金済み」で本番号が空の行に、入金の早い順で続きの番号を振る。2本以上なら「12-13」
function assignBottleNumbers() {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_();
    const n = sh.getLastRow() - 1;
    if (n <= 0) return;
    const rows = sh.getRange(2, 1, n, HEADERS.length).getValues();
    let next = 1;
    rows.forEach((r) => {
      const no = String(r[COL.bottleNo - 1] || "");
      const last = Number(no.split("-").pop());
      if (last >= next) next = last + 1;
    });
    const targets = rows
      .map((r, i) => ({ r, row: i + 2 }))
      .filter(({ r }) => r[COL.id - 1] && r[COL.status - 1] === STATUS.paid && !r[COL.bottleNo - 1])
      .sort((a, b) => new Date(a.r[COL.paidAt - 1] || a.r[COL.at - 1]) - new Date(b.r[COL.paidAt - 1] || b.r[COL.at - 1]));
    const done = [];
    targets.forEach(({ r, row }) => {
      const q = Number(r[COL.paidQty - 1]) || Number(r[COL.qty - 1]) || 1;
      const label = q === 1 ? `${next}` : `${next}-${next + q - 1}`;
      sh.getRange(row, COL.bottleNo).setValue("'" + label);
      done.push(`${r[COL.name - 1]}：No.${label}`);
      next += q;
    });
    SpreadsheetApp.getUi().alert(done.length ? "本番号を振りました。\n" + done.join("\n") : "振る行はありません（入金済みで本番号が空の行がない）。");
  } finally {
    lock.releaseLock();
  }
}

// ---------- Web アプリ ----------
// GET：残り本数（予約ページの表示用。個人情報は返さない）
function doGet() {
  const used = reservedCount_(sheet_());
  return json_({ ok: true, total: TOTAL, reserved: used, remaining: Math.max(0, TOTAL - used) });
}

// POST：{ secret, action: "reserve" | "paid", data }
function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: "bad_json" });
  }
  const secret = PropertiesService.getScriptProperties().getProperty("SECRET");
  if (!secret || body.secret !== secret) return json_({ ok: false, error: "unauthorized" });

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return json_({ ok: false, error: "busy" });
  try {
    if (body.action === "reserve") return reserve_(body.data || {});
    if (body.action === "paid") return paid_(body.data || {});
    return json_({ ok: false, error: "unknown_action" });
  } finally {
    lock.releaseLock();
  }
}

function reserve_(d) {
  const sh = sheet_();
  const qty = Number(d.qty) || 0;
  if (qty < 1) return json_({ ok: false, error: "bad_qty" });
  const remaining = TOTAL - reservedCount_(sh);
  if (remaining <= 0) return json_({ ok: false, error: "soldout", remaining: 0 });
  if (qty > remaining) return json_({ ok: false, error: "not_enough", remaining });
  sh.appendRow([
    safe_(d.id), new Date(), STATUS.reserved, safe_(d.name), safe_(d.email), qty, safe_(d.receive),
    safe_(d.address), safe_(d.payment), safe_(d.referrer), safe_(d.note), safe_(d.lang || "ja"),
    "", "", "", "", "", "",
  ]);
  return json_({ ok: true, remaining: remaining - qty });
}

function paid_(d) {
  const sh = sheet_();
  const n = sh.getLastRow() - 1;
  const rows = n > 0 ? sh.getRange(2, 1, n, HEADERS.length).getValues() : [];
  const now = new Date();
  const sessionId = String(d.sessionId || "");

  // 同じ決済の再送（Stripe は失敗時に再送する）は何もしない
  if (sessionId && rows.some((r) => String(r[COL.stripe - 1]) === sessionId)) return json_({ ok: true, duplicate: true });

  const idx = d.id ? rows.findIndex((r) => String(r[COL.id - 1]) === String(d.id)) : -1;
  if (idx < 0) {
    // 予約フォームを通らずに決済リンクから直接払われた分。本数に数える
    sh.appendRow([
      "STRIPE-" + sessionId.slice(-8), now, STATUS.paid, safe_(d.name), safe_(d.email), Number(d.qty) || "",
      "", safe_(d.address), "card", "", "", "", now, Number(d.qty) || "", Number(d.amount) || "", "",
      "予約フォームを通らないカード決済。受け取り方法を確認する", sessionId,
    ]);
    return json_({ ok: true, matched: false });
  }
  const row = idx + 2;
  const r = rows[idx];
  sh.getRange(row, COL.status).setValue(STATUS.paid);
  sh.getRange(row, COL.paidAt).setValue(now);
  sh.getRange(row, COL.paidQty).setValue(Number(d.qty) || "");
  sh.getRange(row, COL.paidAmount).setValue(Number(d.amount) || "");
  sh.getRange(row, COL.stripe).setValue(sessionId);
  if (d.address && !r[COL.address - 1]) sh.getRange(row, COL.address).setValue(safe_(d.address));
  if (Number(r[COL.qty - 1]) !== Number(d.qty)) {
    const note = `予約${r[COL.qty - 1]}本→決済${d.qty}本`;
    sh.getRange(row, COL.remark).setValue([r[COL.remark - 1], note].filter(String).join(" / "));
  }
  return json_({ ok: true, matched: true });
}

// ---------- 共通 ----------
function sheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

// キャンセル以外の行の本数を合計。決済本数が予約より多ければそちらで数える
function reservedCount_(sh) {
  const n = sh.getLastRow() - 1;
  if (n <= 0) return 0;
  return sh
    .getRange(2, 1, n, HEADERS.length)
    .getValues()
    .reduce((sum, r) => {
      if (!r[COL.id - 1] || r[COL.status - 1] === STATUS.cancelled) return sum;
      return sum + Math.max(Number(r[COL.qty - 1]) || 0, Number(r[COL.paidQty - 1]) || 0);
    }, 0);
}

// 名前などが「=」で始まると数式として動くので、文字列として入れる
function safe_(v) {
  const s = v == null ? "" : String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
