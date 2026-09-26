import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-xl',
  className,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div
        className={cn(
          'relative w-full bg-white dark:bg-[#1E140F] border border-[#E3D9CC] dark:border-[#38251C] rounded-2xl shadow-2xl z-10 overflow-hidden my-8',
          maxWidth,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[#EFE8DE] dark:border-[#2A1C15]">
          <div>
            {title && (
              <h3 className="text-lg sm:text-xl font-bold text-[#26160F] dark:text-[#F7EFE8]">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-[#665349] dark:text-[#C8B7AC] mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#948074] hover:text-[#26160F] hover:bg-[#EFE8DE] dark:text-[#8F7C71] dark:hover:text-[#F7EFE8] dark:hover:bg-[#2A1C15] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[calc(85vh-130px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
