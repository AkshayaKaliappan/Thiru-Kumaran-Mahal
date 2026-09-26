import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { expenseService } from '../services/expenseService';
import { formatCurrency, formatDate, getExpenseCategoryLabel, EXPENSE_CATEGORIES } from '../utils/formatters';

import { ExpenseSummaryCards } from '../components/expense/ExpenseSummaryCards';
import { ExpenseFormModal } from '../components/expense/ExpenseFormModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

import {
  Receipt,
  Plus,
  Search,
  RotateCcw,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

export const Expenses = () => {
  const {
    expenses,
    summary,
    loading,
    totalCount,
    page,
    setPage,
    search,
    setSearch,
    category,
    setCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearFilters,
    refresh,
  } = useExpenses();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedExpenseForEdit, setSelectedExpenseForEdit] = useState(null);
  const [selectedExpenseForDelete, setSelectedExpenseForDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const categoryOptions = Object.entries(EXPENSE_CATEGORIES).map(([value, label]) => ({
    value,
    label,
  }));

  const handleOpenCreate = () => {
    setSelectedExpenseForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setSelectedExpenseForEdit(exp);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedExpenseForEdit) {
        await expenseService.updateExpense(selectedExpenseForEdit.id, formData);
        toast.success('Expense updated successfully');
      } else {
        await expenseService.createExpense(formData);
        toast.success('Expense recorded successfully');
      }
      setIsFormModalOpen(false);
      setSelectedExpenseForEdit(null);
      refresh();
    } catch (err) {
      console.error('Expense save error:', err);
      toast.error(err.response?.data?.error || 'Failed to save expense');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedExpenseForDelete) return;
    setActionLoading(true);
    try {
      await expenseService.deleteExpense(selectedExpenseForDelete.id);
      toast.success('Expense deleted successfully');
      setSelectedExpenseForDelete(null);
      refresh();
    } catch (err) {
      console.error('Expense delete error:', err);
      toast.error('Failed to delete expense');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3D9CC] dark:border-[#38251C]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#26160F] dark:text-[#F7EFE8] tracking-tight">
            Additional Expenses
          </h1>
          <p className="text-xs sm:text-sm text-[#665349] dark:text-[#C8B7AC] mt-0.5">
            Log hall maintenance, utilities, cleaning, and operational expenditures
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={Plus}
        >
          Add Expense
        </Button>
      </div>

      {/* 2. Expense Summary Cards */}
      <ExpenseSummaryCards summary={summary} />

      {/* 3. Search & Filters Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1E140F] border border-[#E3D9CC] dark:border-[#38251C] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search by Description */}
          <Input
            placeholder="Search expense description..."
            leftIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Category Filter */}
          <Select
            placeholder="All Categories"
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          {/* Start Date */}
          <Input
            type="date"
            placeholder="From Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          {/* End Date */}
          <Input
            type="date"
            placeholder="To Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-2 border-t border-[#EFE8DE] dark:border-[#2A1C15]">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            leftIcon={RotateCcw}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* 4. Expenses Table */}
      {loading ? (
        <LoadingState message="Loading operational expenses..." />
      ) : expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses recorded"
          description={
            search || category || startDate || endDate
              ? 'No expense entries match your current search or date filters.'
              : 'Keep track of all maintenance and operating costs in one place.'
          }
          actionLabel="Add First Expense"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((exp) => (
                <TableRow key={exp.id}>
                  {/* Date */}
                  <TableCell>
                    <span className="font-semibold text-xs text-[#26160F] dark:text-[#F7EFE8]">
                      {formatDate(exp.expense_date)}
                    </span>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Badge variant="gold" size="sm">
                      {exp.category_display || getExpenseCategoryLabel(exp.category)}
                    </Badge>
                  </TableCell>

                  {/* Description */}
                  <TableCell>
                    <div className="font-bold text-sm text-[#26160F] dark:text-[#F7EFE8]">
                      {exp.description}
                    </div>
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    <span className="font-black text-sm text-rose-600 dark:text-rose-400">
                      {formatCurrency(exp.amount)}
                    </span>
                  </TableCell>

                  {/* Notes */}
                  <TableCell>
                    <span className="text-xs text-[#665349] dark:text-[#C8B7AC] line-clamp-1 max-w-xs">
                      {exp.notes || '-'}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(exp)}
                        title="Edit Expense"
                      >
                        <Edit className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedExpenseForDelete(exp)}
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalCount={totalCount}
            pageSize={20}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      <ExpenseFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedExpenseForEdit(null);
        }}
        expense={selectedExpenseForEdit}
        onSubmit={handleFormSubmit}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      {selectedExpenseForDelete && (
        <ConfirmDialog
          isOpen={!!selectedExpenseForDelete}
          onClose={() => setSelectedExpenseForDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Expense Record"
          description={`Are you sure you want to delete "${selectedExpenseForDelete.description}" (${formatCurrency(
            selectedExpenseForDelete.amount
          )})? This action cannot be undone.`}
          confirmText="Delete Expense"
          variant="danger"
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};
