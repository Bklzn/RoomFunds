from django.http import JsonResponse
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed

from user_auth.serializers import UserSerializer
from django.contrib.auth import logout
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from .models import LoginCode
from django.utils import timezone
from datetime import timedelta
import json
from django.conf import settings

# class CookieJWTAuthentication(JWTAuthentication):
#     def authenticate(self, request):
#         raw_token = request.COOKIES.get('access_token')
#         if raw_token is None:
#             return None

#         validated_token = self.get_validated_token(raw_token)
#         return self.get_user(validated_token), validated_token

@extend_schema(responses=UserSerializer)
class WhoAmIView(APIView):
    authentication_classes = [JWTAuthentication]
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
    response: JsonResponse = set_tokens(request)
    if response.status_code > 199 and response.status_code < 300:
        code = json.loads(response.content)['code']
        cors_allowed_origin = settings.CORS_ALLOWED_ORIGINS[0]
        response_redirect = redirect(f'{cors_allowed_origin}/auth/' + str(code))
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

def set_tokens(request):
    if request.user.is_authenticated:
        user = request.user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        code = LoginCode.objects.create(
            user=user,
            access_token=access_token,
            refresh_token=str(refresh),
            expires_at=timezone.now() + timedelta(minutes=1),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            ip_address=get_client_ip(request)
        )
        
        code.save()

        return JsonResponse({"message": "Tokens set successfully", "code": str(code)}, status=201)
    
    return JsonResponse({"error": "User is not authenticated"}, status=401)
        
def get_client_ip(request):
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0]
    return request.META.get('REMOTE_ADDR')

@extend_schema(parameters=[
    OpenApiParameter(
        name='refresh',
        description="Refresh token",
        type=str,
        location=OpenApiParameter.PATH,
        required=True,
        )], 
        responses={
            200: OpenApiResponse(
                description="Returns new access and refresh tokens",
                response={
                    'type': 'object',
                    'properties': {
                        'access_token': {'type': 'string'},
                        'refresh_token': {'type': 'string'},
                    },
                }
            ),
            401: OpenApiResponse(description="Invalid refresh token"),
        },
)
class CookieTokenRefreshView(TokenRefreshView): 
    def post(self, request, refresh, *args, **kwargs):

        serializer = self.get_serializer(data={'refresh': refresh})
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            raise AuthenticationFailed('Invalid refresh token')
        
        access_token = serializer.validated_data['access']
        new_refresh_token = serializer.validated_data['refresh']
        
        return Response(
            {'access_token': str(access_token), 'refresh_token': str(new_refresh_token)}
            , status=200)
    
@extend_schema(
    parameters=[
        OpenApiParameter(
            name='code',
            type=str,
            location=OpenApiParameter.PATH,
            description='One-time code to receive access and refresh tokens',
            required=True,
        )
    ],
    responses={
        200: OpenApiResponse(
            description="Returns access and refresh tokens",
            response={
                'type': 'object',
                'properties': {
                    'access_token': {'type': 'string'},
                    'refresh_token': {'type': 'string'},
                },
            }
        ),
        401: OpenApiResponse(description="Invalid one-time code"),
    },
)
class CodeExchangeView(APIView):
    def get(self, request, code):
        
        try:
            login_code = LoginCode.objects.get(code=code)
        except Exception as e:
            raise AuthenticationFailed('Invalid code')
        
        requestIp = get_client_ip(request)
        requestUserAgent = request.META.get('HTTP_USER_AGENT', '')

        if login_code.ip_address != requestIp or login_code.user_agent != requestUserAgent:
            raise AuthenticationFailed('Invalid code')
        
        if timezone.now() > login_code.expires_at:
            login_code.delete()
            raise AuthenticationFailed('Expired code')

        refresh = RefreshToken(login_code.refresh_token)
        access_token = refresh.access_token
        login_code.delete()

        return Response(
            {'access_token': str(access_token), 'refresh_token': str(refresh)}
            , status=200)