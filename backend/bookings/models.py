"""
Bookings app models for Function Hall Booking Management System.
"""
from django.db import models
from django.core.validators import RegexValidator, MinValueValidator
from django.utils import timezone


class Booking(models.Model):
    """
    Main booking model for function hall reservations.
    """
    # Payment Status Choices
    PAYMENT_NOT_PAID = 'not_paid'
    PAYMENT_PARTIAL = 'partially_paid'
    PAYMENT_FULL = 'fully_paid'
    PAYMENT_STATUS_CHOICES = [
        (PAYMENT_NOT_PAID, 'Not Paid'),
        (PAYMENT_PARTIAL, 'Partially Paid'),
        (PAYMENT_FULL, 'Fully Paid'),
    ]

    # Booking Status Choices
    STATUS_UPCOMING = 'upcoming'
    STATUS_TODAY = 'today'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_CHOICES = [
        (STATUS_UPCOMING, 'Upcoming'),
        (STATUS_TODAY, 'Today'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    # Function Type Choices
    FUNCTION_WEDDING = 'wedding'
    FUNCTION_RECEPTION = 'reception'
    FUNCTION_ENGAGEMENT = 'engagement'
    FUNCTION_BIRTHDAY = 'birthday'
    FUNCTION_CONFERENCE = 'conference'
    FUNCTION_SEMINAR = 'seminar'
    FUNCTION_ANNIVERSARY = 'anniversary'
    FUNCTION_NAMING = 'naming_ceremony'
    FUNCTION_PUBERTY = 'puberty_ceremony'
    FUNCTION_OTHER = 'other'
    FUNCTION_TYPE_CHOICES = [
        (FUNCTION_WEDDING, 'Wedding'),
        (FUNCTION_RECEPTION, 'Reception'),
        (FUNCTION_ENGAGEMENT, 'Engagement'),
        (FUNCTION_BIRTHDAY, 'Birthday'),
        (FUNCTION_CONFERENCE, 'Conference'),
        (FUNCTION_SEMINAR, 'Seminar'),
        (FUNCTION_ANNIVERSARY, 'Anniversary'),
        (FUNCTION_NAMING, 'Naming Ceremony'),
        (FUNCTION_PUBERTY, 'Puberty Ceremony'),
        (FUNCTION_OTHER, 'Other'),
    ]

    # Phone validator for Indian mobile numbers
    phone_validator = RegexValidator(
        regex=r'^[6-9]\d{9}$',
        message='Enter a valid 10-digit Indian mobile number.'
    )

    # Booking Identification
    booking_number = models.CharField(max_length=20, unique=True, db_index=True)

    # Party Information
    party_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=10, validators=[phone_validator])
    alternate_contact = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        validators=[phone_validator]
    )
    function_type = models.CharField(max_length=30, choices=FUNCTION_TYPE_CHOICES)
    remarks = models.TextField(blank=True, null=True)

    # Date & Time Information
    start_date = models.DateField()
    end_date = models.DateField()
    number_of_days = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    from_time = models.TimeField()
    end_time = models.TimeField()

    # Payment Information
    total_payment = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    received_payment = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default=PAYMENT_NOT_PAID
    )

    # Booking Status (computed dynamically, stored for query optimization)
    booking_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_UPCOMING
    )

    # Cancellation fields
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bookings'
        ordering = ['-start_date', 'from_time']
        indexes = [
            models.Index(fields=['booking_number']),
            models.Index(fields=['start_date', 'end_date']),
            models.Index(fields=['booking_status']),
            models.Index(fields=['payment_status']),
            models.Index(fields=['party_name']),
            models.Index(fields=['contact_number']),
            models.Index(fields=['function_type']),
            models.Index(fields=['start_date']),
            models.Index(fields=['end_date']),
        ]

    def __str__(self):
        return f"{self.booking_number} - {self.party_name}"

    def calculate_balance(self):
        """Calculate balance from total and received payments."""
        return self.total_payment - self.received_payment

    def calculate_payment_status(self):
        """Determine payment status based on amounts."""
        if self.received_payment == 0:
            return self.PAYMENT_NOT_PAID
        elif self.received_payment < self.total_payment:
            return self.PAYMENT_PARTIAL
        else:
            return self.PAYMENT_FULL

    def compute_booking_status(self):
        """
        Compute the booking status based on dates.
        Backend is authoritative for date classification.
        """
        if self.booking_status == self.STATUS_CANCELLED:
            return self.STATUS_CANCELLED

        today = timezone.localdate()
        if self.start_date <= today <= self.end_date:
            return self.STATUS_TODAY
        elif self.start_date > today:
            return self.STATUS_UPCOMING
        else:  # end_date < today
            return self.STATUS_COMPLETED

    def save(self, *args, **kwargs):
        """Override save to auto-calculate derived fields."""
        # Calculate balance
        self.balance = self.calculate_balance()
        # Calculate payment status
        self.payment_status = self.calculate_payment_status()
        # Compute booking status (only if not cancelled)
        if self.booking_status != self.STATUS_CANCELLED:
            self.booking_status = self.compute_booking_status()
        super().save(*args, **kwargs)
