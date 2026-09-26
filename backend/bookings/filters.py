"""
Bookings app filters for advanced querying.
"""
import django_filters
from .models import Booking


class BookingFilter(django_filters.FilterSet):
    """Filter set for Booking queryset."""
    start_date = django_filters.DateFilter(field_name='start_date')
    start_date_from = django_filters.DateFilter(field_name='start_date', lookup_expr='gte')
    start_date_to = django_filters.DateFilter(field_name='start_date', lookup_expr='lte')
    end_date = django_filters.DateFilter(field_name='end_date')
    payment_status = django_filters.ChoiceFilter(choices=Booking.PAYMENT_STATUS_CHOICES)
    booking_status = django_filters.ChoiceFilter(choices=Booking.STATUS_CHOICES)
    function_type = django_filters.ChoiceFilter(choices=Booking.FUNCTION_TYPE_CHOICES)
    date = django_filters.DateFilter(method='filter_by_date')

    class Meta:
        model = Booking
        fields = [
            'start_date', 'start_date_from', 'start_date_to',
            'end_date', 'payment_status', 'booking_status',
            'function_type', 'date',
        ]

    def filter_by_date(self, queryset, name, value):
        """Filter bookings that cover a specific date."""
        return queryset.filter(start_date__lte=value, end_date__gte=value)
