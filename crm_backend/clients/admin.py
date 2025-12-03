from django.contrib import admin
from .models import Client, ClientProject, ClientInteraction


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'contact_person', 'status', 'industry_type', 
                    'contract_value', 'account_manager', 'created_at']
    list_filter = ['status', 'industry_type', 'created_at']
    search_fields = ['company_name', 'contact_person', 'email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('company_name', 'contact_person', 'email', 'phone', 'website')
        }),
        ('Client Details', {
            'fields': ('status', 'industry_type')
        }),
        ('Contract Information', {
            'fields': ('contract_start_date', 'contract_end_date', 'contract_value')
        }),
        ('Address', {
            'fields': ('address', 'city', 'state', 'country', 'postal_code')
        }),
        ('Relationship', {
            'fields': ('account_manager', 'created_by')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ClientProject)
class ClientProjectAdmin(admin.ModelAdmin):
    list_display = ['project_name', 'client', 'status', 'start_date', 
                    'end_date', 'budget', 'project_manager']
    list_filter = ['status', 'start_date']
    search_fields = ['project_name', 'client__company_name', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ClientInteraction)
class ClientInteractionAdmin(admin.ModelAdmin):
    list_display = ['subject', 'client', 'interaction_type', 'interaction_date', 'user']
    list_filter = ['interaction_type', 'interaction_date']
    search_fields = ['subject', 'notes', 'client__company_name']
    readonly_fields = ['created_at']
