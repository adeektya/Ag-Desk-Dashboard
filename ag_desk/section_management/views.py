from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SectionItem
from .serializers import SectionItemSerializer
from rest_framework import status

class SectionItemList(APIView):
    def get_queryset(self):
        queryset = SectionItem.objects.all()  
        farm_id = self.request.query_params.get('farm_id', None)
        if farm_id is not None:
            queryset = queryset.filter(farm_id=farm_id)
        return queryset
    
    def get(self, request, format=None):
        # Correctly call get_queryset on the instance of the view
        items = self.get_queryset()  # Use 'self' to refer to the instance of SectionItemList
        serializer = SectionItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SectionItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Received data:", request.data)
            print("Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SectionDetail(APIView):
    def get_object(self, id):
        return get_object_or_404(SectionItem, id=id)

    def delete(self, request, id, format=None):
        item = self.get_object(id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    def put(self, request, id, format=None):
        item = self.get_object(id)
        serializer = SectionItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)