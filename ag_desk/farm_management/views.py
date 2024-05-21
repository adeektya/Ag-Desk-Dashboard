from rest_framework import viewsets
from .models import Task, Subtask, Note
from .serializers import TaskSerializer, SubtaskSerializer, NoteSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned tasks to a given farm,
        by filtering against a `farm_id` query parameter in the URL.
        """
        queryset = Task.objects.all()
        farm_id = self.request.query_params.get("farm_id", None)
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


@api_view(["GET", "POST"])
@parser_classes((MultiPartParser, FormParser, JSONParser))
def note_list(request):
    if request.method == "GET":
        farm_id = request.query_params.get("farm_id")
        if farm_id:
            notes = Note.objects.filter(farm_id=farm_id)
        else:
            notes = Note.objects.all()

        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@parser_classes((MultiPartParser, FormParser, JSONParser))
def note_detail(request, pk):
    note = get_object_or_404(Note, pk=pk)

    if request.method == "DELETE":
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Handle any other unsupported HTTP methods
    return Response(
        {"detail": "Method not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )
