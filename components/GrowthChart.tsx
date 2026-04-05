'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { generateGrowthData, formatINR } from '@/lib/calculateGrowth';

interface GrowthChartProps {
  investedAmount: number;
  annualRate: number;
  startDate: string;
  totalDays: number;
  color?: string;
  showGrid?: boolean;
  height?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-white/20 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold">{formatINR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function GrowthChart({
  investedAmount,
  annualRate,
  startDate,
  totalDays,
  color = '#10b981',
  showGrid = true,
  height = 300,
}: GrowthChartProps) {
  const data = useMemo(
    () => generateGrowthData(investedAmount, annualRate, startDate, totalDays),
    [investedAmount, annualRate, startDate, totalDays]
  );

  const formatYAxis = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id={`colorGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        )}
        <XAxis
          dataKey="date"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={formatYAxis}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={investedAmount}
          stroke="rgba(255,255,255,0.15)"
          strokeDasharray="4 4"
          label={{ value: 'Principal', fill: '#6b7280', fontSize: 10 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#colorGradient-${color.replace('#', '')})`}
          dot={false}
          activeDot={{ r: 5, strokeWidth: 0, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
