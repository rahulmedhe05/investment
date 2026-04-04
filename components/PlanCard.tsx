'use client';

import { motion } from 'framer-motion';
import { formatINR, calculateMaturityValue } from '@/lib/calculateGrowth';

interface PlanCardProps {
  plan: {
    id: number;
    name: string;
    amount: number;
    annualRate: number;
    lockMonths: number;
    lockDays: number;
    description: string;
    color: string;
  };
  onSelect?: (planId: number) => void;
  selected?: boolean;
}

export default function PlanCard({ plan, onSelect, selected }: PlanCardProps) {
  const maturityValue = calculateMaturityValue(plan.amount, plan.annualRate, plan.lockDays);
  const totalGain = maturityValue - plan.amount;
  const returnPercent = (plan.annualRate * 100).toFixed(0);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(plan.id)}
      className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 ${
        selected
          ? 'border-emerald-500/70 bg-emerald-500/10'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      } backdrop-blur-sm p-6`}
    >
      {/* Gradient top accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.color}`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{plan.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${plan.color} text-black`}>
          {returnPercent}% p.a.
        </span>
      </div>

      {/* Investment amount */}
      <div className="mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Investment Amount</p>
        <p className="text-3xl font-bold text-white">{formatINR(plan.amount)}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-black/30 rounded-xl p-3">
          <p className="text-gray-500 text-xs mb-1">Lock-in Period</p>
          <p className="text-white font-semibold">{plan.lockMonths} Months</p>
        </div>
        <div className="bg-black/30 rounded-xl p-3">
          <p className="text-gray-500 text-xs mb-1">Annual Return</p>
          <p className="text-emerald-400 font-semibold">{returnPercent}%</p>
        </div>
        <div className="bg-black/30 rounded-xl p-3">
          <p className="text-gray-500 text-xs mb-1">Maturity Value</p>
          <p className="text-cyan-400 font-semibold">{formatINR(Math.round(maturityValue))}</p>
        </div>
        <div className="bg-black/30 rounded-xl p-3">
          <p className="text-gray-500 text-xs mb-1">Total Gain</p>
          <p className="text-emerald-400 font-semibold">+{formatINR(Math.round(totalGain))}</p>
        </div>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r ${plan.color} text-black hover:opacity-90`}
      >
        {selected ? '✓ Selected' : 'Start Simulation'}
      </motion.button>
    </motion.div>
  );
}
