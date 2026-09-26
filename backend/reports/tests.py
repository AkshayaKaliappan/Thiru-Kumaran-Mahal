from datetime import date, time
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from users.models import UserProfile
from bookings.models import Booking


class ReportTests(TestCase):
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

        # Seed test booking
        Booking.objects.create(
            booking_number='FH-2026-0001',
            party_name='Report Test Wedding',
            contact_number='9876543210',
            function_type='wedding',
            start_date=date.today(),
            end_date=date.today(),
            number_of_days=1,
            from_time=time(9, 0),
            end_time=time(21, 0),
            total_payment=100000,
            received_payment=60000,
        )

    def test_daily_report(self):
        response = self.client.get(f'/api/reports/daily/?date={date.today().isoformat()}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('summary', response.data)
        self.assertEqual(response.data['summary']['booking_count'], 1)
        self.assertEqual(response.data['summary']['total_payment'], 100000.0)
        self.assertEqual(response.data['summary']['received_payment'], 60000.0)
        self.assertEqual(response.data['summary']['outstanding_balance'], 40000.0)

    def test_monthly_report(self):
        today = date.today()
        response = self.client.get(f'/api/reports/monthly/?year={today.year}&month={today.month}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('summary', response.data)
        self.assertGreaterEqual(response.data['summary']['booking_count'], 1)

    def test_excel_export_endpoint(self):
        response = self.client.get('/api/reports/export/excel/?type=daily')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response['Content-Type'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

    def test_pdf_export_endpoint(self):
        response = self.client.get('/api/reports/export/pdf/?type=daily')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
