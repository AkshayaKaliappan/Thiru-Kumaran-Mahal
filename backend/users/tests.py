from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from users.models import UserProfile


class UserAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@thirukumaran.com',
            password='Function@2026',
        )
        self.admin_profile = UserProfile.objects.create(
            user=self.admin_user,
            role=UserProfile.ROLE_ADMIN,
            full_name='Hall Owner Admin',
        )

    def test_login_success(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'admin',
            'password': 'Function@2026',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['role'], 'admin')

    def test_registration_success(self):
        response = self.client.post('/api/auth/register/', {
            'full_name': 'Test Staff',
            'username': 'teststaff',
            'email': 'staff@example.com',
            'password': 'TestPassword@123',
            'confirm_password': 'TestPassword@123',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='teststaff').exists())
        staff_profile = UserProfile.objects.get(user__username='teststaff')
        self.assertEqual(staff_profile.role, UserProfile.ROLE_STAFF)

    def test_registration_password_mismatch(self):
        response = self.client.post('/api/auth/register/', {
            'full_name': 'Test Staff',
            'username': 'teststaff2',
            'email': 'staff2@example.com',
            'password': 'TestPassword@123',
            'confirm_password': 'MismatchPassword@123',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_me_endpoint_authenticated(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'admin')
