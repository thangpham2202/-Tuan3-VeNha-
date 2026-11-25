'use strict';
const fs = require('fs');
const path = require('path');
const Database = require('./sqlite');
const { seed } = require('../db/seed');

function openDb(file = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'todo.db')) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  // Nâng cấp CSDL cũ (chưa có cột progress): thêm cột, điền 100% cho việc đã xong, tạo lại trigger
  const cols = db.prepare('PRAGMA table_info(tasks)').all();
  if (cols.length && !cols.some(c => c.name === 'progress')) {
    db.exec(`ALTER TABLE tasks ADD COLUMN progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100);
             UPDATE tasks SET progress = 100 WHERE status = 'done';
             DROP TRIGGER IF EXISTS trg_tasks_touch;`);
  }
  db.exec(fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8'));
  // Chỉ nạp dữ liệu mock khi CSDL còn trống
  if (db.prepare('SELECT COUNT(*) c FROM tasks').get().c === 0 &&
      db.prepare('SELECT COUNT(*) c FROM categories').get().c === 0) seed(db);
  return db;
}
module.exports = { openDb };
