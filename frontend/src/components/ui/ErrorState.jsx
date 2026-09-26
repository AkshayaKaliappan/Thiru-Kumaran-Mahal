import React from 'react';
import { Button } from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ErrorState = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while fetching data from the server.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center border border-rose-200 dark:border-rose-900/40 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20',
        className
      )}
    >
      <div className="p-3.5 rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 mb-3">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-rose-900 dark:text-rose-200 mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300/80 max-w-md mb-5">
        {message}
      </p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} leftIcon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
};
