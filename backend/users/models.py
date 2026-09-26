"""
Users app models - extends Django's built-in User model with profile data.
"""
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """
    Extended profile for admin/owner users.
    Links to Django's built-in User model.
    """
    ROLE_ADMIN = 'admin'
    ROLE_STAFF = 'staff'
    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Admin'),
        (ROLE_STAFF, 'Staff'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_STAFF)
    full_name = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_profiles'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['role']),
        ]

    def __str__(self):
        return f"{self.user.username} ({self.role})"

    @property
    def is_admin(self):
        return self.role == self.ROLE_ADMIN
