"""
Users app permissions for role-based access control.
"""
from rest_framework.permissions import BasePermission

from .models import UserProfile


class IsAdminUser(BasePermission):
    """
    Allows access only to admin/staff users.
    Checks Django superuser/staff status and UserProfile role.
    """
    message = "Access denied. Admin privileges required."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Django superusers and staff users always have access
        if request.user.is_superuser or request.user.is_staff:
            return True
        # Check profile role
        try:
            profile = getattr(request.user, 'profile', None)
            if profile:
                return profile.role in [UserProfile.ROLE_ADMIN, UserProfile.ROLE_STAFF]
        except Exception:
            pass
        return False


class IsAuthenticatedAndAdminOrReadOnly(BasePermission):
    """
    Allows read access to authenticated users,
    write access to admins and staff.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        if request.user.is_superuser or request.user.is_staff:
            return True
        try:
            profile = getattr(request.user, 'profile', None)
            if profile:
                return profile.role in [UserProfile.ROLE_ADMIN, UserProfile.ROLE_STAFF]
        except Exception:
            pass
        return False
