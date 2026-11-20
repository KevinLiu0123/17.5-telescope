// 製作日誌：讀取 data/progress.js（window.PROGRESS），產生日誌頁與首頁的進度摘要
(function () {
  const P = window.PROGRESS;
  const PHASES = { 1: '設計與規劃', 2: '採購與組裝', 3: '校準與觀測', 4: '成果與推廣' };
  const STATUS = { done: '完成', doing: '進行中', todo: '未開始' };

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const paras = t => esc(t).split(/\n\s*\n/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  const fmtDate = d => {
    const [y, m, day] = String(d || '').split('-');
    if (!y) return '';
    return day ? `${y}.${m}.${day}` : m ? `${y}.${m}` : y;
  };
  const tagColor = t => (P && P.TAGS && P.TAGS[t]) || '#c9c9c9';
  const anchor = e => 'e-' + (e.date || '') + '-' + encodeURIComponent(e.title || '').slice(0, 24).replace(/%/g, '');

  function showError(target) {
    const err = window.PROGRESS_ERROR;
    target.innerHTML = `<div class="data-error"><strong>資料格式錯誤</strong>
      <p>data/progress.js ${err ? `第 <b>${err.line}</b> 行附近：${esc(err.msg)}` : '沒有正確載入'}。</p>
      <p>常見原因：少了逗號、引號用成中文「」、或 { } [ ] 括號沒有成對。</p></div>`;
  }

  function stats() {
    const ms = P.milestones || [];
    const done = ms.filter(m => m.status === 'done').length;
    const doing = ms.find(m => m.status === 'doing') || ms.find(m => m.status === 'todo');
    return { total: ms.length, done, pct: ms.length ? Math.round(done / ms.length * 100) : 0, current: doing };
  }

  function overallHTML(compact) {
    const s = stats();
    const cur = s.current ? `目前階段：<b>${PHASES[s.current.phase] || ''}</b> · 下一步：${esc(s.current.title)}` : '全部里程碑完成！';
    return `
      <div class="ov-top"><span class="ov-num">${s.pct}<small>%</small></span>
        <span class="ov-text">已完成 ${s.done} / ${s.total} 個里程碑<br><span class="ov-cur">${cur}</span></span></div>
      <div class="ov-bar" aria-hidden="true">${[1, 2, 3, 4].map(ph => {
        const ms = P.milestones.filter(m => m.phase === ph);
        return `<div class="ov-seg" style="flex:${ms.length || 1}">${ms.map(m => `<i class="${m.status}" title="${esc(m.title)}"></i>`).join('')}</div>`;
      }).join('')}</div>
      ${compact ? '' : `<div class="ov-legend">${[1, 2, 3, 4].map(ph => `<span style="flex:${P.milestones.filter(m => m.phase === ph).length || 1}">${ph} · ${PHASES[ph]}</span>`).join('')}</div>`}`;
  }

  function entryHTML(e) {
    const imgs = (e.images || []).filter(i => i && i.src);
    return `<li class="entry" id="${anchor(e)}" data-tags="${esc((e.tags || []).join('|'))}">
      <time datetime="${esc(e.date)}">${fmtDate(e.date)}</time>
      <article>
        <div class="tags">${(e.tags || []).map(t => `<span class="tag" style="--c:${tagColor(t)}">${esc(t)}</span>`).join('')}</div>
        <h3><a href="#${anchor(e)}">${esc(e.title)}</a></h3>
        ${e.author ? `<p class="by">by ${esc(e.author)}</p>` : ''}
        <div class="body">${paras(e.text)}</div>
        ${imgs.length ? `<div class="gallery n${Math.min(imgs.length, 3)}">${imgs.map(i =>
          `<button type="button" class="shot" data-src="${esc(i.src)}" data-cap="${esc(i.caption)}"><img src="${esc(i.src)}" alt="${esc(i.caption || e.title)}" loading="lazy"></button>`).join('')}</div>` : ''}
        ${e.link ? `<a class="more" href="${esc(e.link)}" target="_blank" rel="noopener">相關連結 →</a>` : ''}
      </article>
    </li>`;
  }

  const sorted = () => (P.entries || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));

  // ---------- 日誌頁 ----------
  const page = document.getElementById('logPage');
  if (page) {
    if (!P) { showError(document.getElementById('overall')); return; }

    document.getElementById('overall').innerHTML = overallHTML(false);

    document.getElementById('milestones').innerHTML = [1, 2, 3, 4].map(ph => {
      const ms = P.milestones.filter(m => m.phase === ph);
      const d = ms.filter(m => m.status === 'done').length;
      return `<div class="ms-col">
        <h3><span class="pn">${ph}</span>${PHASES[ph]}<small>${d}/${ms.length}</small></h3>
        <ul>${ms.map(m => `<li class="${m.status}"><span class="dot" aria-hidden="true"></span>
          <span class="ms-t">${esc(m.title)}</span>
          <span class="ms-s">${m.status === 'done' && m.date ? fmtDate(m.date) : STATUS[m.status] || ''}</span></li>`).join('')}</ul>
      </div>`;
    }).join('');

    const list = sorted();
    const used = [...new Set(list.flatMap(e => e.tags || []))];
    const filters = document.getElementById('filters');
    filters.innerHTML = `<button type="button" class="chip on" data-tag="">全部 <small>${list.length}</small></button>` +
      used.map(t => `<button type="button" class="chip" data-tag="${esc(t)}" style="--c:${tagColor(t)}">${esc(t)} <small>${list.filter(e => (e.tags || []).includes(t)).length}</small></button>`).join('');

    const ol = document.getElementById('entries');
    ol.innerHTML = list.length ? list.map(entryHTML).join('') : '<li class="empty">還沒有日誌，第一則就等你來寫。</li>';

    filters.addEventListener('click', ev => {
      const b = ev.target.closest('.chip');
      if (!b) return;
      filters.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
      const t = b.dataset.tag;
      ol.querySelectorAll('.entry').forEach(li => { li.hidden = t && !li.dataset.tags.split('|').includes(t); });
    });

    // 燈箱
    const lb = document.getElementById('lightbox');
    const lbImg = lb.querySelector('img'), lbCap = lb.querySelector('figcaption');
    ol.addEventListener('click', ev => {
      const s = ev.target.closest('.shot');
      if (!s) return;
      lbImg.src = s.dataset.src; lbImg.alt = s.dataset.cap; lbCap.textContent = s.dataset.cap;
      lb.hidden = false; document.body.style.overflow = 'hidden';
    });
    const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
    lb.addEventListener('click', ev => { if (ev.target === lb || ev.target.closest('.lb-close')) close(); });
    addEventListener('keydown', ev => { if (ev.key === 'Escape' && !lb.hidden) close(); });

    // 訂閱面板
    const dlg = document.getElementById('subDialog');
    if (dlg) {
      const feed = new URL('feed.xml', location.href).href;
      document.getElementById('subUrl').value = feed;
      document.getElementById('subInoreader').href = 'https://www.inoreader.com/?add_feed=' + encodeURIComponent(feed);
      document.getElementById('subFeedly').href = 'https://feedly.com/i/subscription/feed%2F' + encodeURIComponent(feed);
      document.getElementById('subBtn').addEventListener('click', () => dlg.showModal());
      document.getElementById('subClose').addEventListener('click', () => dlg.close());
      dlg.addEventListener('click', ev => { if (ev.target === dlg) dlg.close(); });
      const copyBtn = document.getElementById('subCopyBtn'), input = document.getElementById('subUrl');
      copyBtn.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(feed); }
        catch (e) { input.select(); document.execCommand('copy'); }
        copyBtn.textContent = '已複製 ✓';
        setTimeout(() => (copyBtn.textContent = '複製'), 2000);
      });
    }

    if (location.hash) { const el = document.querySelector(location.hash); if (el) setTimeout(() => el.scrollIntoView(), 50); }
  }

  // ---------- 首頁摘要 ----------
  const mini = document.getElementById('progressMini');
  if (mini) {
    if (!P) { showError(mini); return; }
    const latest = sorted().slice(0, 3);
    mini.innerHTML = `<div class="overall">${overallHTML(true)}</div>
      <div class="latest">${latest.map(e => `
        <a class="latest-card" href="log.html#${anchor(e)}">
          <time>${fmtDate(e.date)}</time>
          <h3>${esc(e.title)}</h3>
          <div class="tags">${(e.tags || []).map(t => `<span class="tag" style="--c:${tagColor(t)}">${esc(t)}</span>`).join('')}</div>
        </a>`).join('')}</div>
      <a class="btn" href="log.html">看完整製作日誌 →</a>`;
  }
})();
