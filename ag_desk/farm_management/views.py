from rest_framework import viewsets
from .models import Task, Subtask
from .serializers import TaskSerializer, SubtaskSerializer
from rest_framework.response import Response
from rest_framework import status


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    def get_queryset(self):
        """
        Optionally restricts the returned tasks to a given farm,
        by filtering against a `farm_id` query parameter in the URL.
        """
        queryset = Task.objects.all()
        farm_id = self.request.query_params.get('farm_id', None)
        if farm_id is not None:
            queryset = queryset.filter(farm_id=farm_id)
        return queryset

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
