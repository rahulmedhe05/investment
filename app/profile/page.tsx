'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [growthAlerts, setGrowthAlerts] = useState(true);
  const [maturityReminders, setMaturityReminders] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setDisplayName(user.displayName ?? '');
    }
  }, [user, loading, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateProfile(auth.currentUser!, { displayName: displayName.trim() || null });
      toast.success('Profile updated successfully! ✅');
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setSavingPassword(true);
    try {
      // Re-authenticate before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updatePassword(auth.currentUser!, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully! 🔒');
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const message =
        firebaseError.code === 'auth/wrong-password' ? 'Current password is incorrect.' :
        firebaseError.code === 'auth/too-many-requests' ? 'Too many attempts. Please try again later.' :
        'Failed to change password. Please try again.';
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved! 🔔');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = displayName
    ? displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? '?';

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account information and preferences</p>
        </motion.div>

        <div className="space-y-6">
          {/* Avatar & Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <span className="text-black font-bold text-xl">{initials}</span>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{displayName || 'Wealthora User'}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <p className="text-gray-600 text-xs mt-1">Member since {user?.metadata.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })
                  : '—'}</p>
              </div>
            </div>
          </motion.div>

          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="text-lg">👤</span> Personal Information
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  value={user?.email ?? ''}
                  readOnly
                  className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                />
                <p className="text-gray-600 text-xs mt-1.5">Email cannot be changed after registration.</p>
              </div>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm rounded-xl hover:opacity-90 disabled:opacity-60 transition-all"
                >
                  {savingProfile ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="text-lg">🔒</span> Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
                />
              </div>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={savingPassword}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/10 disabled:opacity-60 transition-all"
                >
                  {savingPassword ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="text-lg">🔔</span> Notification Preferences
            </h2>
            <div className="space-y-4">
              {[
                {
                  label: 'Email Notifications',
                  description: 'Receive important account updates via email',
                  value: emailNotifications,
                  setter: setEmailNotifications,
                },
                {
                  label: 'Growth Alerts',
                  description: 'Get notified when your portfolio reaches growth milestones',
                  value: growthAlerts,
                  setter: setGrowthAlerts,
                },
                {
                  label: 'Maturity Reminders',
                  description: 'Receive reminders when investments are close to maturity',
                  value: maturityReminders,
                  setter: setMaturityReminders,
                },
              ].map(({ label, description, value, setter }) => (
                <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setter(!value)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                      value ? 'bg-emerald-500' : 'bg-white/20'
                    }`}
                    role="switch"
                    aria-checked={value}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSaveNotifications}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm rounded-xl hover:opacity-90 transition-all"
              >
                Save Preferences
              </motion.button>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-500/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6"
          >
            <h2 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
              <span className="text-lg">⚠️</span> Danger Zone
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Deleting your account is permanent and cannot be undone. All your simulation data will be lost.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => toast.error('Please contact support to delete your account.')}
              className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold rounded-xl border border-red-500/20 transition-all"
            >
              Delete Account
            </motion.button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
