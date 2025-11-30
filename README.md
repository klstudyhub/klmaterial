# KLMaterial Study Hub

Static portfolio + study materials hub for B.Tech CSE. Built with vanilla HTML/CSS/JS and GitHub-hosted files (replacing Firebase). Mobile-first, animated UI.

## Features
- Responsive navigation (floating pill bar on desktop, collapsible hamburger + full-width list on mobile)
- Study materials browser (GitHub API + subject filters + search + localStorage caching)
- Animated profile image with gradient glow (WebP/JPEG fallback chain)
- Seasonal animation container (extensible for effects)
- Accessible touch targets (44px min), keyboard focus outlines
- Light/Dark theme toggle with persisted preference
- Back-to-top button appears on scroll

## Materials Loading
Files stored in the repo under subject folders, fetched via GitHub Contents API. LFS-supported PDFs use raw download URLs. Results are cached for 30 minutes in `localStorage` (key: `materialsCache`) to reduce API calls and survive temporary rate limits.

## Image Fallback
Homepage profile uses a `<picture>` element with sources:
1. Preferred WebP: `assets/images/home-profile.webp`
2. JPEG fallback: `assets/images/home-profile.jpg`
3. Final fallback: root `profile.jpg`

Replace either image without changing markup; keep size < 300KB for mobile performance.

## Navigation Behavior
- Desktop: centered floating header with pill links.
- Mobile (<768px): sticky header; collapsed by default with a hamburger toggle; expanded shows full-width vertical pills.

## Tech Stack
- HTML5, CSS3 (custom animations, gradients)
- Vanilla JavaScript (GitHub API fetch, UI interactions)
- GitHub Pages hosting
- Optional analytics (Google tag)

## Accessibility & Performance
- High-contrast accent color `#00d4ff`
- Focus-friendly layout (links large and clearly separated)
- Smooth scroll & reduced motion friendly (animation durations moderated on mobile)

## Contributing
Open an issue or fork the repo. Keep styles modular by extending existing commented sections inside `style.css`. Test on mobile viewport (375px–430px width) before submitting.

## Future Ideas
- Pre-fetch next subject folder in background for perceived speed
- Small offline manifest / PWA integration for read-only materials
- Skeleton shimmer for cards while loading cache refresh

---
Maintained by Praveen Reddy.
