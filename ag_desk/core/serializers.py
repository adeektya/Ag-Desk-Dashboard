from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import InvitationCode

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    invitation_code = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "password",
            "is_owner", "is_employee", "invitation_code", "is_approved",
            "owner"  # Include owner field if you want to expose this in API responses
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "is_approved": {"read_only": True},
            "owner": {"read_only": True}
        }

    def validate_invitation_code(self, value):
        # Determine user type and validate the corresponding invitation code
        is_owner = self.initial_data.get("is_owner", False)
        is_employee = self.initial_data.get("is_employee", False)

        if is_owner:
            if not InvitationCode.objects.filter(code=value, is_used=False, for_owner=True).exists():
                raise serializers.ValidationError("Invalid or used invitation code for owner.")
        elif is_employee:
            if not InvitationCode.objects.filter(code=value, is_used=False, for_owner=False).exists():
                raise serializers.ValidationError("Invalid or used invitation code for employee.")
        else:
            raise serializers.ValidationError("Invitation code is required and must be valid.")

        return value

    def create(self, validated_data):
        invitation_code = validated_data.pop('invitation_code')
        invitation_code_obj = InvitationCode.objects.get(code=invitation_code)
        
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            is_owner=validated_data.get("is_owner", False),
            is_employee=validated_data.get("is_employee", False),
        )

        if validated_data.get("is_owner", False):
            user.is_approved = True  # Auto-approve owners
            invitation_code_obj.for_owner = True
        elif validated_data.get("is_employee", False):
            user.is_approved = False
            user.owner = invitation_code_obj.owner  # Link employee to the owner who created the code

        user.save()
        invitation_code_obj.is_used = True
        invitation_code_obj.save()

        return user
