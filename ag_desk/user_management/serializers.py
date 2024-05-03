from rest_framework import serializers
from django.contrib.auth.models import User
from .models import EmployeeRegistration

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class EmployeeRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeRegistration
        fields = ['user', 'is_approved', 'created_at']
        read_only_fields = ['is_approved', 'created_at']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        employee_registration = EmployeeRegistration.objects.create(user=user, **validated_data)
        return employee_registration
