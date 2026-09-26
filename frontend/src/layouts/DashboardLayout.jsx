import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { Toaster } from 'sonner';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#140D0A] text-[#26160F] dark:text-[#F7EFE8] transition-colors duration-200">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      <Footer />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
};
