# serializers.py
from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'phone_number', 'photo', 'email', 'first_name', 'last_name', 'username', 'password']
        extra_kwargs = {
            'user': {'read_only': True}
        }

    username = serializers.CharField(source='user.username')
    password = serializers.CharField(source='user.password', write_only=True)
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update User model fields
        user.username = user_data.get('username', user.username)
        if 'password' in user_data:
            user.set_password(user_data['password'])
        user.email = user_data.get('email', user.email)
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.save()

        # Update UserProfile model fields
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.photo = validated_data.get('photo', instance.photo)
        instance.save()

        return instance
