import { MouseEvent, ReactNode, CSSProperties } from 'react';
import './MicroInteractions.css';

interface RippleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const RippleButton = ({ children, onClick, className = '', style, variant = 'primary' }: RippleButtonProps) => {
  const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple-effect');

    const existingRipple = button.querySelector('.ripple-effect');
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    onClick?.();
  };

  return (
    <button
      className={`ripple-button ripple-button-${variant} ${className}`}
      onClick={handleClick}
      style={style}
    >
      {children}
    </button>
  );
};

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export const Magnetic = ({ children, strength = 0.3, className = '' }: MagneticProps) => {
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
  };

  return (
    <div
      className={`magnetic-element ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

interface FloatingProps {
  children: ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export const Floating = ({ children, distance = 20, duration = 3, delay = 0, className = '' }: FloatingProps) => {
  const style: CSSProperties = {
    animation: `float ${duration}s ease-in-out ${delay}s infinite`,
    '--float-distance': `${distance}px`,
  } as CSSProperties;

  return (
    <div className={`floating-element ${className}`} style={style}>
      {children}
    </div>
  );
};

interface ShineProps {
  children: ReactNode;
  color?: string;
  duration?: number;
  className?: string;
}

export const Shine = ({ children, color = 'rgba(255, 255, 255, 0.6)', duration = 3, className = '' }: ShineProps) => {
  const style: CSSProperties = {
    '--shine-color': color,
    '--shine-duration': `${duration}s`,
  } as CSSProperties;

  return (
    <div className={`shine-element ${className}`} style={style}>
      {children}
      <div className="shine-overlay"></div>
    </div>
  );
};

export default { RippleButton, Magnetic, Floating, Shine };
