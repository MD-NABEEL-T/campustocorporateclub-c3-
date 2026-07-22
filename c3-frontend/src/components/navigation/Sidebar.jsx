import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Terminal,
  LogOut,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';
import { MEMBER_NAV_LINKS, ADMIN_NAV_LINKS } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';
  const links = isAdmin ? ADMIN_NAV_LINKS : MEMBER_NAV_LINKS;

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-[#071A2B] border-r border-white/10 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Logo */}
      <div>
        <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5 text-[#38BDF8]" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm text-[#F8FAFC] tracking-tight">
                  C3 PORTAL
                </span>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase">
                  {isAdmin ? 'Admin Console' : 'Member Workspace'}
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Role Badge Indicator */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-white/5 bg-[#10273D]/40">
            <Badge variant={isAdmin ? 'accent' : 'primary'} className="w-full justify-center">
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Privilege
                </>
              ) : (
                <>
                  <UserIcon className="w-3.5 h-3.5" /> Club Member
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
                title={collapsed ? link.label : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#38BDF8] text-[#071A2B] font-semibold shadow-md shadow-[#38BDF8]/10'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#071A2B]' : 'text-[#94A3B8]'}`} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer / Logout */}
      <div className="p-3 border-t border-white/10 bg-[#050E18]">
        {!collapsed && user && (
          <div className="mb-2 px-3 py-2 rounded-lg bg-[#10273D]/60 border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center font-bold text-xs">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-[#F8FAFC] truncate">{user.name}</span>
              <span className="text-[10px] text-[#94A3B8] truncate">{user.email}</span>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
