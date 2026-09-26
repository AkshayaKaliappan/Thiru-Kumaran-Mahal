import React from 'react';
import { Button } from './Button';
import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching your criteria at this time.',
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-[#E3D9CC] dark:border-[#38251C] rounded-2xl bg-[#FAF7F2]/50 dark:bg-[#1E140F]/50',
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-[#EFE8DE] dark:bg-[#2A1C15] text-[#7B4B32] dark:text-[#D4AF37] mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-[#26160F] dark:text-[#F7EFE8] mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-[#665349] dark:text-[#C8B7AC] max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
