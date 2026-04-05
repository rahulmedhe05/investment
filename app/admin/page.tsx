'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import Navbar from '@/components/Navbar';
import {
  INVESTMENT_PLANS,
  calculateCurrentValue,
  formatINR,
} from '@/lib/calculateGrowth';
import toast from 'react-hot-toast';

interface UserInvestment {
  id: string;
  userId: string;
  planName: string;
  investedAmount: number;
  annualRate: number;
  startDate: string;
  maturityDate: string;
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [plans, setPlans] = useState(INVESTMENT_PLANS);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchAllInvestments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAllInvestments = async () => {
    setLoadingData(true);
    try {
      const snapshot = await getDocs(collection(db, 'investments'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserInvestment));
      setInvestments(data);
    } catch {
      const demoStart = new Date();
      demoStart.setDate(demoStart.getDate() - 30);
      const demo: UserInvestment[] = [
        {
          id: 'demo-1',
          userId: 'user-1',
          planName: 'Growth Starter',
          investedAmount: 50000,
          annualRate: 0.18,
          startDate: demoStart.toISOString(),
          maturityDate: new Date(demoStart.getTime() + 90 * 86400000).toISOString(),
        },
        {
          id: 'demo-2',
          userId: 'user-2',
          planName: 'Wealth Accelerator',
          investedAmount: 100000,
          annualRate: 0.21,
          startDate: demoStart.toISOString(),
          maturityDate: new Date(demoStart.getTime() + 180 * 86400000).toISOString(),
        },
      ];
      setInvestments(demo);
    } finally {
      setLoadingData(false);
    }
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + calculateCurrentValue(inv.investedAmount, inv.annualRate, inv.startDate),
    0
  );
  const uniqueUsers = new Set(investments.map(inv => inv.userId)).size;

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

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all simulations and users</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: uniqueUsers.toString(), icon: '👥' },
            { label: 'Total Investments', value: investments.length.toString(), icon: '📊' },
            { label: 'Total Invested', value: formatINR(totalInvested), icon: '💰' },
            { label: 'Total Current Value', value: formatINR(Math.round(totalCurrentValue)), icon: '📈' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Plans Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-white mb-5">Simulation Plans Configuration</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {plans.map((plan, i) => (
              <div key={plan.id} className="bg-black/40 border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">{plan.name}</h3>
                  <span className={`px-2.5 py-1 text-xs rounded-full bg-gradient-to-r ${plan.color} text-black font-semibold`}>
                    Plan {plan.id}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-500 text-xs block mb-1">Annual Rate (%)</label>
                    <input
                      type="number"
                      value={(plan.annualRate * 100).toFixed(0)}
                      onChange={e => {
                        const updated = [...plans];
                        updated[i] = { ...plan, annualRate: parseFloat(e.target.value) / 100 };
                        setPlans(updated);
                      }}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs block mb-1">Lock Months</label>
                    <input
                      type="number"
                      value={plan.lockMonths}
                      onChange={e => {
                        const months = parseInt(e.target.value);
                        const updated = [...plans];
                        updated[i] = { ...plan, lockMonths: months, lockDays: months * 30 };
                        setPlans(updated);
                      }}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
                <button
                  onClick={() => toast.success(`${plan.name} settings saved (demo mode)`)}
                  className="mt-4 w-full py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* All Investments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-bold text-white mb-4">All Investments</h2>
          {loadingData ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['User ID', 'Plan', 'Invested', 'Current Value', 'Growth', 'Start Date', 'Maturity'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((inv) => {
                      const currentValue = calculateCurrentValue(inv.investedAmount, inv.annualRate, inv.startDate);
                      const growth = ((currentValue - inv.investedAmount) / inv.investedAmount) * 100;
                      return (
                        <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-gray-400 text-sm font-mono">{inv.userId.slice(0, 8)}...</td>
                          <td className="px-4 py-3 text-white text-sm font-medium">{inv.planName}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{formatINR(inv.investedAmount)}</td>
                          <td className="px-4 py-3 text-emerald-400 text-sm font-semibold">{formatINR(Math.round(currentValue))}</td>
                          <td className="px-4 py-3 text-emerald-400 text-sm">+{growth.toFixed(3)}%</td>
                          <td className="px-4 py-3 text-gray-400 text-sm whitespace-nowrap">
                            {new Date(inv.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-sm whitespace-nowrap">
                            {new Date(inv.maturityDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
