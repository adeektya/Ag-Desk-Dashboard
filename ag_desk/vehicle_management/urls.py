from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import VehicleItemList, VehicleDetail

urlpatterns = [
    path('', VehicleItemList.as_view(), name='vehicle-list'),  # URL pattern for listing vehicles
    path('<int:id>/', VehicleDetail.as_view(), name='vehicle-detail'),  # URL pattern for retrieving, updating, or deleting a specific vehicle
]

if settings.DEBUG:  # Only serve media files through Django in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

