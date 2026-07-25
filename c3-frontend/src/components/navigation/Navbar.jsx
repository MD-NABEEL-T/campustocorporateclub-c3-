import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Desktop header - fully transparent, sits in normal flow (sticky,
          not fixed) so it never overlaps page content below it. Only the
          nav pill itself carries the glass treatment. */}
      <header className="hidden md:block sticky top-0 z-40 w-full">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#2DD4BF] p-0.5 flex items-center justify-center shadow-lg shadow-[#3B82F6]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-[#3B82F6]" />
              </div>
            </div>
            <span className="font-brand text-xl text-white tracking-tight leading-none">
              C3
            </span>
          </Link>

          {/* Glass pill - absolutely centered relative to the full header */}
<div className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-b from-white/[0.12] to-white/[0.06] backdrop-blur-xl border border-white/15 rounded-full px-2 py-2 shadow-lg shadow-black/20">            <DesktopNav />
          </div>

          <div className="shrink-0">
            {user ? (
              <Link to="/dashboard">
                <Button variant="glass" size="sm" className="font-nav">
                  Portal Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="glass" size="sm" className="font-nav" leftIcon={<LogIn className="w-3.5 h-3.5" />}>
                  C3 Member Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile brand mark - floats top-left, pairs with the StaggeredMenu
          toggle button (top-right) rendered inside MobileNav */}
      <Link to="/" className="md:hidden fixed top-6 left-6 z-50 flex items-center gap-2">
<div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-white to-[#A1A1AA] p-0.5 flex items-center justify-center shadow-lg shadow-white/10">
          <div className="w-full h-full bg-black rounded-[8px] flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
        </div>
        <span className="font-brand text-sm text-white tracking-tight">C3</span>
      </Link>

      <MobileNav />
    </>
  );
};

export default Navbar;