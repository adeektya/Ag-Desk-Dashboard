from rest_framework import viewsets
from .models import Task, Subtask
from .serializers import TaskSerializer, SubtaskSerializer
from rest_framework.response import Response
from rest_framework import status


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SubtaskViewSet(viewsets.ModelViewSet):
    queryset = Subtask.objects.all()
    serializer_class = SubtaskSerializer
