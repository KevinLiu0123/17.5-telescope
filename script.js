// ===== 星空背景 =====
(() => {
  const canvas = document.getElementById('sky');
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [], w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    const n = Math.round((innerWidth * innerHeight) / 2600);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() ** 3 * 1.6 + 0.3) * dpr,
      a: Math.random() * 0.7 + 0.2,
      t: Math.random() * Math.PI * 2,
      s: Math.random() * 0.02 + 0.005,
      warm: Math.random() < 0.12
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const drift = (window.scrollY * 0.05) * dpr;
    for (const s of stars) {
      s.t += s.s;
      const alpha = reduce ? s.a : s.a * (0.65 + 0.35 * Math.sin(s.t));
      const y = (s.y - drift * (s.r / dpr)) % h;
      ctx.beginPath();
      ctx.arc(s.x, y < 0 ? y + h : y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.warm ? `rgba(255,214,140,${alpha})` : `rgba(225,222,255,${alpha})`;
      ctx.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  resize();
  draw();
  addEventListener('resize', () => { resize(); if (reduce) draw(); });
  if (reduce) addEventListener('scroll', draw, { passive: true });
})();

// ===== 導覽列 =====
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); })
);

// ===== 鏡筒分段 Tabs =====
document.querySelectorAll('.tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', b === btn));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === btn.dataset.tab));
  });
});

// ===== 經費長條圖（資料來自計畫書第六章）=====
const budget = [
  ['赤道儀', 210800],
  ['鏡筒材料與加工', 150000],
  ['冷卻相機', 145000],
  ['濾鏡與濾鏡盤', 63000],
  ['預備金', 60000],
  ['彗差修正鏡', 56000],
  ['導星系統', 21000],
  ['對焦座＋馬達', 12000],
  ['雜支與備品', 10000],
  ['光軸調整器', 7000],
  ['遮光罩', 2000]
];
const barsEl = document.getElementById('budgetBars');
if (barsEl) {
  const max = Math.max(...budget.map(b => b[1]));
  barsEl.innerHTML = budget.map(([name, amt]) => `
    <div class="bar-row">
      <span class="label">${name}</span>
      <div class="bar-track"><div class="bar-fill" data-w="${(amt / max * 100).toFixed(1)}"></div></div>
      <span class="amt">${amt.toLocaleString('zh-TW')}</span>
    </div>`).join('');
}

// ===== 數字跳動 =====
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const dec = parseInt(el.dataset.decimals || 0, 10);
  const dur = 1400, start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const v = target * (1 - Math.pow(1 - p, 3));
    el.textContent = v.toLocaleString('zh-TW', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (p < 1) requestAnimationFrame(step);
  })(start);
}

// ===== 捲動顯示 =====
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    e.target.querySelectorAll('.bar-fill').forEach(b => (b.style.width = b.dataset.w + '%'));
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
document.querySelectorAll('.hero-stats [data-count]').forEach(countUp);

document.getElementById('year').textContent = new Date().getFullYear();
