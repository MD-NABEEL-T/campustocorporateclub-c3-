import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, LogIn, Sparkles } from 'lucide-react';
import { PUBLIC_NAV_LINKS } from '../../constants/navigation';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#071A2B]/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#2DD4BF] p-0.5 flex items-center justify-center shadow-lg shadow-[#38BDF8]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#071A2B] rounded-[10px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-[#38BDF8]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg text-[#F8FAFC] tracking-tight leading-none">
              CAMPUS<span className="text-[#38BDF8]">2</span>CORPORATE
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8] tracking-widest uppercase mt-0.5">
              C3 Club • Official Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#10273D]/60 p-1.5 rounded-full border border-white/5">
          {PUBLIC_NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            if (link.isHighlight) return null; // Rendered as separate CTA

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#38BDF8] text-[#071A2B] font-semibold shadow-md'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/apply">
            <Button variant="accent" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Apply for Junior Batch
            </Button>
          </Link>

          {user ? (
            <Link to="/dashboard">
              <Button variant="secondary" size="sm">
                Portal Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" leftIcon={<LogIn className="w-3.5 h-3.5" />}>
                Member Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg hover:bg-white/5"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#071A2B] px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {PUBLIC_NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Link to="/apply" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="accent" size="md" className="w-full">
                Apply for Junior Batch
              </Button>
            </Link>
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="md" className="w-full">
                  Portal Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full">
                  Member Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
