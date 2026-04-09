// ============================================================
// Quick Notes — Floating Sticky Notepad for KL Material
// Draggable, collapsible, persists to localStorage
// ============================================================

(function () {
  'use strict';

  if (document.body.classList.contains('no-notes')) return;

  const STORAGE_KEY = 'klm-quick-notes-v1';
  const MAX_CHARS = 1000;

  // ── Inject CSS ──────────────────────────────────────────
  const css = `
    #qn-widget {
      position: fixed;
      bottom: 160px;
      right: 18px;
      z-index: 9985;
      width: 240px;
      border-radius: 18px;
      background: rgba(10,14,39,0.97);
      border: 1px solid rgba(255,230,100,0.25);
      box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,230,100,0.07);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-family: 'Outfit', 'Poppins', sans-serif;
      transition: transform 0.25s ease, box-shadow 0.25s;
      user-select: none;
      overflow: hidden;
    }
    #qn-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      cursor: move;
    }
    #qn-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #ffe564;
      letter-spacing: 0.5px;
    }
    #qn-toggle-btn {
      background: none; border: none;
      color: rgba(255,255,255,0.45);
      cursor: pointer; font-size: 1rem;
      padding: 2px; line-height: 1;
      transition: color 0.2s;
    }
    #qn-toggle-btn:hover { color: #ffe564; }
    #qn-body { padding: 10px 12px; }
    #qn-textarea {
      width: 100%;
      min-height: 120px;
      max-height: 240px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      color: #fff;
      font-family: inherit;
      font-size: 0.82rem;
      line-height: 1.5;
      padding: 10px 12px;
      resize: vertical;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    #qn-textarea::placeholder { color: rgba(255,255,255,0.25); }
    #qn-textarea:focus { border-color: rgba(255,230,100,0.35); }
    #qn-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 12px 10px;
    }
    #qn-char-count {
      font-size: 0.65rem;
      color: rgba(255,255,255,0.3);
    }
    #qn-clear-btn {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      color: rgba(255,100,100,0.7);
      cursor: pointer;
      font-size: 0.65rem;
      font-family: inherit;
      padding: 3px 8px;
      transition: all 0.2s;
    }
    #qn-clear-btn:hover {
      background: rgba(255,50,50,0.15);
      color: #ff6060;
      border-color: rgba(255,60,60,0.3);
    }
    #qn-widget.qn-collapsed #qn-body,
    #qn-widget.qn-collapsed #qn-footer { display: none; }
    @media (max-width: 768px) {
      #qn-widget { display: none !important; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Build Widget ────────────────────────────────────────
  const w = document.createElement('div');
  w.id = 'qn-widget';
  w.setAttribute('role', 'complementary');
  w.setAttribute('aria-label', 'Quick notes pad');
  w.innerHTML = `
    <div id="qn-header">
      <span id="qn-title">🗒️ Quick Notes</span>
      <button id="qn-toggle-btn" aria-label="Collapse / expand notes" title="Quick Notes">✏️</button>
    </div>
    <div id="qn-body">
      <textarea id="qn-textarea" maxlength="${MAX_CHARS}" placeholder="Jot something down…"></textarea>
    </div>
    <div id="qn-footer">
      <span id="qn-char-count">0 / ${MAX_CHARS}</span>
      <button id="qn-clear-btn" title="Clear notes">Clear</button>
    </div>
  `;
  document.body.appendChild(w);

  // ── State ───────────────────────────────────────────────
  const textarea = document.getElementById('qn-textarea');
  const charCount = document.getElementById('qn-char-count');
  let collapsed = false;

  // Load saved notes
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || '';
    textarea.value = saved;
    updateCharCount();
  } catch(e) {}

  // ── Events ──────────────────────────────────────────────
  textarea.addEventListener('input', () => {
    try { localStorage.setItem(STORAGE_KEY, textarea.value); } catch(e) {}
    updateCharCount();
  });

  document.getElementById('qn-clear-btn').addEventListener('click', () => {
    if (textarea.value && confirm('Clear all notes?')) {
      textarea.value = '';
      try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
      updateCharCount();
    }
  });

  document.getElementById('qn-toggle-btn').addEventListener('click', () => {
    collapsed = !collapsed;
    w.classList.toggle('qn-collapsed', collapsed);
  });

  function updateCharCount() {
    const len = textarea.value.length;
    charCount.textContent = `${len} / ${MAX_CHARS}`;
    charCount.style.color = len > MAX_CHARS * 0.85
      ? 'rgba(255,159,10,0.8)'
      : 'rgba(255,255,255,0.3)';
  }

  // ── Draggable ───────────────────────────────────────────
  let dragging = false, dx = 0, dy = 0;
  const header = document.getElementById('qn-header');

  header.addEventListener('mousedown', e => {
    if (e.target.id === 'qn-toggle-btn') return;
    dragging = true;
    const rect = w.getBoundingClientRect();
    dx = e.clientX - rect.left;
    dy = e.clientY - rect.top;
    w.style.transition = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    w.style.left   = (e.clientX - dx) + 'px';
    w.style.top    = (e.clientY - dy) + 'px';
    w.style.right  = 'auto';
    w.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => {
    dragging = false;
    w.style.transition = '';
  });
})();
