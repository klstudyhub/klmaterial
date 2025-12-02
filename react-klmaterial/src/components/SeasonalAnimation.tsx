import { useEffect, useState } from 'react';
import './SeasonalAnimation.css';

const SeasonalAnimation = () => {
  const [season, setSeason] = useState('winter');

  useEffect(() => {
    // Determine season based on current month
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) setSeason('spring');
    else if (month >= 5 && month <= 7) setSeason('summer');
    else if (month >= 8 && month <= 10) setSeason('autumn');
    else setSeason('winter');
  }, []);

  useEffect(() => {
    const container = document.getElementById('season-container');
    if (!container) return;

    // Clear previous animations
    container.innerHTML = '';

    const isMobile = window.innerWidth <= 768;

    switch (season) {
      case 'winter':
        createSnowfall(container, isMobile);
        break;
      case 'spring':
        createPetals(container, isMobile);
        break;
      case 'summer':
        createFireflies(container, isMobile);
        break;
      case 'autumn':
        createLeaves(container, isMobile);
        break;
    }
  }, [season]);

  const createSnowfall = (container: HTMLElement, isMobile: boolean) => {
    const count = isMobile ? 20 : 150; // More snowflakes for realistic effect
    
    // Create depth layers for 3D realistic effect
    const layers = [
      { depth: 'far', count: Math.floor(count * 0.25), speed: [30, 45], size: [0.4, 0.7], opacity: [0.2, 0.4], blur: 3 },
      { depth: 'mid', count: Math.floor(count * 0.45), speed: [18, 30], size: [0.7, 1.2], opacity: [0.4, 0.7], blur: 1.5 },
      { depth: 'near', count: Math.floor(count * 0.3), speed: [10, 18], size: [1.2, 2.2], opacity: [0.7, 1.0], blur: 0 }
    ];
    
    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = `snowflake snowflake-${layer.depth}`;
        
        // Create snowflake shape (6-pointed star)
        const shapes = ['❄', '❅', '❆', '✻', '✼', '❉'];
        snowflake.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Random horizontal position
        snowflake.style.left = Math.random() * 100 + '%';
        
        // Varied fall duration based on layer depth
        const duration = Math.random() * (layer.speed[1] - layer.speed[0]) + layer.speed[0];
        
        // Wind sway (gentle horizontal drift)
        const swayDuration = Math.random() * 3 + 4;
        
        // Rotation for tumbling effect
        const rotateDuration = Math.random() * 4 + 3;
        
        snowflake.style.animationDuration = `${duration}s, ${swayDuration}s, ${rotateDuration}s`;
        
        // Stagger start times
        const fallDelay = Math.random() * duration;
        const swayDelay = Math.random() * 3;
        const rotateDelay = Math.random() * 3;
        
        snowflake.style.animationDelay = `${fallDelay}s, ${swayDelay}s, ${rotateDelay}s`;
        
        // Size based on layer depth
        const size = Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0];
        snowflake.style.fontSize = size + 'em';
        
        // Opacity based on layer depth
        const opacity = Math.random() * (layer.opacity[1] - layer.opacity[0]) + layer.opacity[0];
        snowflake.style.opacity = opacity.toString();
        
        // Add blur for depth perception
        if (layer.blur > 0) {
          snowflake.style.filter = `blur(${layer.blur}px)`;
        }
        
        // Different drift patterns
        const driftPattern = Math.floor(Math.random() * 6);
        snowflake.setAttribute('data-drift', driftPattern.toString());
        
        // Realistic glow effect
        const shadowIntensity = opacity * 0.9;
        snowflake.style.textShadow = `
          0 0 ${size * 2}px rgba(255, 255, 255, ${shadowIntensity}),
          0 0 ${size * 5}px rgba(200, 230, 255, ${shadowIntensity * 0.6}),
          0 0 ${size * 8}px rgba(180, 220, 255, ${shadowIntensity * 0.3})
        `;
        
        container.appendChild(snowflake);
      }
    });
    
    // Add ambient snow particles in background
    if (!isMobile) {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'snow-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 30) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.opacity = (Math.random() * 0.2 + 0.1).toString();
        container.appendChild(particle);
      }
    }
  };

  const createPetals = (container: HTMLElement, isMobile: boolean) => {
    const count = isMobile ? 15 : 50;
    const petals = ['🌸', '🌺', '🌼', '🌷', '🏵️'];
    
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
      
      petal.style.left = Math.random() * 100 + '%';
      const duration = Math.random() * 8 + 10;
      const swayDuration = Math.random() * 3 + 4;
      const rotateDuration = Math.random() * 5 + 5;
      
      petal.style.animationDuration = `${duration}s, ${swayDuration}s, ${rotateDuration}s`;
      petal.style.animationDelay = `${Math.random() * 5}s, ${Math.random() * 2}s, ${Math.random() * 2}s`;
      
      const size = Math.random() * 0.8 + 0.8;
      petal.style.fontSize = size + 'em';
      petal.style.opacity = (Math.random() * 0.4 + 0.6).toString();
      
      // Soft pink glow
      petal.style.filter = `drop-shadow(0 0 ${size * 5}px rgba(255, 182, 193, 0.6))`;
      
      container.appendChild(petal);
    }
  };

  const createFireflies = (container: HTMLElement, isMobile: boolean) => {
    const count = isMobile ? 10 : 40;
    
    for (let i = 0; i < count; i++) {
      const firefly = document.createElement('div');
      firefly.className = 'firefly';
      
      // Random starting position
      firefly.style.left = Math.random() * 100 + '%';
      firefly.style.top = Math.random() * 100 + '%';
      
      // Varied glow sizes
      const size = Math.random() * 4 + 3;
      firefly.style.width = size + 'px';
      firefly.style.height = size + 'px';
      
      // Multiple animations for realistic movement
      const floatDuration = Math.random() * 8 + 8;
      const glowDuration = Math.random() * 2 + 1.5;
      
      firefly.style.animationDuration = `${floatDuration}s, ${glowDuration}s`;
      firefly.style.animationDelay = `${Math.random() * 5}s, ${Math.random() * 2}s`;
      
      // Warm yellow-green glow
      firefly.style.background = `radial-gradient(circle, rgba(255, 255, 100, 0.9), transparent)`;
      firefly.style.boxShadow = `
        0 0 ${size * 2}px rgba(255, 255, 100, 0.8),
        0 0 ${size * 4}px rgba(180, 255, 100, 0.6),
        0 0 ${size * 6}px rgba(150, 255, 80, 0.4)
      `;
      
      container.appendChild(firefly);
    }
  };

  const createLeaves = (container: HTMLElement, isMobile: boolean) => {
    const leaves = ['🍁', '🍂', '🍃'];
    const count = isMobile ? 20 : 60;
    
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.innerHTML = leaves[Math.floor(Math.random() * leaves.length)];
      
      leaf.style.left = Math.random() * 100 + '%';
      
      // Varied fall speeds and patterns
      const duration = Math.random() * 10 + 12;
      const swayDuration = Math.random() * 4 + 3;
      const rotateDuration = Math.random() * 6 + 4;
      const spinDuration = Math.random() * 3 + 2;
      
      leaf.style.animationDuration = `${duration}s, ${swayDuration}s, ${rotateDuration}s, ${spinDuration}s`;
      leaf.style.animationDelay = `${Math.random() * 8}s, ${Math.random() * 2}s, ${Math.random() * 2}s, ${Math.random() * 2}s`;
      
      const size = Math.random() * 1.0 + 1.0;
      leaf.style.fontSize = size + 'em';
      leaf.style.opacity = (Math.random() * 0.3 + 0.7).toString();
      
      // Autumn warm glow
      leaf.style.filter = `drop-shadow(0 0 ${size * 3}px rgba(255, 140, 0, 0.4))`;
      
      container.appendChild(leaf);
    }
  };

  return <div id="season-container" className="season-container"></div>;
};

export default SeasonalAnimation;
