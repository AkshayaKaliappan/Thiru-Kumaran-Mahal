import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { BookingForm } from '../components/booking/BookingForm';
import { Button } from '../components/ui/Button';
import { ArrowLeft, CalendarPlus, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const NewBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const createdBooking = await bookingService.createBooking(formData);
      toast.success(
        `Booking ${createdBooking.booking_number} created successfully!`
      );
      navigate(`/bookings/${createdBooking.id}`);
    } catch (err) {
      console.error('Create booking failed:', err);
      const data = err.response?.data;
      if (data?.error) {
        toast.error(data.error);
      } else if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        const errorMsg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
        toast.error(`${firstKey}: ${errorMsg}`);
      } else {
        toast.error('Failed to create booking. Please check for scheduling conflicts.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3D9CC] dark:border-[#38251C]">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={ArrowLeft}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-black text-[#26160F] dark:text-[#F7EFE8] tracking-tight">
              Create New Hall Booking
            </h1>
            <p className="text-xs text-[#665349] dark:text-[#C8B7AC]">
              Reserve function hall date & time slot for customer
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#7B4B32] dark:text-[#D4AF37] px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C]">
          <ShieldCheck className="w-4 h-4" />
          <span>4-Hour Buffer Enforced</span>
        </div>
      </div>

      {/* Form */}
      <BookingForm onSubmit={handleSubmit} isLoading={loading} isEdit={false} />
    </div>
  );
};
