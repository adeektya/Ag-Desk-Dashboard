from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import InvitationCode

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    invitation_code = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "is_owner",
            "is_employee",
            "invitation_code",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_invitation_code(self, value):
        if self.initial_data.get("is_owner", False):
            if not InvitationCode.objects.filter(code=value, is_used=False).exists():
                raise serializers.ValidationError("Invalid or used invitation code.")
        elif self.initial_data.get("invitation_code", None):
            raise serializers.ValidationError(
                "Invitation code is not required for employees."
            )
        return value

    def create(self, validated_data):
        invitation_code = validated_data.pop("invitation_code", None)

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            is_owner=validated_data.get("is_owner", False),
            is_employee=validated_data.get("is_employee", False),
            is_approved=validated_data.get("is_owner", False)  # Auto-approve owners
        )

        if user.is_owner and invitation_code:
            code_obj = InvitationCode.objects.get(code=invitation_code)
            code_obj.is_used = True
            code_obj.save()

        return user
