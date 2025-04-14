from django.http import JsonResponse
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken


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
    