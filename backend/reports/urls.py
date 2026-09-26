"""
Reports app URL configuration.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('daily/', views.daily_report, name='report-daily'),
    path('monthly/', views.monthly_report, name='report-monthly'),
    path('cancelled/', views.cancelled_report, name='report-cancelled'),
    path('pending-payment/', views.pending_payment_report, name='report-pending-payment'),
    path('fully-paid/', views.fully_paid_report, name='report-fully-paid'),
    path('export/excel/', views.export_excel, name='export-excel'),
    path('export/pdf/', views.export_pdf, name='export-pdf'),
]
