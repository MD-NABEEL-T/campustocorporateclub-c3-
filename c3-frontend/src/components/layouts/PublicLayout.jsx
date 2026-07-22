import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import { Footer } from '../navigation/Footer';
import { initSmoothScroll } from '../../utils/smoothScroll';

export const PublicLayout = () => {
  useEffect(() => {
    // Initialize Lenis smooth scroll on public layout
    const cleanup = initSmoothScroll();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#071A2B] text-[#F8FAFC]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
