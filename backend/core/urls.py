from django.urls import path
from . import views


urlpatterns = [
    path("", views.login_view, name="login"),
    path("api/expenses", views.ExpensesView.as_view(), name="expenses"),
    path("api/expense/<int:pk>", views.ExpenseView.as_view(), name="expense"),
]
