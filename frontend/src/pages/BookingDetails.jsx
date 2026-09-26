import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
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
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { PaymentModal } from '../components/booking/PaymentModal';
import { CancelModal } from '../components/booking/CancelModal';

import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  DollarSign,
  Printer,
  Edit,
  Ban,
  FileText,
  CheckCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBooking(id);
      setBooking(data);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError(err.response?.data?.error || 'Booking not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleUpdatePayment = async (bookingId, paymentData) => {
    setActionLoading(true);
    try {
      const updated = await bookingService.updatePayment(bookingId, paymentData);
      setBooking(updated);
      toast.success('Payment updated successfully');
      setIsPaymentModalOpen(false);
    } catch (err) {
      console.error('Payment update error:', err);
      toast.error(err.response?.data?.error || 'Failed to update payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, cancelData) => {
    setActionLoading(true);
    try {
      const cancelled = await bookingService.cancelBooking(bookingId, cancelData);
      setBooking(cancelled);
      toast.success('Booking cancelled');
      setIsCancelModalOpen(false);
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

  if (loading) {
    return <LoadingState message="Loading booking details..." />;
  }

  if (error || !booking) {
    return (
      <ErrorState
        title="Booking Not Found"
        message={error || 'The requested booking could not be located.'}
        onRetry={fetchBooking}
      />
    );
  }

  const payBadge = getPaymentStatusBadge(booking.payment_status);
  const bookBadge = getBookingStatusBadge(booking.booking_status);
  const isCancelled = booking.booking_status === 'cancelled';

  return (
    <div className="space-y-6 max-w-5xl mx-auto print-page">
      {/* 1. Top Bar & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3D9CC] dark:border-[#38251C] no-print">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/bookings')}
            leftIcon={ArrowLeft}
          >
            Back to Booked List
          </Button>
          <div>
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
              Booking Detail View
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#26160F] dark:text-[#F7EFE8]">
              {booking.booking_number}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={triggerPrint}
            leftIcon={Printer}
          >
            Print Receipt
          </Button>

          {!isCancelled && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/bookings/${booking.id}/edit`)}
                leftIcon={Edit}
              >
                Edit
              </Button>

              <Button
                variant="gold"
                size="sm"
                onClick={() => setIsPaymentModalOpen(true)}
                leftIcon={DollarSign}
              >
                Update Payment
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsCancelModalOpen(true)}
                leftIcon={Ban}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Printable Letterhead (Shown in Print & on Screen) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1E140F] border border-[#E3D9CC] dark:border-[#38251C] shadow-md space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFE8DE] dark:border-[#2A1C15]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-[#7B4B32] to-[#C5A059] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#26160F] dark:text-[#F7EFE8] tracking-tight">
                Thiru Kumaran Mahal
              </h2>
              <p className="text-xs text-[#665349] dark:text-[#C8B7AC]">
                Function Hall & Convention Center • Official Booking Voucher
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5">
            <div className="text-xs text-[#948074] dark:text-[#8F7C71]">
              Booking Ref: <strong className="text-base text-[#26160F] dark:text-[#F7EFE8]">{booking.booking_number}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${payBadge.bg}`}>
                {booking.payment_status_display || payBadge.label}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bookBadge.bg}`}>
                {booking.booking_status_display || bookBadge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Cancellation Notice Banner if Cancelled */}
        {isCancelled && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>This booking was cancelled on {formatDate(booking.cancelled_at, 'dd MMM yyyy, hh:mm a')}</span>
            </div>
            {booking.cancellation_reason && (
              <p className="text-xs mt-1">Reason: {booking.cancellation_reason}</p>
            )}
          </div>
        )}

        {/* Section 1: Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C] space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#7B4B32] dark:text-[#D4AF37] border-b border-[#E3D9CC] dark:border-[#38251C] pb-2">
              <User className="w-4 h-4" />
              <span>Party & Contact Details</span>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div>
                <span className="text-[#948074] dark:text-[#8F7C71] block text-[11px]">Party / Customer Name:</span>
                <strong className="text-[#26160F] dark:text-[#F7EFE8] text-base">{booking.party_name}</strong>
              </div>
              <div>
                <span className="text-[#948074] dark:text-[#8F7C71] block text-[11px]">Primary Contact:</span>
                <span className="font-semibold text-[#26160F] dark:text-[#F7EFE8]">📞 {booking.contact_number}</span>
              </div>
              {booking.alternate_contact && (
                <div>
                  <span className="text-[#948074] dark:text-[#8F7C71] block text-[11px]">Alternate Contact:</span>
                  <span className="text-[#26160F] dark:text-[#F7EFE8]">📞 {booking.alternate_contact}</span>
                </div>
              )}
              <div>
                <span className="text-[#948074] dark:text-[#8F7C71] block text-[11px]">Function Type:</span>
                <Badge variant="gold" size="sm">
                  {booking.function_type_display || getFunctionTypeLabel(booking.function_type)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Section 2: Date & Timing */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C] space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#7B4B32] dark:text-[#D4AF37] border-b border-[#E3D9CC] dark:border-[#38251C] pb-2">
              <Calendar className="w-4 h-4" />
              <span>Event Schedule</span>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#948074] dark:text-[#8F7C71] block text-[11px]">Start Date:</span>
                  <strong className="text-[#26160F] dark:text-[#F7EFE8]">{formatDate(booking.start_date)}</strong>
                </div>
                <div>
                  <span className="text-[#948074] dark:text-[#8F7C71] block text-[11px]">End Date:</span>
                  <strong className="text-[#26160F] dark:text-[#F7EFE8]">{formatDate(booking.end_date)}</strong>
                </div>
              </div>
              <div>
                <span className="text-[#948074] dark:text-[#8F7C71] block text-[11px]">Duration:</span>
                <span className="font-semibold text-[#26160F] dark:text-[#F7EFE8]">
                  {booking.number_of_days} {booking.number_of_days === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#948074] dark:text-[#8F7C71] block text-[11px]">Start Time:</span>
                  <span className="font-semibold text-[#26160F] dark:text-[#F7EFE8]">⏰ {formatTime(booking.from_time)}</span>
                </div>
                <div>
                  <span className="text-[#948074] dark:text-[#8F7C71] block text-[11px]">End Time:</span>
                  <span className="font-semibold text-[#26160F] dark:text-[#F7EFE8]">⏰ {formatTime(booking.end_time)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Financials & Balance */}
        <div className="p-5 rounded-xl bg-linear-to-r from-[#FAF7F2] to-[#EFE8DE] dark:from-[#251812] dark:to-[#1E140F] border border-[#E3D9CC] dark:border-[#38251C]">
          <div className="flex items-center gap-2 font-bold text-sm text-[#7B4B32] dark:text-[#D4AF37] mb-3">
            <DollarSign className="w-4 h-4" />
            <span>Financial & Settlement Breakdown</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div className="p-3 bg-white dark:bg-[#1E140F] rounded-xl border border-[#E3D9CC] dark:border-[#38251C]">
              <span className="text-[11px] font-semibold text-[#665349] dark:text-[#C8B7AC] uppercase block">
                Total Hall Rent / Tariff
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#26160F] dark:text-[#F7EFE8]">
                {formatCurrency(booking.total_payment)}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-[#1E140F] rounded-xl border border-[#E3D9CC] dark:border-[#38251C]">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase block">
                Collected / Paid Amount
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
                {formatCurrency(booking.received_payment)}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-[#1E140F] rounded-xl border border-[#E3D9CC] dark:border-[#38251C]">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase block">
                Outstanding Balance Due
              </span>
              <span
                className={`text-xl sm:text-2xl font-black ${
                  parseFloat(booking.balance) > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {formatCurrency(booking.balance)}
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Remarks */}
        {booking.remarks && (
          <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C] space-y-1 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 font-bold text-[#7B4B32] dark:text-[#D4AF37]">
              <FileText className="w-4 h-4" />
              <span>Special Remarks & Instructions</span>
            </div>
            <p className="text-[#26160F] dark:text-[#F7EFE8] leading-relaxed whitespace-pre-wrap">
              {booking.remarks}
            </p>
          </div>
        )}

        {/* Audit Timestamps */}
        <div className="pt-4 border-t border-[#EFE8DE] dark:border-[#2A1C15] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#948074] dark:text-[#8F7C71]">
          <span>Created on: {formatDate(booking.created_at, 'dd MMM yyyy, hh:mm a')}</span>
          <span>Last modified: {formatDate(booking.updated_at, 'dd MMM yyyy, hh:mm a')}</span>
        </div>
      </div>

      {/* Payment Update Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          booking={booking}
          onUpdatePayment={handleUpdatePayment}
          isLoading={actionLoading}
        />
      )}

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <CancelModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          booking={booking}
          onCancelBooking={handleCancelBooking}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};
