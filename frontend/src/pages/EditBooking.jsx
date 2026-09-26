import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { BookingForm } from '../components/booking/BookingForm';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

export const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBooking(id);
      if (data.booking_status === 'cancelled') {
        toast.error('Cancelled bookings cannot be edited');
        navigate(`/bookings/${id}`);
        return;
      }
      setBooking(data);
    } catch (err) {
      console.error('Fetch booking error:', err);
      setError(err.response?.data?.error || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const updated = await bookingService.updateBooking(id, formData);
      toast.success(`Booking ${updated.booking_number} updated successfully`);
      navigate(`/bookings/${id}`);
    } catch (err) {
      console.error('Update booking failed:', err);
      const data = err.response?.data;
      if (data?.error) {
        toast.error(data.error);
      } else if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        const errorMsg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
        toast.error(`${firstKey}: ${errorMsg}`);
      } else {
        toast.error('Failed to update booking. Please check for scheduling conflicts.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading booking for editing..." />;
  }

  if (error || !booking) {
    return (
      <ErrorState
        title="Booking Not Found"
        message={error || 'Unable to load the requested booking.'}
        onRetry={fetchBooking}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3D9CC] dark:border-[#38251C]">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/bookings/${id}`)}
            leftIcon={ArrowLeft}
          >
            Cancel
          </Button>
          <div>
            <h1 className="text-2xl font-black text-[#26160F] dark:text-[#F7EFE8] tracking-tight">
              Edit Booking {booking.booking_number}
            </h1>
            <p className="text-xs text-[#665349] dark:text-[#C8B7AC]">
              Modify dates, customer details, or payment schedule
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <BookingForm
        initialValues={booking}
        onSubmit={handleSubmit}
        isLoading={submitting}
        isEdit={true}
      />
    </div>
  );
};
