"""
Lead model - represents potential customers in the CRM.
Includes AI-generated fields like score and category.
"""
from django.db import models
from django.conf import settings


class Lead(models.Model):
    """
    Lead represents a potential customer or sales opportunity.
    
    This is the core model of the CRM. It tracks the lead's progress through
    the sales funnel (status), their source, and AI-generated insights.
    """
    
    # Lead status choices - tracks progress in sales funnel
    STATUS_CHOICES = [
        ('new', 'New'),             # Just created
        ('contacted', 'Contacted'), # Initial contact made
        ('qualified', 'Qualified'), # Interested and has budget
        ('lost', 'Lost'),           # Not interested
        ('converted', 'Converted'), # Became a client
    ]
    
    # Lead source choices - where did they come from?
    SOURCE_CHOICES = [
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('social_media', 'Social Media'),
        ('email_campaign', 'Email Campaign'),
        ('cold_call', 'Cold Call'),
        ('other', 'Other'),
    ]
    
    # AI category choices - predicted quality of lead
    CATEGORY_CHOICES = [
        ('hot', 'Hot'),   # High probability to convert
        ('warm', 'Warm'), # Medium probability
        ('cold', 'Cold'), # Low probability
    ]
    
    # Basic contact information
    name = models.CharField(max_length=200, help_text="Full name of the lead")
    email = models.EmailField(unique=True, help_text="Email must be unique")
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=200, blank=True, null=True)
    
    # Lead details and tracking
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='new',
        help_text="Current stage in the sales pipeline"
    )
    source = models.CharField(
        max_length=30, 
        choices=SOURCE_CHOICES, 
        default='website',
        help_text="Origin of the lead"
    )
    
    # AI-generated fields - Calculated by ML algorithms
    score = models.IntegerField(
        default=0, 
        help_text='AI-generated lead score (0-100) indicating conversion probability'
    )
    category = models.CharField(
        max_length=10, 
        choices=CATEGORY_CHOICES, 
        default='cold',
        help_text='AI-generated category based on score and engagement'
    )
    
    # Assignment - Who is responsible for this lead?
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_leads',
        help_text="Sales rep responsible for this lead"
    )
    
    # Additional info
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Timestamps for auditing
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'leads'
        ordering = ['-created_at'] # Newest leads first
        # Indexes for faster filtering
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['status']),
            models.Index(fields=['category']),
        ]
    
    def __str__(self):
        """String representation of the lead"""
        return f"{self.name} - {self.company} ({self.status})"
