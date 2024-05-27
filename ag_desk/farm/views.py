from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import Farm
from .serializers import FarmSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from core.models import CustomUser
from .permissions import IsOwnerOrReadOnly


class FarmViewSet(viewsets.ModelViewSet):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_owner:
            return Farm.objects.filter(owner=user)
        elif user.is_employee:
            return Farm.objects.filter(owner=user.owner)
        return Farm.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)  # Set owner to the current user
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
