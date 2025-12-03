"""
Note model - represents notes/comments with AI sentiment analysis.
Tracks interactions and sentiment for leads and contacts.
"""
from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Note(models.Model):
    """
    Note represents a comment or interaction record.
    
    Features:
    - AI Sentiment Analysis: Automatically detects if note is positive/negative.
    - Polymorphic: Can be attached to any object (Lead, Contact, Deal).
    - Direct Foreign Keys: Also has direct links to Lead/Contact for easier querying.
    """
    SENTIMENT_CHOICES = [
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative'),
    ]
    
    content = models.TextField(help_text="The content of the note")
    
    # Direct foreign keys for leads and contacts (for easier filtering)
    lead = models.ForeignKey(
        'leads.Lead',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notes'
    )
    contact = models.ForeignKey(
        'contacts.Contact',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notes'
    )
    
    # AI-generated sentiment fields
    sentiment = models.CharField(
        max_length=10,
        choices=SENTIMENT_CHOICES,
        default='neutral',
        help_text='AI-detected sentiment classification'
    )
    sentiment_score = models.FloatField(
        default=0.0,
        help_text='Sentiment confidence score (-1.0 to 1.0)'
    )
    polarity = models.FloatField(
        default=0.0,
        help_text='Sentiment polarity (-1.0 = Negative, 1.0 = Positive)'
    )
    subjectivity = models.FloatField(
        default=0.0,
        help_text='Sentiment subjectivity (0.0 = Objective, 1.0 = Subjective)'
    )
    
    # Generic relation - can relate to any model (fallback if not Lead/Contact)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, blank=True, null=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    related_to = GenericForeignKey('content_type', 'object_id')
    
    # Audit fields
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notes'
        ordering = ['-created_at'] # Newest notes first
    
    def __str__(self):
        return f"Note by {self.created_by.get_full_name()} - {self.sentiment}"
