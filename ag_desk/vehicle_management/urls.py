from django.urls import path
from .views import vehicle_list, vehicle_detail

urlpatterns = [
    path('vehicles/', vehicle_list, name='vehicle-list'),  # URL pattern for listing vehicles
    path('vehicles/<int:pk>/', vehicle_detail, name='vehicle-detail'),  # URL pattern for retrieving, updating, or deleting a specific vehicle
]
