import { useEffect, useRef, ReactNode } from 'react';
import './TextReveal.css';

interface TextRevealProps {
  children: string;
  delay?: number;
  speed?: number;
  className?: string;
}

export const TextReveal = ({ children, delay = 0, speed = 50, className = '' }: TextRevealProps) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chars = element.querySelectorAll('.text-char');
            chars.forEach((char, index) => {
              setTimeout(() => {
                char.classList.add('revealed');
              }, delay * 1000 + index * speed);
            });
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, speed]);

  const chars = children.split('').map((char, index) => (
    <span key={index} className="text-char">
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <span ref={textRef} className={`text-reveal ${className}`}>
      {chars}
    </span>
  );
};

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
}

export const GlitchText = ({ children, className = '' }: GlitchTextProps) => {
  return (
    <span className={`glitch-text ${className}`} data-text={children}>
      {children}
    </span>
  );
};

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export const Typewriter = ({ text, speed = 100, delay = 0, className = '', cursor = true }: TypewriterProps) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let index = 0;
            
            setTimeout(() => {
              const interval = setInterval(() => {
                if (index < text.length) {
                  element.textContent = text.slice(0, index + 1);
                  index++;
                } else {
                  clearInterval(interval);
                  if (cursor) {
                    element.classList.add('typing-complete');
                  }
                }
              }, speed);
            }, delay * 1000);
            
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [text, speed, delay, cursor]);

  return (
    <span ref={textRef} className={`typewriter ${cursor ? 'with-cursor' : ''} ${className}`}></span>
  );
};

export default { TextReveal, GlitchText, Typewriter };
