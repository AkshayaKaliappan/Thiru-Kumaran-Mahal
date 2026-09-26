"""
Users app serializers for authentication and user management.
"""
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile data."""
    class Meta:
        model = UserProfile
        fields = ['role', 'full_name', 'created_at']
        read_only_fields = ['created_at']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data with profile."""
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile', 'full_name']
        read_only_fields = ['id']

    def get_full_name(self, obj):
        if hasattr(obj, 'profile') and obj.profile.full_name:
            return obj.profile.full_name
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    full_name = serializers.CharField(required=True, max_length=200)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['full_name', 'username', 'email', 'password', 'confirm_password']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        validated_data.pop('confirm_password')

        # Split full_name into first/last
        name_parts = full_name.strip().split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
        )

        # Create profile with staff role (not admin)
        UserProfile.objects.create(
            user=user,
            role=UserProfile.ROLE_STAFF,
            full_name=full_name,
        )

        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT token serializer that includes user info in response."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        if hasattr(user, 'profile'):
            token['role'] = user.profile.role
            token['full_name'] = user.profile.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': user.profile.full_name if hasattr(user, 'profile') else user.get_full_name(),
            'role': user.profile.role if hasattr(user, 'profile') else 'staff',
            'is_admin': user.profile.is_admin if hasattr(user, 'profile') else False,
        }
        return data
