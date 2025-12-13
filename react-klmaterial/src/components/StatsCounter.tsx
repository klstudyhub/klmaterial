import { useCounter, useScrollTrigger } from '../hooks/useAnimations';
import './StatsCounter.css';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: string;
}

interface StatsCounterProps {
  stats: Stat[];
}

const StatsCounter = ({ stats }: StatsCounterProps) => {
  const { ref, isVisible } = useScrollTrigger({ threshold: 0.3 });

  return (
    <div ref={ref} className="stats-counter">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            stat={stat}
            isVisible={isVisible}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  );
};

interface StatCardProps {
  stat: Stat;
  isVisible: boolean;
  delay: number;
}

const StatCard = ({ stat, isVisible, delay }: StatCardProps) => {
  const count = useCounter({
    end: stat.value,
    duration: 2000,
    enabled: isVisible,
  });

  return (
    <div
      className="stat-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {stat.icon && <div className="stat-icon">{stat.icon}</div>}
      <div className="stat-value">
        {stat.prefix}
        {count}
        {stat.suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
};

export default StatsCounter;
