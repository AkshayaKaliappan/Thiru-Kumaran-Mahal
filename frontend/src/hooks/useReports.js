import { useState, useEffect, useCallback } from 'react';
import { reportService } from '../services/reportService';
import { getTodayString } from '../utils/dateHelpers';
import { downloadBlobFile } from '../utils/exportHelpers';
import { toast } from 'sonner';

export const useReports = () => {
  const [reportType, setReportType] = useState('daily'); // 'daily' | 'monthly' | 'cancelled' | 'pending-payment' | 'fully-paid'
  const [reportDate, setReportDate] = useState(getTodayString());
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (reportType === 'daily') {
        result = await reportService.getDailyReport(reportDate);
      } else if (reportType === 'monthly') {
        result = await reportService.getMonthlyReport(reportYear, reportMonth);
      } else if (reportType === 'cancelled') {
        result = await reportService.getCancelledReport();
      } else if (reportType === 'pending-payment') {
        result = await reportService.getPendingPaymentReport();
      } else if (reportType === 'fully-paid') {
        result = await reportService.getFullyPaidReport();
      }
      setData(result);
    } catch (err) {
      console.error('Error loading report:', err);
      setError(err.response?.data?.error || 'Failed to generate report');
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  }, [reportType, reportDate, reportYear, reportMonth]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const params = {};
      if (reportType === 'daily') params.date = reportDate;
      if (reportType === 'monthly') {
        params.year = reportYear;
        params.month = reportMonth;
      }
      const blob = await reportService.exportExcel(reportType, params);
      const filename = `Thiru_Kumaran_Mahal_${reportType}_report_${Date.now()}.xlsx`;
      downloadBlobFile(blob, filename);
      toast.success('Excel report downloaded successfully');
    } catch (err) {
      console.error('Export Excel failed:', err);
      toast.error('Failed to export Excel report');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const params = {};
      if (reportType === 'daily') params.date = reportDate;
      if (reportType === 'monthly') {
        params.year = reportYear;
        params.month = reportMonth;
      }
      const blob = await reportService.exportPdf(reportType, params);
      const filename = `Thiru_Kumaran_Mahal_${reportType}_report_${Date.now()}.pdf`;
      downloadBlobFile(blob, filename);
      toast.success('PDF report downloaded successfully');
    } catch (err) {
      console.error('Export PDF failed:', err);
      toast.error('Failed to export PDF report');
    } finally {
      setExporting(false);
    }
  };

  return {
    reportType,
    setReportType,
    reportDate,
    setReportDate,
    reportYear,
    setReportYear,
    reportMonth,
    setReportMonth,
    data,
    loading,
    exporting,
    error,
    refresh: fetchReport,
    exportExcel: handleExportExcel,
    exportPdf: handleExportPdf,
  };
};
