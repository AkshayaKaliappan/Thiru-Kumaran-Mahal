import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentUpdateSchema } from '../../utils/validation';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DollarSign } from 'lucide-react';

export const PaymentModal = ({
  isOpen,
  onClose,
  booking,
  onUpdatePayment,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentUpdateSchema),
    defaultValues: {
      total_payment: booking?.total_payment || 0,
      received_payment: booking?.received_payment || 0,
    },
  });

  useEffect(() => {
    if (booking) {
      reset({
        total_payment: booking.total_payment,
        received_payment: booking.received_payment,
      });
    }
  }, [booking, reset]);

  const totalPayment = watch('total_payment');
  const receivedPayment = watch('received_payment');

  const totalNum = parseFloat(totalPayment) || 0;
  const receivedNum = parseFloat(receivedPayment) || 0;
  const balance = Math.max(0, totalNum - receivedNum);

  const onSubmit = async (data) => {
    await onUpdatePayment(booking.id, data);
  };

  if (!booking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Payment Details"
      description={`Booking ${booking.booking_number} — ${booking.party_name}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Total Payment (₹)"
          type="number"
          step="0.01"
          min={0}
          required
          leftIcon={DollarSign}
          error={errors.total_payment?.message}
          {...register('total_payment')}
        />

        <Input
          label="Received / Collected Payment (₹)"
          type="number"
          step="0.01"
          min={0}
          required
          leftIcon={DollarSign}
          error={errors.received_payment?.message}
          {...register('received_payment')}
        />

        {/* Live Balance Card */}
        <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C] space-y-2">
          <div className="flex justify-between text-xs text-[#665349] dark:text-[#C8B7AC]">
            <span>Outstanding Balance:</span>
            <span className="text-base font-extrabold text-[#7B4B32] dark:text-[#D4AF37]">
              {formatCurrency(balance)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-[#665349] dark:text-[#C8B7AC]">
            <span>New Status:</span>
            <span className="font-bold">
              {receivedNum === 0
                ? '🔴 Not Paid'
                : receivedNum < totalNum
                ? '🟡 Partially Paid'
                : '🟢 Fully Paid'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EFE8DE] dark:border-[#2A1C15]">
          <Button variant="outline" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="gold" size="md" type="submit" isLoading={isLoading}>
            Save Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
