import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBookings } from '../hooks/useBookings';
import { bookingService } from '../services/bookingService';
import { reportService } from '../services/reportService';
import { downloadBlobFile, triggerPrint } from '../utils/exportHelpers';
import {
  formatCurrency,
  formatDate,
  formatTime,
  getFunctionTypeLabel,
  getPaymentStatusBadge,
  getBookingStatusBadge,
  FUNCTION_TYPES,
} from '../utils/formatters';

import { Tabs } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { PaymentModal } from '../components/booking/PaymentModal';
import { CancelModal } from '../components/booking/CancelModal';

import {
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  CalendarPlus,
  Search,
  RotateCcw,
  Eye,
  Edit,
  DollarSign,
  Ban,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

export const BookedList = () => {
  const navigate = useNavigate();
  const {
    category,
    setCategory,
    bookings,
    loading,
    totalCount,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    refresh,
  } = useBookings('today');

  // Modals state
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Tabs setup
  const tabs = [
    { id: 'today', label: "Today's Events", icon: CalendarCheck },
    { id: 'upcoming', label: 'Upcoming Events', icon: CalendarClock },
    { id: 'completed', label: 'Completed Events', icon: CheckCircle2 },
    { id: 'all', label: 'All Bookings', icon: CalendarDays },
  ];

  const handleUpdatePayment = async (bookingId, paymentData) => {
    setActionLoading(true);
    try {
      await bookingService.updatePayment(bookingId, paymentData);
      toast.success('Payment details updated successfully');
      setSelectedBookingForPayment(null);
      refresh();
    } catch (err) {
      console.error('Update payment error:', err);
      toast.error(err.response?.data?.error || 'Failed to update payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, cancelData) => {
    setActionLoading(true);
    try {
      await bookingService.cancelBooking(bookingId, cancelData);
      toast.success('Booking cancelled. Slot has been freed.');
      setSelectedBookingForCancel(null);
      refresh();
    } catch (err) {
      console.error('Cancel booking error:', err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.cancellation_reason?.[0] ||
        'Failed to cancel booking';
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCategoryExcel = async () => {
    setExporting(true);
    try {
      const blob = await reportService.exportExcel(category);
      downloadBlobFile(blob, `Thiru_Kumaran_Mahal_${category}_bookings_${Date.now()}.xlsx`);
      toast.success('Excel export downloaded');
    } catch (err) {
      console.error('Excel export error:', err);
      toast.error('Failed to export bookings to Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCategoryPdf = async () => {
    setExporting(true);
    try {
      const blob = await reportService.exportPdf(category);
      downloadBlobFile(blob, `Thiru_Kumaran_Mahal_${category}_bookings_${Date.now()}.pdf`);
      toast.success('PDF export downloaded');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Failed to export bookings to PDF');
    } finally {
      setExporting(false);
    }
  };

  const functionTypeOptions = Object.entries(FUNCTION_TYPES).map(([value, label]) => ({
    value,
    label,
  }));

  const paymentStatusOptions = [
    { value: 'not_paid', label: 'Not Paid' },
    { value: 'partially_paid', label: 'Partially Paid' },
    { value: 'fully_paid', label: 'Fully Paid' },
  ];

  const bookingStatusOptions = [
    { value: 'today', label: "Today's Event" },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3D9CC] dark:border-[#38251C]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#26160F] dark:text-[#F7EFE8] tracking-tight">
            Booked List Management
          </h1>
          <p className="text-xs sm:text-sm text-[#665349] dark:text-[#C8B7AC] mt-0.5">
            Centralized hub for Today's, Upcoming, and Completed function hall events
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCategoryExcel}
            isLoading={exporting}
            leftIcon={FileSpreadsheet}
          >
            Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCategoryPdf}
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
            Print
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={() => navigate('/bookings/new')}
            leftIcon={CalendarPlus}
          >
            New Booking
          </Button>
        </div>
      </div>

      {/* 2. Category Segmented Tabs (11. BOOKED LIST REQUIREMENT) */}
      <div className="no-print">
        <Tabs tabs={tabs} activeTab={category} onChange={setCategory} />
      </div>

      {/* 3. Search & Filter Bar (11D & 11F CLEAR BUTTON) */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1E140F] border border-[#E3D9CC] dark:border-[#38251C] shadow-xs space-y-3 no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by party, booking #, contact..."
              leftIcon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Date Filter */}
          <Input
            type="date"
            value={filters.date}
            onChange={(e) => setFilter('date', e.target.value)}
          />

          {/* Function Type */}
          <Select
            placeholder="All Function Types"
            options={functionTypeOptions}
            value={filters.function_type}
            onChange={(e) => setFilter('function_type', e.target.value)}
          />

          {/* Payment Status */}
          <Select
            placeholder="All Payment Status"
            options={paymentStatusOptions}
            value={filters.payment_status}
            onChange={(e) => setFilter('payment_status', e.target.value)}
          />
        </div>

        {/* Filters Second Row: Booking Status + Sorting + Clear */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EFE8DE] dark:border-[#2A1C15]">
          <div className="flex flex-wrap items-center gap-3">
            {category === 'all' && (
              <div className="w-44">
                <Select
                  placeholder="All Booking Status"
                  options={bookingStatusOptions}
                  value={filters.booking_status}
                  onChange={(e) => setFilter('booking_status', e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-[#665349] dark:text-[#C8B7AC]">
              <span className="font-semibold">Sort:</span>
              <select
                value={filters.ordering}
                onChange={(e) => setFilter('ordering', e.target.value)}
                className="bg-[#FAF7F2] dark:bg-[#251812] border border-[#D4C5B3] dark:border-[#38251C] rounded-lg px-2.5 py-1 text-xs text-[#26160F] dark:text-[#F7EFE8]"
              >
                <option value="-start_date">Start Date (Newest first)</option>
                <option value="start_date">Start Date (Oldest first)</option>
                <option value="party_name">Party Name (A-Z)</option>
                <option value="-total_payment">Total Amount (High to Low)</option>
                <option value="-balance">Balance Amount (High to Low)</option>
              </select>
            </div>
          </div>

          {/* 11F. CLEAR BUTTON: Only resets search and filters without touching database */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            leftIcon={RotateCcw}
            title="Reset search and filters"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* 4. Booked List Table */}
      {loading ? (
        <LoadingState message="Fetching events from database..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          title={`No ${category} bookings found`}
          description={
            search || filters.date || filters.function_type || filters.payment_status
              ? 'No bookings match your current search and filter criteria.'
              : `There are currently no events categorized as ${category}.`
          }
          actionLabel="Create New Booking"
          onAction={() => navigate('/bookings/new')}
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Booking #</TableHead>
                <TableHead>Party / Customer</TableHead>
                <TableHead>Function</TableHead>
                <TableHead>Dates & Timing</TableHead>
                <TableHead>Payment (Total / Paid / Bal)</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Event Status</TableHead>
                <TableHead className="no-print text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const payBadge = getPaymentStatusBadge(booking.payment_status);
                const bookBadge = getBookingStatusBadge(booking.booking_status);
                const isCancelled = booking.booking_status === 'cancelled';

                return (
                  <TableRow key={booking.id} className={isCancelled ? 'opacity-60 bg-rose-500/5' : ''}>
                    {/* Booking Number */}
                    <TableCell>
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="font-bold text-[#7B4B32] dark:text-[#D4AF37] hover:underline"
                      >
                        {booking.booking_number}
                      </Link>
                    </TableCell>

                    {/* Party Name & Contact */}
                    <TableCell>
                      <div className="font-bold text-[#26160F] dark:text-[#F7EFE8]">
                        {booking.party_name}
                      </div>
                      <div className="text-xs text-[#665349] dark:text-[#C8B7AC]">
                        📞 {booking.contact_number}
                      </div>
                    </TableCell>

                    {/* Function Type */}
                    <TableCell>
                      <Badge variant="default" size="sm">
                        {booking.function_type_display || getFunctionTypeLabel(booking.function_type)}
                      </Badge>
                    </TableCell>

                    {/* Dates & Timing */}
                    <TableCell>
                      <div className="text-xs font-semibold text-[#26160F] dark:text-[#F7EFE8]">
                        {formatDate(booking.start_date)}
                        {booking.start_date !== booking.end_date && ` → ${formatDate(booking.end_date)}`}
                        <span className="text-[#948074] dark:text-[#8F7C71] ml-1.5 font-normal">
                          ({booking.number_of_days} {booking.number_of_days === 1 ? 'day' : 'days'})
                        </span>
                      </div>
                      <div className="text-[11px] text-[#665349] dark:text-[#C8B7AC]">
                        ⏰ {formatTime(booking.from_time)} – {formatTime(booking.end_time)}
                      </div>
                    </TableCell>

                    {/* Payment Summary */}
                    <TableCell>
                      <div className="text-xs">
                        <span className="font-bold text-[#26160F] dark:text-[#F7EFE8]">
                          {formatCurrency(booking.total_payment)}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#665349] dark:text-[#C8B7AC]">
                        Paid: {formatCurrency(booking.received_payment)} | Bal:{' '}
                        <span
                          className={
                            parseFloat(booking.balance) > 0
                              ? 'text-amber-600 dark:text-amber-400 font-bold'
                              : 'text-emerald-600 dark:text-emerald-400 font-bold'
                          }
                        >
                          {formatCurrency(booking.balance)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Payment Status */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${payBadge.bg}`}
                      >
                        {booking.payment_status_display || payBadge.label}
                      </span>
                    </TableCell>

                    {/* Booking Status */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bookBadge.bg}`}
                      >
                        {booking.booking_status_display || bookBadge.label}
                      </span>
                    </TableCell>

                    {/* 11E. ACTIONS */}
                    <TableCell className="no-print text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/bookings/${booking.id}`)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-[#7B4B32] dark:text-[#D4AF37]" />
                        </Button>

                        {!isCancelled && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/bookings/${booking.id}/edit`)}
                              title="Edit Booking"
                            >
                              <Edit className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedBookingForPayment(booking)}
                              title="Update Payment"
                            >
                              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedBookingForCancel(booking)}
                              title="Cancel Booking"
                            >
                              <Ban className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setPage}
            className="no-print"
          />
        </div>
      )}

      {/* Payment Modal */}
      {selectedBookingForPayment && (
        <PaymentModal
          isOpen={!!selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          booking={selectedBookingForPayment}
          onUpdatePayment={handleUpdatePayment}
          isLoading={actionLoading}
        />
      )}

      {/* Cancel Modal */}
      {selectedBookingForCancel && (
        <CancelModal
          isOpen={!!selectedBookingForCancel}
          onClose={() => setSelectedBookingForCancel(null)}
          booking={selectedBookingForCancel}
          onCancelBooking={handleCancelBooking}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};
