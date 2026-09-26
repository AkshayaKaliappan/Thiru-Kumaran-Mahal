import React from 'react';
import { cn } from '../../lib/utils';

export const Table = ({ children, className, ...props }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#E3D9CC] dark:border-[#38251C] bg-white dark:bg-[#1E140F] shadow-xs">
      <table className={cn('w-full text-left text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className, ...props }) => (
  <thead
    className={cn(
      'bg-[#FAF7F2] dark:bg-[#251812] border-b border-[#E3D9CC] dark:border-[#38251C] text-xs uppercase font-bold text-[#665349] dark:text-[#C8B7AC] tracking-wider',
      className
    )}
    {...props}
  >
    {children}
  </thead>
);

export const TableBody = ({ children, className, ...props }) => (
  <tbody className={cn('divide-y divide-[#EFE8DE] dark:divide-[#2A1C15]', className)} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className, hover = true, ...props }) => (
  <tr
    className={cn(
      'transition-colors duration-150',
      hover && 'hover:bg-[#FAF7F2] dark:hover:bg-[#251812]/70',
      className
    )}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, className, ...props }) => (
  <th className={cn('py-3.5 px-4 font-bold text-xs whitespace-nowrap', className)} {...props}>
    {children}
  </th>
);

export const TableCell = ({ children, className, ...props }) => (
  <td
    className={cn(
      'py-3.5 px-4 text-[#26160F] dark:text-[#F7EFE8] text-sm align-middle whitespace-nowrap',
      className
    )}
    {...props}
  >
    {children}
  </td>
);
