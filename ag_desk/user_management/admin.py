from django.contrib import admin
from .models import EmployeeRegistration

@admin.register(EmployeeRegistration)
class EmployeeRegistrationAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_approved', 'created_at')
    list_filter = ('is_approved',)
    search_fields = ('user__username', 'user__email')