from rest_framework import serializers
from django.utils import timezone
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'
from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

    def validate_next_service_date(self, value):
    
        if value and value < timezone.now().date():
            raise serializers.ValidationError("Next service date cannot be in the past.")
        return value

    def validate_registration_renewal_date(self, value):
     
        if value and value < timezone.now().date():
            raise serializers.ValidationError("Registration renewal date cannot be in the past.")
        return value

    def validate(self, data):
      
        next_service_date = data.get('next_service_date')
        registration_renewal_date = data.get('registration_renewal_date')

        if next_service_date and registration_renewal_date:
            if next_service_date > registration_renewal_date:
                raise serializers.ValidationError("Next service date cannot be after registration renewal date.")

        return data
