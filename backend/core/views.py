from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth import logout
from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from user_auth.serializers import UserSerializer

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get('access_token')
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token

class WhoAmIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data})


def login_view(request):
    redirect_uri = settings.LOGIN_REDIRECT_URL
    return render(request, 'login.html', {'redirect_uri': redirect_uri})

def logout_view(request):
    logout(request)
    response = redirect('/')
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response