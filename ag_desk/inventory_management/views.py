from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import InventoryItem
from .serializers import InventoryItemSerializer
from rest_framework import status


class InventoryItemList(APIView):
    def get(self, request, format=None):
        farm_id = request.query_params.get("farm_id")
        if farm_id:
            items = InventoryItem.objects.filter(farm_id=farm_id)
        else:
            items = InventoryItem.objects.all()
        serializer = InventoryItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = InventoryItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Received data:", request.data)
            print("Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InventoryDetail(APIView):
    def get_object(self, id):
        return get_object_or_404(InventoryItem, id=id)

    def delete(self, request, id, format=None):
        item = self.get_object(id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, id, format=None):
        item = self.get_object(id)
        serializer = InventoryItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
