from rest_framework.test import APITestCase, force_authenticate, APIRequestFactory
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import RefreshToken
from social_django.models import UserSocialAuth
from unittest.mock import patch
from django.http import JsonResponse
from datetime import timedelta
from ..models import LoginCode
from ..views import get_client_ip, oauth_redirect, set_tokens
from django.utils import timezone
import json


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
        self.assertEqual(response.data['username'], self.user.username)
        
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
    # @patch('user_auth.views.set_cookies')
    # def test_oauth_redirect(self, mock_set_cookies):
    #     mock_set_cookies.return_value = JsonResponse({"message": "Tokens set successfully"})
    #     response = self.client.get('/auth/callback/')
    #     self.assertEqual(response.status_code, 302)
    #     self.assertEqual(response.url, 'http://localhost:5173')
        
    @patch('user_auth.views.set_tokens')
    def test_oauth_redirect(self, mock_set_tokens):
        mock_set_tokens.return_value = JsonResponse({"message": "Tokens set successfully", 'code': '123abc'})
        response = self.client.get('/auth/callback/')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, 'http://localhost:5173?code=123abc')
        
class CookieTokenRefreshViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        refresh = RefreshToken.for_user(self.user)
        self.refresh_token = str(refresh)
        self.access_token = str(refresh.access_token)
        self.url = reverse('token_refresh')

    def test_successful_token_refresh(self):
        self.client.cookies['refresh_token'] = self.refresh_token
        response = self.client.post(self.url)
        
        self.assertEqual(response.status_code, 204)
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)
        self.assertTrue(response.cookies['access_token']['httponly'])
        self.assertTrue(response.cookies['refresh_token']['httponly'])
        self.assertEqual(response.cookies['access_token']['samesite'], 'Strict')
        self.assertEqual(response.cookies['refresh_token']['samesite'], 'Strict')

    def test_missing_refresh_token(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['detail'], 'Refresh token not found in cookies')

    def test_invalid_refresh_token(self):
        self.client.cookies['refresh_token'] = 'invalid_token'
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['detail'], 'Invalid refresh token')

    def test_expired_refresh_token(self):
        expired_token = RefreshToken.for_user(self.user)
        expired_token.set_exp(lifetime=-timedelta(days=1))
        self.client.cookies['refresh_token'] = str(expired_token)
        
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['detail'], 'Invalid refresh token')
        
    def test_token_refresh_cookie_attributes(self):
        self.client.cookies['refresh_token'] = self.refresh_token
        response = self.client.post(self.url)
        
        for cookie_name in ['access_token', 'refresh_token']:
            self.assertTrue(response.cookies[cookie_name]['httponly'])
            self.assertEqual(response.cookies[cookie_name]['samesite'], 'Strict')
            self.assertNotEqual(response.cookies[cookie_name].value, '')
class SetTokensViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.factory = APIRequestFactory()

    def test_set_tokens_authenticated_user(self):
        request = self.factory.get('/')
        request.user = self.user
        response = set_tokens(request)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertIn('code', data)
        self.assertEqual(data['message'], 'Tokens set successfully')

    def test_set_tokens_unauthenticated_user(self):
        request = self.factory.get('/')
        request.user = AnonymousUser()

        response = set_tokens(request)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(data['error'], 'User is not authenticated')

class CodeExchangeViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.force_authenticate(user=self.user)
        self.user_agent = 'test-user-agent'
        self.ip_address = '127.0.0.1'
        self.client.defaults['HTTP_USER_AGENT'] = self.user_agent
        self.client.defaults['REMOTE_ADDR'] = self.ip_address

        refresh = RefreshToken.for_user(self.user)
        self.login_code = LoginCode.objects.create(
            user=self.user,
            access_token=refresh.access_token,
            refresh_token=str(refresh),
            expires_at=timezone.now() + timedelta(minutes=1),
            user_agent=self.user_agent,
            ip_address=self.ip_address
        )

    def test_valid_code_exchange(self):
        response = self.client.get(f'/token/exchange/{self.login_code.code}')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())
        self.assertIn('refresh_token', response.json())

    def test_invalid_code(self):
        response = self.client.get('/token/exchange/invalid-code')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['detail'], 'Invalid code')

    def test_expired_code(self):
        self.login_code.expires_at = timezone.now() - timedelta(minutes=2)
        self.login_code.save()
        response = self.client.get(f'/token/exchange/{self.login_code.code}')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['detail'], 'Expired code')

    def test_different_user_agent(self):
        self.client.defaults['HTTP_USER_AGENT'] = 'different-user-agent'
        response = self.client.get(f'/token/exchange/{self.login_code.code}')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['detail'], 'Invalid code')

    def test_different_ip_address(self):
        self.client.defaults['REMOTE_ADDR'] = '192.168.1.1'
        response = self.client.get(f'/token/exchange/{self.login_code.code}')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['detail'], 'Invalid code')

class GetClientIPTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        
    def test_get_client_ip_with_x_forwarded_for(self):
        request = self.factory.get('/', HTTP_X_FORWARDED_FOR='192.168.1.1, 10.0.0.1')
        ip = get_client_ip(request)
        self.assertEqual(ip, '192.168.1.1')

    def test_get_client_ip_without_x_forwarded_for(self):
        request = self.factory.get('/', REMOTE_ADDR='127.0.0.1')
        ip = get_client_ip(request)
        self.assertEqual(ip, '127.0.0.1')
