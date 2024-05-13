from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import CustomUser, InvitationCode
from .serializers import UserSerializer
from rest_framework.views import APIView
import logging
from .permissions import IsOwnerUser
from rest_framework.exceptions import ValidationError
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.utils.crypto import get_random_string

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
        username = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user and user.is_approved:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Invalid credentials or not approved"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class EmployeeApprovalView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwnerUser]

    def put(self, request, *args, **kwargs):
        user = self.get_object()
        approve = request.data.get("approve", False)

        if isinstance(
            approve, str
        ):  # If the approve value is a string, safely convert it
            approve = approve.lower() == "true"
        elif not isinstance(approve, bool):  # Ensure that approve is a boolean
            return Response(
                {"error": "Invalid 'approve' value, must be a boolean true or false."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_approved = approve
        try:
            user.save()
            return Response(
                {"message": "User approval status updated"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error updating user approval status: {str(e)}")
            return Response(
                {
                    "error": "Failed to update user approval status due to an internal error."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UnapprovedUsersView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwnerUser]

    def get_queryset(self):
        # Filter to only include employees of this owner who are not approved
        return CustomUser.objects.filter(
            owner=self.request.user, is_approved=False, is_employee=True
        )


class GenerateInvitationCodeView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerUser,
    ]  # Ensure only owners can access

    def post(self, request, *args, **kwargs):
        owner = request.user
        if not owner.is_owner:
            return Response(
                {"error": "Only owners can generate invitation codes."},
                status=status.HTTP_403_FORBIDDEN,
            )

        code = get_random_string(length=12)  # Generates a random alphanumeric string
        new_code = InvitationCode.objects.create(
            code=code, owner=owner, for_owner=False  # This code is for employees
        )
        new_code.save()

        return Response({"code": new_code.code}, status=status.HTTP_201_CREATED)
