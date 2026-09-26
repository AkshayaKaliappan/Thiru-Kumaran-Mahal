import React from 'react';

export const Footer = () => {
  return (
    <footer className="no-print border-t border-[#E3D9CC] dark:border-[#38251C] bg-white/50 dark:bg-[#1E140F]/50 py-4 px-6 text-center text-xs text-[#948074] dark:text-[#8F7C71]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} Thiru Kumaran Mahal. All rights reserved.</p>
        <p className="font-medium">
          Hall Harmony — Function Hall Booking Management System
        </p>
      </div>
    </footer>
  );
};
