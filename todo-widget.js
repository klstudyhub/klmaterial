// ============================================================
// Priority To-Do Widget — KL Material
// Floating checklist with priorities, localStorage persistence
// ============================================================

(function () {
  'use strict';
  if (document.body.classList.contains('no-todo')) return;

  const STORAGE_KEY = 'klm-todo-v1';

  // ── CSS ─────────────────────────────────────────────────
  const css = `
    #td-widget {
      position: fixed;
      bottom: 320px;
      right: 18px;
      z-index: 9983;
      width: 250px;
      border-radius: 18px;
      background: rgba(10,14,39,0.97);
      border: 1px solid rgba(0,229,160,0.25);
      box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,229,160,0.07);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-family: 'Outfit', 'Poppins', sans-serif;
      user-select: none;
      overflow: hidden;
      transition: transform 0.25s ease;
    }
    #td-header {
      display: flex; align-items: center;
      justify-content: space-between;
      padding: 10px 14px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      cursor: move;
    }
    #td-title { font-size: 0.75rem; font-weight: 600; color: #00e5a0; letter-spacing: 0.5px; }
    #td-toggle-btn {
      background: none; border: none; color: rgba(255,255,255,0.45);
      cursor: pointer; font-size: 1rem; padding: 2px; transition: color 0.2s;
    }
    #td-toggle-btn:hover { color: #00e5a0; }
    #td-body { padding: 10px 12px; }
    #td-add-row { display: flex; gap: 6px; margin-bottom: 8px; }
    #td-new-input {
      flex: 1; padding: 7px 10px; border-radius: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff; font-family: inherit; font-size: 0.78rem;
      outline: none; transition: border-color 0.2s;
    }
    #td-new-input:focus { border-color: rgba(0,229,160,0.4); }
    #td-new-input::placeholder { color: rgba(255,255,255,0.25); }
    #td-priority-select {
      padding: 7px 6px; border-radius: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff; font-family: inherit; font-size: 0.72rem;
      cursor: pointer; outline: none;
    }
    #td-priority-select option { background: #0a0e27; }
    #td-add-btn {
      padding: 7px 10px; border-radius: 8px;
      background: rgba(0,229,160,0.15);
      border: 1px solid rgba(0,229,160,0.35);
      color: #00e5a0; font-family: inherit;
      font-size: 0.78rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    #td-add-btn:hover { background: rgba(0,229,160,0.28); }
    #td-list {
      display: flex; flex-direction: column; gap: 4px;
      max-height: 200px; overflow-y: auto;
    }
    #td-list::-webkit-scrollbar { width: 3px; }
    #td-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
    .td-item {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 8px; border-radius: 8px;
      cursor: pointer; transition: background 0.15s;
      font-size: 0.78rem;
    }
    .td-item:hover { background: rgba(255,255,255,0.05); }
    .td-checkbox {
      width: 16px; height: 16px; border-radius: 5px; flex-shrink: 0;
      border: 1.5px solid rgba(255,255,255,0.25);
      background: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .td-item.done .td-checkbox {
      background: #00e5a0; border-color: #00e5a0;
    }
    .td-item.done .td-checkbox::after { content: '✓'; font-size: 0.65rem; color: #000; }
    .td-item-text { flex: 1; color: var(--text-primary, #fff); line-height: 1.3; transition: opacity 0.2s; }
    .td-item.done .td-item-text { text-decoration: line-through; opacity: 0.4; }
    .td-priority-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .td-del { background: none; border: none; color: rgba(255,80,80,0.4); cursor: pointer; font-size: 0.9rem; opacity: 0; transition: opacity 0.2s; padding: 2px; }
    .td-item:hover .td-del { opacity: 1; }
    #td-footer {
      display: flex; justify-content: space-between;
      align-items: center; padding: 4px 12px 10px;
      font-size: 0.65rem; color: rgba(255,255,255,0.25);
    }
    #td-clear-done {
      background: none; border: none; color: rgba(255,255,255,0.25);
      cursor: pointer; font-size: 0.65rem; font-family: inherit;
      transition: color 0.2s;
    }
    #td-clear-done:hover { color: rgba(255,80,80,0.7); }
    #td-widget.td-collapsed #td-body, #td-widget.td-collapsed #td-footer { display: none; }
    @media (max-width: 768px) { #td-widget { display: none !important; } }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── State ───────────────────────────────────────────────
  let todos = [];
  function load() {
    try { const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); if (Array.isArray(s)) todos = s; } catch(e) {}
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); } catch(e) {}
  }

  const PRIORITY_COLORS = { high: '#ff3b30', medium: '#ff9f0a', low: '#30d158' };

  // ── Build Widget ─────────────────────────────────────────
  const w = document.createElement('div');
  w.id = 'td-widget';
  w.setAttribute('role', 'complementary');
  w.setAttribute('aria-label', 'Task list');
  w.innerHTML = `
    <div id="td-header">
      <span id="td-title">✅ To-Do List</span>
      <button id="td-toggle-btn" aria-label="Collapse / expand tasks" title="To-Do List">✅</button>
    </div>
    <div id="td-body">
      <div id="td-add-row">
        <input id="td-new-input" placeholder="Add a task…" maxlength="80">
        <select id="td-priority-select" title="Priority">
          <option value="high">🔴</option>
          <option value="medium" selected>🟡</option>
          <option value="low">🟢</option>
        </select>
        <button id="td-add-btn" title="Add">+</button>
      </div>
      <div id="td-list"></div>
    </div>
    <div id="td-footer">
      <span id="td-stats"></span>
      <button id="td-clear-done">Clear done</button>
    </div>
  `;
  document.body.appendChild(w);

  const listEl    = document.getElementById('td-list');
  const statsEl   = document.getElementById('td-stats');
  const inputEl   = document.getElementById('td-new-input');
  const prioSel   = document.getElementById('td-priority-select');
  const addBtn    = document.getElementById('td-add-btn');
  const clearDone = document.getElementById('td-clear-done');

  // ── Render ───────────────────────────────────────────────
  function render() {
    // Sort: undone first, then by priority (high→low)
    const order = { high: 0, medium: 1, low: 2 };
    const sorted = [...todos].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return (order[a.priority] || 1) - (order[b.priority] || 1);
    });

    listEl.innerHTML = sorted.map(item => {
      const color = PRIORITY_COLORS[item.priority] || '#ff9f0a';
      const doneClass = item.done ? ' done' : '';
      return `
        <div class="td-item${doneClass}" onclick="tdToggle('${item.id}')">
          <div class="td-checkbox"></div>
          <div class="td-priority-dot" style="background:${color}"></div>
          <div class="td-item-text">${escHtml(item.text)}</div>
          <button class="td-del" onclick="event.stopPropagation();tdDelete('${item.id}')" title="Delete">✕</button>
        </div>`;
    }).join('');

    const done  = todos.filter(t => t.done).length;
    const total = todos.length;
    statsEl.textContent = total ? `${done}/${total} done` : 'No tasks yet';
  }

  function escHtml(s) {
    return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // expose to inline onclick
  window.tdToggle = function(id) {
    const t = todos.find(x => x.id === id);
    if (t) { t.done = !t.done; save(); render(); }
  };
  window.tdDelete = function(id) {
    todos = todos.filter(x => x.id !== id);
    save(); render();
  };

  // ── Add task ─────────────────────────────────────────────
  function addTask() {
    const text = inputEl.value.trim();
    if (!text) { inputEl.focus(); return; }
    todos.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      text,
      priority: prioSel.value,
      done: false,
      createdAt: Date.now()
    });
    save(); render();
    inputEl.value = '';
    inputEl.focus();
  }

  addBtn.addEventListener('click', addTask);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
  clearDone.addEventListener('click', () => {
    todos = todos.filter(t => !t.done);
    save(); render();
  });

  // Collapse toggle
  document.getElementById('td-toggle-btn').addEventListener('click', () => {
    w.classList.toggle('td-collapsed');
  });

  // Draggable
  let dragging = false, dx = 0, dy = 0;
  document.getElementById('td-header').addEventListener('mousedown', e => {
    if (e.target.id === 'td-toggle-btn') return;
    dragging = true;
    const rect = w.getBoundingClientRect();
    dx = e.clientX - rect.left; dy = e.clientY - rect.top;
    w.style.transition = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    w.style.left = (e.clientX - dx) + 'px';
    w.style.top  = (e.clientY - dy) + 'px';
    w.style.right = 'auto'; w.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => { dragging = false; w.style.transition = ''; });

  // Init
  load();
  render();
})();
