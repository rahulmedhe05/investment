'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { DashboardSkeleton } from '@/components/Skeleton'
import toast from 'react-hot-toast'

interface InvestmentData {
  id: string; amount: number; annualReturn: number; startDate: string;
  lockPeriod: number; investmentDuration: number; maturityDate: string;
  lockEndDate: string; packageName: string; currentValue: number;
  growthPercent: number; maturityValue: number; isLocked: boolean;
  isMatured: boolean; daysRemaining: number; daysPassed: number;
}

interface DashboardData {
  user: { id: string; investments: InvestmentData[]; createdAt: string }
  summary: { totalInvested: number; totalCurrent: number; totalGrowth: number; totalMaturity: number; totalProfit: number }
}

function generateGrowthChart(investments: InvestmentData[]) {
  if (!investments.length) return []
  const totalAmount = investments.reduce((s, i) => s + i.amount, 0)
  const avgReturn = investments.reduce((s, i) => s + i.annualReturn, 0) / investments.length
  const data = []
  for (let d = 0; d <= 365; d += 5) {
    const dailyRate = avgReturn / 100 / 365
    const val = totalAmount * Math.pow(1 + dailyRate, d)
    data.push({ day: d, value: Math.round(val) })
  }
  return data
}

function Countdown({ targetDate, label }: { targetDate: string; label: string }) {
  const [timeLeft, setTimeLeft] = useState('')
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('Completed'); return }
      const days = Math.floor(diff / 86400000)
      const hrs = Math.floor((diff % 86400000) / 3600000)
      const mins = Math.floor((diff % 3600000) / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${days}d ${hrs}h ${mins}m ${secs}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return (
    <div>
      <p className="text-white/40 text-xs">{label}</p>
      <p className="font-semibold text-amber-300 tabular-nums">{timeLeft}</p>
    </div>
  )
}

function ProgressBar({ current, total, color = 'emerald' }: { current: number; total: number; color?: string }) {
  const pct = Math.min(100, (current / total) * 100)
  return (
    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function DashboardPage() {
  const { userId } = useParams<{ userId: string }>()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = () => {
    fetch(`/api/user/${userId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setData(d); else setError('User not found') })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [userId])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Dashboard link copied!')
  }

  if (loading) return <div className="min-h-screen bg-black p-6"><DashboardSkeleton /></div>
  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="glass p-10 text-center max-w-md">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold mb-2">Investor Not Found</h2>
        <p className="text-white/50 mb-6">No account exists for Investor ID: <span className="font-mono text-white/70">{userId}</span></p>
        <a href="/" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold">Go Home</a>
      </div>
    </div>
  )

  const { user, summary } = data!
  const chartData = generateGrowthChart(user.investments)

  return (
    <main className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold gradient-text">Wealthora</a>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/50">Live</span>
            </div>
            <div className="glass px-3 py-1.5 rounded-lg">
              <span className="text-xs text-white/40">ID: </span>
              <span className="text-xs font-mono text-emerald-400">{userId}</span>
            </div>
            <button onClick={copyLink} className="text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/10 transition">
              Share 🔗
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold mb-1">
            Welcome back, <span className="gradient-text">{userId}</span>
          </h2>
          <p className="text-white/40 text-sm">
            Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Invested', value: summary.totalInvested, prefix: '₹', color: 'text-white' },
            { label: 'Current Value', value: summary.totalCurrent, prefix: '₹', color: 'text-emerald-400' },
            { label: 'Total Profit', value: summary.totalProfit, prefix: '₹', color: 'text-cyan-400' },
            { label: 'Growth', value: summary.totalGrowth, suffix: '%', decimals: 2, color: 'text-emerald-400' },
            { label: 'Maturity Value', value: summary.totalMaturity, prefix: '₹', color: 'text-purple-400' },
          ].map((s, i) => (
            <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp}
              transition={{ delay: i * 0.08 }} className="glass p-5"
            >
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">{s.label}</p>
              <p className={`text-xl md:text-2xl font-bold ${s.color}`}>
                <AnimatedCounter value={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} decimals={s.decimals || 0} />
              </p>
            </motion.div>
          ))}
        </div>

        {/* Chart + Summary Row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Growth Chart */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }}
            className="md:col-span-2 glass p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Growth Chart <span className="text-white/30 text-sm font-normal">(1 Year)</span></h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-emerald-400 rounded" />
                <span className="text-xs text-white/40">Portfolio Value</span>
              </div>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00ff88" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#333" tick={{ fontSize: 11 }} label={{ value: 'Days', position: 'insideBottom', offset: -5, fill: '#555' }} />
                  <YAxis stroke="#333" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                    formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Value']}
                    labelFormatter={l => `Day ${l}`}
                  />
                  <Area type="monotone" dataKey="value" stroke="#00ff88" strokeWidth={2} fill="url(#dashGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-white/30">No investment data</div>
            )}
          </motion.div>

          {/* Quick Info Panel */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.5 }}
            className="glass p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold mb-6">Investment Summary</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/40">Active Investments</span>
                    <span className="font-semibold">{user.investments.length}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/40">Fixed Return Rate</span>
                    <span className="font-semibold text-emerald-400">
                      {user.investments.length > 0 ? `${user.investments[0].annualReturn}%` : '—'} p.a.
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/40">Total at Maturity</span>
                    <span className="font-semibold text-cyan-400">₹{Math.round(summary.totalMaturity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/40">Guaranteed Profit</span>
                    <span className="font-semibold text-emerald-400">₹{Math.round(summary.totalMaturity - summary.totalInvested).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="h-px bg-white/10" />
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/40">Investment Duration</span>
                    <span className="font-semibold">1 Year</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-xs text-emerald-400/70 leading-relaxed">
                ✅ Your returns are fixed &amp; guaranteed — backed by real digital services, not stock market or crypto.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Investment Cards */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Investments</h3>
          {user.investments.length === 0 ? (
            <div className="glass p-12 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h4 className="text-xl font-semibold mb-2">No Active Investments</h4>
              <p className="text-white/40 text-sm">Contact the admin team to start your first investment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {user.investments.map((inv, i) => {
                const progressPct = (inv.daysPassed / inv.investmentDuration) * 100
                const profitSoFar = inv.currentValue - inv.amount
                const totalProfit = inv.maturityValue - inv.amount
                return (
                  <motion.div key={inv.id} initial="hidden" animate="visible" variants={fadeUp}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="glass p-6 space-y-5"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{inv.packageName}</h4>
                        <p className="text-xs text-white/30 font-mono">{inv.id}</p>
                      </div>
                      <div className="flex gap-2">
                        {inv.isMatured ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">✅ Matured</span>
                        ) : inv.isLocked ? (
                          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">🔒 Locked</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium">🔓 Withdrawable</span>
                        )}
                      </div>
                    </div>

                    {/* Value Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-white/40 text-xs mb-1">Invested</p>
                        <p className="font-bold text-lg">₹{inv.amount.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-white/40 text-xs mb-1">Current Value</p>
                        <p className="font-bold text-lg text-emerald-400">₹{Math.round(inv.currentValue).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-white/40 text-xs mb-1">Profit So Far</p>
                        <p className="font-bold text-cyan-400">+₹{Math.round(profitSoFar).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-white/40 text-xs mb-1">Maturity Value</p>
                        <p className="font-bold text-purple-400">₹{Math.round(inv.maturityValue).toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-white/40 mb-2">
                        <span>Day {inv.daysPassed} of {inv.investmentDuration}</span>
                        <span>{progressPct.toFixed(1)}% complete</span>
                      </div>
                      <ProgressBar current={inv.daysPassed} total={inv.investmentDuration} />
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-white/40 text-xs">Fixed Return</p>
                        <p className="font-semibold text-emerald-400">{inv.annualReturn}% p.a.</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Growth</p>
                        <p className="font-semibold text-cyan-400">+{inv.growthPercent.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Total Guaranteed Profit</p>
                        <p className="font-semibold text-emerald-400">₹{Math.round(totalProfit).toLocaleString('en-IN')}</p>
                      </div>
                      {!inv.isMatured && (
                        <Countdown targetDate={inv.maturityDate} label="Maturity In" />
                      )}
                    </div>

                    {/* Lock-in info */}
                    <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-white/30">Start Date</span>
                          <p className="text-white/60">{new Date(inv.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <span className="text-white/30">Maturity Date</span>
                          <p className="text-white/60">{new Date(inv.maturityDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <span className="text-white/30">Lock-in Until</span>
                          <p className={inv.isLocked ? 'text-amber-400' : 'text-emerald-400'}>
                            {new Date(inv.lockEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {!inv.isLocked && ' ✓'}
                          </p>
                        </div>
                        <div>
                          <span className="text-white/30">Withdrawal Status</span>
                          <p className={inv.isLocked ? 'text-amber-400' : 'text-emerald-400'}>
                            {inv.isMatured ? 'Ready to withdraw' : inv.isLocked ? 'Locked' : 'Available for early withdrawal'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Transaction History */}
        {user.investments.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.7 }}>
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <div className="glass overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs uppercase">
                    <th className="text-left p-4">ID</th>
                    <th className="text-left p-4">Plan</th>
                    <th className="text-right p-4">Invested</th>
                    <th className="text-right p-4">Current Value</th>
                    <th className="text-right p-4">Maturity Value</th>
                    <th className="text-right p-4">Return</th>
                    <th className="text-right p-4">Start</th>
                    <th className="text-right p-4">Maturity</th>
                    <th className="text-center p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user.investments.map(inv => (
                    <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="p-4 font-mono text-xs text-white/40">{inv.id}</td>
                      <td className="p-4 font-medium">{inv.packageName}</td>
                      <td className="p-4 text-right">₹{inv.amount.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-right text-emerald-400">₹{Math.round(inv.currentValue).toLocaleString('en-IN')}</td>
                      <td className="p-4 text-right text-purple-400">₹{Math.round(inv.maturityValue).toLocaleString('en-IN')}</td>
                      <td className="p-4 text-right text-cyan-400">{inv.annualReturn}%</td>
                      <td className="p-4 text-right text-white/50">{new Date(inv.startDate).toLocaleDateString('en-IN')}</td>
                      <td className="p-4 text-right text-white/50">{new Date(inv.maturityDate).toLocaleDateString('en-IN')}</td>
                      <td className="p-4 text-center">
                        {inv.isMatured ? (
                          <span className="text-emerald-400 text-xs">Matured</span>
                        ) : inv.isLocked ? (
                          <span className="text-amber-400 text-xs">Locked</span>
                        ) : (
                          <span className="text-cyan-400 text-xs">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center text-white/20 text-xs py-6 space-y-1">
          <p>Returns are fixed and guaranteed — backed by digital services &amp; products revenue.</p>
          <p>© 2026 Wealthora. All rights reserved.</p>
        </div>
      </div>
    </main>
  )
}
