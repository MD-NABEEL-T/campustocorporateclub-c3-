import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BellOff,
  CheckCheck,
  X,
  Share,
  PlusSquare,
  AlertTriangle,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../ui/Button';

const getRelativeTime = (dateVal) => {
  if (!dateVal) return 'Recently';
  const d = new Date(dateVal);
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const NotificationPanel = ({
  isOpen,
  onClose,
  items = [],
  unreadCount = 0,
  onMarkRead,
  onMarkAllRead,
  pushStatus, // 'not_installed' | 'unsupported' | 'blocked' | 'on' | 'off'
  onTogglePush,
  onSendTest,
  isTogglingPush = false,
  isTestingPush = false,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleItemClick = (item) => {
    if (!item.readAt && onMarkRead) {
      onMarkRead(item._id);
    }
    onClose();
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Container: Full-width sheet on mobile, anchored popover on desktop */}
      <div
        className="fixed inset-x-0 bottom-0 max-h-[85vh] lg:max-h-[600px] lg:absolute lg:top-full lg:bottom-auto lg:right-0 lg:left-auto lg:mt-3 lg:w-[420px] bg-zinc-950 border border-white/15 rounded-t-3xl lg:rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-2xl"
        style={{
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    {unreadCount > 99 ? '99+' : unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">Sessions, reminders & alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close notifications panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Device Push Controls Bar */}
        <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 shrink-0 text-xs">
          {pushStatus === 'not_installed' ? (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <Share className="w-3.5 h-3.5 text-amber-400" />
                <span>Add C3 to your Home Screen first to get notifications</span>
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                On iOS Safari, tap the Share icon at the bottom, then choose "Add to Home Screen".
              </p>
            </div>
          ) : pushStatus === 'blocked' ? (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Push notifications blocked in browser</p>
                <p className="text-[11px] text-red-300/80 mt-0.5">
                  To receive session alerts on this device, allow notifications in your browser site settings.
                </p>
              </div>
            </div>
          ) : pushStatus === 'unsupported' ? null : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-300">Push notifications on this device</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      pushStatus === 'on'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400 border-white/10'
                    }`}
                  >
                    {pushStatus === 'on' ? 'Enabled' : 'Off'}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isTogglingPush}
                  onClick={() => onTogglePush(pushStatus !== 'on')}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    pushStatus === 'on' ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                  aria-label="Toggle push notifications"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      pushStatus === 'on' ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {pushStatus === 'on' && (
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-mono">Test delivery:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSendTest}
                    disabled={isTestingPush}
                    className="h-6 px-2 text-[10px] text-sky-400 hover:text-sky-300 hover:bg-sky-500/10"
                    leftIcon={
                      isTestingPush ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Send className="w-3 h-3" />
                      )
                    }
                  >
                    Send test notification to this device
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5 overscroll-contain">
          {items.length === 0 ? (
            <div className="py-12 px-6 text-center space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-zinc-500">
                <BellOff className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">No notifications</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                You're all caught up! When a peer session is announced, cancelled, or starting soon, it will appear here.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const isUnread = !item.readAt;
              return (
                <div
                  key={item._id}
                  onClick={() => handleItemClick(item)}
                  className={`p-4 transition-colors cursor-pointer group flex items-start justify-between gap-3 ${
                    isUnread
                      ? 'bg-sky-500/[0.04] hover:bg-sky-500/[0.08]'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isUnread ? 'text-white' : 'text-zinc-300'
                        }`}
                      >
                        {item.title}
                      </p>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" aria-label="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {item.body}
                    </p>
                    <span className="text-[10px] font-mono text-zinc-500 block pt-0.5">
                      {getRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0 mt-1 transition-colors" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
