import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';
import { toast } from 'sonner';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchSummary = useCallback(async () => {
    try {
      const data = await expenseService.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching expense summary:', err);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = { page };
    if (search.trim()) params.search = search.trim();
    if (category) params.category = category;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    try {
      const data = await expenseService.getExpenses(params);
      if (data.results !== undefined) {
        setExpenses(data.results);
        setTotalCount(data.count || 0);
      } else if (Array.isArray(data)) {
        setExpenses(data);
        setTotalCount(data.length);
      } else {
        setExpenses([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.response?.data?.error || 'Failed to load expenses');
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, startDate, endDate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const refreshAll = () => {
    fetchExpenses();
    fetchSummary();
  };

  return {
    expenses,
    summary,
    loading,
    error,
    totalCount,
    page,
    setPage,
    search,
    setSearch: (val) => { setSearch(val); setPage(1); },
    category,
    setCategory: (val) => { setCategory(val); setPage(1); },
    startDate,
    setStartDate: (val) => { setStartDate(val); setPage(1); },
    endDate,
    setEndDate: (val) => { setEndDate(val); setPage(1); },
    clearFilters,
    refresh: refreshAll,
  };
};
