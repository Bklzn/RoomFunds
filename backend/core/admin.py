from django.contrib import admin
from .models import Expense, Group, Category

admin.site.register(Category)
admin.site.register(Expense)


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner')
    search_fields = ('name', )
