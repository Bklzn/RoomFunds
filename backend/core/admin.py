from django.contrib import admin
from .models import Expense, Group, Category

admin.site.register(Category)


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner')
    search_fields = ('name', )
    
@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('date', 'amount', 'group','user')
    search_fields= ('amount', 'group__name', 'user__username')
