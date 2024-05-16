# user_profile/models.py
from django.db import models
from core.models import CustomUser

class UserProfile(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    @property
    def username(self):
        return self.user.username

    @property
    def password(self):
        return self.user.password

    @property
    def email(self):
        return self.user.email

    @property
    def first_name(self):
        return self.user.first_name

    @property
    def last_name(self):
        return self.user.last_name

    def __str__(self):
        return self.user.username
