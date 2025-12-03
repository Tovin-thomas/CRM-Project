"""
Serializers for Task model.
"""
from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for Task CRUD operations.
    """
    # Read-only field for display
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'priority', 'due_date',
                  'content_type', 'object_id', 'assigned_to', 'assigned_to_name',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
