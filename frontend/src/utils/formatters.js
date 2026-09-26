/**
 * Data formatters for currency, status badges, function types, and strings.
 */
export { formatDate, formatTime, calculateEndDate, getTodayString, isDateToday } from './dateHelpers';


export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(num);
};

export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const FUNCTION_TYPES = {
  wedding: 'Wedding',
  reception: 'Reception',
  engagement: 'Engagement',
  birthday: 'Birthday',
  conference: 'Conference',
  seminar: 'Seminar',
  anniversary: 'Anniversary',
  naming_ceremony: 'Naming Ceremony',
  puberty_ceremony: 'Puberty Ceremony',
  other: 'Other',
};

export const getFunctionTypeLabel = (type) => {
  return FUNCTION_TYPES[type] || type || 'Other';
};

export const PAYMENT_STATUS_CONFIG = {
  not_paid: {
    label: 'Not Paid',
    bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
    color: 'danger',
  },
  partially_paid: {
    label: 'Partially Paid',
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    color: 'warning',
  },
  fully_paid: {
    label: 'Fully Paid',
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    color: 'success',
  },
};

export const getPaymentStatusBadge = (status) => {
  return PAYMENT_STATUS_CONFIG[status] || {
    label: status,
    bg: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30',
    color: 'neutral',
  };
};

export const BOOKING_STATUS_CONFIG = {
  today: {
    label: "Today's Event",
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 ring-1 ring-emerald-500/20',
    color: 'success',
  },
  upcoming: {
    label: 'Upcoming',
    bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
    color: 'info',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/30',
    color: 'neutral',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    color: 'danger',
  },
};

export const getBookingStatusBadge = (status) => {
  return BOOKING_STATUS_CONFIG[status] || {
    label: status,
    bg: 'bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/30',
    color: 'neutral',
  };
};

export const EXPENSE_CATEGORIES = {
  cleaning: 'Cleaning',
  electricity: 'Electricity',
  decoration: 'Decoration',
  maintenance: 'Maintenance',
  repair: 'Repair',
  staff: 'Staff',
  transportation: 'Transportation',
  other: 'Other',
};

export const getExpenseCategoryLabel = (cat) => {
  return EXPENSE_CATEGORIES[cat] || cat || 'Other';
};
