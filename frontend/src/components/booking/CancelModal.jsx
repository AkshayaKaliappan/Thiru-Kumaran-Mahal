import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export const CancelModal = ({
  isOpen,
  onClose,
  booking,
  onCancelBooking,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = async () => {
    if (!booking) return;
    await onCancelBooking(booking.id, { cancellation_reason: reason });
    setReason('');
  };

  if (!booking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Booking"
      description={`Are you sure you want to cancel booking ${booking.booking_number}?`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            This action will mark the booking as <strong>Cancelled</strong>. The hall slot will become available for new reservations. This booking will remain in cancelled reports.
          </p>
        </div>

        <Textarea
          label="Reason for Cancellation (Optional)"
          placeholder="e.g. Client requested postponement, personal emergency..."
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EFE8DE] dark:border-[#2A1C15]">
          <Button variant="outline" size="md" onClick={onClose} disabled={isLoading}>
            Keep Booking
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            Confirm Cancellation
          </Button>
        </div>
      </div>
    </Modal>
  );
};
