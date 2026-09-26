"""
Bookings app serializers.
"""
from datetime import timedelta
import re

from rest_framework import serializers
from django.db import transaction

from .models import Booking
from .services import BookingNumberService, BookingConflictService


class BookingSerializer(serializers.ModelSerializer):
    """
    Full booking serializer for create/update/retrieve operations.
    """
    booking_number = serializers.CharField(read_only=True)
    balance = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    payment_status = serializers.CharField(read_only=True)
    booking_status = serializers.CharField(read_only=True)
    cancelled_at = serializers.DateTimeField(read_only=True)
    payment_status_display = serializers.SerializerMethodField()
    booking_status_display = serializers.SerializerMethodField()
    function_type_display = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_number',
            'party_name', 'contact_number', 'alternate_contact',
            'function_type', 'function_type_display',
            'start_date', 'end_date', 'number_of_days',
            'from_time', 'end_time',
            'total_payment', 'received_payment', 'balance',
            'payment_status', 'payment_status_display',
            'booking_status', 'booking_status_display',
            'remarks',
            'cancelled_at', 'cancellation_reason',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'booking_number', 'balance', 'payment_status',
            'booking_status', 'cancelled_at', 'created_at', 'updated_at',
        ]
        extra_kwargs = {
            'end_date': {'required': False},
        }

    def get_payment_status_display(self, obj):
        return obj.get_payment_status_display()

    def get_booking_status_display(self, obj):
        return obj.get_booking_status_display()

    def get_function_type_display(self, obj):
        return obj.get_function_type_display()

    def validate_contact_number(self, value):
        if not re.match(r'^[6-9]\d{9}$', value):
            raise serializers.ValidationError("Enter a valid 10-digit Indian mobile number.")
        return value

    def validate_alternate_contact(self, value):
        if value and not re.match(r'^[6-9]\d{9}$', value):
            raise serializers.ValidationError("Enter a valid 10-digit Indian mobile number.")
        return value

    def validate_total_payment(self, value):
        if value < 0:
            raise serializers.ValidationError("Total payment cannot be negative.")
        return value

    def validate_received_payment(self, value):
        if value < 0:
            raise serializers.ValidationError("Received payment cannot be negative.")
        return value

    def validate_number_of_days(self, value):
        if value < 1:
            raise serializers.ValidationError("Number of days must be at least 1.")
        return value

    def validate(self, attrs):
        start_date = attrs.get('start_date', self.instance.start_date if self.instance else None)
        number_of_days = attrs.get('number_of_days', self.instance.number_of_days if self.instance else 1)
        if start_date and number_of_days:
            expected_end = start_date + timedelta(days=number_of_days - 1)
            attrs['end_date'] = expected_end
            end_date = expected_end
        else:
            end_date = attrs.get('end_date', self.instance.end_date if self.instance else None)

        from_time = attrs.get('from_time', self.instance.from_time if self.instance else None)
        end_time = attrs.get('end_time', self.instance.end_time if self.instance else None)
        total_payment = attrs.get('total_payment', self.instance.total_payment if self.instance else 0)
        received_payment = attrs.get('received_payment', self.instance.received_payment if self.instance else 0)

        # Validate payment
        if received_payment > total_payment:
            raise serializers.ValidationError({
                'received_payment': "Received payment cannot exceed total payment."
            })

        # Check booking conflicts
        if start_date and end_date and from_time and end_time:
            exclude_id = self.instance.id if self.instance else None
            has_conflict, error_msg = BookingConflictService.check_conflict(
                start_date, end_date, from_time, end_time, exclude_id=exclude_id
            )
            if has_conflict:
                raise serializers.ValidationError({'error': error_msg})

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        """Create booking with auto-generated booking number."""
        validated_data['booking_number'] = BookingNumberService.generate_booking_number()
        return super().create(validated_data)


class BookingListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for booking list views."""
    payment_status_display = serializers.SerializerMethodField()
    booking_status_display = serializers.SerializerMethodField()
    function_type_display = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_number',
            'party_name', 'contact_number',
            'function_type', 'function_type_display',
            'start_date', 'end_date', 'number_of_days',
            'from_time', 'end_time',
            'total_payment', 'received_payment', 'balance',
            'payment_status', 'payment_status_display',
            'booking_status', 'booking_status_display',
            'created_at',
        ]

    def get_payment_status_display(self, obj):
        return obj.get_payment_status_display()

    def get_booking_status_display(self, obj):
        return obj.get_booking_status_display()

    def get_function_type_display(self, obj):
        return obj.get_function_type_display()


class PaymentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating payment information only."""

    class Meta:
        model = Booking
        fields = ['total_payment', 'received_payment']

    def validate_total_payment(self, value):
        if value < 0:
            raise serializers.ValidationError("Total payment cannot be negative.")
        return value

    def validate_received_payment(self, value):
        if value < 0:
            raise serializers.ValidationError("Received payment cannot be negative.")
        return value

    def validate(self, attrs):
        total = attrs.get('total_payment', self.instance.total_payment if self.instance else 0)
        received = attrs.get('received_payment', self.instance.received_payment if self.instance else 0)
        if received > total:
            raise serializers.ValidationError({
                'received_payment': "Received payment cannot exceed total payment."
            })
        return attrs


class CancelBookingSerializer(serializers.ModelSerializer):
    """Serializer for booking cancellation."""
    cancellation_reason = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True
    )

    class Meta:
        model = Booking
        fields = ['cancellation_reason']

    def validate(self, attrs):
        if self.instance and self.instance.booking_status == Booking.STATUS_CANCELLED:
            raise serializers.ValidationError({"error": "This booking is already cancelled."})
        return attrs
