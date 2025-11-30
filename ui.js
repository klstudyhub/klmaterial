// ui.js

// Mobile nav chevron scroll
(function () {
    const track = document.querySelector('header nav .nav-track');
    const next = document.querySelector('header nav .nav-next'); // Note: This element might not exist in all HTMLs yet, but logic is safe
    if (track && next) {
        next.addEventListener('click', () => {
            track.scrollBy({ left: 160, behavior: 'smooth' });
        });
    }

    // Sliding Nav Marker Logic
    if (track) {
        // Create marker
        const marker = document.createElement('div');
        marker.classList.add('nav-marker');
        track.appendChild(marker);

        const links = track.querySelectorAll('a');
        const activeLink = track.querySelector('a.active');

        function moveMarker(element) {
            if (!element) {
                marker.style.opacity = '0';
                return;
            }

            // Calculate relative position within the track
            const trackRect = track.getBoundingClientRect();
            const elemRect = element.getBoundingClientRect();

            // Account for track scroll position if any
            const left = elemRect.left - trackRect.left + track.scrollLeft;

            marker.style.width = `${elemRect.width}px`;
            marker.style.transform = `translateX(${left}px)`;
            marker.style.opacity = '1';
        }

        // Initialize position
        if (activeLink) {
            // Small delay to ensure layout is settled
            setTimeout(() => moveMarker(activeLink), 100);
        }

        // Event listeners
        links.forEach(link => {
            link.addEventListener('mouseenter', () => moveMarker(link));
        });

        track.addEventListener('mouseleave', () => {
            if (activeLink) {
                moveMarker(activeLink);
            } else {
                marker.style.opacity = '0';
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const currentActive = track.querySelector('a:hover') || activeLink;
            if (currentActive) moveMarker(currentActive);
        });
    }
})();

// Back to Top functionality
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Theme Toggle + Hamburger Logic
document.addEventListener('DOMContentLoaded', () => {
    // Theme setup
    const root = document.documentElement;
    const toggleBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
        if (toggleBtn) toggleBtn.setAttribute('aria-pressed', savedTheme === 'light');
    } else {
        root.setAttribute('data-theme', 'dark');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            toggleBtn.setAttribute('aria-pressed', next === 'light');
        });
    }

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger-btn');
    const header = document.querySelector('header');
    if (hamburger && header) {
        // Ensure collapsed initial state
        if (!header.classList.contains('nav-collapsed') && !header.classList.contains('nav-open')) {
            header.classList.add('nav-collapsed');
        }
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            if (expanded) {
                header.classList.remove('nav-open');
                header.classList.add('nav-collapsed');
            } else {
                header.classList.add('nav-open');
                header.classList.remove('nav-collapsed');
            }
            hamburger.setAttribute('aria-expanded', (!expanded).toString());
        });
    }
});
