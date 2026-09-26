import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import {
  Menu,
  Sun,
  Moon,
  Search,
  LogOut,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#1E140F]/90 backdrop-blur-md border-b border-[#E3D9CC] dark:border-[#38251C] transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Mobile Menu button & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-[#665349] hover:text-[#26160F] hover:bg-[#EFE8DE] dark:text-[#C8B7AC] dark:hover:text-[#F7EFE8] dark:hover:bg-[#2A1C15] transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#7B4B32] to-[#C5A059] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="font-extrabold text-base tracking-tight text-[#26160F] dark:text-[#F7EFE8] block leading-tight">
                Thiru Kumaran Mahal
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] dark:text-[#D4AF37]">
                Hall Harmony
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Quick Search Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-[#D4C5B3] dark:border-[#38251C] bg-[#FAF7F2] dark:bg-[#251812] text-xs text-[#948074] dark:text-[#8F7C71] hover:border-[#C5A059] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#C5A059]" />
              <span>Search party, booking no, phone...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#EFE8DE] dark:bg-[#1E140F] border border-[#D4C5B3] dark:border-[#38251C] rounded text-[#665349] dark:text-[#C8B7AC]">
              /search
            </kbd>
          </button>
        </div>

        {/* Right: Theme Toggle & User Menu */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[#E3D9CC] dark:border-[#38251C] text-[#665349] dark:text-[#C8B7AC] hover:bg-[#FAF7F2] dark:hover:bg-[#251812] transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <Moon className="w-4 h-4 text-[#7B4B32]" />
            )}
          </button>

          {/* User Info & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E3D9CC] dark:border-[#38251C]">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-[#26160F] dark:text-[#F7EFE8] leading-tight">
                {user?.profile?.full_name || user?.username || 'Owner Admin'}
              </span>
              <span className="text-[10px] font-semibold uppercase text-[#C5A059] dark:text-[#D4AF37]">
                {isAdmin ? 'Administrator' : 'Staff'}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#EFE8DE] dark:bg-[#2A1C15] border border-[#D4C5B3] dark:border-[#38251C] flex items-center justify-center text-[#7B4B32] dark:text-[#D4AF37]">
              <UserIcon className="w-4 h-4" />
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-[#948074] hover:text-rose-600 hover:bg-rose-50 dark:text-[#8F7C71] dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
