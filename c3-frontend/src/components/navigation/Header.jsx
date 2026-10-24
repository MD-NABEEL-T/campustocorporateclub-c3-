import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  User,
  LogOut,
  Shield,
  ChevronDown,
  Bell,
  Menu,
  Download,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usePWA } from '../../context/PWAContext';
import { getPageTitle } from '../../constants/navigation';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { ChangePasswordModal } from '../auth/ChangePasswordModal';
import {
  getDevicePushStatus,
  subscribeToPush,
  unsubscribeFromPush,
} from '../../utils/pushNotifications';
import api from '../../api/axios';

export const Header = ({ collapsed, setMobileOpen, mobileOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const { canInstall, promptInstall } = usePWA();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [pushStatus, setPushStatus] = useState('off');
  const [isTogglingPush, setIsTogglingPush] = useState(false);
  const [isTestingPush, setIsTestingPush] = useState(false);

  // Fetch device push capabilities / permission status
  const refreshPushStatus = useCallback(async () => {
    try {
      const status = await getDevicePushStatus();
      setPushStatus(status);
    } catch {
      setPushStatus('off');
    }
  }, []);

  // Fetch notifications silently without loading banners or error toasts
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications?limit=30', { silent: true });
      setNotifications(res.data.items || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch {
      // silent poll
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    refreshPushStatus();

    // 60-second silent poll while visible
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchNotifications();
      }
    }, 60000);

    const handleFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchNotifications();
        refreshPushStatus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [user, fetchNotifications, refreshPushStatus]);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`, {}, { silent: true });
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, readAt: new Date() } : item))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all', {}, { silent: true });
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, readAt: item.readAt || new Date() }))
      );
      setUnreadCount(0);
      addToast('All notifications marked as read', 'info');
    } catch {
      // ignore
    }
  };

  const handleTogglePush = async (turnOn) => {
    setIsTogglingPush(true);
    try {
      if (turnOn) {
        await subscribeToPush(api);
        addToast('Push notifications enabled for this device', 'success');
      } else {
        await unsubscribeFromPush(api);
        addToast('Push notifications turned off on this device', 'info');
      }
      await refreshPushStatus();
    } catch (err) {
      addToast(err.message || 'Failed to update push notifications', 'warning');
      await refreshPushStatus();
    } finally {
      setIsTogglingPush(false);
    }
  };

  const handleSendTestPush = async () => {
    setIsTestingPush(true);
    try {
      await api.post('/notifications/test');
      addToast('Test notification dispatched!', 'success');
      await fetchNotifications();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send test notification', 'warning');
    } finally {
      setIsTestingPush(false);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-20 bg-black/85 backdrop-blur-md border-b border-white/10 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 left-0 ${
        collapsed ? 'lg:left-20' : 'lg:left-64'
      }`}
      style={{
        height: 'calc(5rem + env(safe-area-inset-top, 0px))',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileOpen && setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl border border-white/10 bg-white/[0.03] text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold font-heading text-[#F8FAFC] leading-tight">
            {getPageTitle(location.pathname, user?.role)}
          </h1>
          <p className="text-[11px] text-[#94A3B8] font-mono hidden sm:block">
            Campus to Corporate Club • Official Platform
          </p>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Header Bell with Unread Badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setPanelOpen(!panelOpen);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-sky-500 text-white font-mono font-bold text-[10px] flex items-center justify-center border-2 border-black animate-in fade-in">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationPanel
            isOpen={panelOpen}
            onClose={() => setPanelOpen(false)}
            items={notifications}
            unreadCount={unreadCount}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            pushStatus={pushStatus}
            onTogglePush={handleTogglePush}
            onSendTest={handleSendTestPush}
            isTogglingPush={isTogglingPush}
            isTestingPush={isTestingPush}
          />
        </div>

        {/* Profile Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setPanelOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-3 p-1.5 pr-2.5 sm:pr-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/30 transition-all cursor-pointer"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white">{user?.name}</span>
              <span className="text-[10px] text-zinc-400 capitalize font-mono">{user?.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-zinc-950 border border-white/15 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-white/5">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
              </div>

              {canInstall && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    promptInstall();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors text-left cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400 shrink-0" /> Install App
                </button>
              )}

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5"
                >
                  <Shield className="w-4 h-4 text-white" /> Admin Console
                </Link>
              )}

              {/* Change Password for everyone */}
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  setChangePasswordOpen(true);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-zinc-400 shrink-0" /> Change Password
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 border-t border-white/5 mt-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </header>
  );
};

export default Header;
