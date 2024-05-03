from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import EmployeeRegistrationSerializer, UserSerializer
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import EmployeeRegistration
from rest_framework.permissions import IsAdminUser

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'id': user.id, 'token': token.key}, status=status.HTTP_201_CREATED)
        else:
            print("Errors:", serializer.errors)  # Log errors to the console
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)  # Using authenticate method
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
        }
        return Response(data)
    
    
class EmployeeRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = EmployeeRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'Employee registration request submitted'}, status=status.HTTP_201_CREATED)
        else:
            print("Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeApprovalView(generics.UpdateAPIView):
    queryset = EmployeeRegistration.objects.all()
    serializer_class = EmployeeRegistrationSerializer
    permission_classes = [IsAdminUser]  # Restrict access to admin users only

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_approved = True
        instance.save()
        return Response({'message': 'Employee registration approved'}, status=status.HTTP_200_OK)
