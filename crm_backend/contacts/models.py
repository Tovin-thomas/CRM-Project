"""
Contact model - represents individual people associated with leads.
Tracks specific individuals within a company/lead.
"""
from django.db import models
from leads.models import Lead


class Contact(models.Model):
    """
    Contact represents a person associated with a lead/company.
    
    A single Lead (company) can have multiple Contacts (people).
    One contact is designated as 'primary' for main communications.
    """
    # Link to the parent Lead (Company)
    lead = models.ForeignKey(
        Lead, 
        on_delete=models.CASCADE, 
        related_name='contacts',
        help_text="The lead/company this person belongs to"
    )
    
    # Personal details
    name = models.CharField(max_length=200, help_text="Full name of the contact")
    email = models.EmailField(help_text="Direct email address")
    phone = models.CharField(max_length=20, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True, help_text="Job title")
    
    # Key contact flag
    is_primary = models.BooleanField(
        default=False, 
        help_text='If true, this person is the main point of contact'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'contacts'
        # Show primary contacts first, then newest
        ordering = ['-is_primary', '-created_at']
    
    def __str__(self):
        """String representation of the contact"""
        return f"{self.name} - {self.position} ({self.lead.company})"
