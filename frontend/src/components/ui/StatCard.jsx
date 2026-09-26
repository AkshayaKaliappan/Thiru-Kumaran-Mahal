import React from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default', // 'default' | 'gold' | 'emerald' | 'rose' | 'amber'
  className,
}) => {
  const iconVariants = {
    default: 'bg-[#7B4B32]/10 text-[#7B4B32] dark:bg-[#A06443]/20 dark:text-[#E5C358]',
    gold: 'bg-[#C5A059]/15 text-[#8A6A23] dark:bg-[#D4AF37]/20 dark:text-[#F3D370]',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  };

  return (
    <Card hover className={cn('relative overflow-hidden transition-all duration-200', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#665349] dark:text-[#C8B7AC]">
            {title}
          </p>
          <div className="text-2xl font-black text-[#26160F] dark:text-[#F7EFE8] tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-[#948074] dark:text-[#8F7C71]">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-xl shrink-0', iconVariants[variant] || iconVariants.default)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
};
