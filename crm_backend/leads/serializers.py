"""
Serializers for Lead model.
Handles validation and JSON conversion for lead data.
"""
from rest_framework import serializers
from .models import Lead
from accounts.serializers import UserProfileSerializer


class LeadSerializer(serializers.ModelSerializer):
    """
    Serializer for Lead CRUD operations.
    Includes full details including nested user information.
    """
    # Nested serializer to show full user details instead of just ID
    assigned_to_detail = UserProfileSerializer(source='assigned_to', read_only=True)
    
    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'email', 'phone', 'company', 'status', 'source',
            'score', 'category', 'assigned_to', 'assigned_to_detail',
            'description', 'website', 'created_at', 'updated_at'
        ]
        # Prevent manual editing of system-managed fields
        read_only_fields = ['id', 'created_at', 'updated_at', 'score', 'category']


class LeadListSerializer(serializers.ModelSerializer):
    """
    Lighter serializer for listing leads.
    Optimized for performance by including fewer fields and flattening relationships.
    """
    # Flatten assigned_to to just show the name, avoiding full object overhead
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    
    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'email', 'company', 'status', 'source',
            'score', 'category', 'assigned_to_name', 'created_at'
        ]
