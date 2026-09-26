import React from 'react';
import { StatCard } from '../ui/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, Calendar, Sparkles, Receipt } from 'lucide-react';

export const ExpenseSummaryCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Expenses"
        value={formatCurrency(summary.total_expenses || 0)}
        subtitle="All-time recorded expenses"
        icon={DollarSign}
        variant="rose"
      />
      <StatCard
        title="This Month"
        value={formatCurrency(summary.this_month_expenses || 0)}
        subtitle="Current billing cycle"
        icon={Calendar}
        variant="amber"
      />
      <StatCard
        title="Cleaning Expenses"
        value={formatCurrency(summary.cleaning_expenses || 0)}
        subtitle="Sanitation & upkeep"
        icon={Sparkles}
        variant="gold"
      />
      <StatCard
        title="Other Expenses"
        value={formatCurrency(summary.other_expenses || 0)}
        subtitle="Maintenance, staff & utilities"
        icon={Receipt}
        variant="default"
      />
    </div>
  );
};
