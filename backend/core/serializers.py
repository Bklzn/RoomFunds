from rest_framework import serializers

from user_auth.serializers import UserSerializer
from .models import Expense, Group

class ExpenseSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)
    group = serializers.SlugRelatedField(slug_field='name', queryset=Group.objects.none())
    
    class Meta:
        model = Expense
        fields = ['user', 'group', 'amount', 'category', 'description', 'date']
        read_only_fields = ['id','user']
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = self.context['request'].user
        self.fields['group'].queryset = Group.objects.filter(members=user)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
        
    def get_user(self, obj):
        return UserSerializer(obj.user).data['display']
    
        
class GroupSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    moderators = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    
    class Meta:
        model = Group
        fields = ['name', 'description', 'owner', 'moderators', 'members']
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
    
    def get_owner(self, obj):
        return UserSerializer(instance=obj.owner).data['display']

    def get_moderators(self, obj):
        serializers = UserSerializer(instance=obj.moderators.all(), many=True).data
        return [user['display'] for user in serializers.data]
        
    def get_members(self, obj):
        serializers = UserSerializer(instance=obj.members.all(), many=True).data
        return [user['display'] for user in serializers.data]