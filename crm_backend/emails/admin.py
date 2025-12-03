from django.contrib import admin
from .models import EmailTemplate, Email, EmailAttachment, EmailCampaign


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_active', 'created_by', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['name', 'subject', 'body']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = ['subject', 'to_email', 'status', 'sent_by', 'sent_at', 'open_count']
    list_filter = ['status', 'sent_at', 'created_at']
    search_fields = ['subject', 'to_email', 'body']
    readonly_fields = ['created_at', 'updated_at', 'sent_at', 'opened_at', 'clicked_at']


@admin.register(EmailAttachment)
class EmailAttachmentAdmin(admin.ModelAdmin):
    list_display = ['filename', 'email', 'file_size', 'uploaded_at']
    search_fields = ['filename']


@admin.register(EmailCampaign)
class EmailCampaignAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'recipient_count', 'sent_count', 'opened_count', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'subject']
    readonly_fields = ['created_at', 'updated_at', 'sent_count', 'delivered_count', 
                      'opened_count', 'clicked_count', 'bounced_count']
