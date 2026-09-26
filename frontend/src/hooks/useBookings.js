import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { toast } from 'sonner';

export const useBookings = (initialCategory = 'today') => {
  const [category, setCategory] = useState(initialCategory); // 'today' | 'upcoming' | 'completed' | 'all'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    payment_status: '',
    booking_status: '',
    function_type: '',
    ordering: '-start_date',
  });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = {
      page,
      ordering: filters.ordering,
    };

    if (search.trim()) params.search = search.trim();
    if (filters.date) params.date = filters.date;
    if (filters.payment_status) params.payment_status = filters.payment_status;
    if (filters.booking_status) params.booking_status = filters.booking_status;
    if (filters.function_type) params.function_type = filters.function_type;

    try {
      let data;
      if (category === 'today') {
        data = await bookingService.getTodayBookings(params);
      } else if (category === 'upcoming') {
        data = await bookingService.getUpcomingBookings(params);
      } else if (category === 'completed') {
        data = await bookingService.getCompletedBookings(params);
      } else {
        data = await bookingService.getBookings(params);
      }

      if (data.results !== undefined) {
        setBookings(data.results);
        setTotalCount(data.count || 0);
      } else if (Array.isArray(data)) {
        setBookings(data);
        setTotalCount(data.length);
      } else {
        setBookings([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [category, page, search, filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilterChange = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setPage(1);
  };

  /**
   * 11F. CLEAR BUTTON:
   * Clear must ONLY:
   * - Clear search input
   * - Clear filters
   * - Restore default selected event category (today)
   * - Restore default booking list
   * Clear must NEVER modify database data.
   */
  const clearFilters = () => {
    setSearch('');
    setFilters({
      date: '',
      payment_status: '',
      booking_status: '',
      function_type: '',
      ordering: '-start_date',
    });
    setCategory('today');
    setPage(1);
    toast.info('Search and filters reset');
  };

  return {
    category,
    setCategory: handleCategoryChange,
    bookings,
    loading,
    error,
    totalCount,
    page,
    setPage,
    pageSize,
    search,
    setSearch: handleSearchChange,
    filters,
    setFilter: handleFilterChange,
    clearFilters,
    refresh: fetchBookings,
  };
};
