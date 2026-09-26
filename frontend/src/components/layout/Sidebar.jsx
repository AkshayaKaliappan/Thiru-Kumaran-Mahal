import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  Receipt,
  FileBarChart2,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'New Booking', path: '/bookings/new', icon: CalendarPlus },
    { label: 'Booked List', path: '/bookings', icon: CalendarDays },
    { label: 'Additional Expenses', path: '/expenses', icon: Receipt },
    { label: 'Reports', path: '/reports', icon: FileBarChart2 },
    { label: 'Global Search', path: '/search', icon: Search },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#E3D9CC] dark:border-[#38251C]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#7B4B32] to-[#C5A059] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-tight text-[#26160F] dark:text-[#F7EFE8] leading-tight">
              Thiru Kumaran Mahal
            </h2>
            <p className="text-[10px] uppercase font-bold text-[#C5A059] dark:text-[#D4AF37] tracking-wider">
              Management Portal
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-[#948074] hover:text-[#26160F] hover:bg-[#EFE8DE] dark:text-[#8F7C71] dark:hover:text-[#F7EFE8] dark:hover:bg-[#2A1C15]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#948074] dark:text-[#8F7C71] px-3 mb-2">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-[#7B4B32] text-white shadow-sm dark:bg-[#C5A059] dark:text-[#1F130E]'
                    : 'text-[#665349] hover:text-[#26160F] hover:bg-[#FAF7F2] dark:text-[#C8B7AC] dark:hover:text-[#F7EFE8] dark:hover:bg-[#251812]'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 m-4 rounded-xl bg-[#FAF7F2] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-bold text-[#26160F] dark:text-[#F7EFE8]">
            System Online
          </span>
        </div>
        <p className="text-[10px] text-[#948074] dark:text-[#8F7C71] leading-relaxed">
          Thiru Kumaran Mahal Booking Management System
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-[#E3D9CC] dark:border-[#38251C] bg-white dark:bg-[#1E140F] min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-[#1E140F] h-full shadow-2xl z-10 border-r border-[#E3D9CC] dark:border-[#38251C]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
