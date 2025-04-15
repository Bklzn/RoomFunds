from rest_framework import serializers
from .models import Expense, Group

class ExpenseSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)
    
    class Meta:
        model = Expense
        fields = ['id', 'user', 'amount', 'category', 'description', 'date']
        read_only_fields = ['id']
        
class GroupSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'owner', 'members']
        read_only_fields = ['id']
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.context.get('request') and self.context['request'].method == 'POST':
            self.fields.pop('members')

    def create(self, validated_data):
        user = self.context['request'].user
        group = Group.objects.create(**validated_data)
        group.members.add(user)
        return group