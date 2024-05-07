from django.db import models
from django.conf import settings


class SectionItem(models.Model):
    SECTION_CHOICES = [
        ("crop", "Crop"),
        ("livestock", "Livestock"),  # Changed "needs repair" to match the choices
        ("field", "Field"), 
        ("barn", "Barn"), 
        ("other", "Other"),        
    ]
    #farm_id = models.ForeignKey('Farm', on_delete=models.CASCADE)
    section_name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    size_acers = models.DecimalField(max_digits=10, decimal_places=2)
    section_type = models.CharField(max_length=100,choices=SECTION_CHOICES )
    add_info = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.section_name

