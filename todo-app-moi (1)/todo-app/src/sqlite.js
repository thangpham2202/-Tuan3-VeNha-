'use strict';
// Trả về lớp Database có API giống better-sqlite3.
// Ưu tiên better-sqlite3; nếu máy không cài được (thiếu bộ biên dịch) thì dùng node:sqlite có sẵn trong Node >= 22.13.
function loadDatabase() {
  if (!process.env.USE_NODE_SQLITE) {
    try { return require('better-sqlite3'); } catch { /* chuyển sang node:sqlite */ }
  }
  let DatabaseSync;
  try { ({ DatabaseSync } = require('node:sqlite')); }
  catch { throw new Error('Không tìm thấy better-sqlite3 và Node hiện tại không có node:sqlite. Hãy chạy "npm install" hoặc dùng Node >= 22.13.'); }
  return class NodeSqliteDatabase {
    constructor(file) { this.db = new DatabaseSync(file); }
    pragma(s) { this.db.exec(`PRAGMA ${s}`); }
    exec(sql) { this.db.exec(sql); }
    prepare(sql) { return this.db.prepare(sql); }
    transaction(fn) {
      return (...a) => { this.db.exec('BEGIN'); try { const r = fn(...a); this.db.exec('COMMIT'); return r; } catch (e) { this.db.exec('ROLLBACK'); throw e; } };
    }
    close() { this.db.close(); }
  };
}
module.exports = loadDatabase();
