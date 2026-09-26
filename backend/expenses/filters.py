"""
Expenses app filters.
"""
import django_filters
from .models import Expense


class ExpenseFilter(django_filters.FilterSet):
    """Filter set for expenses."""
    category = django_filters.ChoiceFilter(choices=Expense.CATEGORY_CHOICES)
    date_from = django_filters.DateFilter(field_name='expense_date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='expense_date', lookup_expr='lte')
    expense_date = django_filters.DateFilter(field_name='expense_date')

    class Meta:
        model = Expense
        fields = ['category', 'expense_date', 'date_from', 'date_to']
