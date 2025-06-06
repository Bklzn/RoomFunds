from rest_framework import serializers
from ..models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'description', 'id']
        read_only_fields = ['id']

    def validate(self, attrs):
        self.get_group()
        return super().validate(attrs)

    def validate_name(self, value):
        group = self.get_group()
        if group and Category.objects.filter(group=group, name__iexact=value).exists():
            raise serializers.ValidationError('Category with this name already exists')
        return value
    
    def create(self, validated_data):
        group = self.get_group()
        return Category.objects.create(group=group, **validated_data)
    
    def get_group(self):
        if hasattr(self, '_validated_group'):
            return self._validated_group
        
        group = self.context.get('group')
        if not group:
            raise serializers.ValidationError('Group is required in serializer context.')

        self._validated_group = group
        return group