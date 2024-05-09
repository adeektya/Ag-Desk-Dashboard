from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, SubtaskViewSet

router = DefaultRouter()
router.register(r"tasks", TaskViewSet, basename="task")  # Specifying the basename here
router.register(
    r"subtasks", SubtaskViewSet, basename="subtask"
)  # Good practice to specify here as well
urlpatterns = [
    path("", include(router.urls)),
]
