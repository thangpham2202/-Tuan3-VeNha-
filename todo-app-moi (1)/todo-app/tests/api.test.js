'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { openDb } = require('../src/db');
const { createApp } = require('../src/app');
const { ymd } = require('../db/seed');

let server, base;
test.before(async () => { server = createApp(openDb(':memory:')).listen(0); base = `http://localhost:${server.address().port}`; });
test.after(() => server.close());
const api = (p, o = {}) => fetch(base + p, { headers: { 'Content-Type': 'application/json' }, ...o, body: o.body && JSON.stringify(o.body) });

test('seed có dữ liệu mock và trang Hôm nay có việc', async () => {
  const all = await (await api('/api/tasks')).json();
  assert.ok(all.length >= 30);
  const today = await (await api(`/api/tasks?scope=today&today=${ymd(0)}`)).json();
  assert.ok(today.length >= 8);
});
test('CRUD công việc', async () => {
  let r = await api('/api/tasks', { method: 'POST', body: { title: '  Việc thử  ', priority: 'high', due_date: ymd(0) } });
  assert.equal(r.status, 201);
  const t = await r.json();
  assert.equal(t.title, 'Việc thử');
  r = await api(`/api/tasks/${t.id}`, { method: 'PUT', body: { title: 'Đã sửa', status: 'done' } });
  const u = await r.json();
  assert.equal(u.title, 'Đã sửa'); assert.ok(u.completed_at);
  r = await api(`/api/tasks/${t.id}/toggle`, { method: 'PATCH' });
  assert.equal((await r.json()).completed_at, null);
  assert.equal((await api(`/api/tasks/${t.id}`, { method: 'DELETE' })).status, 204);
  assert.equal((await api(`/api/tasks/${t.id}`)).status, 404);
});
test('kiểm tra dữ liệu đầu vào', async () => {
  assert.equal((await api('/api/tasks', { method: 'POST', body: { title: '' } })).status, 400);
  assert.equal((await api('/api/tasks', { method: 'POST', body: { title: 'x', priority: 'zzz' } })).status, 400);
  assert.equal((await api('/api/tasks', { method: 'POST', body: { title: 'x', due_date: '31/12/2026' } })).status, 400);
  assert.equal((await api('/api/tasks', { method: 'POST', body: { title: 'x', category_id: 9999 } })).status, 400);
});
test('tìm kiếm và lọc', async () => {
  const s = await (await api('/api/tasks?q=' + encodeURIComponent('báo cáo'))).json();
  assert.ok(s.length >= 1 && s.every(t => /báo cáo/i.test(t.title + t.description)));
  const h = await (await api('/api/tasks?priority=high&status=done')).json();
  assert.ok(h.every(t => t.priority === 'high' && t.status === 'done'));
  assert.equal((await (await api('/api/tasks?q=%25')).json()).length, 0); // ký tự % được escape
});
test('xóa danh mục không xóa việc (ON DELETE SET NULL)', async () => {
  const c = await (await api('/api/categories', { method: 'POST', body: { name: 'Tạm' } })).json();
  const t = await (await api('/api/tasks', { method: 'POST', body: { title: 'a', category_id: c.id } })).json();
  assert.equal((await api('/api/categories', { method: 'POST', body: { name: 'Tạm' } })).status, 409);
  assert.equal(t.category_id, c.id);
  assert.equal((await api(`/api/categories/${c.id}`, { method: 'DELETE' })).status, 204);
  assert.equal((await (await api(`/api/tasks/${t.id}`)).json()).category_id, null);
});
test('thống kê khớp dữ liệu', async () => {
  const s = await (await api(`/api/stats?today=${ymd(0)}`)).json();
  const all = await (await api('/api/tasks')).json();
  assert.equal(s.total, all.length);
  assert.equal(s.byStatus.done + s.byStatus.todo + s.byStatus.doing, s.total);
  assert.equal(s.last7.length, 7);
  assert.ok(s.streak >= 1);
  assert.ok(s.overdue >= 2);
});
test('mức độ hoàn thành luôn khớp với trạng thái', async () => {
  const mk = async body => (await api('/api/tasks', { method: 'POST', body: { title: 'tiến độ', ...body } })).json();
  assert.equal((await api('/api/tasks', { method: 'POST', body: { title: 'x', progress: 101 } })).status, 400);
  assert.equal((await api('/api/tasks', { method: 'POST', body: { title: 'x', progress: 'abc' } })).status, 400);
  let t = await mk({ progress: 40 });
  assert.equal(t.status, 'doing'); assert.equal(t.progress, 40);
  t = await (await api(`/api/tasks/${t.id}`, { method: 'PUT', body: { progress: 100 } })).json();
  assert.equal(t.status, 'done'); assert.ok(t.completed_at);
  t = await (await api(`/api/tasks/${t.id}`, { method: 'PUT', body: { progress: 30 } })).json();
  assert.equal(t.status, 'doing'); assert.equal(t.completed_at, null);
  t = await (await api(`/api/tasks/${t.id}`, { method: 'PUT', body: { status: 'done' } })).json();
  assert.equal(t.progress, 100);
  t = await (await api(`/api/tasks/${t.id}/toggle`, { method: 'PATCH' })).json();
  assert.equal(t.status, 'todo'); assert.equal(t.progress, 0);
  const all = await (await api('/api/tasks')).json();
  assert.ok(all.every(x => x.status === 'done' ? x.progress === 100 : x.status === 'todo' ? x.progress === 0 : x.progress < 100));
  const s = await (await api(`/api/stats?today=${ymd(0)}`)).json();
  assert.ok(s.avgProgress >= 0 && s.avgProgress <= 100 && s.inProgress.length > 0);
});
test('nâng cấp CSDL cũ chưa có cột progress', async () => {
  const fs = require('fs'), os = require('os'), path = require('path'), Database = require('../src/sqlite');
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sv-')), 'old.db');
  const old = new Database(file);
  old.exec(fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8').replace(/.*progress.*\n/, '').replace('status, progress, due_date', 'status, due_date'));
  old.exec("INSERT INTO tasks (title, status) VALUES ('cũ xong','done'),('cũ chưa','todo')"); old.close();
  const db = openDb(file);
  assert.deepEqual(db.prepare('SELECT progress FROM tasks ORDER BY id').all().map(r => r.progress), [100, 0]);
  db.exec("UPDATE tasks SET status='doing' WHERE id=2"); // trigger mới phải chạy được
});
