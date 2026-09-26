import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const LoadingState = ({ message = 'Loading...', className }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-[#C5A059]/10 text-[#C5A059] mb-3 animate-pulse">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
      <p className="text-sm font-medium text-[#665349] dark:text-[#C8B7AC]">{message}</p>
    </div>
  );
};
