// ============================================================
// Keyboard Shortcuts — KL Material
// Press ? to show the shortcuts overlay
// ============================================================

(function () {
  'use strict';

  const SHORTCUTS = [
    { keys: ['?'],                  desc: 'Show / hide this help overlay',   group: 'General' },
    { keys: ['Esc'],                desc: 'Close overlay / dismiss toast',    group: 'General' },
    { keys: ['G', 'then H'],        desc: 'Go to Home',                       group: 'Navigation' },
    { keys: ['G', 'then M'],        desc: 'Go to Materials',                  group: 'Navigation' },
    { keys: ['G', 'then R'],        desc: 'Go to Roadmap',                    group: 'Navigation' },
    { keys: ['G', 'then C'],        desc: 'Go to CGPA Calculator',            group: 'Navigation' },
    { keys: ['G', 'then A'],        desc: 'Go to Attendance Tracker',         group: 'Navigation' },
    { keys: ['G', 'then T'],        desc: 'Go to Timetable Builder',          group: 'Navigation' },
    { keys: ['G', 'then F'],        desc: 'Go to Flashcards',                 group: 'Navigation' },
    { keys: ['/'],                  desc: 'Focus search bar (if available)',   group: 'General' },
    { keys: ['↑'],                  desc: 'Scroll to top',                    group: 'General' },
  ];

  // ── Build Overlay ───────────────────────────────────────
  const css = `
    #ks-overlay {
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(0,0,0,0.72);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: none; align-items: center; justify-content: center;
      padding: 20px;
    }
    #ks-overlay.visible { display: flex; }
    #ks-box {
      background: rgba(10,14,39,0.98);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 24px;
      padding: 32px 36px;
      max-width: 560px; width: 100%;
      max-height: 90vh; overflow-y: auto;
      box-shadow: 0 24px 64px rgba(0,0,0,0.7);
      animation: ks-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes ks-in { from { opacity:0; transform:scale(0.9) translateY(16px); } to { opacity:1; transform:none; } }
    #ks-box h2 { font-family:'Outfit',sans-serif; font-size:1.3rem; font-weight:600; margin-bottom:4px; color:#fff; }
    #ks-box .ks-sub { font-size:0.85rem; color:rgba(255,255,255,0.4); margin-bottom:24px; font-family:'Outfit',sans-serif; }
    .ks-group { margin-bottom:20px; }
    .ks-group-label { font-size:0.7rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:rgba(255,255,255,0.35); margin-bottom:10px; font-family:'Outfit',sans-serif; }
    .ks-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-family:'Outfit',sans-serif; }
    .ks-row:last-child { border-bottom:none; }
    .ks-keys { display:flex; gap:4px; align-items:center; flex-shrink:0; }
    .ks-key { padding:3px 10px; border-radius:6px; background:rgba(255,255,255,0.09); border:1px solid rgba(255,255,255,0.15); font-size:0.78rem; font-weight:600; color:#fff; white-space:nowrap; }
    .ks-plus { font-size:0.75rem; color:rgba(255,255,255,0.3); }
    .ks-desc { font-size:0.82rem; color:rgba(255,255,255,0.55); text-align:right; }
    #ks-close {
      display:block; margin:20px auto 0;
      padding:9px 28px; border-radius:99px;
      background:rgba(255,255,255,0.08);
      border:1px solid rgba(255,255,255,0.18);
      color:#fff; font-family:'Outfit',sans-serif;
      font-size:0.88rem; font-weight:600;
      cursor:pointer; transition:background 0.2s;
    }
    #ks-close:hover { background:rgba(255,255,255,0.16); }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // Group shortcuts
  const groups = {};
  SHORTCUTS.forEach(s => {
    if (!groups[s.group]) groups[s.group] = [];
    groups[s.group].push(s);
  });

  const overlay = document.createElement('div');
  overlay.id = 'ks-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Keyboard shortcuts');
  overlay.innerHTML = `
    <div id="ks-box">
      <h2>⌨️ Keyboard Shortcuts</h2>
      <div class="ks-sub">Press <strong>?</strong> anytime to toggle this panel</div>
      ${Object.entries(groups).map(([group, shortcuts]) => `
        <div class="ks-group">
          <div class="ks-group-label">${group}</div>
          ${shortcuts.map(s => `
            <div class="ks-row">
              <div class="ks-keys">
                ${s.keys.map((k, i) => `
                  ${i > 0 ? `<span class="ks-plus">${k.startsWith('then') ? '' : '+'}</span>` : ''}
                  <span class="ks-key">${k.replace('then ', '')}</span>
                `).join('')}
              </div>
              <div class="ks-desc">${s.desc}</div>
            </div>`).join('')}
        </div>`).join('')}
      <button id="ks-close">Close</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // ── Toggle ───────────────────────────────────────────────
  let visible = false;
  function show() { overlay.classList.add('visible'); visible = true; }
  function hide() { overlay.classList.remove('visible'); visible = false; }

  overlay.addEventListener('click', e => { if (e.target === overlay) hide(); });
  document.getElementById('ks-close').addEventListener('click', hide);

  // ── Navigation sequence ──────────────────────────────────
  let gPressed = false;
  let gTimer   = null;

  const gMap = {
    h: 'index.html',
    m: 'materials.html',
    r: 'roadmap.html',
    c: 'cgpa.html',
    a: 'attendance.html',
    t: 'timetable.html',
    f: 'flashcards.html',
  };

  document.addEventListener('keydown', e => {
    const tag = e.target.tagName;
    const inInput = ['INPUT','TEXTAREA','SELECT'].includes(tag);

    // ? key — always work unless in input
    if (e.key === '?' && !inInput) {
      visible ? hide() : show();
      return;
    }

    // Esc — close overlay
    if (e.key === 'Escape') { hide(); return; }

    if (inInput) return;

    // / — focus search
    if (e.key === '/') {
      e.preventDefault();
      const searchEl = document.getElementById('heroSearch') ||
                       document.getElementById('searchSubject') ||
                       document.getElementById('search-bar');
      if (searchEl) { searchEl.focus(); searchEl.select(); }
      return;
    }

    // ↑ — scroll to top
    if (e.key === 'ArrowUp' && e.altKey) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // G + key navigation
    if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey) {
      gPressed = true;
      clearTimeout(gTimer);
      gTimer = setTimeout(() => { gPressed = false; }, 1200);
      return;
    }

    if (gPressed) {
      const dest = gMap[e.key.toLowerCase()];
      if (dest) {
        gPressed = false;
        clearTimeout(gTimer);
        window.location.href = dest;
      }
    }
  });

  // ── Hint badge injected once ─────────────────────────────
  const hint = document.createElement('div');
  hint.style.cssText = `
    position:fixed; bottom:18px; left:18px; z-index:9980;
    background:rgba(10,14,39,0.92); border:1px solid rgba(255,255,255,0.1);
    border-radius:10px; padding:6px 12px; font-family:'Outfit',sans-serif;
    font-size:0.72rem; color:rgba(255,255,255,0.35); cursor:pointer;
    backdrop-filter:blur(10px); transition:opacity 0.3s;
    display:flex; align-items:center; gap:6px;
  `;
  hint.innerHTML = `<span style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);padding:1px 8px;border-radius:4px;font-weight:600;color:rgba(255,255,255,0.5)">?</span> Keyboard Shortcuts`;
  hint.addEventListener('click', () => visible ? hide() : show());
  document.body.appendChild(hint);

  // fade hint after 6s
  setTimeout(() => { hint.style.opacity = '0.4'; }, 6000);
  hint.addEventListener('mouseenter', () => { hint.style.opacity = '1'; });
  hint.addEventListener('mouseleave', () => { hint.style.opacity = '0.4'; });
})();
