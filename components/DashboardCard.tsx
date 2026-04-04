'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
  animate?: boolean;
  delay?: number;
}

function useAnimatedNumber(target: number, duration: number = 1500) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(target * eased));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return current;
}

export default function DashboardCard({
  title,
  value,
  prefix = '',
  suffix = '',
  change,
  changeType = 'neutral',
  icon,
  animate = false,
  delay = 0,
}: DashboardCardProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const animatedValue = useAnimatedNumber(animate ? numericValue : numericValue, animate ? 1500 : 0);

  const displayValue = animate
    ? `${prefix}${animatedValue.toLocaleString('en-IN')}${suffix}`
    : `${prefix}${typeof value === 'number' ? value.toLocaleString('en-IN') : value}${suffix}`;

  const changeColors = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>

      <p className="text-2xl md:text-3xl font-bold text-white mb-2">{displayValue}</p>

      {change && (
        <p className={`text-sm font-medium ${changeColors[changeType]}`}>
          {changeType === 'positive' && '↑ '}
          {changeType === 'negative' && '↓ '}
          {change}
        </p>
      )}
    </motion.div>
  );
}
