'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

function generateDemoData() {
  const data = []
  const principal = 100000
  data.push({ day: 0, value: principal })
  for (let i = 5; i <= 365; i += 5) {
    const value = principal * Math.pow(1 + 0.21 / 365, i)
    data.push({ day: i, value: Math.round(value) })
  }
  return data
}

export default function Home() {
  const router = useRouter()
  const [demoData] = useState(generateDemoData)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Packages', href: '#packages' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <main className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold gradient-text">Wealthora</a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-white/60 hover:text-white transition">{l.label}</a>
            ))}
            <a href="/admin" className="text-sm text-white/40 hover:text-white transition">Admin</a>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-white/60">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileMenu ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden px-6 pb-4 space-y-3">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileMenu(false)} className="block text-sm text-white/60 hover:text-white">{l.label}</a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full glass text-sm text-emerald-400">
              Guaranteed Fixed Returns. Zero Market Risk.
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Invest Smart,{' '}
              <span className="gradient-text">Earn Fixed Returns</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
              Wealthora is a digital investment platform backed by real digital services &amp; products — not stocks, crypto, or gold. Get guaranteed fixed returns on your investment.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:opacity-90 transition text-lg"
            >
              Investor Login
            </button>
          </motion.div>

          {/* Stats bar */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { value: '₹5Cr+', label: 'Capital Managed' },
              { value: '500+', label: 'Active Investors' },
              { value: '28%', label: 'Fixed Annual Return' },
              { value: '100%', label: 'Guaranteed Results' },
            ].map((s, i) => (
              <div key={i} className="glass p-4 text-center">
                <div className="text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
              About <span className="gradient-text">Wealthora</span>
            </h3>
            <p className="text-center text-white/50 mb-16 max-w-2xl mx-auto">
              Building wealth through smart investments and digital innovation
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
              <div className="glass p-8 glow">
                <div className="text-6xl mb-6">💎</div>
                <h4 className="text-2xl font-bold mb-4">Our Mission</h4>
                <p className="text-white/60 leading-relaxed">
                  At Wealthora, we believe everyone deserves access to smart investment opportunities. Our mission is to democratize wealth creation by providing a secure, transparent, and high-performing investment platform backed by real digital services and revenue-generating systems.
                </p>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="space-y-6">
                {[
                  { icon: '🏢', title: 'Who We Are', desc: 'Wealthora is a digital investment platform that deploys capital into high-yield digital services, marketing operations, and technology-driven revenue systems to generate consistent returns for our investors.' },
                  { icon: '🎯', title: 'Our Vision', desc: 'To become the most trusted digital investment platform in India, empowering thousands of investors with transparent, technology-driven wealth growth solutions.' },
                  { icon: '🤝', title: 'Our Promise', desc: 'Complete transparency in how your capital is deployed, real-time dashboard access to track your investments, and dedicated support for every investor.' },
                ].map((item, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="flex gap-4"
                  >
                    <div className="text-3xl shrink-0">{item.icon}</div>
                    <div>
                      <h5 className="font-semibold mb-1">{item.title}</h5>
                      <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
              How It <span className="gradient-text">Works</span>
            </h3>
            <p className="text-center text-white/50 mb-16 max-w-xl mx-auto">
              A simple 4-step process to start growing your wealth with Wealthora
            </p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '📋', title: 'Sign Up', desc: 'Contact our team to create your investor account. You receive a unique Investor ID for dashboard access.' },
              { step: '02', icon: '💰', title: 'Choose Package', desc: 'Select a 1-year investment package — Starter at ₹50K (24% return) or Pro at ₹1L (28% return).' },
              { step: '03', icon: '🚀', title: 'Capital Deployed', desc: 'Your capital is deployed into digital marketing, client projects, SaaS services, and revenue-generating digital products.' },
              { step: '04', icon: '📈', title: 'Get Fixed Returns', desc: 'Receive your guaranteed fixed returns at maturity. Track daily growth on your personal dashboard.' },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glass glass-hover p-6 group cursor-default text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-xs font-bold text-emerald-400/60 mb-2">STEP {item.step}</div>
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Packages */}
      <section id="packages" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Investment <span className="gradient-text">Packages</span>
            </h3>
            <p className="text-center text-white/50 mb-16 max-w-xl mx-auto">
              Choose the plan that fits your investment goals. Both packages offer guaranteed fixed returns backed by real digital services.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Starter Package',
                icon: '🌱',
                amount: '₹50,000',
                ret: '24%',
                duration: '1 Year',
                lockIn: '90 Days (3 Months)',
                maturity: '₹62,000',
                monthlyGrowth: '₹1,000/month',
                features: ['Guaranteed fixed 24% annual return', 'Personal investment dashboard', 'Real-time growth tracking', 'Dedicated investor support', 'Early withdrawal after 90 days lock-in'],
              },
              {
                name: 'Pro Package',
                icon: '👑',
                amount: '₹1,00,000',
                ret: '28%',
                duration: '1 Year',
                lockIn: '180 Days (6 Months)',
                maturity: '₹1,28,000',
                monthlyGrowth: '₹2,333/month',
                featured: true,
                features: ['Guaranteed fixed 28% annual return', 'Everything in Starter', 'Priority support & updates', 'Detailed analytics dashboard', 'Early withdrawal after 180 days lock-in'],
              },
            ].map((plan, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`glass p-8 relative overflow-hidden ${plan.featured ? 'glow border-emerald-500/30' : ''}`}
              >
                {plan.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-4xl mb-3">{plan.icon}</div>
                <h4 className="text-2xl font-bold mb-1">{plan.name}</h4>
                <div className="text-3xl font-black gradient-text mb-6">{plan.amount}</div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Fixed Return</span>
                    <span className="font-semibold text-emerald-400">{plan.ret} per annum</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Investment Duration</span>
                    <span className="font-semibold">{plan.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Min. Lock-in Period</span>
                    <span className="font-semibold text-white/70">{plan.lockIn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Monthly Growth</span>
                    <span className="font-semibold text-cyan-400">{plan.monthlyGrowth}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Maturity Value</span>
                    <span className="font-bold text-lg text-cyan-400">{plan.maturity}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">What&apos;s included</div>
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-white/60">
                      <span className="text-emerald-400">✓</span>
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Simulation */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/3 to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Growth <span className="gradient-text">Simulation</span>
            </h3>
            <p className="text-center text-white/50 mb-12">Guaranteed growth of ₹1,00,000 over 1 year at fixed 28% p.a.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            transition={{ duration: 0.6 }} className="glass p-6 glow"
          >
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={demoData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#333" tick={{ fontSize: 12 }} label={{ value: 'Days', position: 'insideBottom', offset: -5, fill: '#666' }} />
                <YAxis stroke="#333" tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Value']}
                  labelFormatter={l => `Day ${l}`}
                />
                <Area type="monotone" dataKey="value" stroke="#00ff88" strokeWidth={2} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      {/* Benefits - Not Stock/Crypto/Gold */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Why <span className="gradient-text">Wealthora</span> is Different
            </h3>
            <p className="text-center text-white/50 mb-16 max-w-2xl mx-auto">
              Unlike stocks, crypto, or gold — your returns are not dependent on volatile markets. Wealthora is backed by real digital services &amp; products that generate guaranteed revenue.
            </p>
          </motion.div>

          {/* Comparison */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="glass glow p-8 mb-16">
            <h4 className="text-xl font-bold text-center mb-8">Wealthora vs Traditional Investments</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white/40 font-medium">Feature</th>
                    <th className="text-center py-3 px-4 text-white/40 font-medium">Stocks</th>
                    <th className="text-center py-3 px-4 text-white/40 font-medium">Crypto</th>
                    <th className="text-center py-3 px-4 text-white/40 font-medium">Gold</th>
                    <th className="text-center py-3 pl-4 gradient-text font-bold">Wealthora</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Fixed Returns', '❌', '❌', '❌', '✅'],
                    ['Guaranteed Results', '❌', '❌', '❌', '✅'],
                    ['No Market Risk', '❌', '❌', '❌', '✅'],
                    ['Backed by Real Revenue', '❌', '❌', '❌', '✅'],
                    ['Real-Time Dashboard', '✅', '✅', '❌', '✅'],
                    ['Personal Support', '❌', '❌', '❌', '✅'],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-3 pr-4 text-white/60">{row[0]}</td>
                      <td className="py-3 px-4 text-center">{row[1]}</td>
                      <td className="py-3 px-4 text-center">{row[2]}</td>
                      <td className="py-3 px-4 text-center">{row[3]}</td>
                      <td className="py-3 pl-4 text-center">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '✅', title: 'Guaranteed Fixed Returns', desc: 'Get assured 24-28% annual returns. Your returns are fixed from day one — no surprises, no fluctuations, no market dependency.' },
              { icon: '🚫', title: 'Zero Market Risk', desc: 'Your investment is NOT in stocks, crypto, or gold. It is backed by digital services and products that generate consistent, predictable revenue.' },
              { icon: '💰', title: 'Revenue-Backed Investment', desc: 'Capital is deployed into web development, digital marketing, SaaS products, and IT services — real businesses with real paying clients.' },
              { icon: '📊', title: 'Real-Time Dashboard', desc: 'Track your fixed returns growing daily on your personalized dashboard. See your exact maturity value and timeline — no guesswork.' },
              { icon: '🔒', title: 'Secure & Transparent', desc: 'Every rupee is accounted for. Complete transparency on how your capital is deployed and exactly how much you will earn at maturity.' },
              { icon: '⚡', title: 'Quick & Easy', desc: 'Get started in minutes with our simple onboarding. Choose your package, invest, and start seeing your guaranteed returns grow from day one.' },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass glass-hover p-6 group cursor-default"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Benefits of Investing with <span className="gradient-text">Wealthora</span>
            </h3>
            <p className="text-center text-white/50 mb-16 max-w-xl mx-auto">
              Fixed returns, zero market risk, and complete transparency — everything you need for stress-free investing
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Fixed Returns from Day 1', desc: 'Your return rate is locked the moment you invest. 24% for Starter, 28% for Pro — guaranteed, no ifs or buts.' },
              { icon: '📱', title: 'Access Anywhere', desc: 'Your dashboard works on any device — desktop, tablet, or mobile. Track your guaranteed returns from anywhere, anytime.' },
              { icon: '🛡️', title: 'Dedicated Support', desc: 'Every investor gets personal support. Our team is always available to help you with your portfolio and answer any questions.' },
              { icon: '💎', title: 'No Hidden Charges', desc: 'What you see is what you get. No management fees, no platform charges, no hidden deductions from your returns.' },
              { icon: '🏦', title: 'Easy Withdrawal', desc: 'Withdraw your capital plus earned returns at maturity — simple, hassle-free process with no complications.' },
              { icon: '📈', title: 'Compounding Growth', desc: 'Your returns compound daily, meaning your money grows faster every single day. Watch your wealth grow on the dashboard in real-time.' },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass glass-hover p-6 group cursor-default"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Investor <span className="gradient-text">Testimonials</span>
            </h3>
            <p className="text-center text-white/50 mb-16 max-w-xl mx-auto">
              Hear from our investors who trust Wealthora with their capital
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Rahul S.', role: 'Pro Investor', text: 'Wealthora has been a game-changer. The dashboard is incredibly transparent and I can see my investment growing every single day. The 28% returns are real.' },
              { name: 'Priya M.', role: 'Starter Investor', text: 'I started with the Starter package to test the waters. Within 3 months, I received exactly what was projected. Now I have moved to the Pro package.' },
              { name: 'Amit K.', role: 'Pro Investor', text: 'What I love most is the transparency. I can log in anytime and see real-time growth. The team is responsive and always available for any questions.' },
            ].map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glass p-6"
              >
                <div className="text-emerald-400 text-2xl mb-3">&ldquo;</div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h3>
            <p className="text-center text-white/50 mb-16">Everything you need to know about investing with Wealthora</p>
          </motion.div>
          <div className="space-y-3">
            {[
              { q: 'What is Wealthora?', a: 'Wealthora is a performance-based digital investment platform. We deploy your capital into real revenue-generating digital services — including client projects, marketing operations, and SaaS systems — and share the returns with you.' },
              { q: 'How are the returns generated?', a: 'Returns are generated from real digital business operations — web development, digital marketing, SaaS products, and IT services. These are real businesses with real paying clients, which is why we can guarantee fixed returns.' },
              { q: 'Is this like stock market or crypto?', a: 'Absolutely not. Wealthora has zero connection to stocks, crypto, or gold. Your investment is backed entirely by digital services and products that generate consistent, predictable revenue. That is why your returns are fixed and guaranteed.' },
              { q: 'Are the returns really guaranteed?', a: 'Yes. Since our revenue comes from real digital services and products with paying clients, we guarantee fixed returns — 24% for Starter and 28% for Pro. Your return rate is locked from the day you invest.' },
              { q: 'What is the minimum investment?', a: 'The minimum investment is ₹50,000 with our Starter Package (24% fixed annual return). For higher returns, our Pro Package starts at ₹1,00,000 (28% fixed annual return). Both packages are for a 1-year investment period.' },
              { q: 'How do I track my investment?', a: 'Every investor gets a unique Investor ID and a personal dashboard where you can track real-time growth, fixed returns, maturity dates, and detailed analytics of your portfolio.' },
              { q: 'When can I withdraw my returns?', a: 'Both packages are for 1 year. However, if you need to withdraw early, you can do so after the minimum lock-in period — 90 days for Starter and 180 days for Pro. At the end of 1 year, you receive your full capital plus guaranteed returns.' },
              { q: 'How do I get started?', a: 'Contact our team via the details below. We will set up your investor account, explain the packages in detail, and help you choose the best plan for your goals.' },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-white/5 transition"
                >
                  <span className="font-medium text-sm pr-4">{item.q}</span>
                  <span className={`text-emerald-400 transition-transform shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed">{item.a}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="glass glow p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start <span className="gradient-text">Investing</span>?</h3>
              <p className="text-white/60 mb-8 max-w-xl mx-auto">
                Join hundreds of investors who trust Wealthora for consistent, transparent wealth growth. Start your investment journey today.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:opacity-90 transition text-lg"
              >
                View Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="glass p-8"
          >
            <div className="text-3xl mb-3">🛡️</div>
            <h4 className="text-lg font-bold mb-3">Your Investment, Our Commitment</h4>
            <p className="text-white/40 text-xs leading-relaxed">
              Wealthora provides guaranteed fixed returns backed by revenue from real digital services and products. Your capital is not invested in stocks, cryptocurrency, gold, or any volatile market instruments. Returns are generated through our digital service operations including web development, digital marketing, SaaS products, and IT services. The return rates mentioned (24% and 28% per annum) are fixed and guaranteed for the respective lock-in periods. Please invest responsibly and within your financial capacity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/5 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <h4 className="text-2xl font-bold gradient-text mb-4">Wealthora</h4>
              <p className="text-white/40 text-sm leading-relaxed">
                A performance-based digital investment platform. Growing wealth through smart capital deployment and transparent returns.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h5 className="font-semibold mb-4 text-sm text-white/70">Quick Links</h5>
              <div className="space-y-2">
                {[
                  { label: 'About Us', href: '#about' },
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'Investment Packages', href: '#packages' },
                  { label: 'Why Choose Us', href: '#why-us' },
                  { label: 'FAQ', href: '#faq' },
                ].map(l => (
                  <a key={l.href} href={l.href} className="block text-sm text-white/40 hover:text-white/70 transition">{l.label}</a>
                ))}
              </div>
            </div>
            {/* Packages */}
            <div>
              <h5 className="font-semibold mb-4 text-sm text-white/70">Packages</h5>
              <div className="space-y-2">
                <div className="text-sm text-white/40">Starter — ₹50,000 at 24% p.a.</div>
                <div className="text-sm text-white/40">Pro — ₹1,00,000 at 28% p.a.</div>
              </div>
              <h5 className="font-semibold mb-3 mt-6 text-sm text-white/70">Investor Access</h5>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-white/40 hover:text-white/70 transition">Dashboard Login</a>
                <a href="/admin" className="block text-sm text-white/40 hover:text-white/70 transition">Admin Panel</a>
              </div>
            </div>
            {/* Contact */}
            <div>
              <h5 className="font-semibold mb-4 text-sm text-white/70">Contact Us</h5>
              <div className="space-y-3 text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>invest@wealthora.in</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                {['Instagram', 'Twitter', 'LinkedIn'].map(s => (
                  <span key={s} className="text-xs text-white/30 hover:text-white/60 cursor-pointer transition">{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-white/20 text-xs">© 2026 Wealthora. All rights reserved.</span>
            <div className="flex gap-6 text-xs text-white/20">
              <span className="hover:text-white/40 cursor-pointer transition">Privacy Policy</span>
              <span className="hover:text-white/40 cursor-pointer transition">Terms of Service</span>
              <span className="hover:text-white/40 cursor-pointer transition">Refund Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
