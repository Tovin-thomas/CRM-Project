from django.db import models
from django.conf import settings

class Client(models.Model):
    """
    Client model for managing client information
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('past', 'Past Client'),
        ('potential', 'Potential'),
    ]
    
    INDUSTRY_CHOICES = [
        ('technology', 'Technology'),
        ('finance', 'Finance'),
        ('healthcare', 'Healthcare'),
        ('retail', 'Retail'),
        ('manufacturing', 'Manufacturing'),
        ('education', 'Education'),
        ('real_estate', 'Real Estate'),
        ('consulting', 'Consulting'),
        ('other', 'Other'),
    ]
    
    # Basic Information
    company_name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    
    # Client Details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    industry_type = models.CharField(max_length=50, choices=INDUSTRY_CHOICES, default='other')
    
    # Contract Information
    contract_start_date = models.DateField(null=True, blank=True)
    contract_end_date = models.DateField(null=True, blank=True)
    contract_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Address
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    
    # Relationship
    account_manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='managed_clients')
    
    # Notes
    notes = models.TextField(blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_clients')
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.company_name
    
    @property
    def is_active(self):
        return self.status == 'active'
    
    @property
    def contract_duration_days(self):
        if self.contract_start_date and self.contract_end_date:
            return (self.contract_end_date - self.contract_start_date).days
        return None


class ClientProject(models.Model):
    """
    Model for tracking client project history
    """
    PROJECT_STATUS = [
        ('planning', 'Planning'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    ]
    
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='projects')
    project_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=PROJECT_STATUS, default='planning')
    
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    project_manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='managed_projects')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
        
    def __str__(self):
        return f"{self.project_name} - {self.client.company_name}"


class ClientInteraction(models.Model):
    """
    Model for tracking interactions with clients
    """
    INTERACTION_TYPE = [
        ('meeting', 'Meeting'),
        ('call', 'Phone Call'),
        ('email', 'Email'),
        ('video_call', 'Video Call'),
        ('other', 'Other'),
    ]
    
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_TYPE)
    subject = models.CharField(max_length=200)
    notes = models.TextField()
    interaction_date = models.DateTimeField()
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-interaction_date']
        
    def __str__(self):
        return f"{self.interaction_type} - {self.client.company_name}"
