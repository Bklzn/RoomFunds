from rest_framework import serializers
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)
    
    class Meta:
        model = Expense
        fields = ['id', 'user', 'amount', 'category', 'description', 'date']
        read_only_fields = ['id']