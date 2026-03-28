/* ═══════════════════════════════════════════════════════
   Market Intel — Shared Utilities
   Used by: terminal.html, signals.html, index.html
   ═══════════════════════════════════════════════════════ */

// ── Data Loading ──
async function loadJSON(url) {
  try {
    const r = await fetch(url + '?t=' + Date.now());
    return r.ok ? await r.json() : null;
  } catch { return null; }
}

// ── Formatters ──
function esc(s) { return s ? String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''; }
function pct(v) { return v != null ? (v >= 0 ? '+' : '') + Number(v).toFixed(2) + '%' : '--'; }
function cls(v) { return v > 0 ? 'up' : v < 0 ? 'dn' : 'nt'; }

// ── Clock ──
function startClock(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  function tick() {
    const now = new Date();
    const tw = new Date(now.getTime() + (8 - now.getTimezoneOffset() / -60) * 3600000);
    el.textContent = tw.toISOString().slice(11, 19) + ' TST';
  }
  tick();
  setInterval(tick, 1000);
}

// ── Navigation Bar ──
function renderNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const links = [
    { href: 'index.html', label: 'Dashboard', icon: '📊' },
    { href: 'terminal.html', label: 'Terminal', icon: '💻' },
    { href: 'signals.html', label: 'Signals', icon: '📡' },
  ];
  const nav = document.createElement('nav');
  nav.className = 'mi-nav';
  nav.innerHTML = links.map(l =>
    `<a href="${l.href}" class="mi-nav-link${page === l.href ? ' active' : ''}">${l.icon} ${l.label}</a>`
  ).join('');
  document.body.prepend(nav);
}

// ── Mini Sparkline SVG ──
function miniSpark(data, w, h) {
  w = w || 60; h = h || 16;
  if (!data || data.length < 2) return '';
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1) * w).toFixed(1)},${(h - 2 - (v - mn) / rng * (h - 4)).toFixed(1)}`
  ).join(' ');
  const c = data[data.length - 1] >= data[0] ? 'var(--green,#00d26a)' : 'var(--red,#ff3b30)';
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${pts}" fill="none" stroke="${c}" stroke-width="1.2"/></svg>`;
}
