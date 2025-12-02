import { useEffect, useState } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
  }, []);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => {
              onComplete?.();
            }, 800);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${isComplete ? 'loading-complete' : ''}`}>
      <div className="loading-content">
        {/* Animated Logo */}
        <div className="loading-logo">
          <div className="logo-ring logo-ring-1"></div>
          <div className="logo-ring logo-ring-2"></div>
          <div className="logo-ring logo-ring-3"></div>
          <div className="logo-center">
            <span className="logo-text">KL</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          <span className="loading-letter" style={{ animationDelay: '0s' }}>L</span>
          <span className="loading-letter" style={{ animationDelay: '0.1s' }}>o</span>
          <span className="loading-letter" style={{ animationDelay: '0.2s' }}>a</span>
          <span className="loading-letter" style={{ animationDelay: '0.3s' }}>d</span>
          <span className="loading-letter" style={{ animationDelay: '0.4s' }}>i</span>
          <span className="loading-letter" style={{ animationDelay: '0.5s' }}>n</span>
          <span className="loading-letter" style={{ animationDelay: '0.6s' }}>g</span>
          <span className="loading-dots">
            <span style={{ animationDelay: '0s' }}>.</span>
            <span style={{ animationDelay: '0.2s' }}>.</span>
            <span style={{ animationDelay: '0.4s' }}>.</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="loading-progress-container">
          <div className="loading-progress-bar">
            <div 
              className="loading-progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
            <div className="loading-progress-glow"></div>
          </div>
          <div className="loading-percentage">{Math.floor(progress)}%</div>
        </div>

        {/* Particles */}
        {!isMobile && (
          <div className="loading-particles">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="loading-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
