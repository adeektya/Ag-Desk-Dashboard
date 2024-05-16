# serializers.py
from rest_framework import serializers
from core.models import CustomUser
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    password = serializers.CharField(source='user.password', write_only=True)
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'username', 'password', 'email', 'first_name', 'last_name', 'phone_number', 'photo']
        read_only_fields = ['id']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = CustomUser.objects.create(**user_data)
        user.set_password(user_data['password'])
        user.save()
        profile = UserProfile.objects.create(user=user, **validated_data)
        return profile

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        if 'username' in user_data:
            user.username = user_data['username']
        if 'password' in user_data:
            user.set_password(user_data['password'])
        if 'email' in user_data:
            user.email = user_data['email']
        if 'first_name' in user_data:
            user.first_name = user_data['first_name']
        if 'last_name' in user_data:
            user.last_name = user_data['last_name']

        user.save()

        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.photo = validated_data.get('photo', instance.photo)
        instance.save()

        return instance
