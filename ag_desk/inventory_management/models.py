from django.db import models
from django.conf import settings
from farm.models import Farm

class InventoryItem(models.Model):
    TYPE_CHOICES = [
        ("seeds", "Seeds"),
        ("fertilizers", "Fertilizers"),
        ("feed", "Feed"),
        ("tools", "Tools"),
        ("machinery", "Machinery"),
        ("vehicles", "Vehicles"),
    ]

    STATUS_CHOICES = [
        ("operational", "Operational"),
        ("needs repair", "Needs Repair"),  # Changed "needs repair" to match the choices
        ("service due", "Service Due"), 
    ]
    name = models.CharField(max_length=255)
    item_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    quantity = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    last_service_date = models.DateField(null=True, blank=True)
    service_details = models.TextField(blank=True)
    next_service_date = models.DateField(null=True, blank=True)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='inventory_items')

    def __str__(self):
        return self.name

