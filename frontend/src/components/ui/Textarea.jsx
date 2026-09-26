import React from 'react';
import { cn } from '../../lib/utils';

export const Textarea = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      className,
      id,
      rows = 3,
      required,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-[#57443A] dark:text-[#C8B7AC] uppercase tracking-wider mb-1.5"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-xs">
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            required={required}
            className={cn(
              'block w-full rounded-lg border bg-white dark:bg-[#1E140F] py-2 px-3 text-sm text-[#26160F] dark:text-[#F7EFE8] placeholder:text-[#948074] dark:placeholder:text-[#6F5D53] transition duration-150',
              'border-[#D4C5B3] dark:border-[#38251C]',
              'focus:border-[#C5A059] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 dark:focus:border-[#D4AF37]',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-[#948074] dark:text-[#8F7C71]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
