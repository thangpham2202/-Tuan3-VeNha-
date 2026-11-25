'use strict';
const App = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const p2 = n => String(n).padStart(2, '0');
  const ymd = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  const today = () => ymd(new Date());
  const PRI = { high: 'Cao', medium: 'Trung bình', low: 'Thấp' };
  const STA = { todo: 'Chưa làm', doing: 'Đang làm', done: 'Hoàn thành' };

  async function api(path, opt = {}) {
    const res = await fetch('/api' + path, { headers: { 'Content-Type': 'application/json' }, ...opt, body: opt.body ? JSON.stringify(opt.body) : undefined });
    if (res.status === 204) return null;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra');
    return data;
  }
  let tt;
  function toast(msg) { ensureModals(); const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2200); }
  function fmtDate(s) {
    if (!s) return 'Không có hạn';
    const t = today();
    if (s === t) return 'Hôm nay';
    const d = new Date(s + 'T00:00:00'), diff = Math.round((d - new Date(t + 'T00:00:00')) / 864e5);
    if (diff === 1) return 'Ngày mai'; if (diff === -1) return 'Hôm qua';
    return `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`;
  }
  const isLate = t => t.status !== 'done' && t.due_date && t.due_date < today();
  function pills(t, withDate = true) {
    return `${t.category_name ? `<span class="pill"><i style="background:${esc(t.category_color)}"></i>${esc(t.category_name)}</span>` : ''}
      <span class="pill p-${t.priority}">${PRI[t.priority]}</span>
      <span class="pill s-${t.status}">${STA[t.status]}</span>
      ${withDate ? `<span class="pill ${isLate(t) ? 'late' : ''}">📅 ${fmtDate(t.due_date)}${isLate(t) ? ' · quá hạn' : ''}</span>` : ''}`;
  }
  // Thanh mức độ hoàn thành (%)
  const progBar = t => `<div class="prog" title="Mức độ hoàn thành ${t.progress}%"><span class="prog-bar"><b style="width:${t.progress}%"></b></span><em>${t.progress}%</em></div>`;
  function taskRow(t) {
    return `<div class="task ${t.status === 'done' ? 'done' : ''}" data-id="${t.id}">
      <button class="check" data-act="toggle" aria-label="Đánh dấu hoàn thành">${t.status === 'done' ? '✓' : ''}</button>
      <div><div class="t">${esc(t.title)}</div>${t.description ? `<div class="d">${esc(t.description)}</div>` : ''}<div class="meta">${pills(t)}</div>${t.status === 'todo' ? '' : progBar(t)}</div>
      <div class="acts"><button class="icon" data-act="edit" title="Sửa" aria-label="Sửa">✏️</button><button class="icon del" data-act="del" title="Xóa" aria-label="Xóa">🗑️</button></div></div>`;
  }

  // ----- Hộp thoại thêm / sửa -----
  let cats = [];
  async function loadCats() { cats = await api('/categories'); return cats; }
  function ensureModals() {
    if ($('#taskDlg')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <dialog id="taskDlg"><form method="dialog" id="taskForm" novalidate>
      <h3 id="dlgTitle">Thêm công việc</h3>
      <div class="f"><label for="fTitle">Tiêu đề *</label><input type="text" id="fTitle" maxlength="120" placeholder="Ví dụ: Nộp báo cáo Lab 07"></div>
      <div class="f"><label for="fDesc">Mô tả</label><textarea id="fDesc" rows="3" maxlength="1000" placeholder="Ghi chú thêm (không bắt buộc)"></textarea></div>
      <div class="row2"><div class="f"><label for="fCat">Danh mục</label><select id="fCat"></select></div>
        <div class="f"><label for="fDue">Ngày hạn</label><input type="date" id="fDue"></div></div>
      <div class="f"><label for="fPro">Mức độ hoàn thành: <output id="fProOut">0%</output></label><input type="range" id="fPro" min="0" max="100" step="5" value="0"></div>
      <div class="row2"><div class="f"><label for="fPri">Ưu tiên</label><select id="fPri"><option value="high">Cao</option><option value="medium">Trung bình</option><option value="low">Thấp</option></select></div>
        <div class="f"><label for="fSta">Trạng thái</label><select id="fSta"><option value="todo">Chưa làm</option><option value="doing">Đang làm</option><option value="done">Hoàn thành</option></select></div></div>
      <div class="err" id="fErr" role="alert"></div>
      <div class="mact"><button type="button" class="btn ghost" id="fCancel">Hủy</button><button type="submit" class="btn">Lưu</button></div>
    </form></dialog>
    <dialog id="confirmDlg"><form method="dialog"><h3>Xóa công việc?</h3><p id="confirmMsg"></p>
      <div class="mact"><button value="no" class="btn ghost">Không</button><button value="yes" class="btn danger">Xóa</button></div></form></dialog>
    <div id="toast" role="status"></div>`);
    $('#fCancel').onclick = () => $('#taskDlg').close();
  }
  function openTask(task, onSaved, defaults = {}) {
    ensureModals();
    const dlg = $('#taskDlg'), f = $('#taskForm');
    $('#dlgTitle').textContent = task ? 'Sửa công việc' : 'Thêm công việc';
    $('#fCat').innerHTML = '<option value="">Chưa phân loại</option>' + cats.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    const v = task || { title: '', description: '', category_id: '', priority: 'medium', status: 'todo', due_date: defaults.due_date ?? today() };
    $('#fTitle').value = v.title; $('#fDesc').value = v.description; $('#fCat').value = v.category_id ?? '';
    $('#fPro').value = v.progress ?? 0; $('#fProOut').textContent = $('#fPro').value + '%';
    $('#fDue').value = v.due_date ?? ''; $('#fPri').value = v.priority; $('#fSta').value = v.status; $('#fErr').textContent = '';
    // Đồng bộ trạng thái <-> mức độ hoàn thành (giống quy tắc phía máy chủ)
    $('#fPro').oninput = () => {
      const n = Number($('#fPro').value); $('#fProOut').textContent = n + '%';
      if (n === 100) $('#fSta').value = 'done'; else if (n > 0 && $('#fSta').value === 'todo') $('#fSta').value = 'doing'; else if ($('#fSta').value === 'done') $('#fSta').value = n > 0 ? 'doing' : 'todo';
    };
    $('#fSta').onchange = () => {
      const s = $('#fSta').value, n = Number($('#fPro').value);
      if (s === 'done') $('#fPro').value = 100; else if (s === 'todo') $('#fPro').value = 0; else if (n === 100 || n === 0 && task && task.progress) $('#fPro').value = n === 100 ? 90 : n;
      $('#fProOut').textContent = $('#fPro').value + '%';
    };
    f.onsubmit = async e => {
      e.preventDefault();
      const body = { title: $('#fTitle').value, description: $('#fDesc').value, category_id: $('#fCat').value || null, due_date: $('#fDue').value || null, priority: $('#fPri').value, status: $('#fSta').value, progress: Number($('#fPro').value) };
      if (!body.title.trim()) { $('#fErr').textContent = 'Vui lòng nhập tiêu đề'; $('#fTitle').focus(); return; }
      try { await (task ? api('/tasks/' + task.id, { method: 'PUT', body }) : api('/tasks', { method: 'POST', body })); dlg.close(); toast(task ? 'Đã cập nhật công việc' : 'Đã ghi lại công việc'); onSaved(); }
      catch (err) { $('#fErr').textContent = err.message; }
    };
    dlg.showModal(); $('#fTitle').focus();
  }
  function confirmDel(task, onDone) {
    ensureModals();
    const dlg = $('#confirmDlg'); $('#confirmMsg').textContent = `"${task.title}" sẽ bị xóa vĩnh viễn.`;
    dlg.onclose = async () => { if (dlg.returnValue === 'yes') { await api('/tasks/' + task.id, { method: 'DELETE' }); toast('Đã xóa công việc'); onDone(); } };
    dlg.returnValue = ''; dlg.showModal();
  }
  // Ủy quyền sự kiện cho danh sách công việc (dùng chung 2 trang)
  function bindActions(root, getTasks, reload) {
    root.addEventListener('click', async e => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const id = Number(b.closest('[data-id]').dataset.id), t = getTasks().find(x => x.id === id);
      if (b.dataset.act === 'toggle') { await api(`/tasks/${id}/toggle`, { method: 'PATCH' }); toast(t.status === 'done' ? 'Đã mở lại công việc' : 'Tuyệt vời, xong một việc! 🎉'); reload(); }
      if (b.dataset.act === 'edit') openTask(t, reload);
      if (b.dataset.act === 'del') confirmDel(t, reload);
    });
  }
  const debounce = (fn, ms = 250) => { let h; return (...a) => { clearTimeout(h); h = setTimeout(() => fn(...a), ms); }; };
  function catOptions(sel, first = 'Tất cả danh mục') { sel.innerHTML = `<option value="">${first}</option>` + cats.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join(''); }
  return { $, esc, api, toast, today, ymd, fmtDate, isLate, pills, progBar, taskRow, loadCats, openTask, bindActions, debounce, catOptions, PRI, STA, get cats() { return cats; } };
})();
