from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    start_date = serializers.DateField(format='%Y-%m-%d', input_formats=['%Y-%m-%d'])
    farm_id = serializers.ReadOnlyField(source='farm.id')

    class Meta:
        model = Employee
        fields = '__all__'