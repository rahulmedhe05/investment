'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import Navbar from '@/components/Navbar';
import DashboardCard from '@/components/DashboardCard';
import GrowthChart from '@/components/GrowthChart';
import {
  INVESTMENT_PLANS,
  calculateCurrentValue,
  calculateGrowthPercent,
  calculateDaysRemaining,
  isLocked,
  formatINR,
  Investment,
} from '@/lib/calculateGrowth';
import toast from 'react-hot-toast';

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedChart, setSelectedChart] = useState<Investment | null>(null);
  const [isInvesting, setIsInvesting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchInvestments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchInvestments = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const q = query(collection(db, 'investments'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment));
      setInvestments(data);
      if (data.length > 0) setSelectedChart(data[0]);
    } catch {
      // If Firebase not configured, use demo data
      const demoStart = new Date();
      demoStart.setDate(demoStart.getDate() - 45);
      const demoMaturity = new Date(demoStart);
      demoMaturity.setMonth(demoMaturity.getMonth() + 3);

      const demoInvestments: Investment[] = [
        {
          id: 'demo-1',
          userId: 'demo',
          planId: 1,
          planName: 'Growth Starter',
          investedAmount: 50000,
          annualRate: 0.18,
          lockMonths: 3,
          startDate: demoStart.toISOString(),
          maturityDate: demoMaturity.toISOString(),
        },
      ];
      setInvestments(demoInvestments);
      setSelectedChart(demoInvestments[0]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInvest = async (planId: number) => {
    if (!user) return;
    const plan = INVESTMENT_PLANS.find(p => p.id === planId);
    if (!plan) return;

    setIsInvesting(true);
    try {
      const startDate = new Date();
      const maturityDate = new Date();
      maturityDate.setDate(maturityDate.getDate() + plan.lockDays);

      await addDoc(collection(db, 'investments'), {
        userId: user.uid,
        planId: plan.id,
        planName: plan.name,
        investedAmount: plan.amount,
        annualRate: plan.annualRate,
        lockMonths: plan.lockMonths,
        startDate: startDate.toISOString(),
        maturityDate: maturityDate.toISOString(),
        createdAt: serverTimestamp(),
      });

      toast.success(`${plan.name} simulation started! 🎉`);
      fetchInvestments();
    } catch {
      toast.error('Could not start simulation. Check Firebase configuration.');
    } finally {
      setIsInvesting(false);
    }
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + calculateCurrentValue(inv.investedAmount, inv.annualRate, inv.startDate),
    0
  );
  const totalGrowthPercent = totalInvested > 0
    ? ((totalCurrentValue - totalInvested) / totalInvested) * 100
    : 0;
  const minDaysRemaining = investments.length > 0
    ? Math.min(...investments.map(inv => calculateDaysRemaining(inv.maturityDate)))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Investment Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email} · Simulation Mode</p>
          </div>
          <button
            onClick={logout}
            className="hidden md:block px-4 py-2 text-sm bg-white/5 border border-white/10 text-gray-400 rounded-xl hover:bg-white/10 hover:text-white transition-all"
          >
            Sign Out
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loadingData ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)
          ) : (
            <>
              <DashboardCard
                title="Total Invested"
                value={totalInvested}
                prefix="₹"
                icon="💰"
                animate
                delay={0}
              />
              <DashboardCard
                title="Current Value"
                value={Math.round(totalCurrentValue)}
                prefix="₹"
                icon="📈"
                change={`+₹${Math.round(totalCurrentValue - totalInvested).toLocaleString('en-IN')}`}
                changeType="positive"
                animate
                delay={0.1}
              />
              <DashboardCard
                title="Total Growth"
                value={totalGrowthPercent.toFixed(2)}
                suffix="%"
                icon="🚀"
                change="Since investment"
                changeType="positive"
                delay={0.2}
              />
              <DashboardCard
                title="Days Remaining"
                value={minDaysRemaining}
                suffix=" days"
                icon="⏳"
                change={investments.length > 0 ? 'Until earliest maturity' : 'No active investments'}
                changeType="neutral"
                delay={0.3}
              />
            </>
          )}
        </div>

        {/* Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Growth Trajectory</h2>
              <p className="text-gray-500 text-sm">Compound interest simulation</p>
            </div>
            {investments.length > 1 && (
              <select
                onChange={(e) => {
                  const inv = investments.find(i => i.id === e.target.value);
                  if (inv) setSelectedChart(inv);
                }}
                className="bg-black/50 border border-white/10 text-gray-400 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500/50"
              >
                {investments.map(inv => (
                  <option key={inv.id} value={inv.id}>{inv.planName}</option>
                ))}
              </select>
            )}
          </div>

          {loadingData ? (
            <Skeleton className="h-64" />
          ) : selectedChart ? (
            <GrowthChart
              investedAmount={selectedChart.investedAmount}
              annualRate={selectedChart.annualRate}
              startDate={selectedChart.startDate}
              totalDays={selectedChart.lockMonths * 30}
              color="#10b981"
              height={300}
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No active investments to chart</p>
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Investments */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-lg font-bold text-white mb-4">Active Simulations</h2>

              {loadingData ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-48" />)}
                </div>
              ) : investments.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
                  <p className="text-4xl mb-4">💼</p>
                  <p className="text-white font-semibold mb-2">No Active Simulations</p>
                  <p className="text-gray-500 text-sm mb-6">Start a simulation by choosing a plan below</p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    {INVESTMENT_PLANS.map(plan => (
                      <motion.button
                        key={plan.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleInvest(plan.id)}
                        disabled={isInvesting}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-60"
                      >
                        {plan.name} — {formatINR(plan.amount)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {investments.map((inv, i) => {
                    const currentValue = calculateCurrentValue(inv.investedAmount, inv.annualRate, inv.startDate);
                    const growthPct = calculateGrowthPercent(inv.investedAmount, currentValue);
                    const daysLeft = calculateDaysRemaining(inv.maturityDate);
                    const locked = isLocked(inv.maturityDate);

                    return (
                      <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-white font-semibold">{inv.planName}</h3>
                            <p className="text-gray-500 text-xs mt-0.5">
                              Started {new Date(inv.startDate).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {locked ? (
                              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">
                                🔒 Locked
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
                                ✓ Matured
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Invested</p>
                            <p className="text-white font-semibold">{formatINR(inv.investedAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Current Value</p>
                            <p className="text-emerald-400 font-semibold">{formatINR(Math.round(currentValue))}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Growth</p>
                            <p className="text-emerald-400 font-semibold">+{growthPct.toFixed(3)}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">
                              {locked ? 'Days Remaining' : 'Lock Status'}
                            </p>
                            <p className={locked ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                              {locked ? `${daysLeft} days` : 'Unlocked'}
                            </p>
                          </div>
                        </div>

                        {locked && (
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Lock Progress</span>
                              <span>Unlocks {new Date(inv.maturityDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                                style={{
                                  width: `${Math.max(0, Math.min(100, 100 - (daysLeft / (inv.lockMonths * 30)) * 100))}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Quick Invest Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-lg font-bold text-white mb-4">Quick Invest</h2>
            <div className="space-y-4">
              {INVESTMENT_PLANS.map(plan => {
                const maturityValue = plan.amount * Math.pow(1 + plan.annualRate / 365, plan.lockDays);
                return (
                  <div
                    key={plan.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-white font-semibold text-sm">{plan.name}</p>
                      <span className="text-emerald-400 text-xs font-semibold">
                        {(plan.annualRate * 100).toFixed(0)}% p.a.
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{formatINR(plan.amount)}</p>
                    <p className="text-gray-500 text-xs mb-3">
                      Matures at {formatINR(Math.round(maturityValue))} · {plan.lockMonths}M lock
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInvest(plan.id)}
                      disabled={isInvesting}
                      className={`w-full py-2.5 text-sm font-semibold rounded-xl transition-all bg-gradient-to-r ${plan.color} text-black hover:opacity-90 disabled:opacity-60`}
                    >
                      {isInvesting ? 'Starting...' : 'Simulate →'}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Transaction History */}
        {investments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <h2 className="text-lg font-bold text-white mb-4">Transaction History</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Plan', 'Invested', 'Current Value', 'Start Date', 'Maturity Date', 'Status'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((inv) => {
                      const currentValue = calculateCurrentValue(inv.investedAmount, inv.annualRate, inv.startDate);
                      const locked = isLocked(inv.maturityDate);
                      return (
                        <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-4 text-white text-sm font-medium">{inv.planName}</td>
                          <td className="px-4 py-4 text-gray-300 text-sm">{formatINR(inv.investedAmount)}</td>
                          <td className="px-4 py-4 text-emerald-400 text-sm font-semibold">{formatINR(Math.round(currentValue))}</td>
                          <td className="px-4 py-4 text-gray-400 text-sm">
                            {new Date(inv.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-4 text-gray-400 text-sm">
                            {new Date(inv.maturityDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              locked ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {locked ? '🔒 Locked' : '✓ Matured'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
