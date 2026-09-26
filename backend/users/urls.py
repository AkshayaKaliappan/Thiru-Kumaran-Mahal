"""
Users app URL configuration.
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import CustomTokenObtainPairView, RegisterView, logout_view, me_view

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', logout_view, name='logout'),
    path('me/', me_view, name='me'),
]
