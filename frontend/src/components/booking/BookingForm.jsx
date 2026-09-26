import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema } from '../../utils/validation';
import { calculateEndDate, getTodayString } from '../../utils/dateHelpers';
import { formatCurrency, FUNCTION_TYPES } from '../../utils/formatters';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { User, Phone, Calendar, Clock, DollarSign, FileText } from 'lucide-react';

export const BookingForm = ({
  initialValues,
  onSubmit,
  isLoading = false,
  isEdit = false,
}) => {
  const defaultValues = initialValues || {
    party_name: '',
    contact_number: '',
    alternate_contact: '',
    function_type: 'wedding',
    start_date: getTodayString(),
    number_of_days: 1,
    end_date: getTodayString(),
    from_time: '09:00',
    end_time: '21:00',
    total_payment: '',
    received_payment: 0,
    remarks: '',
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  const startDate = watch('start_date');
  const numberOfDays = watch('number_of_days');
  const totalPayment = watch('total_payment');
  const receivedPayment = watch('received_payment');

  // Auto-calculate End Date = Start Date + Number of Days - 1
  useEffect(() => {
    if (startDate && numberOfDays) {
      const calculatedEnd = calculateEndDate(startDate, numberOfDays);
      setValue('end_date', calculatedEnd);
    }
  }, [startDate, numberOfDays, setValue]);

  // Derived balance calculation
  const totalNum = parseFloat(totalPayment) || 0;
  const receivedNum = parseFloat(receivedPayment) || 0;
  const balance = Math.max(0, totalNum - receivedNum);

  const functionOptions = Object.entries(FUNCTION_TYPES).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 1. Customer / Party Information */}
      <Card>
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#EFE8DE] dark:border-[#2A1C15]">
          <User className="w-5 h-5 text-[#7B4B32] dark:text-[#D4AF37]" />
          <h3 className="text-base font-bold text-[#26160F] dark:text-[#F7EFE8]">
            Customer & Function Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Party / Customer Name"
            placeholder="e.g. Ramesh & Priya Wedding"
            required
            leftIcon={User}
            error={errors.party_name?.message}
            {...register('party_name')}
          />

          <Select
            label="Function Type"
            options={functionOptions}
            required
            error={errors.function_type?.message}
            {...register('function_type')}
          />

          <Input
            label="Primary Contact Number"
            placeholder="10-digit mobile number"
            required
            leftIcon={Phone}
            maxLength={10}
            error={errors.contact_number?.message}
            helperText="Valid 10-digit Indian mobile number (e.g. 9876543210)"
            {...register('contact_number')}
          />

          <Input
            label="Alternate Contact Number (Optional)"
            placeholder="10-digit mobile number"
            leftIcon={Phone}
            maxLength={10}
            error={errors.alternate_contact?.message}
            {...register('alternate_contact')}
          />
        </div>
      </Card>

      {/* 2. Date & Time Information */}
      <Card>
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#EFE8DE] dark:border-[#2A1C15]">
          <Calendar className="w-5 h-5 text-[#7B4B32] dark:text-[#D4AF37]" />
          <h3 className="text-base font-bold text-[#26160F] dark:text-[#F7EFE8]">
            Date & Time Schedule
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Start Date"
            type="date"
            required
            leftIcon={Calendar}
            error={errors.start_date?.message}
            {...register('start_date')}
          />

          <Input
            label="Number of Days"
            type="number"
            min={1}
            required
            error={errors.number_of_days?.message}
            helperText="Minimum 1 day"
            {...register('number_of_days')}
          />

          <Input
            label="End Date (Auto-calculated)"
            type="date"
            readOnly
            className="bg-[#FAF7F2] dark:bg-[#251812] cursor-not-allowed opacity-80"
            error={errors.end_date?.message}
            {...register('end_date')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Input
            label="From Time (Start Time)"
            type="time"
            required
            leftIcon={Clock}
            error={errors.from_time?.message}
            {...register('from_time')}
          />

          <Input
            label="End Time"
            type="time"
            required
            leftIcon={Clock}
            error={errors.end_time?.message}
            helperText="A 4-hour cleaning buffer will be automatically enforced after end time."
            {...register('end_time')}
          />
        </div>
      </Card>

      {/* 3. Payment Information */}
      <Card>
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#EFE8DE] dark:border-[#2A1C15]">
          <DollarSign className="w-5 h-5 text-[#7B4B32] dark:text-[#D4AF37]" />
          <h3 className="text-base font-bold text-[#26160F] dark:text-[#F7EFE8]">
            Payment & Pricing
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Total Payment (₹)"
            type="number"
            step="0.01"
            min={0}
            required
            placeholder="0.00"
            error={errors.total_payment?.message}
            {...register('total_payment')}
          />

          <Input
            label="Advance / Received Payment (₹)"
            type="number"
            step="0.01"
            min={0}
            placeholder="0.00"
            error={errors.received_payment?.message}
            {...register('received_payment')}
          />
        </div>

        {/* Live Balance Preview Box */}
        <div className="mt-4 p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#665349] dark:text-[#C8B7AC]">
              Outstanding Balance:
            </span>
            <div className="text-xl font-black text-[#7B4B32] dark:text-[#D4AF37]">
              {formatCurrency(balance)}
            </div>
          </div>

          <div className="text-xs">
            <span className="font-semibold text-[#665349] dark:text-[#C8B7AC]">Payment Status: </span>
            <span className="font-bold">
              {receivedNum === 0
                ? '🔴 Not Paid'
                : receivedNum < totalNum
                ? '🟡 Partially Paid'
                : '🟢 Fully Paid'}
            </span>
          </div>
        </div>
      </Card>

      {/* 4. Remarks */}
      <Card>
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#EFE8DE] dark:border-[#2A1C15]">
          <FileText className="w-5 h-5 text-[#7B4B32] dark:text-[#D4AF37]" />
          <h3 className="text-base font-bold text-[#26160F] dark:text-[#F7EFE8]">
            Remarks & Special Notes
          </h3>
        </div>

        <Textarea
          label="Remarks (Optional)"
          placeholder="Any special decorations, catering notes, stage arrangements, or VIP requests..."
          rows={3}
          error={errors.remarks?.message}
          {...register('remarks')}
        />
      </Card>

      {/* Submit button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={isLoading}
          className="min-w-40"
        >
          {isEdit ? 'Update Booking' : 'Confirm & Create Booking'}
        </Button>
      </div>
    </form>
  );
};
