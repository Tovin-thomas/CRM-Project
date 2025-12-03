"""
Task model - represents tasks and reminders.
Can be associated with any other model (Lead, Contact, Deal) using GenericForeignKeys.
"""
from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Task(models.Model):
    """
    Task represents a to-do item or reminder.
    
    Features:
    - Status tracking (Pending -> Completed)
    - Priority levels (Low -> Urgent)
    - Due dates
    - Polymorphic association (can link to Lead, Contact, or Deal)
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    # Task details
    title = models.CharField(max_length=200, help_text="What needs to be done?")
    description = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    priority = models.CharField(
        max_length=10, 
        choices=PRIORITY_CHOICES, 
        default='medium'
    )
    due_date = models.DateTimeField(blank=True, null=True)
    
    # Generic relation - allows attaching task to ANY model (Lead, Contact, Deal, etc.)
    # This is powerful as it avoids creating separate foreign keys for each model.
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, blank=True, null=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    related_to = GenericForeignKey('content_type', 'object_id')
    
    # Assignment
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='assigned_tasks',
        help_text="User responsible for this task"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tasks'
        ordering = ['-priority', 'due_date'] # Show urgent and soonest due first
    
    def __str__(self):
        return f"{self.title} ({self.status})"
