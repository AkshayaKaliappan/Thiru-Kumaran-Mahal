import React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalCount = 0,
  pageSize = 20,
  onPageChange,
  className = '',
}) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  if (totalPages <= 1) return null;

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-sm text-[#665349] dark:text-[#C8B7AC] ${className}`}
    >
      <div>
        Showing <span className="font-semibold text-[#26160F] dark:text-[#F7EFE8]">{startRecord}</span> to{' '}
        <span className="font-semibold text-[#26160F] dark:text-[#F7EFE8]">{endRecord}</span> of{' '}
        <span className="font-semibold text-[#26160F] dark:text-[#F7EFE8]">{totalCount}</span> entries
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#EFE8DE] dark:bg-[#2A1C15] text-[#26160F] dark:text-[#F7EFE8]">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
