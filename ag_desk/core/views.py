from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.views import APIView
import logging
from .permissions import IsOwnerUser
from rest_framework.exceptions import ValidationError
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger(__name__)


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                user = serializer.save()
                token, created = Token.objects.get_or_create(user=user)
                if user.is_owner:
                    return Response(
                        {
                            "id": user.id,
                            "token": token.key,
                            "is_approved": user.is_approved,
                        },
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {"id": user.id, "message": "Pending owner approval."},
                        status=status.HTTP_201_CREATED,
                    )
        except ValidationError as e:
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error occurred: {str(e)}")
            return Response(
                {"error": "Unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


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


class EmployeeApprovalView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        IsAuthenticated,
        IsOwnerUser,
    ]  # Assuming IsOwnerUser checks if user is an owner

    def put(self, request, *args, **kwargs):
        user = self.get_object()
        approve = request.data.get("approve", "false")

        # Handling both boolean and string inputs
        if isinstance(approve, str):
            approve = approve.lower() == "true"
        user.is_approved = approve

        user.save()
        return Response(
            {"message": "User approval status updated"}, status=status.HTTP_200_OK
        )


class UnapprovedUsersView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    queryset = CustomUser.objects.filter(is_approved=False)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwnerUser]
    
    def get_queryset(self):
        # Filter to only include non-staff users who are not approved
        return CustomUser.objects.filter(is_approved=False, is_staff=False)
