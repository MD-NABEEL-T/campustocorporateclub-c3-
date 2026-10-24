import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../navigation/Sidebar';
import { Header } from '../navigation/Header';

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-black text-[#F8FAFC] flex flex-col lg:flex-row relative"
      style={{
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Header Top Bar */}
      <Header
        collapsed={collapsed}
        setMobileOpen={setMobileOpen}
        mobileOpen={mobileOpen}
      />

      {/* Main Content Area */}
      <main
        className={`flex-grow pb-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 ml-0 ${
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
        style={{
          paddingTop: 'calc(6rem + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(3rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <Outlet context={{ collapsed, setCollapsed }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

