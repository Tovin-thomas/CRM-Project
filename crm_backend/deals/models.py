"""
Deal model - represents sales opportunities/deals.
Tracks potential revenue through the sales pipeline.
"""
from django.db import models
from django.conf import settings
from leads.models import Lead


class Deal(models.Model):
    """
    Deal represents a sales opportunity with a monetary value.
    Linked to a Lead and tracks progress through defined stages.
    """
    # Sales pipeline stages
    STAGE_CHOICES = [
        ('prospecting', 'Prospecting'),     # Initial discovery
        ('qualification', 'Qualification'), # Confirming budget/authority
        ('proposal', 'Proposal'),           # Quote sent
        ('negotiation', 'Negotiation'),     # Discussing terms
        ('closed_won', 'Closed Won'),       # Sale made!
        ('closed_lost', 'Closed Lost'),     # Deal failed
    ]
    
    # Relationships
    lead = models.ForeignKey(
        Lead, 
        on_delete=models.CASCADE, 
        related_name='deals',
        help_text="The lead this deal belongs to"
    )
    
    # Deal details
    title = models.CharField(max_length=200, help_text="Name of the deal")
    value = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        help_text='Estimated deal value in currency'
    )
    stage = models.CharField(
        max_length=20, 
        choices=STAGE_CHOICES, 
        default='prospecting',
        help_text="Current stage in sales pipeline"
    )
    probability = models.IntegerField(
        default=50, 
        help_text='Probability of closing (0-100%)'
    )
    expected_close_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    
    # Audit fields
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True,
        help_text="User who created this deal"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'deals'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - ${self.value} ({self.stage})"
