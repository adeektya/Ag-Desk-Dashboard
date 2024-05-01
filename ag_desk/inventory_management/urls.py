from django.urls import path
from .views import InventoryItemList, InventoryDetail

urlpatterns = [
    path('', InventoryItemList.as_view(), name='inventory-list'),
    path('<int:id>/', InventoryDetail.as_view(), name='inventory-detail'),  # Corrected route
]