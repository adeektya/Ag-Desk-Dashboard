from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes 
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Employee
from .serializers import EmployeeSerializer

@api_view(["GET", "POST"])
@parser_classes((MultiPartParser, FormParser, JSONParser))
def employee_list(request):
    if request.method == "GET":
        farm_id = request.query_params.get('farm', None)
        if farm_id:
            employees = Employee.objects.filter(farm=farm_id)
        else:
            employees = Employee.objects.all()
        
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        print("Received data:", request.data)
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "PUT", "DELETE"])
@parser_classes((MultiPartParser, FormParser, JSONParser))
def employee_detail(request, pk):
    try:
        employee = get_object_or_404(Employee, pk=pk)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Handle any other unsupported HTTP methods
    return Response({"detail": "Method not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
