"""
Bookings app views - HTTP request handling only.
Business logic is delegated to services.
"""
from django.utils import timezone
from django.db import transaction
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from users.permissions import IsAdminUser
from .models import Booking
from .serializers import (
    BookingSerializer,
    BookingListSerializer,
    PaymentUpdateSerializer,
    CancelBookingSerializer,
)
from .filters import BookingFilter


class BookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Booking CRUD operations and custom actions.
    All endpoints require authentication.
    Write operations require admin role.
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = BookingFilter
    search_fields = ['booking_number', 'party_name', 'contact_number']
    ordering_fields = ['start_date', 'from_time', 'party_name', 'total_payment', 'balance', 'created_at']
    ordering = ['-start_date', 'from_time']

    def get_queryset(self):
        """Return all bookings with dynamic status refresh."""
        return Booking.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return BookingListSerializer
        return BookingSerializer

    def get_permissions(self):
        """Admin required for write operations."""
        if self.action in ['create', 'update', 'partial_update', 'destroy',
                           'cancel', 'update_payment']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'], url_path='today')
    def today_bookings(self, request):
        """Get today's active bookings."""
        today = timezone.localdate()
        queryset = self.get_queryset().filter(
            start_date__lte=today,
            end_date__gte=today,
        ).exclude(booking_status=Booking.STATUS_CANCELLED)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = BookingListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = BookingListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='upcoming')
    def upcoming_bookings(self, request):
        """Get upcoming active bookings (start date > today)."""
        today = timezone.localdate()
        queryset = self.get_queryset().filter(
            start_date__gt=today,
        ).exclude(booking_status=Booking.STATUS_CANCELLED)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = BookingListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = BookingListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='completed')
    def completed_bookings(self, request):
        """Get completed bookings (end date < today, non-cancelled)."""
        today = timezone.localdate()
        queryset = self.get_queryset().filter(
            end_date__lt=today,
        ).exclude(booking_status=Booking.STATUS_CANCELLED)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = BookingListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = BookingListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        """Cancel a booking."""
        booking = self.get_object()
        if booking.booking_status == Booking.STATUS_CANCELLED:
            return Response(
                {'error': 'This booking is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = CancelBookingSerializer(booking, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            booking.booking_status = Booking.STATUS_CANCELLED
            booking.cancelled_at = timezone.now()
            booking.cancellation_reason = serializer.validated_data.get('cancellation_reason', '') or request.data.get('cancellation_reason', '') or ''
            booking.save()

        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['patch'], url_path='update-payment')
    def update_payment(self, request, pk=None):
        """Update payment information for a booking."""
        booking = self.get_object()
        if booking.booking_status == Booking.STATUS_CANCELLED:
            return Response(
                {'error': 'Cannot update payment for a cancelled booking.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PaymentUpdateSerializer(booking, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            serializer.save()

        return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='dashboard-stats')
    def dashboard_stats(self, request):
        """Get dashboard statistics from real database data."""
        from django.db.models import Sum, Count, Q
        from expenses.models import Expense

        today = timezone.localdate()

        all_bookings = Booking.objects.all()
        active_bookings = all_bookings.exclude(booking_status=Booking.STATUS_CANCELLED)

        stats = {
            'total_bookings': all_bookings.count(),
            'cancelled_bookings': all_bookings.filter(
                booking_status=Booking.STATUS_CANCELLED
            ).count(),
            'today_bookings': active_bookings.filter(
                start_date__lte=today, end_date__gte=today
            ).count(),
            'upcoming_bookings': active_bookings.filter(start_date__gt=today).count(),
            'completed_bookings': active_bookings.filter(end_date__lt=today).count(),
            'pending_payment': active_bookings.filter(
                payment_status__in=[Booking.PAYMENT_NOT_PAID, Booking.PAYMENT_PARTIAL]
            ).count(),
            'fully_paid': active_bookings.filter(
                payment_status=Booking.PAYMENT_FULL
            ).count(),
            'revenue': float(
                active_bookings.aggregate(
                    total=Sum('received_payment')
                )['total'] or 0
            ),
            'total_billed': float(
                active_bookings.aggregate(
                    total=Sum('total_payment')
                )['total'] or 0
            ),
            'outstanding_balance': float(
                active_bookings.aggregate(
                    total=Sum('balance')
                )['total'] or 0
            ),
        }

        # Expense totals
        total_expenses = float(
            Expense.objects.aggregate(total=Sum('amount'))['total'] or 0
        )
        stats['expenses'] = total_expenses
        stats['net_amount'] = stats['revenue'] - total_expenses

        # Daily bookings for chart (last 30 days)
        from datetime import timedelta
        thirty_days_ago = today - timedelta(days=29)
        daily_data = []
        current = thirty_days_ago
        while current <= today:
            day_count = active_bookings.filter(
                start_date__lte=current, end_date__gte=current
            ).count()
            daily_data.append({
                'date': current.isoformat(),
                'bookings': day_count,
            })
            current += timedelta(days=1)
        stats['daily_bookings'] = daily_data

        # Payment status distribution
        stats['payment_distribution'] = [
            {'name': 'Not Paid', 'value': active_bookings.filter(payment_status=Booking.PAYMENT_NOT_PAID).count()},
            {'name': 'Partially Paid', 'value': active_bookings.filter(payment_status=Booking.PAYMENT_PARTIAL).count()},
            {'name': 'Fully Paid', 'value': active_bookings.filter(payment_status=Booking.PAYMENT_FULL).count()},
        ]

        # Booking status distribution
        stats['status_distribution'] = [
            {'name': 'Today', 'value': stats['today_bookings']},
            {'name': 'Upcoming', 'value': stats['upcoming_bookings']},
            {'name': 'Completed', 'value': stats['completed_bookings']},
            {'name': 'Cancelled', 'value': stats['cancelled_bookings']},
        ]

        return Response(stats)

    @action(detail=False, methods=['get'], url_path='search')
    def global_search(self, request):
        """Global search for bookings by name, number, or contact."""
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'results': [], 'count': 0})

        queryset = Booking.objects.filter(
            party_name__icontains=query
        ) | Booking.objects.filter(
            booking_number__icontains=query
        ) | Booking.objects.filter(
            contact_number__icontains=query
        )
        queryset = queryset.distinct().order_by('-start_date')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = BookingListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = BookingListSerializer(queryset, many=True)
        return Response({'results': serializer.data, 'count': queryset.count()})
