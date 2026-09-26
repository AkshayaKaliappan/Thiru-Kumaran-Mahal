"""
Expenses app models for tracking additional function hall expenses.
"""
from django.db import models
from django.core.validators import MinValueValidator


class Expense(models.Model):
    """Model for tracking additional hall expenses."""

    CATEGORY_CLEANING = 'cleaning'
    CATEGORY_ELECTRICITY = 'electricity'
    CATEGORY_DECORATION = 'decoration'
    CATEGORY_MAINTENANCE = 'maintenance'
    CATEGORY_REPAIR = 'repair'
    CATEGORY_STAFF = 'staff'
    CATEGORY_TRANSPORTATION = 'transportation'
    CATEGORY_OTHER = 'other'

    CATEGORY_CHOICES = [
        (CATEGORY_CLEANING, 'Cleaning'),
        (CATEGORY_ELECTRICITY, 'Electricity'),
        (CATEGORY_DECORATION, 'Decoration'),
        (CATEGORY_MAINTENANCE, 'Maintenance'),
        (CATEGORY_REPAIR, 'Repair'),
        (CATEGORY_STAFF, 'Staff'),
        (CATEGORY_TRANSPORTATION, 'Transportation'),
        (CATEGORY_OTHER, 'Other'),
    ]

    expense_date = models.DateField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=500)
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    notes = models.TextField(blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'expenses'
        ordering = ['-expense_date', '-created_at']
        indexes = [
            models.Index(fields=['expense_date']),
            models.Index(fields=['category']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.category} - {self.description} ({self.expense_date})"
