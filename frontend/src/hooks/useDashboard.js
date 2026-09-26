import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { toast } from 'sonner';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
};
