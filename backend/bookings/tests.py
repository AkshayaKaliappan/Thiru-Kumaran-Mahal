from datetime import date, time, timedelta
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status

from users.models import UserProfile
from bookings.models import Booking
from bookings.services import BookingNumberService, BookingConflictService


class BookingModelAndServiceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@thirukumaran.com',
            password='Function@2026',
        )
        UserProfile.objects.create(
            user=self.admin_user,
            role=UserProfile.ROLE_ADMIN,
            full_name='Owner Admin',
        )
        self.client.force_authenticate(user=self.admin_user)

    def test_booking_number_generation(self):
        num1 = BookingNumberService.generate_booking_number()
        self.assertTrue(num1.startswith(f"FH-{timezone.now().year}-"))
        self.assertEqual(num1, f"FH-{timezone.now().year}-0001")

    def test_booking_creation_and_end_date_calculation(self):
        start_d = date(2026, 11, 10)
        response = self.client.post('/api/bookings/', {
            'party_name': 'Ramesh & Priya Wedding',
            'contact_number': '9876543210',
            'alternate_contact': '9123456780',
            'function_type': 'wedding',
            'start_date': start_d.isoformat(),
            'number_of_days': 3,
            'from_time': '09:00:00',
            'end_time': '21:00:00',
            'total_payment': '150000.00',
            'received_payment': '50000.00',
            'remarks': 'Stage floral decoration requested',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        booking = Booking.objects.get(id=response.data['id'])
        # End date = Nov 10 + 3 - 1 = Nov 12
        self.assertEqual(booking.end_date, date(2026, 11, 12))
        self.assertEqual(float(booking.balance), 100000.00)
        self.assertEqual(booking.payment_status, Booking.PAYMENT_PARTIAL)
        self.assertEqual(booking.booking_number, f"FH-{timezone.now().year}-0001")

    def test_conflict_detection_with_4_hour_buffer(self):
        # Booking 1: 2026-12-01 08:00 to 14:00 (Buffered until 18:00)
        Booking.objects.create(
            booking_number='FH-2026-0001',
            party_name='Party A',
            contact_number='9876543210',
            function_type='birthday',
            start_date=date(2026, 12, 1),
            end_date=date(2026, 12, 1),
            number_of_days=1,
            from_time=time(8, 0),
            end_time=time(14, 0),
            total_payment=50000,
            received_payment=50000,
        )

        # Attempt to book at 16:00 (within 4 hours of 14:00 end) -> should fail
        has_conflict, msg = BookingConflictService.check_conflict(
            start_date=date(2026, 12, 1),
            end_date=date(2026, 12, 1),
            from_time=time(16, 0),
            end_time=time(22, 0),
        )
        self.assertTrue(has_conflict)
        self.assertEqual(msg, "Already booked.")

        # Attempt to book at 18:00 (exactly at buffer boundary) -> should succeed
        has_conflict2, _ = BookingConflictService.check_conflict(
            start_date=date(2026, 12, 1),
            end_date=date(2026, 12, 1),
            from_time=time(18, 0),
            end_time=time(23, 0),
        )
        self.assertFalse(has_conflict2)

    def test_cancellation_releases_slot(self):
        # Create a booking
        booking = Booking.objects.create(
            booking_number='FH-2026-0002',
            party_name='Party B',
            contact_number='9876543210',
            function_type='reception',
            start_date=date(2026, 12, 5),
            end_date=date(2026, 12, 5),
            number_of_days=1,
            from_time=time(9, 0),
            end_time=time(21, 0),
            total_payment=80000,
            received_payment=20000,
        )

        # Cancel it
        response = self.client.post(f'/api/bookings/{booking.id}/cancel/', {
            'cancellation_reason': 'Customer requested refund',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.booking_status, Booking.STATUS_CANCELLED)
        self.assertIsNotNone(booking.cancelled_at)

        # Check if slot is now free for another booking at the same time
        has_conflict, _ = BookingConflictService.check_conflict(
            start_date=date(2026, 12, 5),
            end_date=date(2026, 12, 5),
            from_time=time(9, 0),
            end_time=time(21, 0),
        )
        self.assertFalse(has_conflict)

    def test_payment_update_endpoint(self):
        booking = Booking.objects.create(
            booking_number='FH-2026-0003',
            party_name='Party C',
            contact_number='9876543210',
            function_type='reception',
            start_date=date(2026, 12, 10),
            end_date=date(2026, 12, 10),
            number_of_days=1,
            from_time=time(9, 0),
            end_time=time(21, 0),
            total_payment=100000,
            received_payment=30000,
        )
        response = self.client.patch(f'/api/bookings/{booking.id}/update-payment/', {
            'total_payment': '100000.00',
            'received_payment': '100000.00',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(float(booking.balance), 0.0)
        self.assertEqual(booking.payment_status, Booking.PAYMENT_FULL)

    def test_dashboard_stats_endpoint(self):
        response = self.client.get('/api/bookings/dashboard-stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_bookings', response.data)
        self.assertIn('revenue', response.data)
        self.assertIn('expenses', response.data)
        self.assertIn('net_amount', response.data)
