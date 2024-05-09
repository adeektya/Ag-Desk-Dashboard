from django.db import models
from farm.models import Farm

class CalendarEvent(models.Model):
    SEVERITY_CHOICES = [
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    ]

    title = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return self.title