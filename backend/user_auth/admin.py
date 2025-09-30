from django.contrib import admin
from social_django.models import UserSocialAuth
from .models import LoginCode
from core.models import GroupMembership
from django.utils.html import mark_safe

class UserSocialAuthAdminWithAvatar(admin.ModelAdmin):
    list_display = ['user', 'provider', 'uid', 'avatar_preview']
    readonly_fields = ['avatar_preview'] 
    fields = ['user', 'provider', 'uid', 'extra_data', 'avatar_preview']

    def avatar_preview(self, obj):
        url = obj.extra_data.get('picture')
        if url:
            return mark_safe(f'<img src="{url}" width="40" style="border-radius:50%;" />')
        return "-"
    
    avatar_preview.short_description = "Avatar"
    
class GroupMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'group')

admin.site.unregister(UserSocialAuth)
admin.site.register(UserSocialAuth, UserSocialAuthAdminWithAvatar)
admin.site.register(GroupMembership, GroupMembershipAdmin)
admin.site.register(LoginCode)