import { format, parseISO, isValid, addDays } from 'date-fns';

/**
 * Format date string (YYYY-MM-DD or ISO) to display format (e.g. 15 Oct 2026 or dd/MM/yyyy)
 */
export const formatDate = (dateInput, formatStr = 'dd MMM yyyy') => {
  if (!dateInput) return '-';
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (!isValid(date)) return '-';
    return format(date, formatStr);
  } catch (e) {
    return dateInput;
  }
};

/**
 * Format time string (HH:MM:SS or HH:MM) to 12-hour format (e.g. 09:00 AM)
 */
export const formatTime = (timeInput) => {
  if (!timeInput) return '-';
  try {
    const parts = timeInput.split(':');
    if (parts.length < 2) return timeInput;
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const strHours = hours < 10 ? `0${hours}` : hours;
    return `${strHours}:${minutes} ${ampm}`;
  } catch (e) {
    return timeInput;
  }
};

/**
 * Calculate End Date based on Start Date and Number of Days.
 * Formula: End Date = Start Date + Number of Days - 1
 */
export const calculateEndDate = (startDateStr, numberOfDays) => {
  if (!startDateStr || !numberOfDays || numberOfDays < 1) return startDateStr || '';
  try {
    const startDate = parseISO(startDateStr);
    if (!isValid(startDate)) return '';
    const daysToAdd = parseInt(numberOfDays, 10) - 1;
    const endDate = addDays(startDate, daysToAdd);
    return format(endDate, 'yyyy-MM-dd');
  } catch (e) {
    return '';
  }
};

/**
 * Get current date formatted as YYYY-MM-DD
 */
export const getTodayString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Check if a given date string is today
 */
export const isDateToday = (dateStr) => {
  if (!dateStr) return false;
  return dateStr === getTodayString();
};
