import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'primary' | 'gold'
  isLoading = false,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-xl shrink-0 ${
            variant === 'danger'
              ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
              : 'bg-[#C5A059]/15 text-[#C5A059]'
          }`}
        >
          {variant === 'danger' ? (
            <AlertTriangle className="w-6 h-6" />
          ) : (
            <Info className="w-6 h-6" />
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[#26160F] dark:text-[#F7EFE8]">{title}</h3>
          <p className="text-sm text-[#665349] dark:text-[#C8B7AC]">{description}</p>
        </div>
      </div>

      {children && <div className="mt-4">{children}</div>}

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#EFE8DE] dark:border-[#2A1C15]">
        <Button variant="outline" size="md" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant}
          size="md"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
