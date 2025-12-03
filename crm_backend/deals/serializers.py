"""
Serializers for Deal model.
"""
from rest_framework import serializers
from .models import Deal


class DealSerializer(serializers.ModelSerializer):
    """
    Serializer for Deal CRUD operations.
    Includes related field names for display.
    """
    # Read-only fields for display
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Deal
        fields = ['id', 'lead', 'lead_name', 'title', 'value', 'stage', 
                  'probability', 'expected_close_date', 'description', 
                  'created_by', 'created_by_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']
