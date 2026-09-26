import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Toaster } from 'sonner';

export const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FAF7F2] dark:bg-[#140D0A] p-4 sm:p-6 transition-colors duration-200">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-[#E3D9CC] dark:border-[#38251C] text-[#665349] dark:text-[#C8B7AC] hover:bg-white dark:hover:bg-[#251812] transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#D4AF37]" />
          ) : (
            <Moon className="w-4 h-4 text-[#7B4B32]" />
          )}
        </button>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-linear-to-tr from-[#7B4B32] to-[#C5A059] items-center justify-center text-white shadow-lg mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#26160F] dark:text-[#F7EFE8] tracking-tight">
            Thiru Kumaran Mahal
          </h1>
          <p className="text-xs uppercase tracking-widest font-bold text-[#C5A059] dark:text-[#D4AF37] mt-1">
            Hall Harmony — Owner Portal
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-[#1E140F] border border-[#E3D9CC] dark:border-[#38251C] rounded-2xl p-6 sm:p-8 shadow-xl">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-[#948074] dark:text-[#8F7C71]">
          Function Hall Booking Management System
        </div>
      </div>

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};
