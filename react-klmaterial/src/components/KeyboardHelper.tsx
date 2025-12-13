import { useEffect, useState } from 'react';
import './KeyboardHelper.css';

const KeyboardHelper = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => setIsVisible(false), 5000);

    // Show again on any key press
    const handleKeyPress = () => {
      setIsVisible(true);
      clearTimeout(timer);
      setTimeout(() => setIsVisible(false), 3000);
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="keyboard-helper">
      <div className="keyboard-hint">
        <kbd>Ctrl</kbd> + <kbd>K</kbd>
        <span>Quick Navigation</span>
      </div>
    </div>
  );
};

export default KeyboardHelper;
