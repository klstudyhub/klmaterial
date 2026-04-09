// ============================================================
// Nav Dropdown — KL Material
// Groups Tools links into a collapsible dropdown in the navbar
// Works with desktop hover and mobile tap
// Injected after ui.js on all pages
// ============================================================

(function () {
  'use strict';

  // Tool links to move into the dropdown
  const TOOL_HREFS = [
    'attendance.html',
    'timetable.html',
    'flashcards.html',
    'marks.html',
    'formulas.html',
  ];

  const TOOL_LABELS = {
    'attendance.html': '📅 Attendance',
    'timetable.html':  '📆 Timetable',
    'flashcards.html': '🃏 Flashcards',
    'marks.html':      '📝 Marks',
    'formulas.html':   '🧮 Formulas',
  };

  // ── CSS ─────────────────────────────────────────────────
  const css = `
    /* ── Dropdown wrapper ── */
    .nav-dropdown-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    /* ── Dropdown trigger button ── */
    .nav-dropdown-trigger {
      display: flex; align-items: center; gap: 5px;
      padding: 7px 14px; border-radius: 10px;
      background: transparent; border: none;
      color: rgba(255,255,255,0.82);
      font-family: inherit; font-size: 0.9rem; font-weight: 500;
      cursor: pointer; transition: all 0.25s ease;
      white-space: nowrap;
    }
    .nav-dropdown-trigger:hover,
    .nav-dropdown-wrap.open .nav-dropdown-trigger {
      color: #fff;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.18) !important;
    }
    .nav-dropdown-trigger.dd-active {
      color: #fff !important;
      background: rgba(0,212,255,0.20) !important;
      border: 1px solid rgba(0,212,255,0.42) !important;
      box-shadow: inset 0 1.5px 0 rgba(255,255,255,0.40), 0 4px 16px rgba(0,212,255,0.30) !important;
      text-shadow: 0 0 14px rgba(0,212,255,1) !important;
      font-weight: 600 !important;
    }
    .nav-dropdown-chevron {
      font-size: 0.6rem; opacity: 0.6;
      transition: transform 0.25s ease;
      display: inline-block;
    }
    .nav-dropdown-wrap.open .nav-dropdown-chevron { transform: rotate(180deg); opacity: 1; }

    /* ── Dropdown panel ── */
    .nav-dropdown-panel {
      position: absolute;
      top: calc(100% + 10px); right: 0;
      min-width: 180px;
      background: rgba(6,10,28,0.97);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 16px;
      padding: 6px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      opacity: 0; pointer-events: none;
      transform: translateY(-8px) scale(0.97);
      transform-origin: top right;
      transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
      z-index: 9999;
    }
    .nav-dropdown-wrap.open .nav-dropdown-panel {
      opacity: 1; pointer-events: auto;
      transform: translateY(0) scale(1);
    }
    .nav-dropdown-panel a {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; border-radius: 10px;
      color: rgba(255,255,255,0.75) !important;
      font-size: 0.88rem; font-weight: 500;
      text-decoration: none;
      transition: all 0.18s ease;
      border: 1px solid transparent !important;
      background: transparent !important;
      box-shadow: none !important;
      -webkit-text-fill-color: rgba(255,255,255,0.75) !important;
    }
    .nav-dropdown-panel a:hover {
      color: #fff !important;
      -webkit-text-fill-color: #fff !important;
      background: rgba(255,255,255,0.09) !important;
      border-color: rgba(255,255,255,0.12) !important;
    }
    .nav-dropdown-panel a.active {
      color: #00d4ff !important;
      -webkit-text-fill-color: #00d4ff !important;
      background: rgba(0,212,255,0.12) !important;
      border-color: rgba(0,212,255,0.28) !important;
      font-weight: 600 !important;
    }
    .nav-dropdown-divider {
      height: 1px; margin: 4px 6px;
      background: rgba(255,255,255,0.07);
    }

    /* ── Mobile: tools become regular nav-links in the dropdown ── */
    @media (max-width: 768px) {
      .nav-dropdown-wrap { display: none !important; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Wait for DOM ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelector('.nav-links, #nLinks, #navLinks');
    if (!navLinks) return;

    // Detect if current page is one of the tool pages
    const currPage = window.location.pathname.split('/').pop() || 'index.html';
    const isToolPage = TOOL_HREFS.includes(currPage);

    // Collect and remove tool links from the nav
    const toolAnchors = [];
    TOOL_HREFS.forEach(href => {
      const el = navLinks.querySelector(`a[href="${href}"]`);
      if (el) { toolAnchors.push(el.cloneNode(true)); el.remove(); }
    });

    if (toolAnchors.length === 0) return; // nothing to group

    // ── Build dropdown ──────────────────────────────────
    const wrap = document.createElement('div');
    wrap.className = 'nav-dropdown-wrap';

    const trigger = document.createElement('button');
    trigger.className = 'nav-dropdown-trigger' + (isToolPage ? ' dd-active' : '');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `🛠 Tools <span class="nav-dropdown-chevron">▼</span>`;

    const panel = document.createElement('div');
    panel.className = 'nav-dropdown-panel';
    panel.setAttribute('role', 'menu');

    toolAnchors.forEach((a, i) => {
      const href = a.getAttribute('href') || '';
      const label = TOOL_LABELS[href] || a.textContent.trim();
      // Rebuild anchor with emoji label
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      link.setAttribute('role', 'menuitem');
      if (href === currPage) link.classList.add('active');
      panel.appendChild(link);
      if (i < toolAnchors.length - 1) {
        const div = document.createElement('div');
        div.className = 'nav-dropdown-divider';
        panel.appendChild(div);
      }
    });

    wrap.appendChild(trigger);
    wrap.appendChild(panel);

    // Insert before "About" link
    const aboutLink = navLinks.querySelector('a[href="about.html"]');
    if (aboutLink) navLinks.insertBefore(wrap, aboutLink);
    else navLinks.appendChild(wrap);

    // ── Toggle logic ─────────────────────────────────────
    function open()  { wrap.classList.add('open'); trigger.setAttribute('aria-expanded','true'); }
    function close() { wrap.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); }
    function toggle(){ wrap.classList.contains('open') ? close() : open(); }

    trigger.addEventListener('click', e => { e.stopPropagation(); toggle(); });
    wrap.addEventListener('mouseenter', () => open());
    wrap.addEventListener('mouseleave', () => close());
    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  });
})();
