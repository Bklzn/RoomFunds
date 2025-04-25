from rest_framework import serializers
from social_django.models import UserSocialAuth
from django.contrib.auth.models import User

class UserSocialAuthSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = UserSocialAuth
        fields = ['id', 'provider', 'uid', 'extra_data', 'user']
        read_only_fields = fields
        
class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    display = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'avatar', 'display']

    def get_avatar(self, user):
        social = user.social_auth.filter(provider='google-oauth2').first()
        if social:
            return social.extra_data.get('picture')
        return None
    
    def get_display(self, obj):
        return f'{obj.username} ({obj.first_name} {obj.last_name})'