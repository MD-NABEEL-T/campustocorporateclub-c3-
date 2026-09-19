import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User, LogOut, Shield, ChevronDown, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ collapsed, setMobileOpen, mobileOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Helper to generate readable breadcrumbs
  const getPageTitle = (path) => {
    if (path === '/dashboard' || path === '/admin') return 'Dashboard Overview';
    if (path.startsWith('/admin/members')) return 'Member Roster & Onboarding';
    if (path.startsWith('/admin/applications')) return 'Junior Applications Desk';
    if (path.startsWith('/admin/sessions')) return 'Sessions Operations Desk';
    if (path.startsWith('/admin/events')) return 'Events Operations Desk';
    if (path.startsWith('/admin/attendance')) return 'Global Attendance Matrix';
    if (path.startsWith('/sessions')) return 'Daily Sessions Archive';
    if (path.startsWith('/attendance')) return 'Personal Attendance Record';
    if (path.startsWith('/events')) return 'Events & Post-Event Reports';
    if (path.startsWith('/resources')) return 'Learning Resources Hub';
    if (path.startsWith('/announcements')) return 'Official Announcements';
    if (path.startsWith('/profile')) return 'My Profile & Settings';
    return 'Portal';
  };

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-20 bg-black/85 backdrop-blur-md border-b border-white/10 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 left-0 ${
        collapsed ? 'lg:left-20' : 'lg:left-64'
      }`}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileOpen && setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl border border-white/10 bg-white/[0.03] text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold font-heading text-[#F8FAFC] leading-tight">
            {getPageTitle(location.pathname)}
          </h1>
          <p className="text-[11px] text-[#94A3B8] font-mono hidden sm:block">
            Campus to Corporate Club • Official Platform
          </p>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Profile Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 p-1.5 pr-2.5 sm:pr-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/30 transition-all"
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
              className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-white/15 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-white/5">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
              </div>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5"
                >
                  <Shield className="w-4 h-4 text-white" /> Admin Console
                </Link>
              )}

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 border-t border-white/5 mt-1"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

