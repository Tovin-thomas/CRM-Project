"""
Serializers for Calendar models.
"""
from rest_framework import serializers
from .models import CalendarEvent, EventReminder, Availability
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Minimal user serializer for attendees list"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class EventReminderSerializer(serializers.ModelSerializer):
    """Serializer for EventReminder"""
    class Meta:
        model = EventReminder
        fields = '__all__'


class CalendarEventSerializer(serializers.ModelSerializer):
    """
    Serializer for CalendarEvent.
    Includes nested attendees and computed fields.
    """
    organizer_name = serializers.CharField(source='organizer.get_full_name', read_only=True)
    attendees_list = UserSerializer(source='attendees', many=True, read_only=True)
    duration = serializers.FloatField(read_only=True)
    is_past = serializers.BooleanField(read_only=True)
    is_today = serializers.BooleanField(read_only=True)
    reminders = EventReminderSerializer(many=True, read_only=True)
    
    class Meta:
        model = CalendarEvent
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'organizer']


class AvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for Availability"""
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = Availability
        fields = '__all__'
