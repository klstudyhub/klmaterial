import { useState, useEffect, useRef } from 'react';

interface UseCounterProps {
  end: number;
  duration?: number;
  start?: number;
  enabled?: boolean;
}

export const useCounter = ({
  end,
  duration = 2000,
  start = 0,
  enabled = true,
}: UseCounterProps) => {
  const [count, setCount] = useState(start);
  const counterRef = useRef<number>(start);

  useEffect(() => {
    if (!enabled) return;

    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const updateCounter = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const progress = 1 - remaining / duration;
      
      const current = Math.floor(progress * (end - start) + start);
      counterRef.current = current;
      setCount(current);

      if (remaining > 0) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [end, duration, start, enabled]);

  return count;
};

interface UseScrollTriggerProps {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollTrigger = ({
  threshold = 0.1,
  rootMargin = '0px',
}: UseScrollTriggerProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, isVisible]);

  return { ref, isVisible };
};

export const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
};
