"""
Expenses app serializers.
"""
from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    """Full serializer for expense CRUD operations."""
    category_display = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = [
            'id', 'expense_date', 'category', 'category_display',
            'description', 'amount', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_category_display(self, obj):
        return obj.get_category_display()

    def validate_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Amount cannot be negative.")
        return value

    def validate_description(self, value):
        if not value.strip():
            raise serializers.ValidationError("Description cannot be blank.")
        return value.strip()
