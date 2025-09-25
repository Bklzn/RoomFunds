from rest_framework import serializers
from user_auth.serializers import UserSerializer
from ..models import Group

class GroupSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(method_name='get_owner_id')
    moderators = serializers.ListSerializer(
        child=serializers.CharField(),
        read_only=True
    )
    members = serializers.ListSerializer(
        child=serializers.CharField(),
        read_only=True
    )
    
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

    def get_moderators_ids(self, obj):
        return [str(moderator.id) for moderator in obj.moderators.all()]
        
    def get_members_ids(self, obj):
        return [str(member.id) for member in obj.members.all()]
    