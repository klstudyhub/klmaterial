// ============================================================
// Theme Toggle (Dark/Light) — KL Material
// Toggles the root data-theme attribute and saves to localStorage
// ============================================================

(function () {
  'use strict';

  const THEME_KEY = 'klm-theme-v1';
  let currentTheme = localStorage.getItem(THEME_KEY) || 'dark';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Apply immediately to prevent flash
  applyTheme(currentTheme);

  document.addEventListener('DOMContentLoaded', () => {
    // We add a sun/moon icon to the navbar, right before the hamburger/mobile button
    const navLinks = document.querySelector('.nav-links, #nLinks');
    const mobileBtn = document.querySelector('.mobile-btn, #mobBtn');
    const navContainer = document.querySelector('.nav-container');

    if (!navContainer || document.getElementById('themeToggleBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'themeToggleBtn';
    btn.setAttribute('aria-label', 'Toggle light/dark theme');
    btn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
    
    // Style the button directly
    btn.style.cssText = `
      background: transparent; border: none; font-size: 1.1rem;
      cursor: pointer; padding: 4px; margin-left: auto; margin-right: 12px;
      transition: transform 0.2s ease;
    `;
    
    // Add hover effect
    btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
    btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');

    btn.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, currentTheme);
      applyTheme(currentTheme);
      btn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
      
      // Flash a quick toast message
      let t = document.getElementById('klToast');
      if (!t) { t = document.createElement('div'); t.id='klToast'; t.className='glass toast-msg'; document.body.appendChild(t); }
      t.textContent = currentTheme === 'light' ? 'Light Mode On ☀️' : 'Dark Mode On 🌙';
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2000);
    });

    if (mobileBtn) {
       navContainer.insertBefore(btn, mobileBtn);
    } else if (navLinks) {
       navContainer.insertBefore(btn, navLinks.nextSibling);
    } else {
       navContainer.appendChild(btn);
    }
  });
})();
