import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Terminal,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  X,
} from 'lucide-react';
import { MEMBER_NAV_LINKS, ADMIN_NAV_LINKS } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';
  const links = isAdmin ? ADMIN_NAV_LINKS : MEMBER_NAV_LINKS;

  // Auto-close mobile drawer on route change
  useEffect(() => {
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 h-screen bg-black border-r border-white/10 transition-all duration-300 flex flex-col justify-between ${
          /* Desktop width */
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          /* Mobile toggle transform */
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 overflow-hidden"
              onClick={() => setMobileOpen && setMobileOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-sm text-white tracking-tight">
                    C3 PORTAL
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    {isAdmin ? 'Admin Console' : 'Member Workspace'}
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Badge Indicator */}
          {(!collapsed || mobileOpen) && (
            <div className="px-4 py-3 border-b border-white/5 bg-zinc-950">
              <Badge variant={isAdmin ? 'accent' : 'primary'} className="w-full justify-center">
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin Console
                  </>
                ) : (
                  <>
                    <UserIcon className="w-3.5 h-3.5" /> C3 Member
                  </>
                )}
              </Badge>
            </div>
          )}

          {/* Nav Links List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  title={collapsed && !mobileOpen ? link.label : undefined}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  } ${collapsed && !mobileOpen ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-black font-bold' : 'text-zinc-400'
                    }`}
                  />
                  {(!collapsed || mobileOpen) && <span>{link.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer / Logout */}
        <div className="p-3 border-t border-white/10 bg-zinc-950">
          {(!collapsed || mobileOpen) && user && (
            <div className="mb-2 px-3 py-2 rounded-xl bg-zinc-900 border border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">{user.name}</span>
                <span className="text-[10px] text-zinc-400 truncate">{user.email}</span>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              if (setMobileOpen) setMobileOpen(false);
              logout();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${
              collapsed && !mobileOpen ? 'justify-center px-0' : ''
            }`}
            title={collapsed && !mobileOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

