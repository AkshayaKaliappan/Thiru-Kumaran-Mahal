import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({
  children,
  className,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold'
  size = 'md', // 'sm' | 'md'
}) => {
  const variants = {
    default:
      'bg-[#EFE8DE] text-[#57443A] border-[#D4C5B3] dark:bg-[#2A1C15] dark:text-[#C8B7AC] dark:border-[#38251C]',
    gold:
      'bg-[#C5A059]/15 text-[#8A6A23] border-[#C5A059]/40 dark:bg-[#D4AF37]/20 dark:text-[#F3D370] dark:border-[#D4AF37]/40',
    success:
      'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40',
    warning:
      'bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40',
    danger:
      'bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40',
    info:
      'bg-sky-500/10 text-sky-700 border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/40',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border tracking-wide whitespace-nowrap',
        variants[variant] || variants.default,
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
