import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import { Footer } from '../navigation/Footer';
import { initSmoothScroll } from '../../utils/smoothScroll';
import FloatingEventBtn from '../../event-module/components/FloatingEventBtn';
import ClickSpark from '../reactbits/ClickSpark';

export const PublicLayout = () => {
  useEffect(() => {
    // Initialize Lenis smooth scroll on public layout
    const cleanup = initSmoothScroll();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <ClickSpark sparkColor="#ffffff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={350}>
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <FloatingEventBtn />
      </div>
    </ClickSpark>
  );
};
