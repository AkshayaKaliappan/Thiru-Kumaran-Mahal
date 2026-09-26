import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(
  (
    {
      children,
      className,
      variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'gold'
      size = 'md', // 'sm' | 'md' | 'lg' | 'icon'
      isLoading = false,
      disabled = false,
      type = 'button',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer';

    const variants = {
      primary:
        'bg-[#7B4B32] hover:bg-[#643C27] text-white shadow-sm focus:ring-[#7B4B32] dark:bg-[#A06443] dark:hover:bg-[#B5734F] dark:focus:ring-[#A06443]',
      gold:
        'bg-[#C5A059] hover:bg-[#B08B42] text-[#1F130E] font-semibold shadow-sm focus:ring-[#C5A059] dark:bg-[#D4AF37] dark:hover:bg-[#E5C358]',
      secondary:
        'bg-[#EFE8DE] hover:bg-[#E3D9CC] text-[#26160F] focus:ring-[#C5A059] dark:bg-[#2A1C15] dark:hover:bg-[#38251C] dark:text-[#F7EFE8]',
      outline:
        'border border-[#D4C5B3] hover:bg-[#F6F1EA] text-[#26160F] dark:border-[#38251C] dark:text-[#F7EFE8] dark:hover:bg-[#2B1D16]',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-600 dark:bg-red-700 dark:hover:bg-red-800',
      ghost:
        'text-[#665349] hover:bg-[#F6F1EA] hover:text-[#26160F] dark:text-[#C8B7AC] dark:hover:bg-[#2B1D16] dark:hover:text-[#F7EFE8]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : LeftIcon ? (
          <LeftIcon className="w-4 h-4 shrink-0" />
        ) : null}
        {children}
        {!isLoading && RightIcon ? <RightIcon className="w-4 h-4 shrink-0" /> : null}
      </button>
    );
  }
);

Button.displayName = 'Button';
