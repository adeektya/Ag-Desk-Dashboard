from django.shortcuts import render
from .models import CalendarEvent
from .serializers import CalendarEventSerializer
from rest_framework import generics

class CalendarEventList(generics.ListCreateAPIView):
    serializer_class = CalendarEventSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned events to a given farm,
        by filtering against a `farm_id` query parameter in the URL.
        """
        queryset = CalendarEvent.objects.all()
        farm_id = self.request.query_params.get('farm_id', None)
        if farm_id is not None:
            queryset = queryset.filter(farm__id=farm_id)
        return queryset

class CalendarEventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer

