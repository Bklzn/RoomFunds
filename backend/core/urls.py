from django.urls import path
from . import views


urlpatterns = [
    path("", views.login_view, name="login"),
    path("api/expenses", views.ExpensesView.as_view(), name="expenses"),
    path("api/expense/<int:pk>", views.ExpenseView.as_view(), name="expense"),
    path("api/groups", views.GroupsView.as_view(), name="groups"),
    path("api/groups/<int:pk>", views.GroupView.as_view(), name="group"),
]
