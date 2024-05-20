from rest_framework import serializers
from .models import InventoryItem

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'  # You can also list fields explicitly if needed

    def create(self, validated_data):
        inventoryItem=InventoryItem.objects.create(**validated_data)
        return inventoryItem

    def update(self, instance, validated_data):
        # Update the existing InventoryItem instance with the validated data
        instance.name = validated_data.get('name', instance.name)
        instance.item_type = validated_data.get('item_type', instance.item_type)
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.status = validated_data.get('status', instance.status)
        instance.last_service_date = validated_data.get('last_service_date', instance.last_service_date)
        instance.service_details = validated_data.get('service_details', instance.service_details)
        instance.next_service_date = validated_data.get('next_service_date', instance.next_service_date)
        instance.image_repair = validated_data.get('image_repair', instance.image_repair)
        instance.repair_description = validated_data.get('repair_description', instance.repair_description)
        instance.section_name = validated_data.get('section_name', instance.section_name)

        # Save the updated instance
        instance.save()
        
        return instance
