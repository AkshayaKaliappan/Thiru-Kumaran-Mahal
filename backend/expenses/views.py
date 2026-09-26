"""
Expenses app views.
"""
from django.utils import timezone
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum

from users.permissions import IsAdminUser
from .models import Expense
from .serializers import ExpenseSerializer
from .filters import ExpenseFilter


class ExpenseViewSet(viewsets.ModelViewSet):
    """ViewSet for Expense CRUD operations."""
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ExpenseFilter
    search_fields = ['description', 'notes']
    ordering_fields = ['expense_date', 'amount', 'category', 'created_at']
    ordering = ['-expense_date', '-created_at']

    def get_queryset(self):
        return Expense.objects.all()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        """Get expense summary statistics."""
        today = timezone.localdate()
        first_day_of_month = today.replace(day=1)

        all_expenses = Expense.objects.all()

        total = float(all_expenses.aggregate(t=Sum('amount'))['t'] or 0)
        this_month = float(
            all_expenses.filter(
                expense_date__gte=first_day_of_month
            ).aggregate(t=Sum('amount'))['t'] or 0
        )
        cleaning = float(
            all_expenses.filter(
                category=Expense.CATEGORY_CLEANING
            ).aggregate(t=Sum('amount'))['t'] or 0
        )
        other = float(
            all_expenses.exclude(
                category=Expense.CATEGORY_CLEANING
            ).aggregate(t=Sum('amount'))['t'] or 0
        )


        # Category breakdown
        category_breakdown = []
        for cat_key, cat_label in Expense.CATEGORY_CHOICES:
            amount = float(
                all_expenses.filter(category=cat_key).aggregate(t=Sum('amount'))['t'] or 0
            )
            category_breakdown.append({
                'category': cat_key,
                'label': cat_label,
                'amount': amount,
            })

        return Response({
            'total_expenses': total,
            'this_month': this_month,
            'cleaning_expenses': cleaning,
            'other_expenses': other,
            'category_breakdown': category_breakdown,
        })
