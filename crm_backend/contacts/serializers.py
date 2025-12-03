"""
Serializers for Contact model.
"""
from rest_framework import serializers
from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    """
    Serializer for Contact CRUD operations.
    """
    # Include lead name for display purposes (read-only)
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    
    class Meta:
        model = Contact
        fields = ['id', 'lead', 'lead_name', 'name', 'email', 'phone', 
                  'position', 'is_primary', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
