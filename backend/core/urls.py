from django.urls import path, include
from oauth2_provider.views import TokenView
from . import views


urlpatterns = [
    path("", views.login_view, name="login"),
    path('whoami/', views.WhoAmIView.as_view(), name='whoami'),
    path('logout/', views.logout_view, name='logout'),
]
