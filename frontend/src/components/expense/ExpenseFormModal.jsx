import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema } from '../../utils/validation';
import { EXPENSE_CATEGORIES } from '../../utils/formatters';
import { getTodayString } from '../../utils/dateHelpers';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Calendar, DollarSign, Tag, FileText } from 'lucide-react';

export const ExpenseFormModal = ({
  isOpen,
  onClose,
  expense,
  onSubmit,
  isLoading = false,
}) => {
  const isEdit = !!expense;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expense_date: getTodayString(),
      category: 'cleaning',
      description: '',
      amount: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (expense) {
      reset({
        expense_date: expense.expense_date,
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        notes: expense.notes || '',
      });
    } else {
      reset({
        expense_date: getTodayString(),
        category: 'cleaning',
        description: '',
        amount: '',
        notes: '',
      });
    }
  }, [expense, reset, isOpen]);

  const categoryOptions = Object.entries(EXPENSE_CATEGORIES).map(([value, label]) => ({
    value,
    label,
  }));

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Expense Record' : 'Record New Expense'}
      description="Track function hall operational and maintenance costs"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Expense Date"
            type="date"
            required
            leftIcon={Calendar}
            error={errors.expense_date?.message}
            {...register('expense_date')}
          />

          <Select
            label="Category"
            options={categoryOptions}
            required
            error={errors.category?.message}
            {...register('category')}
          />
        </div>

        <Input
          label="Description"
          placeholder="e.g. Stage power backup fuel, Deep cleaning chemicals"
          required
          leftIcon={Tag}
          error={errors.description?.message}
          {...register('description')}
        />

        <Input
          label="Amount (₹)"
          type="number"
          step="0.01"
          min={0}
          required
          placeholder="0.00"
          leftIcon={DollarSign}
          error={errors.amount?.message}
          {...register('amount')}
        />

        <Textarea
          label="Notes / Vendor / Bill Details (Optional)"
          placeholder="e.g. Paid via UPI to Kumar cleaners, Bill #492"
          rows={3}
          error={errors.notes?.message}
          {...register('notes')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EFE8DE] dark:border-[#2A1C15]">
          <Button variant="outline" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="gold" size="md" type="submit" isLoading={isLoading}>
            {isEdit ? 'Update Expense' : 'Save Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
