'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Wealthora
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
              Home
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
                <Link href="/admin" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Admin
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-lg hover:opacity-90 transition-all"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden py-4 space-y-3 border-t border-white/10"
          >
            <Link href="/" className="block text-gray-400 hover:text-white py-2">Home</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block text-gray-400 hover:text-white py-2">Dashboard</Link>
                <Link href="/admin" className="block text-gray-400 hover:text-white py-2">Admin</Link>
                <button onClick={logout} className="block text-gray-400 hover:text-white py-2">Sign Out</button>
              </>
            ) : (
              <Link href="/login" className="block text-emerald-400 hover:text-emerald-300 py-2">Get Started</Link>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
