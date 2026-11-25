-- ============================================================
-- Sổ Việc – lược đồ CSDL (SQLite)
-- 2 bảng chính: categories (1) ──< (N) tasks
-- ============================================================
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL UNIQUE CHECK (length(trim(name)) BETWEEN 1 AND 40),
  color      TEXT    NOT NULL DEFAULT '#6366f1' CHECK (color GLOB '#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]'),
  created_at TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS tasks (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT    NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 120),
  description  TEXT    NOT NULL DEFAULT '',
  category_id  INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  priority     TEXT    NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  status       TEXT    NOT NULL DEFAULT 'todo'   CHECK (status   IN ('todo','doing','done')),
  progress     INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),  -- mức độ hoàn thành (%)
  due_date     TEXT    CHECK (due_date IS NULL OR due_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  created_at   TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  completed_at TEXT
);

-- Chỉ mục phục vụ các truy vấn chính: lọc theo ngày, trạng thái, danh mục
CREATE INDEX IF NOT EXISTS idx_tasks_due      ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_done_at  ON tasks(completed_at);

-- Tự cập nhật updated_at và completed_at khi sửa công việc
CREATE TRIGGER IF NOT EXISTS trg_tasks_touch
AFTER UPDATE OF title, description, category_id, priority, status, progress, due_date ON tasks
FOR EACH ROW
BEGIN
  UPDATE tasks
     SET updated_at   = datetime('now','localtime'),
         completed_at = CASE
                          WHEN NEW.status = 'done' AND OLD.status <> 'done' THEN datetime('now','localtime')
                          WHEN NEW.status <> 'done' THEN NULL
                          ELSE NEW.completed_at
                        END
   WHERE id = NEW.id;
END;
