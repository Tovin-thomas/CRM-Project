"""
Custom User model for the CRM system.
Extends Django's AbstractUser to allow email-based authentication.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model with additional fields for CRM.
    
    Inherits from AbstractUser to keep standard Django auth features
    (password management, groups, permissions) while adding CRM-specific fields.
    """
    
    # Email is the primary login field, must be unique
    email = models.EmailField(unique=True, max_length=255, help_text="Primary identifier for login")
    
    # User role in the organization - determines access levels
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('sales_manager', 'Sales Manager'),
        ('account_manager', 'Account Manager'),
        ('bde', 'Business Development Exec'),
        ('pre_sales', 'Pre-Sales Consultant'),
        ('developer', 'Developer / Technical Staff'),
    ]
    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        default='developer',
        help_text="Role determines user permissions in the system"
    )
    
    # Additional contact info
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Timestamps for auditing
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Use email for login instead of username
    USERNAME_FIELD = 'email'
    # These fields are required when creating a superuser via command line
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        """String representation of the user"""
        return f"{self.get_full_name()} ({self.email})"
