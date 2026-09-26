import React from 'react';
import { cn } from '../../lib/utils';

export const Tabs = ({ tabs = [], activeTab, onChange, className }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 p-1.5 rounded-xl bg-[#EFE8DE] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C] overflow-x-auto',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0',
              isActive
                ? 'bg-white dark:bg-[#1E140F] text-[#7B4B32] dark:text-[#D4AF37] shadow-xs border border-[#E3D9CC]/80 dark:border-[#38251C]'
                : 'text-[#665349] dark:text-[#C8B7AC] hover:text-[#26160F] dark:hover:text-[#F7EFE8] hover:bg-white/40 dark:hover:bg-white/5'
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-1 px-2 py-0.5 text-xs rounded-full font-bold',
                  isActive
                    ? 'bg-[#7B4B32]/10 text-[#7B4B32] dark:bg-[#D4AF37]/20 dark:text-[#D4AF37]'
                    : 'bg-[#E3D9CC] text-[#665349] dark:bg-[#38251C] dark:text-[#C8B7AC]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
