import apiClient from '../lib/axios';

export const reportService = {
  getDailyReport: async (date) => {
    const response = await apiClient.get('/reports/daily/', {
      params: date ? { date } : {},
    });
    return response.data;
  },

  getMonthlyReport: async (year, month) => {
    const response = await apiClient.get('/reports/monthly/', {
      params: { year, month },
    });
    return response.data;
  },

  getCancelledReport: async () => {
    const response = await apiClient.get('/reports/cancelled/');
    return response.data;
  },

  getPendingPaymentReport: async () => {
    const response = await apiClient.get('/reports/pending-payment/');
    return response.data;
  },

  getFullyPaidReport: async () => {
    const response = await apiClient.get('/reports/fully-paid/');
    return response.data;
  },

  exportExcel: async (reportType, params = {}) => {
    const response = await apiClient.get('/reports/export/excel/', {
      params: { type: reportType, ...params },
      responseType: 'blob',
    });
    return response.data;
  },

  exportPdf: async (reportType, params = {}) => {
    const response = await apiClient.get('/reports/export/pdf/', {
      params: { type: reportType, ...params },
      responseType: 'blob',
    });
    return response.data;
  },
};
