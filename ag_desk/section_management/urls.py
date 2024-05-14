from django.urls import path
from .views import SectionItemList, SectionDetail

urlpatterns = [
    path('', SectionItemList.as_view(), name='section-list'),
    path('<int:id>/', SectionDetail.as_view(), name='section-detail'),
]
