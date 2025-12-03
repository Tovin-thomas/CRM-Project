from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import os


class DocumentCategory(models.Model):
    """Categories for organizing documents"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Emoji or icon class")
    color = models.CharField(max_length=7, default='#3b82f6', help_text="Hex color code")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Document Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Document(models.Model):
    """File/Document storage and management"""
    DOCUMENT_TYPE_CHOICES = [
        ('contract', 'Contract'),
        ('proposal', 'Proposal'),
        ('invoice', 'Invoice'),
        ('receipt', 'Receipt'),
        ('presentation', 'Presentation'),
        ('report', 'Report'),
        ('image', 'Image'),
        ('spreadsheet', 'Spreadsheet'),
        ('pdf', 'PDF Document'),
        ('other', 'Other'),
    ]
    
    # File details
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='documents/%Y/%m/')
    file_size = models.BigIntegerField(help_text="Size in bytes", editable=False)
    file_type = models.CharField(max_length=100, editable=False)
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES, default='other')
    
    # Organization
    category = models.ForeignKey(DocumentCategory, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags")
    
    # Related to (Lead, Contact, Client, Deal, etc.)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    related_to = GenericForeignKey('content_type', 'object_id')
    
    # Access control
    is_public = models.BooleanField(default=False)
    shared_with = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='shared_documents', blank=True)
    
    # Version control
    version = models.CharField(max_length=20, default='1.0')
    previous_version = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='newer_versions')
    
    # Metadata
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='uploaded_documents')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Tracking
    download_count = models.IntegerField(default=0)
    view_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['uploaded_by', 'uploaded_at']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
            self.file_type = os.path.splitext(self.file.name)[1][1:].lower()
        super().save(*args, **kwargs)
    
    @property
    def file_size_mb(self):
        """Return file size in MB"""
        return round(self.file_size / (1024 * 1024), 2)
    
    @property
    def file_extension(self):
        """Return file extension"""
        return self.file_type


class DocumentAccess(models.Model):
    """Track document access/downloads"""
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='access_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(
        max_length=20,
        choices=[
            ('view', 'Viewed'),
            ('download', 'Downloaded'),
            ('share', 'Shared'),
            ('edit', 'Edited'),
        ]
    )
    accessed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        ordering = ['-accessed_at']
        verbose_name_plural = 'Document Access Logs'
    
    def __str__(self):
        return f"{self.user} {self.action} {self.document.title}"


class DocumentComment(models.Model):
    """Comments on documents"""
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.document.title}"


class Folder(models.Model):
    """Folders for organizing documents"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subfolders')
    
    # Access control
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_folders')
    shared_with = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='shared_folders', blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        unique_together = ['name', 'parent', 'owner']
    
    def __str__(self):
        if self.parent:
            return f"{self.parent.name}/{self.name}"
        return self.name
    
    @property
    def full_path(self):
        """Get full folder path"""
        path = [self.name]
        parent = self.parent
        while parent:
            path.insert(0, parent.name)
            parent = parent.parent
        return '/'.join(path)
