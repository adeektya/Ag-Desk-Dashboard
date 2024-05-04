from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.views import APIView
import logging

logger = logging.getLogger(__name__)


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {"id": user.id, "token": token.key, "is_approved": user.is_approved},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get(
            "email"
        )  # or "email" if you're using email to log in
        password = request.data.get("password")
        logger.debug(
            f"Login attempt for username: {username} with password: {password}"
        )
        user = authenticate(username=username, password=password)
        if user:
            logger.debug(f"User found: {user.username}, approved: {user.is_approved}")
            if user.is_approved:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            logger.debug("User not found or password incorrect")
        return Response(
            {"error": "Invalid credentials or not approved"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


class UserApprovalView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_approved = True
        user.save()
        return Response({"message": "User approved"}, status=status.HTTP_200_OK)



