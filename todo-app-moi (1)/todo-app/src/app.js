'use strict';
const express = require('express');
const path = require('path');

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['todo', 'doing', 'done'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const localToday = () => { const d = new Date(), p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };
const addDays = (s, n) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); const p = x => String(x).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };

class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }

function createApp(db) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  const SELECT = `SELECT t.*, c.name AS category_name, c.color AS category_color
                  FROM tasks t LEFT JOIN categories c ON c.id = t.category_id`;
  const getTask = id => db.prepare(`${SELECT} WHERE t.id = ?`).get(id);

  function validate(body, partial = false) {
    const out = {};
    if (!partial || 'title' in body) {
      const t = String(body.title ?? '').trim();
      if (!t) throw new HttpError(400, 'Tiêu đề không được để trống');
      if (t.length > 120) throw new HttpError(400, 'Tiêu đề tối đa 120 ký tự');
      out.title = t;
    }
    if ('description' in body) out.description = String(body.description ?? '').slice(0, 1000);
    if ('priority' in body) { if (!PRIORITIES.includes(body.priority)) throw new HttpError(400, 'Mức ưu tiên không hợp lệ'); out.priority = body.priority; }
    if ('status' in body) { if (!STATUSES.includes(body.status)) throw new HttpError(400, 'Trạng thái không hợp lệ'); out.status = body.status; }
    if ('progress' in body) {
      const n = Number(body.progress);
      if (!Number.isInteger(n) || n < 0 || n > 100) throw new HttpError(400, 'Mức độ hoàn thành phải là số nguyên từ 0 đến 100');
      out.progress = n;
    }
    if ('due_date' in body) {
      const d = body.due_date || null;
      if (d && (!DATE_RE.test(d) || isNaN(new Date(d)))) throw new HttpError(400, 'Ngày hạn không hợp lệ (YYYY-MM-DD)');
      out.due_date = d;
    }
    if ('category_id' in body) {
      const c = body.category_id || null;
      if (c && !db.prepare('SELECT 1 FROM categories WHERE id = ?').get(c)) throw new HttpError(400, 'Danh mục không tồn tại');
      out.category_id = c;
    }
    return out;
  }

  // Giữ trạng thái và mức độ hoàn thành luôn nhất quán:
  // 100% <=> Hoàn thành; 1-99% => ít nhất là Đang làm; chọn "Chưa làm" => 0%.
  function reconcile(cur, v) {
    const out = { ...v };
    let status = out.status ?? cur.status, progress = out.progress ?? cur.progress;
    if ('status' in out && !('progress' in out)) progress = status === 'done' ? 100 : status === 'todo' ? 0 : Math.min(progress, 99);
    else if ('progress' in out) {
      if (progress === 100) status = 'done';
      else if (status === 'done') status = progress > 0 ? 'doing' : 'todo';
      else if (progress > 0 && status === 'todo') status = 'doing';
    }
    if (status === 'done') progress = 100;
    return { ...out, status, progress };
  }

  // ---------- Tasks ----------
  app.get('/api/tasks', (req, res) => {
    const { scope = 'all', status, priority, category, q, sort = 'due' } = req.query;
    const today = DATE_RE.test(req.query.today || '') ? req.query.today : localToday();
    const where = [], p = {};
    if (scope === 'today') { where.push("(t.due_date = @today OR (t.due_date < @today AND t.status <> 'done'))"); p.today = today; }
    if (STATUSES.includes(status)) { where.push('t.status = @status'); p.status = status; }
    if (status === 'open') where.push("t.status <> 'done'");
    if (PRIORITIES.includes(priority)) { where.push('t.priority = @priority'); p.priority = priority; }
    if (category) { where.push('t.category_id = @category'); p.category = Number(category); }
    if (q && q.trim()) { where.push("(t.title LIKE @q ESCAPE '\\' OR t.description LIKE @q ESCAPE '\\')"); p.q = `%${q.trim().replace(/[\\%_]/g, '\\$&')}%`; }
    const order = {
      due: "t.status = 'done', t.due_date IS NULL, t.due_date, CASE t.priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END, t.id",
      priority: "CASE t.priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END, t.due_date, t.id",
      progress: "t.status = 'done', t.progress DESC, t.due_date, t.id",
      newest: 't.id DESC',
    }[sort] || 't.id';
    res.json(db.prepare(`${SELECT} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ${order}`).all(p));
  });

  app.get('/api/tasks/:id', (req, res) => {
    const t = getTask(req.params.id);
    if (!t) throw new HttpError(404, 'Không tìm thấy công việc');
    res.json(t);
  });

  app.post('/api/tasks', (req, res) => {
    const v = reconcile({ status: 'todo', progress: 0 }, validate(req.body));
    const r = db.prepare(`INSERT INTO tasks (title, description, category_id, priority, status, progress, due_date, completed_at)
      VALUES (@title, @description, @category_id, @priority, @status, @progress, @due_date, CASE WHEN @status = 'done' THEN datetime('now','localtime') END)`)
      .run({ description: '', category_id: null, priority: 'medium', due_date: null, ...v });
    res.status(201).json(getTask(r.lastInsertRowid));
  });

  app.put('/api/tasks/:id', (req, res) => {
    const cur = getTask(req.params.id);
    if (!cur) throw new HttpError(404, 'Không tìm thấy công việc');
    const v = reconcile(cur, validate(req.body, true));
    const keys = Object.keys(v);
    if (keys.length) db.prepare(`UPDATE tasks SET ${keys.map(k => `${k} = @${k}`).join(', ')} WHERE id = @id`).run({ ...v, id: req.params.id });
    res.json(getTask(req.params.id));
  });

  app.patch('/api/tasks/:id/toggle', (req, res) => {
    const t = getTask(req.params.id);
    if (!t) throw new HttpError(404, 'Không tìm thấy công việc');
    db.prepare('UPDATE tasks SET status = ?, progress = ? WHERE id = ?').run(...(t.status === 'done' ? ['todo', 0] : ['done', 100]), t.id);
    res.json(getTask(t.id));
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const r = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    if (!r.changes) throw new HttpError(404, 'Không tìm thấy công việc');
    res.status(204).end();
  });

  // ---------- Categories ----------
  app.get('/api/categories', (_req, res) => {
    res.json(db.prepare(`SELECT c.*, COUNT(t.id) AS task_count FROM categories c
      LEFT JOIN tasks t ON t.category_id = c.id GROUP BY c.id ORDER BY c.name`).all());
  });
  app.post('/api/categories', (req, res) => {
    const name = String(req.body.name ?? '').trim();
    const color = req.body.color || '#6366f1';
    if (!name || name.length > 40) throw new HttpError(400, 'Tên danh mục 1–40 ký tự');
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new HttpError(400, 'Màu không hợp lệ');
    try { const r = db.prepare('INSERT INTO categories (name, color) VALUES (?, ?)').run(name, color); res.status(201).json(db.prepare('SELECT * FROM categories WHERE id = ?').get(r.lastInsertRowid)); }
    catch (e) { if (String(e.code).startsWith('SQLITE_CONSTRAINT') || /UNIQUE constraint/i.test(e.message)) throw new HttpError(409, 'Danh mục đã tồn tại'); throw e; }
  });

  app.delete('/api/categories/:id', (req, res) => {
    const r = db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id); // việc thuộc danh mục sẽ về "Chưa phân loại"
    if (!r.changes) throw new HttpError(404, 'Không tìm thấy danh mục');
    res.status(204).end();
  });

  // ---------- Stats ----------
  app.get('/api/stats', (req, res) => {
    const today = DATE_RE.test(req.query.today || '') ? req.query.today : localToday();
    const one = (sql, ...a) => db.prepare(sql).get(...a);
    const total = one('SELECT COUNT(*) c FROM tasks').c;
    const byStatus = Object.fromEntries(STATUSES.map(s => [s, 0]));
    for (const r of db.prepare('SELECT status, COUNT(*) c FROM tasks GROUP BY status').all()) byStatus[r.status] = r.c;
    const byPriority = Object.fromEntries(PRIORITIES.map(s => [s, 0]));
    for (const r of db.prepare('SELECT priority, COUNT(*) c FROM tasks GROUP BY priority').all()) byPriority[r.priority] = r.c;
    const byCategory = db.prepare(`SELECT COALESCE(c.name,'Chưa phân loại') name, COALESCE(c.color,'#94a3b8') color,
        COUNT(t.id) total, SUM(t.status='done') done
        FROM tasks t LEFT JOIN categories c ON c.id = t.category_id GROUP BY c.id ORDER BY total DESC`).all();
    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
    const doneMap = Object.fromEntries(db.prepare(`SELECT date(completed_at) d, COUNT(*) c FROM tasks
        WHERE completed_at IS NOT NULL AND date(completed_at) BETWEEN ? AND ? GROUP BY d`).all(days[0], days[6]).map(r => [r.d, r.c]));
    const dueMap = Object.fromEntries(db.prepare(`SELECT due_date d, COUNT(*) c FROM tasks
        WHERE due_date BETWEEN ? AND ? GROUP BY d`).all(days[0], days[6]).map(r => [r.d, r.c]));
    const last7 = days.map(d => ({ date: d, done: doneMap[d] || 0, due: dueMap[d] || 0 }));
    // Chuỗi ngày liên tiếp (tính đến hôm nay hoặc hôm qua) có ít nhất 1 việc hoàn thành
    const doneDays = new Set(db.prepare("SELECT DISTINCT date(completed_at) d FROM tasks WHERE completed_at IS NOT NULL").all().map(r => r.d));
    let streak = 0, cur = doneDays.has(today) ? today : addDays(today, -1);
    while (doneDays.has(cur)) { streak++; cur = addDays(cur, -1); }
    res.json({
      total, byStatus, byPriority, byCategory, last7, streak,
      avgProgress: Math.round(one('SELECT COALESCE(AVG(progress), 0) a FROM tasks').a),
      inProgress: db.prepare(`SELECT t.id, t.title, t.progress, t.due_date, COALESCE(c.color,'#94a3b8') color
        FROM tasks t LEFT JOIN categories c ON c.id = t.category_id
        WHERE t.status = 'doing' ORDER BY t.progress DESC, t.due_date LIMIT 8`).all(),
      completionRate: total ? Math.round(byStatus.done * 100 / total) : 0,
      overdue: one("SELECT COUNT(*) c FROM tasks WHERE status <> 'done' AND due_date < ?", today).c,
      dueToday: one('SELECT COUNT(*) c FROM tasks WHERE due_date = ?', today).c,
      doneToday: one("SELECT COUNT(*) c FROM tasks WHERE status = 'done' AND date(completed_at) = ?", today).c,
    });
  });

  app.use('/api', (_req, _res, next) => next(new HttpError(404, 'API không tồn tại')));
  app.use((err, _req, res, _next) => {
    const status = err.status || (err.type === 'entity.parse.failed' ? 400 : 500);
    if (status === 500) console.error(err);
    res.status(status).json({ error: status === 500 ? 'Lỗi máy chủ' : err.message });
  });
  return app;
}
module.exports = { createApp };
