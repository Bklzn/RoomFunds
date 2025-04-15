from rest_framework import serializers
from .models import Expense, Group
from django.contrib.auth.models import User

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
        fields = ['name', 'description', 'owner', 'members']
        read_only_fields = ['id']
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method in ['POST', 'PUT', 'PATCH']:
            self.fields.pop('members')
            
            
    def validate_name(self, value):
        owner = self.context['request'].user
        if Group.objects.filter(owner=owner, name=value).exists():
            raise serializers.ValidationError('Group with this name already exists')
        return value
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['owner'] = user
        group = Group.objects.create(**validated_data)
        group.members.add(user)
        return group