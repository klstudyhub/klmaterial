import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 Configuration (set VITE_GA_ID in .env)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - vite client types provide import.meta.env
const GA_MEASUREMENT_ID: string | undefined = import.meta?.env?.VITE_GA_ID || undefined;

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;

  if (!GA_MEASUREMENT_ID) {
    console.warn('GA: VITE_GA_ID is not set. Analytics disabled.');
    return;
  }

  // If gtag already present (e.g., injected via index.html/Helmet), just configure
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
    return;
  }

  // Load GA4 script and initialize
  const existing = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id="]`);
  if (!existing) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });

  console.log('📊 Page View:', path);
};

// Track custom events
export const trackEvent = ({ action, category, label, value }: AnalyticsEvent) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });

  console.log('📊 Event:', { action, category, label, value });
};

// Track specific actions
export const analytics = {
  // Material downloads
  trackDownload: (fileName: string, category: string) => {
    trackEvent({
      action: 'download',
      category: 'Materials',
      label: `${category} - ${fileName}`,
    });
  },

  // Search queries
  trackSearch: (query: string, resultsCount: number) => {
    trackEvent({
      action: 'search',
      category: 'Search',
      label: query,
      value: resultsCount,
    });
  },

  // Navigation clicks
  trackNavigation: (destination: string) => {
    trackEvent({
      action: 'navigation_click',
      category: 'Navigation',
      label: destination,
    });
  },

  // Button clicks
  trackButtonClick: (buttonName: string, location: string) => {
    trackEvent({
      action: 'button_click',
      category: 'Engagement',
      label: `${location} - ${buttonName}`,
    });
  },

  // Social media clicks
  trackSocialClick: (platform: string) => {
    trackEvent({
      action: 'social_click',
      category: 'Social Media',
      label: platform,
    });
  },

  // External links
  trackExternalLink: (url: string, linkText: string) => {
    trackEvent({
      action: 'external_link',
      category: 'Outbound',
      label: `${linkText} - ${url}`,
    });
  },

  // PWA install
  trackPWAInstall: () => {
    trackEvent({
      action: 'pwa_install',
      category: 'PWA',
      label: 'App Installed',
    });
  },

  // Errors
  trackError: (errorMessage: string, errorStack?: string) => {
    trackEvent({
      action: 'error',
      category: 'Error',
      label: errorMessage,
    });

    // Also log to console in development
  if (window.location.hostname === 'localhost') {
      console.error('Error tracked:', errorMessage, errorStack);
    }
  },

  // Performance metrics
  trackPerformance: (metric: string, value: number) => {
    trackEvent({
      action: 'performance',
      category: 'Performance',
      label: metric,
      value: Math.round(value),
    });
  },

  // User engagement time
  trackEngagementTime: (page: string, timeInSeconds: number) => {
    trackEvent({
      action: 'engagement_time',
      category: 'Engagement',
      label: page,
      value: timeInSeconds,
    });
  },
};

// Hook for automatic page view tracking
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return analytics;
};

// Performance monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  // Track page load time
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (perfData) {
        analytics.trackPerformance('page_load_time', perfData.loadEventEnd - perfData.fetchStart);
        analytics.trackPerformance('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.fetchStart);
        analytics.trackPerformance('first_paint', perfData.responseEnd - perfData.fetchStart);
      }
    }, 0);
  });

  // Track Core Web Vitals
  if ('web-vital' in window || (window as any).webVitals) {

    // You can use web-vitals library here
    // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
    // Example: getCLS(reportWebVital);
    // getFID(reportWebVital);
  }
};

// Error boundary tracking
export const trackErrorBoundary = (error: Error, errorInfo: React.ErrorInfo) => {
  analytics.trackError(error.message, error.stack);
  console.error('Error Boundary:', error, errorInfo);
};

// Session tracking
let sessionStartTime = Date.now();

export const trackSessionEnd = () => {
  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
  analytics.trackEngagementTime('session', sessionDuration);
};

// Track session end on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', trackSessionEnd);
}

export default {
  initGA,
  trackPageView,
  trackEvent,
  analytics,
  useAnalytics,
  initPerformanceMonitoring,
  trackErrorBoundary,
};
