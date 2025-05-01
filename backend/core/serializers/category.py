from rest_framework import serializers
from ..models import Group, Category

class CategorySerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(write_only=True)
    class Meta:
        model = Category
        fields = ['name', 'description', 'group_name']
        read_only_fields = ['id']

    def validate_group_name(self, value):
        user = self.context['request'].user
        try:
            group = Group.objects.get(name=value, members=user)
        except Group.DoesNotExist:
            raise serializers.ValidationError('Group not found')
        self.group = group
        return value

    def validate_name(self, value):
        group = getattr(self, 'group', None)
        if group and Category.objects.filter(group=group, name__iexact=value).exists():
            raise serializers.ValidationError('Category with this name already exists')
        return value
    
    def create(self, validated_data):
        validated_data.pop('group_name')
        category = Category.objects.create(group=self.group, **validated_data)
        return category