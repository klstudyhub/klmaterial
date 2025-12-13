import { ReactNode, CSSProperties } from 'react';
import './GlassCard.css';

interface GlassCardProps {
  children: ReactNode;
  blur?: number;
  opacity?: number;
  borderGradient?: boolean;
  hover?: boolean;
  className?: string;
  style?: CSSProperties;
}

const GlassCard = ({ 
  children, 
  blur = 10, 
  opacity = 0.1, 
  borderGradient = true,
  hover = true,
  className = '',
  style
}: GlassCardProps) => {
  const cardStyle: CSSProperties = {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    background: `rgba(255, 255, 255, ${opacity})`,
    ...style
  };

  return (
    <div 
      className={`glass-card ${borderGradient ? 'glass-card-gradient' : ''} ${hover ? 'glass-card-hover' : ''} ${className}`}
      style={cardStyle}
    >
      {borderGradient && <div className="glass-card-border"></div>}
      <div className="glass-card-content">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
