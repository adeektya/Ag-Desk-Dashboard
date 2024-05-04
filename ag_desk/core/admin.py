from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, InvitationCode

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'username', 'is_owner', 'is_employee', 'is_active', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('is_owner', 'is_employee')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('is_owner', 'is_employee')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(InvitationCode)
class InvitationCodeAdmin(admin.ModelAdmin):
    list_display = ['code', 'is_used']
    search_fields = ['code']
    list_filter = ['is_used']