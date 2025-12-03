"""
Serializers for Email models.
"""
from rest_framework import serializers
from .models import EmailTemplate, Email, EmailAttachment, EmailCampaign


class EmailTemplateSerializer(serializers.ModelSerializer):
    """Serializer for EmailTemplate"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = EmailTemplate
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'created_by']


class EmailAttachmentSerializer(serializers.ModelSerializer):
    """Serializer for EmailAttachment"""
    class Meta:
        model = EmailAttachment
        fields = '__all__'


class EmailSerializer(serializers.ModelSerializer):
    """
    Serializer for Email.
    Includes nested attachments and read-only status fields.
    """
    sent_by_name = serializers.CharField(source='sent_by.get_full_name', read_only=True)
    attachments = EmailAttachmentSerializer(many=True, read_only=True)
    is_opened = serializers.BooleanField(read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True)
    
    class Meta:
        model = Email
        fields = '__all__'
        # Status fields are managed by the system, not user editable
        read_only_fields = ['created_at', 'updated_at', 'sent_at', 'opened_at', 
                           'clicked_at', 'replied_at', 'open_count', 'click_count', 'sent_by']


class EmailCampaignSerializer(serializers.ModelSerializer):
    """
    Serializer for EmailCampaign.
    Includes computed rates (open rate, click rate).
    """
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    open_rate = serializers.FloatField(read_only=True)
    click_rate = serializers.FloatField(read_only=True)
    
    class Meta:
        model = EmailCampaign
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'sent_count', 'delivered_count', 
                           'opened_count', 'clicked_count', 'bounced_count', 'created_by']
