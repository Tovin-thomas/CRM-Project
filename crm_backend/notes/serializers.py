"""
Serializers for Note model.
"""
from rest_framework import serializers
from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    """
    Serializer for Note CRUD operations.
    Includes related names and AI fields (read-only).
    """
    # Read-only fields for display
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    contact_name = serializers.CharField(source='contact.name', read_only=True)
    
    class Meta:
        model = Note
        fields = ['id', 'content', 'lead', 'contact', 'lead_name', 'contact_name',
                  'sentiment', 'sentiment_score', 'polarity', 'subjectivity',
                  'content_type', 'object_id', 'created_by', 'created_by_name',
                  'created_at', 'updated_at']
        # AI fields and timestamps are system-managed
        read_only_fields = ['id', 'sentiment', 'sentiment_score', 'polarity', 
                           'subjectivity', 'created_by', 'created_at', 'updated_at']
    
    def validate_lead(self, value):
        """
        Convert empty string to None for optional foreign key.
        Fixes issue where frontend might send empty string for null relation.
        """
        if value == '' or value == 'null':
            return None
        return value
    
    def validate_contact(self, value):
        """
        Convert empty string to None for optional foreign key.
        Fixes issue where frontend might send empty string for null relation.
        """
        if value == '' or value == 'null':
            return None
        return value
