'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PlanCard from '@/components/PlanCard';
import GrowthChart from '@/components/GrowthChart';
import { INVESTMENT_PLANS, formatINR } from '@/lib/calculateGrowth';

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  // Demo chart data starts 6 months ago
  const demoStartDate = new Date();
  demoStartDate.setMonth(demoStartDate.getMonth() - 6);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Simulation Platform — Not Real Investment
            </span>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Track Your{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent neon-green">
                Wealth Growth
              </span>
              <br />
              Visually
            </h1>

            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Simulate investment growth with real compound interest formulas.
              Watch your money grow day by day with beautiful analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-xl text-lg hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25"
                >
                  Start Simulation →
                </motion.button>
              </Link>
              <Link href="#plans">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl text-lg hover:bg-white/10 transition-all"
                >
                  View Plans
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { label: 'Simulated Returns', value: 'Up to 21%' },
              { label: 'Growth Tracking', value: 'Daily' },
              { label: 'Investment Plans', value: '2 Plans' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Investment Plans Section */}
      <section id="plans" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Investment{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Simulation Plans
              </span>
            </h2>
            <p className="text-gray-400">Choose a plan to simulate your investment growth</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {INVESTMENT_PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <PlanCard
                  plan={plan}
                  onSelect={setSelectedPlan}
                  selected={selectedPlan === plan.id}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Chart Preview Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Watch Your Investment{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Grow
              </span>
            </h2>
            <p className="text-gray-400">Interactive growth simulation using real compound interest formulas</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-400 text-sm">Simulated Growth — ₹1,00,000 @ 21% p.a.</p>
                <p className="text-white text-xl font-bold mt-1">
                  {formatINR(Math.round(100000 * Math.pow(1 + 0.21 / 365, 180)))} after 6 months
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold">
                +{((Math.pow(1 + 0.21 / 365, 180) - 1) * 100).toFixed(1)}%
              </span>
            </div>
            <GrowthChart
              investedAmount={100000}
              annualRate={0.21}
              startDate={demoStartDate.toISOString()}
              totalDays={180}
              color="#10b981"
              height={280}
            />
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-8">
            <p className="text-amber-400 text-lg font-semibold mb-2">⚠️ Important Disclaimer</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              <strong className="text-gray-300">Wealthora is for simulation and tracking purposes only.</strong>{' '}
              No real money is involved. All returns shown are simulated using compound interest formulas
              and do not represent actual investment returns. No guaranteed returns. Past simulation
              performance does not indicate future results. This is not a regulated financial service.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 text-center text-gray-600 text-sm">
        <p>© 2024 Wealthora. Simulation platform — Not a real investment service.</p>
      </footer>
    </main>
  );
}
