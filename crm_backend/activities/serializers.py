from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Activity
        fields = ['id', 'activity_type', 'description', 'content_type', 'object_id',
                  'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['id', 'created_at']
