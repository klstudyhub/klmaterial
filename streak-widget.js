// ============================================================
// Study Streak Tracker — KL Material
// Floating widget showing consecutive study days
// Pressing "I studied today" logs a visit, streak resets if a
// day is skipped. Shows best streak and motivational message.
// ============================================================

(function () {
  'use strict';
  if (document.body.classList.contains('no-streak')) return;

  const STORAGE_KEY = 'klm-streak-v1';

  // ── CSS ─────────────────────────────────────────────────
  const css = `
    #streak-widget {
      position: fixed;
      bottom: 18px;
      right: 250px;
      z-index: 9982;
      border-radius: 18px;
      background: rgba(10,14,39,0.97);
      border: 1px solid rgba(255,159,10,0.3);
      box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,159,10,0.06);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-family: 'Outfit', 'Poppins', sans-serif;
      overflow: hidden;
      width: 190px;
      transition: transform 0.25s ease;
    }
    #streak-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 13px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      cursor: move;
    }
    #streak-title { font-size: 0.72rem; font-weight: 700; color: #ff9f0a; letter-spacing: 0.5px; }
    #streak-collapse-btn {
      background: none; border: none; color: rgba(255,255,255,0.4);
      cursor: pointer; font-size: 0.9rem; transition: color 0.2s;
    }
    #streak-collapse-btn:hover { color: #ff9f0a; }
    #streak-body { padding: 10px 13px 12px; }

    /* Big streak display */
    #streak-big {
      text-align: center; padding: 6px 0 4px;
    }
    #streak-number {
      font-size: 2.8rem; font-weight: 700; line-height: 1;
      letter-spacing: -2px;
      background: linear-gradient(135deg, #ff9f0a, #ff5520);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    #streak-fire { font-size: 1.4rem; }
    #streak-label { font-size: 0.68rem; color: rgba(255,255,255,0.35); margin-top: 2px; }

    /* Stats row */
    #streak-stats {
      display: flex; gap: 10px; margin: 10px 0 8px;
    }
    .streak-stat {
      flex: 1; text-align: center;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px; padding: 6px 4px;
    }
    .streak-stat-val { font-size: 1rem; font-weight: 700; color: #fff; }
    .streak-stat-lbl { font-size: 0.58rem; color: rgba(255,255,255,0.3); margin-top: 1px; }

    /* Log button */
    #streak-log-btn {
      width: 100%; padding: 9px;
      border-radius: 10px;
      background: rgba(255,159,10,0.18);
      border: 1px solid rgba(255,159,10,0.4);
      color: #ff9f0a; font-family: inherit;
      font-size: 0.78rem; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
      line-height: 1.2;
    }
    #streak-log-btn:hover { background: rgba(255,159,10,0.32); }
    #streak-log-btn:disabled {
      background: rgba(48,209,88,0.12);
      border-color: rgba(48,209,88,0.3);
      color: #30d158; cursor: default;
    }

    /* Motivational message */
    #streak-msg { font-size: 0.67rem; color: rgba(255,255,255,0.3); text-align: center; margin-top: 6px; }

    /* Collapsed state */
    #streak-widget.streak-collapsed #streak-body { display: none; }

    @media (max-width: 768px) { #streak-widget { display: none !important; } }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── State ───────────────────────────────────────────────
  let data = { streak: 0, best: 0, lastDate: null, total: 0 };

  function load() {
    try { const s = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (s) data = s; } catch(e) {}
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  }

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }
  function yesterdayStr() {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }

  // Check if streak needs reset (missed a day)
  function checkStreakReset() {
    if (!data.lastDate) return;
    if (data.lastDate === todayStr()) return; // already logged today
    if (data.lastDate !== yesterdayStr()) {
      // Missed a day — reset streak (but not best)
      if (data.streak > 0) {
        data.streak = 0;
        save();
      }
    }
  }

  function logStudy() {
    const today = todayStr();
    if (data.lastDate === today) return; // already logged

    if (data.lastDate === yesterdayStr()) {
      data.streak += 1; // continuing streak
    } else {
      data.streak = 1; // fresh start
    }
    data.best = Math.max(data.best, data.streak);
    data.total = (data.total || 0) + 1;
    data.lastDate = today;
    save();
    render();
  }

  const MESSAGES = [
    "Every day counts! 💪",
    "Consistency is key 🔑",
    "You're on a roll! 🔥",
    "Keep grinding! ⚡",
    "Small steps = big results 🚀",
    "Future you says thanks 🙏",
    "Study mode: ON 📚",
    "Building good habits! ✅",
  ];

  function getMessage(streak) {
    if (streak === 0) return "Log today's study session!";
    if (streak >= 30) return "🏆 Legendary streak!";
    if (streak >= 14) return "🔥 On fire! Keep it up!";
    if (streak >= 7)  return "🌟 One week strong!";
    if (streak >= 3)  return "⚡ Building momentum!";
    return MESSAGES[streak % MESSAGES.length];
  }

  // ── Widget DOM ───────────────────────────────────────────
  const w = document.createElement('div');
  w.id = 'streak-widget';
  w.setAttribute('role', 'status');
  w.setAttribute('aria-label', 'Study streak tracker');
  w.innerHTML = `
    <div id="streak-header">
      <span id="streak-title">🔥 Study Streak</span>
      <button id="streak-collapse-btn" title="Collapse">—</button>
    </div>
    <div id="streak-body">
      <div id="streak-big">
        <div id="streak-fire">🔥</div>
        <div id="streak-number">0</div>
        <div id="streak-label">day streak</div>
      </div>
      <div id="streak-stats">
        <div class="streak-stat">
          <div class="streak-stat-val" id="streak-best-val">0</div>
          <div class="streak-stat-lbl">Best</div>
        </div>
        <div class="streak-stat">
          <div class="streak-stat-val" id="streak-total-val">0</div>
          <div class="streak-stat-lbl">Total days</div>
        </div>
      </div>
      <button id="streak-log-btn">✅ I studied today!</button>
      <div id="streak-msg"></div>
    </div>
  `;
  document.body.appendChild(w);

  const numEl   = document.getElementById('streak-number');
  const bestEl  = document.getElementById('streak-best-val');
  const totEl   = document.getElementById('streak-total-val');
  const logBtn  = document.getElementById('streak-log-btn');
  const msgEl   = document.getElementById('streak-msg');
  const fireEl  = document.getElementById('streak-fire');

  function render() {
    const today = todayStr();
    const logged = data.lastDate === today;

    numEl.textContent  = data.streak;
    bestEl.textContent = data.best;
    totEl.textContent  = data.total || 0;
    msgEl.textContent  = getMessage(data.streak);

    // Fire emoji scales with streak
    fireEl.textContent = data.streak >= 14 ? '🔥🔥' : '🔥';
    fireEl.style.filter = data.streak >= 7 ? 'drop-shadow(0 0 6px #ff9f0a)' : '';

    logBtn.disabled = logged;
    logBtn.textContent = logged ? '✅ Logged for today!' : '✅ I studied today!';
  }

  logBtn.addEventListener('click', logStudy);

  // Collapse
  document.getElementById('streak-collapse-btn').addEventListener('click', () => {
    w.classList.toggle('streak-collapsed');
  });

  // Draggable
  let dragging = false, dx = 0, dy = 0;
  document.getElementById('streak-header').addEventListener('mousedown', e => {
    if (e.target.id === 'streak-collapse-btn') return;
    dragging = true;
    const rect = w.getBoundingClientRect();
    dx = e.clientX - rect.left; dy = e.clientY - rect.top;
    w.style.transition = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    w.style.left   = (e.clientX - dx) + 'px';
    w.style.top    = (e.clientY - dy) + 'px';
    w.style.right  = 'auto'; w.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => { dragging = false; w.style.transition = ''; });

  // Init
  load();
  checkStreakReset();
  render();
})();
