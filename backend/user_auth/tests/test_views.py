from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from social_django.models import UserSocialAuth
from unittest.mock import patch
from django.http import JsonResponse


class WhoAmIViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)

        self.cookies = {
            'access_token': access_token,
            'refresh_token': str(refresh),
        }

    def test_who_am_i(self):
        url = reverse('whoami')
        for cookie, value in self.cookies.items():
            self.client.cookies[cookie] = value

        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user']['username'], self.user.username)
        
class UserSocialAuthTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.social_auth = UserSocialAuth.objects.create(
            user=self.user,
            provider='google-oauth2',
            uid='google_uid_123',
            extra_data={'picture': 'https://google.com/profile_pic.jpg'}
        )

    def test_user_social_auth_creation(self):
        self.assertEqual(self.social_auth.provider, 'google-oauth2')
        self.assertEqual(self.social_auth.uid, 'google_uid_123')
        self.assertEqual(self.social_auth.extra_data, {'picture': 'https://google.com/profile_pic.jpg'})
        
class OAuthRedirectTest(APITestCase):
    @patch('user_auth.views.set_cookies')
    def test_oauth_redirect(self, mock_set_cookies):
        mock_set_cookies.return_value = JsonResponse({"message": "Tokens set successfully"})
        response = self.client.get('/auth/callback/')  # Zakładając, że masz odpowiedni URL
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, 'http://localhost:5173')