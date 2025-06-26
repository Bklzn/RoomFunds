from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from . import views


urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='tokens'),
    path('token/refresh/<str:refresh>', views.CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('token/exchange/<str:code>', views.CodeExchangeView.as_view(), name='token_exchange'),
    path('auth/callback/', views.oauth_redirect, name='callback'),
    path('logout/', views.logout_view, name='logout'),
    path('whoami/', views.WhoAmIView.as_view(), name='whoami'),
]
