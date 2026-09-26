import { z } from 'zod';
import { calculateEndDate } from './dateHelpers';

export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Full Name must be at least 2 characters'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(150, 'Username cannot exceed 150 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const bookingSchema = z
  .object({
    party_name: z.string().min(2, 'Party/Customer Name is required'),
    contact_number: z
      .string()
      .regex(INDIAN_PHONE_REGEX, 'Enter a valid 10-digit Indian mobile number (starts with 6-9)'),
    alternate_contact: z
      .string()
      .optional()
      .refine(
        (val) => !val || INDIAN_PHONE_REGEX.test(val),
        'Enter a valid 10-digit Indian mobile number'
      ),
    function_type: z.string().min(1, 'Please select a function type'),
    start_date: z.string().min(1, 'Start Date is required'),
    number_of_days: z.coerce.number().min(1, 'Number of days must be at least 1'),
    end_date: z.string().optional(),
    from_time: z.string().min(1, 'Start time is required'),
    end_time: z.string().min(1, 'End time is required'),
    total_payment: z.coerce.number().min(0, 'Total payment cannot be negative'),
    received_payment: z.coerce.number().min(0, 'Received payment cannot be negative').default(0),
    remarks: z.string().optional(),
  })
  .refine((data) => (data.received_payment || 0) <= data.total_payment, {
    message: 'Received payment cannot exceed total payment',
    path: ['received_payment'],
  });

export const paymentUpdateSchema = z
  .object({
    total_payment: z.coerce.number().min(0, 'Total payment cannot be negative'),
    received_payment: z.coerce.number().min(0, 'Received payment cannot be negative'),
  })
  .refine((data) => data.received_payment <= data.total_payment, {
    message: 'Received payment cannot exceed total payment',
    path: ['received_payment'],
  });

export const expenseSchema = z.object({
  expense_date: z.string().min(1, 'Expense date is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
  amount: z.coerce.number().min(0, 'Amount cannot be negative'),
  notes: z.string().optional(),
});

export const cancelBookingSchema = z.object({
  cancellation_reason: z.string().optional(),
});
