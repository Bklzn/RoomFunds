from decimal import Decimal
from rest_framework import serializers
from django.utils import timezone
from ..models import Expense, Group, Category

class ExpenseSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    category_input = serializers.CharField(write_only=True, required=False)
    user = serializers.SerializerMethodField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0.01'))
    group = serializers.SlugRelatedField(slug_field='slug', queryset=Group.objects.none())
    
    class Meta:
        model = Expense
        fields = ['user', 'group', 'amount', 'category', 'category_input', 'description', 'date']
        read_only_fields = ['id','user']
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request is not None:
            user = request.user
            self.fields['group'].queryset = Group.objects.filter(members=user)
        else:
            self.fields['group'].queryset = Group.objects.none()
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        category_input = validated_data.pop("category_input", "").strip()
        group: Group = validated_data['group']
        try:
            category_obj = Category.objects.get(name__iexact=category_input, group=group)
            validated_data['category'] = category_obj
        except Category.DoesNotExist:
            validated_data['category_text'] = category_input
        return super().create(validated_data)

    def update(self, instance, validated_data):
        category_input = validated_data.pop("category_input", "").strip()
        group = validated_data.get("group", instance.group)

        try:
            category_obj = Category.objects.get(name__iexact=category_input, group=group)
            instance.category = category_obj
            instance.category_text = ""
        except Category.DoesNotExist:
            instance.category = None
            instance.category_text = category_input

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
    def validate_date(self, value):
        if value > timezone.now().date():
            raise serializers.ValidationError("Date cannot be in the future.")
        return value

    def get_user(self, obj):
        return obj.user.id
    
    def get_category(self, obj):
        if obj.category:
            return obj.category.id
        return obj.category_text