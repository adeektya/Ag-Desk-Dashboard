from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from employee_management.models import Employee


from django.db import models

class Task(models.Model):
    STATUS_CHOICES = [
        ("todo", "To Do"),
        ("inProgress", "In Progress"),
        ("onHold", "On Hold"),
        ("completed", "Completed"),
    ]

    SEVERITY_CHOICES = [
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    ]

    title = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="todo")
    severity = models.CharField(max_length=6, choices=SEVERITY_CHOICES, default="low")
    image = models.ImageField(upload_to="task_images/", null=True, blank=True)
    due_date = models.DateField(null=True, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_employee = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tasks"
    )

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"

class Subtask(models.Model):
    task = models.ForeignKey(Task, related_name="subtasks", on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.description} - {'Completed' if self.completed else 'Pending'}"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_owner = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
