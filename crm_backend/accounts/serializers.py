"""
Serializers for User model - convert between JSON and Python objects.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

# Get the custom user model defined in settings
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration and full profile management.
    Handles password hashing and user creation logic.
    """
    # Password should be write-only (never returned in API response)
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 
                  'last_name', 'role', 'phone', 'created_at']
        # ID and created_at are system-generated and cannot be changed by user
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        """
        Create a new user with encrypted password.
        Admin users are auto-activated. Others require admin approval.
        """
        # Default role if not specified
        role = validated_data.get('role', 'sales_rep')
        
        # Security: Only admins are auto-activated. 
        # Regular users must be approved by an admin to prevent unauthorized access.
        is_active = (role == 'admin')
        
        # Use create_user helper to handle password hashing automatically
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=role,
            phone=validated_data.get('phone', ''),
            is_active=is_active
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing user profile safely (excludes sensitive data like password).
    Used for listing users and showing profile details.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'phone', 'created_at', 'is_active']
        # All fields are read-only in this view
        read_only_fields = fields
