from rest_framework import serializers
from .models import SectionItem
from farm.models import Farm

class SectionItemSerializer(serializers.ModelSerializer):

    farm = serializers.PrimaryKeyRelatedField(
        queryset=Farm.objects.all(),
        write_only=True  # Make farm write-only if you do not wish to send this in response
    )
    
    class Meta:
        model = SectionItem
        fields = '__all__'

    def create(self, validated_data):
        sectionItem=SectionItem.objects.create(**validated_data)
        return sectionItem

    def update(self, instance, validated_data):
        # Update the existing InventoryItem instance with the validated data
        instance.section_name = validated_data.get('section_name', instance.section_name)
        instance.location = validated_data.get('location', instance.location)
        instance.size_acers = validated_data.get('size_acers', instance.size_acers)
        instance.section_type = validated_data.get('section_type', instance.section_type)
        instance.add_info = validated_data.get('add_info', instance.add_info)

        
        # Save the updated instance
        instance.save()
        
        return instance