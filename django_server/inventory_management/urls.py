from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import InventoryItemList, InventoryDetail

urlpatterns = [
    path('', InventoryItemList.as_view(), name='inventory-list'),
    path('<int:id>/', InventoryDetail.as_view(), name='inventory-detail'),  # Corrected route
]

if settings.DEBUG:  # Only serve media files through Django in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

