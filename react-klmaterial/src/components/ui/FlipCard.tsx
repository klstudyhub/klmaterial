import { useState, ReactNode } from 'react';
import './FlipCard.css';

interface FlipCardProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  className?: string;
}

const FlipCard = ({ frontContent, backContent, className = '' }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`flip-card ${isFlipped ? 'flipped' : ''} ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsFlipped(!isFlipped);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Flip card"
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">{frontContent}</div>
        <div className="flip-card-back">{backContent}</div>
      </div>
    </div>
  );
};

export default FlipCard;
