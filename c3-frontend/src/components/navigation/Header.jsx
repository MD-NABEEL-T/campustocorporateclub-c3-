import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User, LogOut, Shield, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ collapsed }) => {
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
      className={`fixed top-0 right-0 z-20 h-20 bg-[#071A2B]/90 backdrop-blur-md border-b border-white/10 transition-all duration-300 flex items-center justify-between px-6 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Page Title / Breadcrumb */}
      <div>
        <h1 className="text-lg font-bold font-heading text-[#F8FAFC]">
          {getPageTitle(location.pathname)}
        </h1>
        <p className="text-xs text-[#94A3B8] font-mono">
          Campus to Corporate Club • Official Platform
        </p>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon (Placeholder) */}
        <button className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#38BDF8]" />
        </button>

        {/* Profile Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-[#10273D] border border-white/10 hover:border-[#38BDF8]/40 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#F8FAFC]">{user?.name}</span>
              <span className="text-[10px] text-[#38BDF8] capitalize font-mono">{user?.role}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-[#10273D] border border-white/10 rounded-xl shadow-2xl py-2 z-50"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-white/5">
                <p className="text-xs font-bold text-[#F8FAFC]">{user?.name}</p>
                <p className="text-[10px] text-[#94A3B8] truncate">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
              >
                <User className="w-4 h-4 text-[#38BDF8]" /> Profile Settings
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
                >
                  <Shield className="w-4 h-4 text-[#2DD4BF]" /> Admin Console
                </Link>
              )}

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 border-t border-white/5 mt-1"
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
