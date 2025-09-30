from rest_framework import serializers
from ..models import Group, GroupMembership
from drf_spectacular.utils import extend_schema_field

class GroupSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(method_name='get_owner_id')
    moderators = serializers.SerializerMethodField(method_name='get_moderators_ids')
    members = serializers.SerializerMethodField(method_name='get_members_ids')
    total_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = Group
        fields = ['name', 'description', 'owner', 'moderators', 'members', 'total_amount']
        read_only_fields = ['id']
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method in ['POST', 'PUT', 'PATCH']:
            self.fields.pop('members')
            
            
    def validate_name(self, value):
        owner = self.context['request'].user
        if Group.objects.filter(members=owner, name=value).exists():
            raise serializers.ValidationError('Group with this name already exists')
        return value
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['owner'] = user
        group = Group.objects.create(**validated_data)
        group.members.add(user)
        return group
    
    def get_owner_id(self, obj):
        return str(obj.owner.id)
    
    @extend_schema_field(serializers.ListField(child=serializers.CharField(), read_only=True))
    def get_moderators_ids(self, obj):
         return [
        str(m.user.id)
        for m in obj.memberships.filter(role=GroupMembership.ROLE_MODERATOR)
    ]
    
    @extend_schema_field(serializers.ListField(child=serializers.CharField(), read_only=True))
    def get_members_ids(self, obj):
        return [str(member.id) for member in obj.members.all()]
    
    @extend_schema_field(serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0))
    def get_total_amount(self, obj):
        group_expenses = obj.expenses.all()
        return sum([expense.amount for expense in group_expenses])
    