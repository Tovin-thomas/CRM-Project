"""
Email models - handles templates, tracking, and campaigns.
"""
from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class EmailTemplate(models.Model):
    """
    Email templates for quick sending.
    Allows users to create reusable email content with placeholders.
    """
    CATEGORY_CHOICES = [
        ('follow_up', 'Follow Up'),
        ('introduction', 'Introduction'),
        ('proposal', 'Proposal'),
        ('thank_you', 'Thank You'),
        ('meeting', 'Meeting Request'),
        ('custom', 'Custom'),
    ]
    
    name = models.CharField(max_length=200, help_text="Internal name for the template")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    subject = models.CharField(max_length=500)
    body = models.TextField(help_text="Use {{name}}, {{company}}, etc. for variables")
    is_active = models.BooleanField(default=True)
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.category})"


class Email(models.Model):
    """
    Email tracking and history.
    Records every email sent through the system, including status and engagement metrics.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('opened', 'Opened'),
        ('clicked', 'Clicked'),
        ('replied', 'Replied'),
        ('bounced', 'Bounced'),
        ('failed', 'Failed'),
    ]
    
    # Email details
    subject = models.CharField(max_length=500)
    body = models.TextField()
    from_email = models.EmailField()
    to_email = models.EmailField()
    cc = models.TextField(blank=True, help_text="Comma-separated emails")
    bcc = models.TextField(blank=True, help_text="Comma-separated emails")
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    sent_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    replied_at = models.DateTimeField(null=True, blank=True)
    
    # Engagement metrics
    open_count = models.IntegerField(default=0)
    click_count = models.IntegerField(default=0)
    
    # Polymorphic relation - can link email to Lead, Contact, Client, or Deal
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    related_to = GenericForeignKey('content_type', 'object_id')
    
    # Template used (optional)
    template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    
    # User who sent the email
    sent_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='sent_emails'
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.subject} - {self.to_email}"
    
    @property
    def is_opened(self):
        """Check if email has been opened"""
        return self.status in ['opened', 'clicked', 'replied']


class EmailAttachment(models.Model):
    """
    Email attachments.
    Files attached to specific emails.
    """
    email = models.ForeignKey(Email, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='email_attachments/%Y/%m/')
    filename = models.CharField(max_length=255)
    file_size = models.IntegerField(help_text="Size in bytes")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.filename


class EmailCampaign(models.Model):
    """
    Email marketing campaigns.
    Allows sending bulk emails to a list of recipients.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sending', 'Sending'),
        ('sent', 'Sent'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    ]
    
    name = models.CharField(max_length=200, help_text="Campaign name")
    subject = models.CharField(max_length=500)
    body = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Scheduling
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    # Recipients (can be filtered by tags, segments, etc.)
    recipient_count = models.IntegerField(default=0)
    
    # Campaign Statistics
    sent_count = models.IntegerField(default=0)
    delivered_count = models.IntegerField(default=0)
    opened_count = models.IntegerField(default=0)
    clicked_count = models.IntegerField(default=0)
    bounced_count = models.IntegerField(default=0)
    
    # Template used
    template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Creator
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def open_rate(self):
        """Calculate open rate percentage"""
        if self.delivered_count > 0:
            return (self.opened_count / self.delivered_count) * 100
        return 0
    
    @property
    def click_rate(self):
        """Calculate click rate percentage"""
        if self.delivered_count > 0:
            return (self.clicked_count / self.delivered_count) * 100
        return 0
