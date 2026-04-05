'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface Investment { id: string; amount: number; annualReturn: number; startDate: string; lockPeriod: number; investmentDuration: number; maturityDate: string; lockEndDate: string; packageName: string }
interface User { id: string; password: string; name: string; phone: string; investments: Investment[]; createdAt: string }
interface Config { starterReturn: number; proReturn: number; starterLockDays: number; proLockDays: number }

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [config, setConfig] = useState<Config>({ starterReturn: 18, proReturn: 21, starterLockDays: 90, proLockDays: 180 })
  const [tab, setTab] = useState<'dashboard' | 'users' | 'create' | 'investments' | 'config'>('dashboard')
  const [search, setSearch] = useState('')

  // Create user form
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [createdUser, setCreatedUser] = useState<User | null>(null)

  // Add investment form
  const [invUserId, setInvUserId] = useState('')
  const [invPackage, setInvPackage] = useState<'starter' | 'pro'>('starter')

  // Edit user modal
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editPassword, setEditPassword] = useState('')

  // Expand user
  const [expandedUser, setExpandedUser] = useState<string | null>(null)

  const fetchData = () => {
    fetch('/api/admin/reset').then(r => r.json()).then(d => {
      setUsers(d.users || [])
      setConfig(d.config || config)
    })
  }

  useEffect(() => { fetchData() }, [])

  const totalInvested = users.reduce((s, u) => s + u.investments.reduce((ss, i) => ss + i.amount, 0), 0)
  const totalInvestments = users.reduce((s, u) => s + u.investments.length, 0)
  const filteredUsers = users.filter(u =>
    u.id.toLowerCase().includes(search.toLowerCase()) ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  )

  const createUser = async () => {
    const r = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, phone: newPhone, password: newPassword }),
    })
    const d = await r.json()
    if (d.success) {
      setCreatedUser(d.user)
      toast.success(`Investor created: ${d.user.id}`)
      setNewName(''); setNewPhone(''); setNewPassword('')
      fetchData()
    }
  }

  const addInvestment = async () => {
    if (!invUserId) { toast.error('Enter an Investor ID'); return }
    const r = await fetch('/api/admin/add-investment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: invUserId.toUpperCase(), packageType: invPackage }),
    })
    const d = await r.json()
    if (d.success) { toast.success('Investment added!'); setInvUserId(''); fetchData() }
    else toast.error(d.error || 'Failed')
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(`Delete investor ${userId}? This cannot be undone.`)) return
    const r = await fetch('/api/admin/manage', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    const d = await r.json()
    if (d.success) { toast.success('Investor deleted'); fetchData() }
    else toast.error(d.error)
  }

  const handleDeleteInvestment = async (userId: string, investmentId: string) => {
    if (!confirm(`Delete investment ${investmentId}?`)) return
    const r = await fetch('/api/admin/manage', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, investmentId }),
    })
    const d = await r.json()
    if (d.success) { toast.success('Investment deleted'); fetchData() }
    else toast.error(d.error)
  }

  const handleEditUser = async () => {
    if (!editUser) return
    const r = await fetch('/api/admin/manage', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: editUser.id, name: editName, phone: editPhone, password: editPassword || undefined }),
    })
    const d = await r.json()
    if (d.success) { toast.success('Investor updated'); setEditUser(null); fetchData() }
    else toast.error(d.error)
  }

  const resetAll = async () => {
    if (!confirm('⚠️ Reset ALL data? This will delete all investors and investments.')) return
    await fetch('/api/admin/reset', { method: 'POST' })
    toast.success('All data reset')
    setUsers([]); setCreatedUser(null)
  }

  const updateConfigHandler = async () => {
    await fetch('/api/admin/reset', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    toast.success('Config saved')
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
  }

  const openEdit = (u: User) => {
    setEditUser(u); setEditName(u.name); setEditPhone(u.phone); setEditPassword('')
  }

  const tabs = [
    { id: 'dashboard' as const, label: '📊 Dashboard', icon: '📊' },
    { id: 'users' as const, label: '👥 Investors', icon: '👥' },
    { id: 'create' as const, label: '➕ Create', icon: '➕' },
    { id: 'investments' as const, label: '💰 Investments', icon: '💰' },
    { id: 'config' as const, label: '⚙️ Settings', icon: '⚙️' },
  ]

  return (
    <main className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="text-2xl font-bold gradient-text">Wealthora</a>
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-white/30 hover:text-white/50 transition">Home</a>
            <a href="/dashboard" className="text-xs text-white/30 hover:text-white/50 transition">Investor Login</a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                tab === t.id ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black' : 'glass text-white/60 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Investors', value: users.length, icon: '👥', color: 'text-emerald-400' },
                { label: 'Total Investments', value: totalInvestments, icon: '📈', color: 'text-cyan-400' },
                { label: 'Capital Managed', value: `₹${totalInvested.toLocaleString('en-IN')}`, icon: '💰', color: 'text-purple-400' },
                { label: 'Active Packages', value: `${users.filter(u => u.investments.length > 0).length}`, icon: '📦', color: 'text-amber-400' },
              ].map((s, i) => (
                <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp}
                  transition={{ delay: i * 0.08 }} className="glass p-5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{s.label}</p>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                    <span className="text-2xl">{s.icon}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Users */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }} className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Investors</h3>
              {users.length === 0 ? (
                <p className="text-white/30 text-sm">No investors yet. Go to Create tab to add one.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 text-xs uppercase">
                        <th className="text-left p-3">ID</th>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Phone</th>
                        <th className="text-center p-3">Investments</th>
                        <th className="text-right p-3">Total Invested</th>
                        <th className="text-right p-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(-10).reverse().map(u => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="p-3"><code className="text-emerald-400 text-xs">{u.id}</code></td>
                          <td className="p-3 text-white/70">{u.name || '—'}</td>
                          <td className="p-3 text-white/50">{u.phone || '—'}</td>
                          <td className="p-3 text-center">{u.investments.length}</td>
                          <td className="p-3 text-right">₹{u.investments.reduce((s, i) => s + i.amount, 0).toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right text-white/40 text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <button onClick={() => setTab('create')} className="glass p-6 text-left hover:bg-white/5 transition group">
                <span className="text-2xl mb-2 block">➕</span>
                <h4 className="font-semibold">Create Investor</h4>
                <p className="text-xs text-white/40">Add a new investor account</p>
              </button>
              <button onClick={() => setTab('investments')} className="glass p-6 text-left hover:bg-white/5 transition group">
                <span className="text-2xl mb-2 block">💰</span>
                <h4 className="font-semibold">Add Investment</h4>
                <p className="text-xs text-white/40">Add investment to an account</p>
              </button>
              <button onClick={() => setTab('users')} className="glass p-6 text-left hover:bg-white/5 transition group">
                <span className="text-2xl mb-2 block">👥</span>
                <h4 className="font-semibold">Manage Investors</h4>
                <p className="text-xs text-white/40">View, edit, delete investors</p>
              </button>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search by ID, name, or phone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition"
              />
              <span className="glass px-4 py-3 rounded-xl text-sm text-white/40">{filteredUsers.length} investors</span>
            </div>

            {/* Users List */}
            {filteredUsers.length === 0 ? (
              <div className="glass p-10 text-center text-white/30">No investors found</div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map(u => (
                  <motion.div key={u.id} initial="hidden" animate="visible" variants={fadeUp} className="glass overflow-hidden">
                    {/* User Header */}
                    <div className="p-5 flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-lg shrink-0">
                          {(u.name || u.id)[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-emerald-400 text-sm font-bold">{u.id}</code>
                            <button onClick={() => copyText(u.id)} className="text-white/30 hover:text-white text-xs">📋</button>
                            <button onClick={() => copyText(u.password)} className="text-white/30 hover:text-white text-xs" title="Copy password">🔑</button>
                          </div>
                          <p className="text-sm text-white/70 mt-1">{u.name || 'No name'} {u.phone ? `· ${u.phone}` : ''}</p>
                          <p className="text-xs text-white/30 mt-0.5">
                            Password: <code className="text-amber-400/60">{u.password}</code> · 
                            {u.investments.length} investment{u.investments.length !== 1 ? 's' : ''} · 
                            ₹{u.investments.reduce((s, i) => s + i.amount, 0).toLocaleString('en-IN')} invested
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a href={`/dashboard/${u.id}`} target="_blank"
                          className="px-3 py-2 rounded-lg glass text-xs hover:bg-white/10 transition">Dashboard ↗</a>
                        <button onClick={() => openEdit(u)}
                          className="px-3 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs hover:bg-cyan-500/20 transition">Edit</button>
                        <button onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                          className="px-3 py-2 rounded-lg glass text-xs hover:bg-white/10 transition">
                          {expandedUser === u.id ? 'Collapse' : 'Details'}
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)}
                          className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition">Delete</button>
                      </div>
                    </div>

                    {/* Expanded: Investments */}
                    {expandedUser === u.id && (
                      <div className="border-t border-white/5 p-5 bg-white/2">
                        <h4 className="text-sm font-semibold mb-3 text-white/60">Investments</h4>
                        {u.investments.length === 0 ? (
                          <p className="text-xs text-white/30">No investments</p>
                        ) : (
                          <div className="space-y-2">
                            {u.investments.map(inv => (
                              <div key={inv.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-3 rounded-xl bg-white/5">
                                <div className="text-xs space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <code className="text-cyan-400">{inv.id}</code>
                                    <span className="text-white/60">{inv.packageName}</span>
                                  </div>
                                  <p className="text-white/40">
                                    ₹{inv.amount.toLocaleString('en-IN')} · {inv.annualReturn}% p.a. · 
                                    Start: {new Date(inv.startDate).toLocaleDateString('en-IN')} · 
                                    Maturity: {new Date(inv.maturityDate).toLocaleDateString('en-IN')} · 
                                    Lock-in: {inv.lockPeriod} days
                                  </p>
                                </div>
                                <button onClick={() => handleDeleteInvestment(u.id, inv.id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition shrink-0">
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CREATE TAB */}
        {tab === 'create' && (
          <div className="max-w-lg mx-auto space-y-6">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass p-8">
              <h3 className="text-xl font-semibold mb-6">Create New Investor</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Investor Name</label>
                  <input type="text" placeholder="Full name" value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Phone Number</label>
                  <input type="tel" placeholder="e.g. 9876543210" value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Password <span className="text-white/20">(auto-generated if empty)</span></label>
                  <input type="text" placeholder="Set a password" value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition" />
                </div>
                <button onClick={createUser}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:opacity-90 transition text-lg">
                  Create Investor Account
                </button>
              </div>

              {createdUser && (
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mt-6 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-3">✅ Investor Created Successfully</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Investor ID</span>
                      <div className="flex items-center gap-2">
                        <code className="text-emerald-400 font-bold">{createdUser.id}</code>
                        <button onClick={() => copyText(createdUser.id)} className="text-xs text-white/30 hover:text-white">📋</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Password</span>
                      <div className="flex items-center gap-2">
                        <code className="text-amber-400">{createdUser.password}</code>
                        <button onClick={() => copyText(createdUser.password)} className="text-xs text-white/30 hover:text-white">📋</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Name</span>
                      <span className="text-white/70">{createdUser.name || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Phone</span>
                      <span className="text-white/70">{createdUser.phone || '—'}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Dashboard Link</span>
                      <button onClick={() => copyText(`${window.location.origin}/dashboard/${createdUser.id}`)}
                        className="text-xs text-cyan-400 hover:text-cyan-300">Copy Link 📋</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}

        {/* INVESTMENTS TAB */}
        {tab === 'investments' && (
          <div className="max-w-lg mx-auto space-y-6">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass p-8">
              <h3 className="text-xl font-semibold mb-6">Add Investment</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Investor ID</label>
                  <input type="text" placeholder="e.g. WO-ABC123" value={invUserId}
                    onChange={e => setInvUserId(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition font-mono" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Select Package</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setInvPackage('starter')}
                      className={`p-4 rounded-xl border transition text-left ${
                        invPackage === 'starter' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/20'
                      }`}>
                      <div className="text-lg mb-1">🌱</div>
                      <div className={`font-semibold text-sm ${invPackage === 'starter' ? 'text-emerald-400' : 'text-white/60'}`}>Starter</div>
                      <div className="text-xs text-white/40">₹50,000 · 18% p.a.</div>
                      <div className="text-xs text-white/30">Lock: 90 days</div>
                    </button>
                    <button onClick={() => setInvPackage('pro')}
                      className={`p-4 rounded-xl border transition text-left ${
                        invPackage === 'pro' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 hover:border-white/20'
                      }`}>
                      <div className="text-lg mb-1">👑</div>
                      <div className={`font-semibold text-sm ${invPackage === 'pro' ? 'text-cyan-400' : 'text-white/60'}`}>Pro</div>
                      <div className="text-xs text-white/40">₹1,00,000 · 21% p.a.</div>
                      <div className="text-xs text-white/30">Lock: 180 days</div>
                    </button>
                  </div>
                </div>
                <button onClick={addInvestment}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:opacity-90 transition text-lg">
                  Add Investment
                </button>
              </div>
            </motion.div>

            {/* All Investments Table */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">All Investments ({totalInvestments})</h3>
              {totalInvestments === 0 ? (
                <p className="text-white/30 text-sm">No investments yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 uppercase">
                        <th className="text-left p-3">Investor</th>
                        <th className="text-left p-3">Inv ID</th>
                        <th className="text-left p-3">Package</th>
                        <th className="text-right p-3">Amount</th>
                        <th className="text-right p-3">Return</th>
                        <th className="text-right p-3">Start</th>
                        <th className="text-right p-3">Maturity</th>
                        <th className="text-center p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.flatMap(u => u.investments.map(inv => ({ ...inv, userId: u.id, userName: u.name }))).map(inv => (
                        <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="p-3"><code className="text-emerald-400">{inv.userId}</code></td>
                          <td className="p-3 text-white/50 font-mono">{inv.id}</td>
                          <td className="p-3 text-white/70">{inv.packageName}</td>
                          <td className="p-3 text-right">₹{inv.amount.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right text-emerald-400">{inv.annualReturn}%</td>
                          <td className="p-3 text-right text-white/40">{new Date(inv.startDate).toLocaleDateString('en-IN')}</td>
                          <td className="p-3 text-right text-white/40">{new Date(inv.maturityDate).toLocaleDateString('en-IN')}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => handleDeleteInvestment(inv.userId, inv.id)}
                              className="px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* CONFIG TAB */}
        {tab === 'config' && (
          <div className="max-w-lg mx-auto space-y-6">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass p-8">
              <h3 className="text-xl font-semibold mb-6">Platform Settings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Starter Return Rate (%)', key: 'starterReturn' as const },
                  { label: 'Pro Return Rate (%)', key: 'proReturn' as const },
                  { label: 'Starter Lock-in Period (days)', key: 'starterLockDays' as const },
                  { label: 'Pro Lock-in Period (days)', key: 'proLockDays' as const },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">{f.label}</label>
                    <input type="number" value={config[f.key]}
                      onChange={e => setConfig({ ...config, [f.key]: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition" />
                  </div>
                ))}
                <button onClick={updateConfigHandler}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:opacity-90 transition">
                  Save Settings
                </button>
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="glass p-8">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h3>
              <p className="text-sm text-white/40 mb-4">This will permanently delete all investors, investments, and reset all settings.</p>
              <button onClick={resetAll}
                className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/20 transition border border-red-500/20">
                ⚠️ Reset All Data
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/80 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setEditUser(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass glow p-8 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-6">Edit Investor <code className="text-emerald-400">{editUser.id}</code></h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Name</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition" />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Phone</label>
                <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition" />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">New Password <span className="text-white/20">(leave empty to keep current)</span></label>
                <input type="text" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="Enter new password"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleEditUser}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:opacity-90 transition">
                  Save Changes
                </button>
                <button onClick={() => setEditUser(null)}
                  className="px-6 py-3 rounded-xl glass text-white/60 hover:text-white transition">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}
