import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, LogIn, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Desktop header - hidden on mobile; StaggeredMenu (MobileNav) takes over below md */}
      <header className="hidden md:block sticky top-0 z-40 w-full border-b border-white/10 bg-[#071A2B]/85 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
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

          <DesktopNav />

          <div className="flex items-center gap-3 shrink-0">
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
        </div>
      </header>

      {/* Mobile brand mark - floats top-left, pairs with the StaggeredMenu
          toggle button (top-right) rendered inside MobileNav */}
      <Link to="/" className="md:hidden fixed top-6 left-6 z-50 flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#38BDF8] to-[#2DD4BF] p-0.5 flex items-center justify-center shadow-lg shadow-[#38BDF8]/20">
          <div className="w-full h-full bg-[#071A2B] rounded-[8px] flex items-center justify-center">
            <Terminal className="w-4 h-4 text-[#38BDF8]" />
          </div>
        </div>
        <span className="font-heading font-extrabold text-sm text-[#F8FAFC] tracking-tight">
          C3
        </span>
      </Link>

      <MobileNav />
    </>
  );
};

export default Navbar;