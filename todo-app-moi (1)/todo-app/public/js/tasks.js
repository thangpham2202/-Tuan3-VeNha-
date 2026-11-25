'use strict';
(async () => {
  const { $, esc, api, today, fmtDate, isLate, pills, loadCats, openTask, bindActions, debounce, catOptions } = App;
  let tasks = [];
  await loadCats(); catOptions($('#cat'));
  async function load() {
    const p = new URLSearchParams({ today: today(), q: $('#q').value, status: $('#sta').value, priority: $('#pri').value, category: $('#cat').value, sort: $('#sort').value });
    tasks = await api('/tasks?' + p);
    $('#count').textContent = `${tasks.length} công việc`;
    $('#out').innerHTML = tasks.length ? `<div class="card tw"><table><thead><tr><th></th><th>Công việc</th><th>Danh mục</th><th>Ưu tiên</th><th>Hạn</th><th>Trạng thái</th><th>Hoàn thành</th><th></th></tr></thead><tbody>${tasks.map(row).join('')}</tbody></table></div>`
      : `<div class="card empty"><b>🔍</b>Không tìm thấy công việc nào.</div>`;
  }
  const row = t => `<tr class="${t.status === 'done' ? 'done' : ''}" data-id="${t.id}">
    <td style="width:46px"><button class="check" data-act="toggle" aria-label="Đánh dấu hoàn thành" style="${t.status === 'done' ? 'background:var(--ok);border-color:var(--ok)' : ''}">${t.status === 'done' ? '✓' : ''}</button></td>
    <td><div class="t">${esc(t.title)}</div>${t.description ? `<div class="d">${esc(t.description)}</div>` : ''}</td>
    <td>${t.category_name ? `<span class="pill"><i style="background:${esc(t.category_color)}"></i>${esc(t.category_name)}</span>` : '<span class="d">—</span>'}</td>
    <td><span class="pill p-${t.priority}">${App.PRI[t.priority]}</span></td>
    <td><span class="pill ${isLate(t) ? 'late' : ''}">${fmtDate(t.due_date)}</span></td>
    <td><span class="pill s-${t.status}">${App.STA[t.status]}</span></td>
    <td style="min-width:120px">${App.progBar(t)}</td>
    <td><div class="acts"><button class="icon" data-act="edit" title="Sửa" aria-label="Sửa">✏️</button><button class="icon del" data-act="del" title="Xóa" aria-label="Xóa">🗑️</button></div></td></tr>`;
  $('#addBtn').onclick = () => openTask(null, load);
  $('#q').addEventListener('input', debounce(load));
  for (const s of ['#sta', '#pri', '#cat', '#sort']) $(s).onchange = load;
  bindActions($('#out'), () => tasks, load);
  load();
})();
