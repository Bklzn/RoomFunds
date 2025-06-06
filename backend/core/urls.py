from django.urls import path
from . import views


urlpatterns = [
    path("", views.login_view, name="login"),
    path("api/expenses", views.ExpensesView.as_view(), name="expenses"),
    path("api/expense/<int:pk>", views.ExpenseView.as_view(), name="expense"),
    path("api/groups", views.GroupsView.as_view(), name="groups"),
    path("api/group/<str:name>", views.GroupView.as_view(), name="group"),
    path("api/group/<str:group_name>/categories", views.CategoriesView.as_view(), name="group_categories"),
    path("api/group/<str:group_name>/users", views.GroupMemberView.as_view(), name="group_users"),
]
