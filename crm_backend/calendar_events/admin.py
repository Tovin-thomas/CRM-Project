from django.contrib import admin
from .models import CalendarEvent, EventReminder, Availability


@admin.register(CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'start_time', 'end_time', 'status', 'priority', 'organizer']
    list_filter = ['event_type', 'status', 'priority', 'start_time']
    search_fields = ['title', 'description', 'location']
    filter_horizontal = ['attendees']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Event Details', {
            'fields': ('title', 'description', 'event_type', 'status', 'priority')
        }),
        ('Timing', {
            'fields': ('start_time', 'end_time', 'all_day')
        }),
        ('Location', {
            'fields': ('location', 'meeting_link')
        }),
        ('Participants', {
            'fields': ('organizer', 'attendees')
        }),
        ('Reminders', {
            'fields': ('reminder_minutes_before', 'reminder_sent')
        }),
        ('Recurrence', {
            'fields': ('is_recurring', 'recurrence_pattern', 'recurrence_end_date'),
            'classes': ('collapse',)
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(EventReminder)
class EventReminderAdmin(admin.ModelAdmin):
    list_display = ['event', 'user', 'remind_at', 'sent', 'sent_at']
    list_filter = ['sent', 'remind_at']
    search_fields = ['event__title', 'user__username']


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ['user', 'day_of_week', 'start_time', 'end_time', 'is_available']
    list_filter = ['day_of_week', 'is_available']
    search_fields = ['user__username']
