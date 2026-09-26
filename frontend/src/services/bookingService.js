import apiClient from '../lib/axios';

export const bookingService = {
  getBookings: async (params = {}) => {
    const response = await apiClient.get('/bookings/', { params });
    return response.data;
  },

  getTodayBookings: async (params = {}) => {
    const response = await apiClient.get('/bookings/today/', { params });
    return response.data;
  },

  getUpcomingBookings: async (params = {}) => {
    const response = await apiClient.get('/bookings/upcoming/', { params });
    return response.data;
  },

  getCompletedBookings: async (params = {}) => {
    const response = await apiClient.get('/bookings/completed/', { params });
    return response.data;
  },

  getBooking: async (id) => {
    const response = await apiClient.get(`/bookings/${id}/`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await apiClient.post('/bookings/', bookingData);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await apiClient.put(`/bookings/${id}/`, bookingData);
    return response.data;
  },

  partialUpdateBooking: async (id, bookingData) => {
    const response = await apiClient.patch(`/bookings/${id}/`, bookingData);
    return response.data;
  },

  updatePayment: async (id, paymentData) => {
    const response = await apiClient.patch(`/bookings/${id}/update-payment/`, paymentData);
    return response.data;
  },

  cancelBooking: async (id, cancelData = {}) => {
    const response = await apiClient.post(`/bookings/${id}/cancel/`, cancelData);
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await apiClient.delete(`/bookings/${id}/`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await apiClient.get('/bookings/dashboard-stats/');
    return response.data;
  },

  globalSearch: async (query, params = {}) => {
    const response = await apiClient.get('/bookings/search/', {
      params: { q: query, ...params },
    });
    return response.data;
  },
};
