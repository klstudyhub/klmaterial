import React, { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';
import './InstallPrompt.css';

const InstallPrompt: React.FC = () => {
  const { canInstall, promptInstall, isOnline } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show prompt after 30 seconds if user hasn't dismissed it
    const timer = setTimeout(() => {
      if (canInstall && !dismissed) {
        setShowPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [canInstall, dismissed]);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    // Remember dismissal for 7 days
    localStorage.setItem('pwa-dismissed', Date.now().toString());
  };

  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwa-dismissed');
    if (dismissedTime) {
      const daysSinceDismissal = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissal < 7) {
        setDismissed(true);
      } else {
        localStorage.removeItem('pwa-dismissed');
      }
    }
  }, []);

  if (!canInstall || !showPrompt) {
    return null;
  }

  return (
    <>
      {/* Floating Install Button */}
      <div className="install-prompt-floating">
        <button onClick={handleInstall} className="install-btn-floating" aria-label="Install App">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>

      {/* Bottom Banner Prompt */}
      <div className="install-prompt-banner">
        <div className="install-prompt-content">
          <div className="install-prompt-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="url(#gradient)" />
              <path d="M20 10v12m0 0l-4-4m4 4l4-4M10 26h20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#0066ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="install-prompt-text">
            <h3>Install KL Material</h3>
            <p>Get instant access to materials offline. Add to your home screen!</p>
          </div>

          <div className="install-prompt-actions">
            <button onClick={handleInstall} className="install-btn-primary">
              Install
            </button>
            <button onClick={handleDismiss} className="install-btn-secondary">
              Not now
            </button>
          </div>
        </div>

        {/* Offline Indicator */}
        {!isOnline && (
          <div className="offline-indicator">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
              <path d="M8 4c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1s1-.45 1-1V5c0-.55-.45-1-1-1zm0 6c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
            </svg>
            <span>You're offline - App is cached and ready!</span>
          </div>
        )}
      </div>
    </>
  );
};

export default InstallPrompt;
