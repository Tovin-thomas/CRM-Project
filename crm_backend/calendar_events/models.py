"""
Calendar models - handles events, reminders, and availability.
"""
from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from datetime import timedelta


class CalendarEvent(models.Model):
    """
    Calendar events for meetings, calls, tasks, etc.
    Supports recurrence, reminders, and linking to other CRM objects.
    """
    EVENT_TYPE_CHOICES = [
        ('meeting', 'Meeting'),
        ('call', 'Phone Call'),
        ('email', 'Email'),
        ('task', 'Task'),
        ('deadline', 'Deadline'),
        ('reminder', 'Reminder'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    # Event details
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default='meeting')
    
    # Timing
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    all_day = models.BooleanField(default=False)
    
    # Location
    location = models.CharField(max_length=500, blank=True)
    meeting_link = models.URLField(blank=True, help_text="Zoom, Google Meet, etc.")
    
    # Status and priority
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
    # Participants
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_events')
    attendees = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='attending_events', blank=True)
    
    # Polymorphic relation - can link event to Lead, Contact, Client, or Deal
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    related_to = GenericForeignKey('content_type', 'object_id')
    
    # Reminders
    reminder_minutes_before = models.IntegerField(default=15, help_text="Minutes before event")
    reminder_sent = models.BooleanField(default=False)
    
    # Recurrence
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(
        max_length=20,
        choices=[
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('yearly', 'Yearly'),
        ],
        blank=True,
        null=True
    )
    recurrence_end_date = models.DateField(null=True, blank=True)
    
    # Notes
    notes = models.TextField(blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['start_time']
        indexes = [
            models.Index(fields=['start_time', 'end_time']),
            models.Index(fields=['organizer', 'start_time']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.start_time.strftime('%Y-%m-%d %H:%M')}"
    
    @property
    def duration(self):
        """Return duration in minutes"""
        if self.end_time and self.start_time:
            delta = self.end_time - self.start_time
            return delta.total_seconds() / 60
        return 0
    
    @property
    def is_past(self):
        """Check if event is in the past"""
        from django.utils import timezone
        return self.end_time < timezone.now()
    
    @property
    def is_today(self):
        """Check if event starts today"""
        from django.utils import timezone
        today = timezone.now().date()
        return self.start_time.date() == today


class EventReminder(models.Model):
    """
    Reminders for calendar events.
    Can be used to send push notifications or emails.
    """
    event = models.ForeignKey(CalendarEvent, on_delete=models.CASCADE, related_name='reminders')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    remind_at = models.DateTimeField()
    sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['remind_at']
    
    def __str__(self):
        return f"Reminder for {self.event.title} at {self.remind_at}"


class Availability(models.Model):
    """
    User availability/working hours.
    Used for scheduling meetings.
    """
    DAY_CHOICES = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='availability')
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['day_of_week', 'start_time']
        unique_together = ['user', 'day_of_week', 'start_time']
    
    def __str__(self):
        return f"{self.user.username} - {self.get_day_of_week_display()}: {self.start_time}-{self.end_time}"
