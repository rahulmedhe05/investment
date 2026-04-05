'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function DashboardLoginPage() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.toUpperCase(), password }),
      })
      const d = await r.json()
      if (d.success) {
        toast.success('Login successful!')
        router.push(`/dashboard/${d.userId}`)
      } else {
        toast.error(d.error || 'Invalid credentials')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />

      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="text-3xl font-bold gradient-text">Wealthora</a>
          <p className="text-white/40 text-sm mt-2">Investor Dashboard Login</p>
        </div>

        {/* Login Card */}
        <div className="glass p-8 glow">
          <h2 className="text-xl font-bold mb-6 text-center">Welcome Back, Investor</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Investor ID</label>
              <input
                type="text"
                placeholder="e.g. WO-ABC123"
                value={userId}
                onChange={e => setUserId(e.target.value.toUpperCase())}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition font-mono"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:opacity-90 transition disabled:opacity-50 text-lg mt-2"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-white/3 border border-white/5">
            <p className="text-xs text-white/30 text-center leading-relaxed">
              Your Investor ID and password were provided by the Wealthora team when your account was created. Contact support if you need help.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <a href="/" className="text-sm text-white/30 hover:text-white/50 transition block">← Back to Home</a>
          <p className="text-xs text-white/20">© 2026 Wealthora. All rights reserved.</p>
        </div>
      </motion.div>
    </main>
  )
}
