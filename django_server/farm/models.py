from django.db import models
from core.models import CustomUser

# Create your models here.
class Farm(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='farms')
    name = models.CharField(max_length=255)
    address = models.TextField()

    def __str__(self):
        return self.name