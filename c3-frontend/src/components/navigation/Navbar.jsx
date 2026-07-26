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
      {/* Desktop header - flex row keeps the logo/pill-nav pinned to the far
          left and the login button pinned to the far right, both centered
          on the same vertical axis. */}
      <header className="hidden md:block sticky top-0 z-40 w-full h-20">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <DesktopNav />

          <div className="z-[99]">
            {user ? (
              <Link to="/dashboard">
                <Button variant="white" size="sm" className="font-nav">
                  Portal Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  variant="premiumBlue"
                  size="md"
                  className="font-nav tracking-wide"
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  C3 Member Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile brand mark - floats top-left, pairs with the StaggeredMenu
          toggle button (top-right) rendered inside MobileNav. Unchanged -
          PillNav never renders on mobile (hidden md:block in DesktopNav). */}
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