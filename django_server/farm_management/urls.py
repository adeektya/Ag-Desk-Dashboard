from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, SubtaskViewSet,note_list,note_detail

router = DefaultRouter()
router.register(r"tasks", TaskViewSet, basename="task")  
router.register(
    r"subtasks", SubtaskViewSet, basename="subtask"
) 
urlpatterns = [
    path("", include(router.urls)),
    path('note_list/', note_list, name='note-list'),
    path('note_detail/<int:pk>/', note_detail, name='note-detail'),
]
