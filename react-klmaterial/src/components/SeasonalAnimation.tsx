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
    const snowflakes = ['❄', '❅', '❆'];
    const count = 60;
    
    for (let i = 0; i < count; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
      
      snowflake.style.left = Math.random() * 100 + '%';
      
      const speed = Math.random();
      const duration = isMobile 
        ? (speed < 0.3 ? Math.random() * 5 + 20 : speed < 0.7 ? Math.random() * 8 + 12 : Math.random() * 5 + 8) 
        : (speed < 0.3 ? Math.random() * 3 + 12 : speed < 0.7 ? Math.random() * 4 + 7 : Math.random() * 3 + 4);
      
      snowflake.style.animationDuration = duration + 's, ' + (Math.random() * 2 + 2) + 's';
      snowflake.style.animationDelay = Math.random() * 8 + 's, ' + Math.random() * 2 + 's';
      
      const size = Math.random();
      snowflake.style.fontSize = (size * 1.2 + 0.3) + 'em';
      snowflake.style.opacity = (size * 0.6 + 0.4).toString();
      
      snowflake.setAttribute('data-drift', Math.floor(Math.random() * 3).toString());
      
      container.appendChild(snowflake);
    }
  };

  const createPetals = (container: HTMLElement, isMobile: boolean) => {
    const petals = ['🌸', '🌺', '🌼'];
    const count = 30;
    
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = isMobile ? (Math.random() * 8 + 12) + 's' : (Math.random() * 4 + 8) + 's';
      petal.style.animationDelay = Math.random() * 5 + 's';
      petal.style.fontSize = (Math.random() * 0.8 + 0.6) + 'em';
      container.appendChild(petal);
    }
  };

  const createFireflies = (container: HTMLElement, isMobile: boolean) => {
    const count = isMobile ? 15 : 25;
    
    for (let i = 0; i < count; i++) {
      const firefly = document.createElement('div');
      firefly.className = 'firefly';
      firefly.style.left = Math.random() * 100 + '%';
      firefly.style.top = Math.random() * 100 + '%';
      firefly.style.animationDuration = (Math.random() * 3 + 2) + 's';
      firefly.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(firefly);
    }
  };

  const createLeaves = (container: HTMLElement, isMobile: boolean) => {
    const leaves = ['🍁', '🍂'];
    const count = 40;
    
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.animationDuration = isMobile ? (Math.random() * 8 + 10) + 's' : (Math.random() * 4 + 6) + 's';
      leaf.style.animationDelay = Math.random() * 5 + 's';
      leaf.style.fontSize = (Math.random() * 0.8 + 1) + 'em';
      container.appendChild(leaf);
    }
  };

  return <div id="season-container" className="season-container"></div>;
};

export default SeasonalAnimation;
