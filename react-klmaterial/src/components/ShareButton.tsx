import { ReactNode } from 'react';
import './ShareButton.css';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
  children?: ReactNode;
}

const ShareButton = ({ title, text, url, className = '', children }: ShareButtonProps) => {
  const handleShare = async () => {
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          fallbackShare(url);
        }
      }
    } else {
      fallbackShare(url);
    }
  };

  const fallbackShare = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      // Show success notification (would need toast context)
      const event = new CustomEvent('showToast', {
        detail: { message: 'Link copied to clipboard!', type: 'success' },
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button onClick={handleShare} className={`share-button ${className}`}>
      {children || (
        <>
          <span className="share-icon">🔗</span>
          <span>Share</span>
        </>
      )}
    </button>
  );
};

export default ShareButton;
