import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-[#1E140F] border border-[#E3D9CC] dark:border-[#38251C] rounded-xl p-5 shadow-xs transition-all duration-200',
        hover && 'hover:shadow-md hover:border-[#C5A059]/50 dark:hover:border-[#D4AF37]/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('flex items-center justify-between pb-4 border-b border-[#EFE8DE] dark:border-[#2A1C15] mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn('text-lg font-bold text-[#26160F] dark:text-[#F7EFE8]', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={cn('text-xs text-[#665349] dark:text-[#C8B7AC] mt-0.5', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={cn('pt-4 border-t border-[#EFE8DE] dark:border-[#2A1C15] mt-4 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);
