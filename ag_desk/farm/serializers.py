from rest_framework import serializers
from .models import Farm

class FarmSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Farm
        fields = ['id', 'owner', 'name', 'address']
        read_only_fields = ['owner']
