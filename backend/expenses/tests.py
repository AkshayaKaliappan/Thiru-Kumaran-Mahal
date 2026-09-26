from datetime import date
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from users.models import UserProfile
from expenses.models import Expense


class ExpenseTests(TestCase):
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

    def test_create_and_summary_expense(self):
        # Create cleaning expense
        res1 = self.client.post('/api/expenses/', {
            'expense_date': date.today().isoformat(),
            'category': 'cleaning',
            'description': 'Deep cleaning hall floor',
            'amount': '3500.00',
            'notes': 'Paid cash to contractor',
        })
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)

        # Create electricity expense
        res2 = self.client.post('/api/expenses/', {
            'expense_date': date.today().isoformat(),
            'category': 'electricity',
            'description': 'EB Bill Monthly',
            'amount': '12500.00',
        })
        self.assertEqual(res2.status_code, status.HTTP_201_CREATED)

        # Check Summary endpoint
        summary_res = self.client.get('/api/expenses/summary/')
        self.assertEqual(summary_res.status_code, status.HTTP_200_OK)
        self.assertEqual(summary_res.data['total_expenses'], 16000.00)
        self.assertEqual(summary_res.data['cleaning_expenses'], 3500.00)
        self.assertEqual(summary_res.data['other_expenses'], 12500.00)

    def test_reject_negative_expense_amount(self):
        res = self.client.post('/api/expenses/', {
            'expense_date': date.today().isoformat(),
            'category': 'cleaning',
            'description': 'Invalid test',
            'amount': '-500.00',
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
