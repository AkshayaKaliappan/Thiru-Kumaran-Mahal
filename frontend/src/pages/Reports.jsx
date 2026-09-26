import React from 'react';
import { useReports } from '../hooks/useReports';
import {
  formatCurrency,
  formatDate,
  formatTime,
  getFunctionTypeLabel,
  getPaymentStatusBadge,
  getBookingStatusBadge,
} from '../utils/formatters';
import { triggerPrint } from '../utils/exportHelpers';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';

import {
  FileBarChart2,
  Calendar,
  CalendarRange,
  Ban,
  Clock,
  CheckCircle2,
  Printer,
  FileSpreadsheet,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const Reports = () => {
  const {
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
    refresh,
    exportExcel,
    exportPdf,
  } = useReports();

  const reportTabs = [
    { id: 'daily', label: 'Daily Report', icon: Calendar },
    { id: 'monthly', label: 'Monthly Report', icon: CalendarRange },
    { id: 'cancelled', label: 'Cancelled Bookings', icon: Ban },
    { id: 'pending-payment', label: 'Pending Payments', icon: Clock },
    { id: 'fully-paid', label: 'Fully Paid Bookings', icon: CheckCircle2 },
  ];

  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => ({
    value: currentYear - 3 + i,
    label: String(currentYear - 3 + i),
  }));

  const summary = data?.summary;
  const bookings = data?.bookings || [];

  return (
    <div className="space-y-6 print-page">
      {/* 1. Header & Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3D9CC] dark:border-[#38251C]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#26160F] dark:text-[#F7EFE8] tracking-tight">
            Financial & Booking Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#665349] dark:text-[#C8B7AC] mt-0.5">
            Audit collection totals, monthly summaries, cancelled events, and outstanding dues
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          <Button
            variant="outline"
            size="sm"
            onClick={exportExcel}
            isLoading={exporting}
            leftIcon={FileSpreadsheet}
          >
            Export Excel
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportPdf}
            isLoading={exporting}
            leftIcon={FileText}
          >
            Export PDF
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={triggerPrint}
            leftIcon={Printer}
          >
            Print Report
          </Button>
        </div>
      </div>

      {/* 2. Report Selector Tabs */}
      <div className="no-print">
        <Tabs tabs={reportTabs} activeTab={reportType} onChange={setReportType} />
      </div>

      {/* 3. Parameter Filters Bar (For Daily / Monthly) */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1E140F] border border-[#E3D9CC] dark:border-[#38251C] shadow-xs no-print">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {reportType === 'daily' && (
              <div className="w-52">
                <Input
                  label="Select Report Date"
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </div>
            )}

            {reportType === 'monthly' && (
              <div className="flex items-center gap-3">
                <div className="w-40">
                  <Select
                    label="Month"
                    options={monthOptions}
                    value={reportMonth}
                    onChange={(e) => setReportMonth(Number(e.target.value))}
                  />
                </div>
                <div className="w-32">
                  <Select
                    label="Year"
                    options={yearOptions}
                    value={reportYear}
                    onChange={(e) => setReportYear(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {(reportType === 'cancelled' ||
              reportType === 'pending-payment' ||
              reportType === 'fully-paid') && (
              <div className="text-xs text-[#665349] dark:text-[#C8B7AC]">
                Showing complete active records for{' '}
                <strong className="text-[#26160F] dark:text-[#F7EFE8] capitalize">
                  {reportType.replace('-', ' ')}
                </strong>
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={refresh}>
            Refresh Data
          </Button>
        </div>
      </div>

      {/* 4. Report Content & Financial Aggregates */}
      {loading ? (
        <LoadingState message="Generating financial report from database..." />
      ) : error ? (
        <ErrorState
          title="Report Generation Failed"
          message={error}
          onRetry={refresh}
        />
      ) : (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#1E140F] border border-[#E3D9CC] dark:border-[#38251C] shadow-xs">
                <p className="text-[11px] uppercase font-bold text-[#665349] dark:text-[#C8B7AC]">
                  Total Bookings
                </p>
                <p className="text-2xl font-black text-[#26160F] dark:text-[#F7EFE8] mt-1">
                  {summary.booking_count}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#1E140F] border border-[#E3D9CC] dark:border-[#38251C] shadow-xs">
                <p className="text-[11px] uppercase font-bold text-[#665349] dark:text-[#C8B7AC]">
                  Total Billed / Tariff
                </p>
                <p className="text-2xl font-black text-[#26160F] dark:text-[#F7EFE8] mt-1">
                  {formatCurrency(summary.total_payment)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#1E140F] border border-emerald-500/30 bg-emerald-500/5 shadow-xs">
                <p className="text-[11px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                  Total Collected (Revenue)
                </p>
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatCurrency(summary.received_payment)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#1E140F] border border-amber-500/30 bg-amber-500/5 shadow-xs">
                <p className="text-[11px] uppercase font-bold text-amber-700 dark:text-amber-400">
                  Outstanding Balance
                </p>
                <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                  {formatCurrency(summary.outstanding_balance)}
                </p>
              </div>
            </div>
          )}

          {/* Bookings Table for this Report */}
          {bookings.length === 0 ? (
            <EmptyState
              icon={FileBarChart2}
              title="No bookings in this report period"
              description="There were no event records found matching this report scope."
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#26160F] dark:text-[#F7EFE8]">
                  Detailed Event Records ({bookings.length})
                </h3>
              </div>

              <Table>
                <TableHeader>
                  <TableRow hover={false}>
                    <TableHead>Booking #</TableHead>
                    <TableHead>Party / Customer</TableHead>
                    <TableHead>Function</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Total Rent</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Booking Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    const payBadge = getPaymentStatusBadge(booking.payment_status);
                    const bookBadge = getBookingStatusBadge(booking.booking_status);

                    return (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <span className="font-bold text-[#7B4B32] dark:text-[#D4AF37]">
                            {booking.booking_number}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-[#26160F] dark:text-[#F7EFE8]">
                            {booking.party_name}
                          </div>
                          <div className="text-[11px] text-[#665349] dark:text-[#C8B7AC]">
                            📞 {booking.contact_number}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" size="sm">
                            {booking.function_type_display || getFunctionTypeLabel(booking.function_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold">
                            {formatDate(booking.start_date)}
                            {booking.start_date !== booking.end_date && ` → ${formatDate(booking.end_date)}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-xs text-[#26160F] dark:text-[#F7EFE8]">
                            {formatCurrency(booking.total_payment)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-xs text-emerald-700 dark:text-emerald-400">
                            {formatCurrency(booking.received_payment)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-semibold text-xs ${
                              parseFloat(booking.balance) > 0
                                ? 'text-amber-700 dark:text-amber-400 font-bold'
                                : 'text-emerald-700 dark:text-emerald-400'
                            }`}
                          >
                            {formatCurrency(booking.balance)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${payBadge.bg}`}
                          >
                            {booking.payment_status_display || payBadge.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${bookBadge.bg}`}
                          >
                            {booking.booking_status_display || bookBadge.label}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
