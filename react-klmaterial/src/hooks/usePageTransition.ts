import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const location = useLocation();
  const prevLocation = useRef(location);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track page views
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname,
      });
    }

    prevLocation.current = location;
  }, [location]);

  return {
    location,
    prevLocation: prevLocation.current,
  };
};

export const useRouteDirection = () => {
  const routes = ['/', '/materials', '/roadmap', '/about', '/contact'];
  const location = useLocation();
  const prevLocation = useRef(location);

  const getDirection = () => {
    const currentIndex = routes.indexOf(location.pathname);
    const prevIndex = routes.indexOf(prevLocation.current.pathname);

    if (currentIndex > prevIndex) {
      return 'forward';
    } else if (currentIndex < prevIndex) {
      return 'backward';
    }
    return 'none';
  };

  useEffect(() => {
    prevLocation.current = location;
  }, [location]);

  return getDirection();
};
