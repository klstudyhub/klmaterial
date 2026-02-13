/**
 * Advanced Seasonal Animations System
 * Creates sophisticated particle effects for each season
 * Optimized for performance across all devices
 */

// Determine current season
function getSeason() {
  const month = new Date().getMonth() + 1;
  if (month === 12 || month === 1 || month === 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  return 'autumn';
}

// Check if device performance is limited
function isLowPerformanceDevice() {
  return window.innerWidth < 600 || 
         (navigator.deviceMemory && navigator.deviceMemory < 4);
}

// Main animation initialization
function createSeasonalAnimation() {
  const container = document.getElementById('seasonalAnimation');
  if (!container) return;

  const season = getSeason();
  container.innerHTML = '';

  // Reduce particle count on low-performance devices
  const perfMultiplier = isLowPerformanceDevice() ? 0.5 : 1;

  switch (season) {
    case 'winter':
      createSnowfall(container, Math.floor(50 * perfMultiplier));
      break;
    case 'spring':
      createPetals(container, Math.floor(40 * perfMultiplier));
      break;
    case 'summer':
      createFireflies(container, Math.floor(25 * perfMultiplier));
      break;
    case 'autumn':
      createLeaves(container, Math.floor(45 * perfMultiplier));
      break;
  }
}

/**
 * Winter: Advanced Snowfall with varied particles
 */
function createSnowfall(container, count) {
  const snowflakes = ['❄', '❅', '❆', '✻', '✼'];
  
  for (let i = 0; i < count; i++) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
    
    const randomLeft = Math.random() * 100;
    const randomSize = 0.8 + Math.random() * 0.6; // 0.8 - 1.4
    const duration = 8 + Math.random() * 14; // 8-22 seconds
    const delay = Math.random() * 5; // Random start delay
    
    snowflake.style.left = randomLeft + '%';
    snowflake.style.fontSize = (1 * randomSize) + 'em';
    snowflake.style.opacity = 0.4 + Math.random() * 0.6; // 0.4-1.0
    snowflake.style.animationDuration = duration + 's';
    snowflake.style.animationDelay = delay + 's';
    snowflake.style.animationTimingFunction = 'linear';
    
    container.appendChild(snowflake);
  }
}

/**
 * Spring: Graceful falling petals with swirling motion
 */
function createPetals(container, count) {
  const petals = ['🌸', '🌺', '🌼', '🌻', '💐', '🌷'];
  
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    
    const randomLeft = Math.random() * 100;
    const duration = 6 + Math.random() * 10; // 6-16 seconds
    const delay = Math.random() * 8;
    
    petal.style.left = randomLeft + '%';
    petal.style.fontSize = (1.1 + Math.random() * 0.4) + 'em';
    petal.style.opacity = 0.5 + Math.random() * 0.5;
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = delay + 's';
    petal.style.animationTimingFunction = 'ease-in-out';
    
    container.appendChild(petal);
  }
}

/**
 * Summer: Glowing fireflies with complex motion patterns
 */
function createFireflies(container, count) {
  for (let i = 0; i < count; i++) {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';
    
    const randomLeft = Math.random() * 100;
    const randomStartHeight = Math.random() * 50 + 20; // Start 20-70% down
    const duration = 3 + Math.random() * 6; // 3-9 seconds
    const delay = Math.random() * 10;
    
    firefly.style.left = randomLeft + '%';
    firefly.style.top = randomStartHeight + '%';
    firefly.style.width = (2 + Math.random() * 3) + 'px'; // 2-5px
    firefly.style.height = firefly.style.width;
    firefly.style.animationDuration = duration + 's';
    firefly.style.animationDelay = delay + 's';
    firefly.style.animationTimingFunction = 'ease-in-out';
    
    // Add color variation
    const hue = 45 + Math.random() * 15; // Gold to orange hues
    firefly.style.filter = `hue-rotate(${hue}deg)`;
    
    container.appendChild(firefly);
  }
}

/**
 * Autumn: Leaves with complex swaying and rotation
 */
function createLeaves(container, count) {
  const leaves = ['🍂', '🍁', '🍃', '🌿', '🌾'];
  
  for (let i = 0; i < count; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
    
    const randomLeft = Math.random() * 100;
    const duration = 7 + Math.random() * 13; // 7-20 seconds (complex motion)
    const delay = Math.random() * 6;
    
    leaf.style.left = randomLeft + '%';
    leaf.style.fontSize = (1.2 + Math.random() * 0.5) + 'em';
    leaf.style.opacity = 0.6 + Math.random() * 0.4;
    leaf.style.animationDuration = duration + 's';
    leaf.style.animationDelay = delay + 's';
    leaf.style.animationTimingFunction = 'ease-in-out';
    
    container.appendChild(leaf);
  }
}

/**
 * Counter animation for stats section
 * Animates numbers from 0 to target value
 */
function animateCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const element = entry.target;
        const target = parseInt(element.dataset.target);
        const suffix = element.dataset.suffix || '';
        const duration = 2000; // 2 seconds animation
        const startTime = Date.now();
        
        element.dataset.animated = 'true';
        
        function updateCount() {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const eased = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
          
          const current = Math.floor(target * eased);
          element.textContent = current + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          }
        }
        
        updateCount();
        observer.unobserve(element);
      }
    });
  }, observerOptions);
  
  statNumbers.forEach(num => observer.observe(num));
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    createSeasonalAnimation();
    animateCounter();
  });
} else {
  createSeasonalAnimation();
  animateCounter();
}

// Reinitialize animations on window resize (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const container = document.getElementById('seasonalAnimation');
    if (container) {
      createSeasonalAnimation();
    }
  }, 250);
});
