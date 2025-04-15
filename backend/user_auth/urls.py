from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from . import views


urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='tokens'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/callback/', views.oauth_redirect, name='callback'),
    path('logout/', views.logout, name='logout'),
    path('whoami/', views.WhoAmIView.as_view(), name='whoami'),
]
