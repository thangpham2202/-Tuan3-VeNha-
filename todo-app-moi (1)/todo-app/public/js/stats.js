'use strict';
(async () => {
  const { $, esc, api, today } = App;
  const s = await api('/stats?today=' + today());
  $('#k-total').textContent = s.total; $('#k-rate').textContent = s.completionRate + '%';
  $('#k-over').textContent = s.overdue; $('#k-streak').textContent = s.streak + ' ngày';

  // Biểu đồ tròn: trạng thái
  const parts = [['done', 'Hoàn thành', '#2f9e6b'], ['doing', 'Đang làm', '#3f6fd1'], ['todo', 'Chưa làm', '#d8cdb8']];
  const R = 70, C = 2 * Math.PI * R; let off = 0, arcs = '';
  for (const [k, , col] of parts) {
    const len = s.total ? s.byStatus[k] / s.total * C : 0;
    arcs += `<circle r="${R}" cx="90" cy="90" fill="none" stroke="${col}" stroke-width="26" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" transform="rotate(-90 90 90)"/>`; off += len;
  }
  $('#donut').innerHTML = `<svg viewBox="0 0 180 180" width="180" height="180" role="img" aria-label="Biểu đồ trạng thái công việc">${arcs}<text x="90" y="88" text-anchor="middle" font-size="30" font-weight="700" font-family="Georgia,serif" fill="#2a2118">${s.completionRate}%</text><text x="90" y="110" text-anchor="middle" font-size="12" fill="#7a6e5f">hoàn thành</text></svg>
    <div class="legend">${parts.map(([k, n, c]) => `<span><i style="background:${c}"></i>${n}: <b>${s.byStatus[k]}</b></span>`).join('')}</div>`;

  // Cột 7 ngày
  const max = Math.max(1, ...s.last7.flatMap(d => [d.done, d.due]));
  const dn = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  $('#week').innerHTML = s.last7.map(d => { const dt = new Date(d.date + 'T00:00:00');
    return `<div class="col" title="${d.date}: hoàn thành ${d.done}, đến hạn ${d.due}"><div class="pair"><b style="height:${d.due / max * 100}%;background:#e3b58f"></b><b style="height:${d.done / max * 100}%;background:#1f6f5c"></b></div><span>${d.date === today() ? 'Nay' : dn[dt.getDay()]}</span></div>`; }).join('');

  // Mức độ hoàn thành của các việc đang làm
  $('#avg').textContent = s.avgProgress + '%'; $('#avgBar').style.width = s.avgProgress + '%';
  $('#doing').innerHTML = s.inProgress.map(t => `<div class="hbar"><div class="top"><span>${esc(t.title)}</span><span>${t.progress}%</span></div><div class="tr"><b style="width:${t.progress}%;background:${esc(t.color)}"></b></div></div>`).join('') || '<p class="d">Chưa có việc nào đang làm</p>';

  // Thanh ngang
  $('#cats').innerHTML = s.byCategory.map(c => `<div class="hbar"><div class="top"><span>${esc(c.name)}</span><span>${c.done}/${c.total}</span></div><div class="tr"><b style="width:${c.total ? c.done / c.total * 100 : 0}%;background:${esc(c.color)}"></b></div></div>`).join('') || '<p class="d">Chưa có dữ liệu</p>';
  const pc = { high: ['Cao', '#c0392b'], medium: ['Trung bình', '#e0a100'], low: ['Thấp', '#2f9e6b'] }, pm = Math.max(1, ...Object.values(s.byPriority));
  $('#pris').innerHTML = Object.entries(pc).map(([k, [n, c]]) => `<div class="hbar"><div class="top"><span>${n}</span><span>${s.byPriority[k]}</span></div><div class="tr"><b style="width:${s.byPriority[k] / pm * 100}%;background:${c}"></b></div></div>`).join('');
})();
