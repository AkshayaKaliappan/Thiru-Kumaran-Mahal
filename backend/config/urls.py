"""
Root URL Configuration for Thiru Kumaran Mahal.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    """Health check endpoint for deployment monitoring."""
    return JsonResponse({'status': 'healthy', 'service': 'Thiru Kumaran Mahal API'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check, name='health-check'),
    path('api/auth/', include('users.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/expenses/', include('expenses.urls')),
    path('api/reports/', include('reports.urls')),
]
