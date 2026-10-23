import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, X, Check, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import {
  isPushSupported,
  getNotificationPermission,
  subscribeToPush,
} from '../../utils/pushNotifications';

export const NotificationPrompt = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [showPrompt, setShowPrompt] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    // Only prompt authenticated users
    if (!user) {
      setShowPrompt(false);
      return;
    }

    if (!isPushSupported()) return;

    const permission = getNotificationPermission();

    // If permission is already granted, ensure the service worker subscription is registered in the background
    if (permission === 'granted') {
      const alreadySubscribed = localStorage.getItem('c3_notifications_enabled');
      if (!alreadySubscribed) {
        subscribeToPush(api).catch(() => {});
      }
      return;
    }

    // If permission was never asked ('default')
    if (permission === 'default') {
      const dismissedUntil = localStorage.getItem('c3_push_prompt_dismissed_until');
      const now = Date.now();
      if (!dismissedUntil || now > parseInt(dismissedUntil, 10)) {
        // Show prompt with a small delay so initial page transition is smooth
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleEnable = async () => {
    setSubscribing(true);
    try {
      await subscribeToPush(api);
      setShowPrompt(false);
      addToast('🔔 Notifications enabled! You will receive session & 12:55 PM reminders.', 'success');
    } catch (err) {
      console.error('Subscription error:', err);
      addToast(err.message || 'Failed to enable notifications', 'warning');
      setShowPrompt(false);
    } finally {
      setSubscribing(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Dismiss for 2 days
    const snoozeUntil = Date.now() + 2 * 24 * 60 * 60 * 1000;
    localStorage.setItem('c3_push_prompt_dismissed_until', snoozeUntil.toString());
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 pointer-events-auto"
      >
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-zinc-950/95 p-4 sm:p-5 shadow-2xl shadow-sky-950/30 backdrop-blur-xl ring-1 ring-white/10">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 text-sky-400 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                  New Feature
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                Get Session & 12:55 PM Reminders
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Receive instant notifications on your phone when sessions or club announcements are posted, plus automated 5-minute pre-session reminders!
              </p>
            </div>

            <button
              onClick={handleDismiss}
              aria-label="Dismiss"
              className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-2 relative z-10">
            <button
              onClick={handleDismiss}
              disabled={subscribing}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleEnable}
              disabled={subscribing}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10 active:scale-95 disabled:opacity-50"
            >
              {subscribing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enabling...</span>
                </>
              ) : (
                <>
                  <BellRing className="w-4 h-4 text-sky-600" />
                  <span>Enable Notifications</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPrompt;
