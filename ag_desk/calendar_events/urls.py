from django.urls import path
from .views import CalendarEventList, CalendarEventDetail

urlpatterns = [
    path('events/', CalendarEventList.as_view(), name='calendar-event-list'),
    path('events/<int:pk>/', CalendarEventDetail.as_view(), name='calendar-event-detail'),
]