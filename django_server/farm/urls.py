from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'farm', FarmViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),  # Include the farm app's URLs in the project.
]