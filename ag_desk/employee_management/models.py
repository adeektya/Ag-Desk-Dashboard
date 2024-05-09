from django.db import models
from django.conf import settings
from farm.models import Farm


class Employee(models.Model):
    ROLE_CHOICES = [
        ("manager", "Manager"),
        ("employee", "Employee"),
    ]
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]
    EMPLOYEE_SECTION_CHOICES = [
        ("A", "Section A"),
        ("B", "Section B"),
        ("C", "Section C"),
    ]

    employee_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default="employee")
    contactNumber = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='employees')
    section = models.CharField(
        max_length=1, choices=EMPLOYEE_SECTION_CHOICES, default="A"
    )
    start_date = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    photo = models.ImageField(
        upload_to="employee_photos/", blank=True, null=True
    )  # Photo field added

    def __str__(self):
        return self.name
