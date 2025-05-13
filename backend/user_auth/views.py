from django.http import JsonResponse
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from user_auth.serializers import UserSerializer
from django.contrib.auth import logout
from drf_spectacular.utils import extend_schema

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get('access_token')
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token

@extend_schema(responses=UserSerializer)
class WhoAmIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

def logout_view(request):
    logout(request)
    response = redirect('/')
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response


def oauth_redirect(request):
    response: JsonResponse = set_cookies(request)
    if response.status_code > 199 and response.status_code < 300:
        response_redirect = redirect('http://localhost:5173')
        response_redirect.cookies = response.cookies
        return response_redirect
    else:
        return response

def set_cookies(request):
    if request.user.is_authenticated:
        user = request.user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        response = JsonResponse({"message": "Tokens set successfully"})
        response.set_cookie('access_token', access_token, httponly=True, samesite='Strict')
        response.set_cookie('refresh_token', refresh, httponly=True, samesite='Strict')
    else:
        return JsonResponse({"error": "User is not authenticated"}, status=401)

    return response
    