from django.contrib import admin
from .models import Farm

# Register your models here.
@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'owner']
    search_fields = ['name', 'owner__username']