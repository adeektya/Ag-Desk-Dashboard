from rest_framework import serializers
from django.utils import timezone
from .models import VehicleItem

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleItem
        fields = '__all__'
        
    def create(self, validated_data):
            vehicleItem=VehicleItem.objects.create(**validated_data)
            return vehicleItem
    
    def update(self, instance, validated_data):
        # Update the existing InventoryItem instance with the validated data
        instance.vehicle_name = validated_data.get('vehicle_name', instance.vehicle_name)
        instance.vehicle_type = validated_data.get('vehicle_type', instance.vehicle_type)
        instance.vehicle_mark = validated_data.get('vehicle_mark', instance.vehicle_mark)
        instance.vehicle_model = validated_data.get('vehicle_model', instance.vehicle_model)
        instance.vehicle_year = validated_data.get('vehicle_year', instance.vehicle_year)
        instance.service_status = validated_data.get('service_status', instance.service_status)
        instance.next_service_date = validated_data.get('next_service_date', instance.next_service_date)
        instance.registration_renewal_date = validated_data.get('registration_renewal_date', instance.registration_renewal_date)
        instance.image = validated_data.get('image', instance.image)
        
        # Save the updated instance
        
        # Save the updated instance
        instance.save()
        
        return instance

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
