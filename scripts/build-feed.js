// 從 data/progress.js 產生 RSS 訂閱檔 feed.xml
// 由 GitHub Actions 在每次推送時自動執行，平常不需要手動跑。
// 本機測試：node scripts/build-feed.js https://你的帳號.github.io/repo名稱/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
let site = process.argv[2] || process.env.SITE_URL || 'https://example.github.io/telescope/';
site = site.replace(/\/+$/, '') + '/';

// 讀取 progress.js（它是寫給瀏覽器的，所以模擬一個 window）
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/progress.js'), 'utf8'), sandbox, { filename: 'data/progress.js' });
const P = sandbox.window.PROGRESS;

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// 跟 log.js 相同的錨點規則，讓 RSS 連結能直接跳到那一則
const anchor = e => 'e-' + (e.date || '') + '-' + encodeURIComponent(e.title || '').slice(0, 24).replace(/%/g, '');
const pubDate = d => {
  const [y, m = '01', day = '01'] = String(d || '').split('-');
  return new Date(Date.UTC(+y, +m - 1, +day, 4)).toUTCString(); // 台灣時間中午
};
const abs = src => /^https?:/.test(src) ? src : site + String(src).replace(/^\.?\//, '');

const entries = (P.entries || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));

const items = entries.map(e => {
  const link = `${site}log.html#${anchor(e)}`;
  const html =
    String(e.text || '').split(/\n\s*\n/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('') +
    (e.images || []).filter(i => i && i.src).map(i => `<p><img src="${esc(abs(i.src))}" alt="${esc(i.caption)}"><br>${esc(i.caption)}</p>`).join('') +
    (e.link ? `<p><a href="${esc(e.link)}">相關連結</a></p>` : '');
  return `    <item>
      <title>${esc(e.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="false">${esc(anchor(e))}</guid>
      <pubDate>${pubDate(e.date)}</pubDate>
${(e.tags || []).map(t => `      <category>${esc(t)}</category>`).join('\n')}
      <description><![CDATA[${html.replace(/]]>/g, ']]&gt;')}]]></description>
    </item>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>17.5 吋望遠鏡製作日誌｜清大天文社 × 清大天文台</title>
    <link>${esc(site)}log.html</link>
    <atom:link href="${esc(site)}feed.xml" rel="self" type="application/rss+xml"/>
    <description>一面沉睡四十年的 17.5 吋主鏡，由學生親手打造成望遠鏡的過程紀錄。</description>
    <language>zh-TW</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(root, 'feed.xml'), xml);
console.log(`feed.xml：${entries.length} 則，網址 ${site}`);
