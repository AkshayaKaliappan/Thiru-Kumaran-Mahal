"""
Booking services - centralized business logic for booking operations.
Separated from views to maintain clean architecture.
"""
import re
from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from django.db.models import Q

from .models import Booking


class BookingNumberService:
    """Service for generating unique booking numbers."""

    @staticmethod
    def generate_booking_number():
        """
        Generate a unique booking number in format: FH-YYYY-NNNN
        Uses database transaction to prevent race conditions.
        """
        year = timezone.now().year
        prefix = f"FH-{year}-"

        with transaction.atomic():
            # Get last booking number for this year
            last_booking = (
                Booking.objects
                .filter(booking_number__startswith=prefix)
                .order_by('-booking_number')
                .first()
            )

            if last_booking:
                try:
                    last_number = int(last_booking.booking_number.split('-')[-1])
                    next_number = last_number + 1
                except (ValueError, IndexError):
                    next_number = 1
            else:
                next_number = 1

            return f"{prefix}{str(next_number).zfill(4)}"


class BookingConflictService:
    """
    Service for detecting booking conflicts.
    Django backend is the authoritative source for conflict detection.
    """

    @staticmethod
    def check_conflict(start_date, end_date, from_time, end_time, exclude_id=None):
        """
        Check if a new booking conflicts with existing active bookings.

        Rules:
        1. Date ranges and times must not overlap with active bookings.
        2. A 4-hour buffer is enforced after end_time on the end_date.

        Returns:
            (bool, str): (has_conflict, error_message)
        """
        from datetime import datetime, timedelta

        # Base queryset - only active (non-cancelled) bookings
        qs = Booking.objects.exclude(booking_status=Booking.STATUS_CANCELLED)

        # Exclude current booking when editing
        if exclude_id:
            qs = qs.exclude(id=exclude_id)

        # Broad date range filter (include +-1 day for 4-hour buffer)
        query_start_date = start_date - timedelta(days=1)
        query_end_date = end_date + timedelta(days=1)

        candidates = qs.filter(
            start_date__lte=query_end_date,
            end_date__gte=query_start_date,
        )

        req_start_dt = datetime.combine(start_date, from_time)
        req_end_dt = datetime.combine(end_date, end_time)

        for existing in candidates:
            exist_start_dt = datetime.combine(existing.start_date, existing.from_time)
            exist_end_dt = datetime.combine(existing.end_date, existing.end_time)

            # Conflict condition with 4-hour buffer after both bookings:
            # req_start < (exist_end + 4h) AND exist_start < (req_end + 4h)
            if (req_start_dt < exist_end_dt + timedelta(hours=4)) and \
               (exist_start_dt < req_end_dt + timedelta(hours=4)):
                return True, "Already booked."

        return False, ""


class BookingValidationService:
    """Service for validating booking data."""

    INDIAN_PHONE_RE = re.compile(r'^[6-9]\d{9}$')

    @classmethod
    def validate_phone(cls, number, field_name="phone"):
        """Validate Indian mobile number format."""
        if number and not cls.INDIAN_PHONE_RE.match(str(number)):
            return False, f"{field_name}: Enter a valid 10-digit Indian mobile number."
        return True, ""

    @staticmethod
    def validate_payment(total_payment, received_payment):
        """Validate payment amounts."""
        errors = {}
        if total_payment < 0:
            errors['total_payment'] = "Total payment cannot be negative."
        if received_payment < 0:
            errors['received_payment'] = "Received payment cannot be negative."
        if received_payment > total_payment:
            errors['received_payment'] = "Received payment cannot exceed total payment."
        return errors

    @staticmethod
    def validate_dates(start_date, end_date, number_of_days):
        """Validate date logic."""
        errors = {}
        if end_date < start_date:
            errors['end_date'] = "End date cannot be before start date."
        expected_end = start_date + timedelta(days=number_of_days - 1)
        if end_date != expected_end:
            errors['end_date'] = f"End date must be {expected_end} based on number of days."
        return errors


def update_all_booking_statuses():
    """
    Utility function to update all non-cancelled booking statuses.
    Can be called by a management command or scheduled task.
    """
    today = timezone.localdate()
    active_bookings = Booking.objects.exclude(booking_status=Booking.STATUS_CANCELLED)

    for_today = Q(start_date__lte=today, end_date__gte=today)
    upcoming = Q(start_date__gt=today)
    completed = Q(end_date__lt=today)

    active_bookings.filter(for_today).update(booking_status=Booking.STATUS_TODAY)
    active_bookings.filter(upcoming).update(booking_status=Booking.STATUS_UPCOMING)
    active_bookings.filter(completed).update(booking_status=Booking.STATUS_COMPLETED)
