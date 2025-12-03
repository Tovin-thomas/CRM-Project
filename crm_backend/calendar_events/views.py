"""
Views for Calendar management.
Handles events, reminders, and availability.
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import datetime, timedelta
from .models import CalendarEvent, EventReminder, Availability
from .serializers import CalendarEventSerializer, EventReminderSerializer, AvailabilitySerializer


class CalendarEventViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Calendar Events.
    Includes filtering by date range and special actions for 'today', 'upcoming', and 'my_events'.
    """
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event_type', 'status', 'priority', 'organizer']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_time', 'end_time', 'priority']
    ordering = ['start_time']
    
    def get_queryset(self):
        """
        Custom queryset to support date range filtering.
        """
        queryset = super().get_queryset()
        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(start_time__gte=start_date)
        if end_date:
            queryset = queryset.filter(end_time__lte=end_date)
        
        return queryset
    
    def perform_create(self, serializer):
        """Assign organizer automatically"""
        serializer.save(organizer=self.request.user)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's events for the dashboard"""
        today = timezone.now().date()
        events = CalendarEvent.objects.filter(
            start_time__date=today
        ).order_by('start_time')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events (next 7 days) for the dashboard"""
        now = timezone.now()
        week_later = now + timedelta(days=7)
        events = CalendarEvent.objects.filter(
            start_time__gte=now,
            start_time__lte=week_later
        ).order_by('start_time')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_events(self, request):
        """
        Get events where current user is organizer OR attendee.
        """
        events = CalendarEvent.objects.filter(
            organizer=request.user
        ) | CalendarEvent.objects.filter(
            attendees=request.user
        )
        events = events.distinct().order_by('start_time')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)


class AvailabilityViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for User Availability.
    Used to define working hours.
    """
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'day_of_week', 'is_available']
    
    @action(detail=False, methods=['get'])
    def my_availability(self, request):
        """Get current user's availability"""
        availability = Availability.objects.filter(user=request.user)
        serializer = self.get_serializer(availability, many=True)
        return Response(serializer.data)
