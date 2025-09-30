from django.contrib import admin
from .models import Expense, Group, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'group')
    search_fields = ('name', 'group__name')


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'owner')
    search_fields = ('name', 'slug')
    
@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('date', 'amount', 'group','user')
    search_fields= ('amount', 'group__name', 'user__username')
