from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    is_owner = models.BooleanField(default=False)
    is_employee = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)  # Default is False for employees until approved by an owner
    owner = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='employees', limit_choices_to={'is_owner': True})

    def is_owner_user(self):
        return self.is_owner

    def is_employee_user(self):
        return self.is_employee

class InvitationCode(models.Model):
    code = models.CharField(max_length=100, unique=True)
    is_used = models.BooleanField(default=False)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='invitation_codes', null=True, blank=True, limit_choices_to={'is_owner': True})
    for_owner = models.BooleanField(default=False)  # True if this is for owner registration

    def __str__(self):
        return self.code
