from rest_framework.test import APITestCase
from user_auth.serializers import UserSerializer
from django.contrib.auth.models import User
from social_django.models import UserSocialAuth

class UserSerializerTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.social_auth = UserSocialAuth.objects.create(
            user=self.user,
            provider='google-oauth2',
            uid='google_uid_123',
            extra_data={'picture': 'https://google.com/profile_pic.jpg'}
        )

    def test_user_serializer(self):
        serializer = UserSerializer(self.user)
        data = serializer.data
        self.assertEqual(data['username'], self.user.username)
        self.assertEqual(data['avatar'], 'https://google.com/profile_pic.jpg')