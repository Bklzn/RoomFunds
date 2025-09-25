from rest_framework import serializers
from social_django.models import UserSocialAuth
from django.contrib.auth.models import User
from core.models import Expense

class UserSocialAuthSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = UserSocialAuth
        fields = ['id', 'provider', 'uid', 'extra_data', 'user']
        read_only_fields = fields
        
class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    display = serializers.SerializerMethodField()
    total_group_expenses = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id','username', 'email', 'first_name', 'last_name', 'avatar', 'display', 'total_group_expenses']

    def get_avatar(self, user):
        social = user.social_auth.filter(provider='google-oauth2').first()
        if social:
            return social.extra_data.get('picture')
        return None
    
    def get_display(self, obj):
        return f'{obj.username} ({obj.first_name} {obj.last_name})'
    
    def get_total_group_expenses(self, obj):
        group = self.context.get('group')
        if not group:
            return None
        expenses = Expense.objects.filter(group=group)
        return sum([expense.amount for expense in expenses])