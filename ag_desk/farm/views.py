from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import Farm
from .serializers import FarmSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from core.models import CustomUser
class FarmViewSet(viewsets.ModelViewSet):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    permission_classes = [IsAuthenticated]  # Make sure you require authentication
    def get_queryset(self):
        user = self.request.user
        print(f"Fetching farms for user: {user}")
        farms = Farm.objects.filter(owner=user)
        print(f"Found farms: {farms}")
        return farms
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)  # Set owner to the current user
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
