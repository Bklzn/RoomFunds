from decimal import Decimal
from rest_framework import serializers

from user_auth.serializers import UserSerializer
from ..models import Expense, Group, Category

class ExpenseSerializer(serializers.ModelSerializer):
    category = serializers.CharField(write_only=True)
    category_display = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0.01'))
    group = serializers.SlugRelatedField(slug_field='name', queryset=Group.objects.none())
    
    class Meta:
        model = Expense
        fields = ['user', 'group', 'amount', 'category', 'category_display', 'description', 'date']
        read_only_fields = ['id','user']
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = self.context['request'].user
        self.fields['group'].queryset = Group.objects.filter(members=user)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        category_input = validated_data.pop("category", "").strip()
        group: Group = validated_data['group']
        try:
            category_obj = Category.objects.get(name__iexact=category_input, group=group)
            validated_data['category_obj'] = category_obj
        except Category.DoesNotExist:
            validated_data['category_text'] = category_input
        return super().create(validated_data)

    def update(self, instance, validated_data):
        category_input = validated_data.pop("category", "").strip()
        group = validated_data.get("group", instance.group)

        try:
            category_obj = Category.objects.get(name__iexact=category_input, group=group)
            instance.category_obj = category_obj
            instance.category_text = ""
        except Category.DoesNotExist:
            instance.category_obj = None
            instance.category_text = category_input

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def get_user(self, obj):
        return UserSerializer(obj.user).data['display']
    
    def get_category_display(self, obj):
        return obj.category_text or (obj.category_obj.name if obj.category_obj else None)