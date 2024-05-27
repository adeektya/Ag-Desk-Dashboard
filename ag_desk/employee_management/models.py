from django.db import models
from django.conf import settings
from farm.models import Farm
from section_management.models import SectionItem

class Employee(models.Model):
    ROLE_CHOICES = [
        ("manager", "Manager"),
        ("employee", "Employee"),
    ]
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]


    employee_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default="employee")
    contactNumber = models.CharField(max_length=50)
    email = models.EmailField()
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='employees')
    section = models.CharField(max_length=255,null=True, blank=True)
    start_date = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2,null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    photo = models.ImageField(
        upload_to="employee_photos/", blank=True, null=True
    )  # Photo field added
    class Meta:
        # Add a unique constraint across email, contactNumber, and farm fields
        unique_together = [('contactNumber', 'farm'), ('email', 'farm')]
    def __str__(self):
        return self.name
