"""
Views for Email management.
Handles sending, tracking, and template management.
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import EmailTemplate, Email, EmailAttachment, EmailCampaign
from .serializers import (
    EmailTemplateSerializer, EmailSerializer,
    EmailAttachmentSerializer, EmailCampaignSerializer
)


class EmailTemplateViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Email Templates.
    Templates allow users to save and reuse email content.
    """
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'subject', 'body']
    
    def perform_create(self, serializer):
        """Assign creator automatically"""
        serializer.save(created_by=self.request.user)


class EmailViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Emails.
    Includes actions for sending and tracking emails.
    """
    queryset = Email.objects.all()
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'to_email', 'sent_by']
    search_fields = ['subject', 'body', 'to_email']
    ordering_fields = ['created_at', 'sent_at']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        """Assign sender automatically"""
        serializer.save(sent_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """
        Send an email immediately.
        Uses Django's email backend (SMTP).
        """
        email = self.get_object()
        
        try:
            # Send email using Django's email backend
            send_mail(
                subject=email.subject,
                message=email.body,
                from_email=email.from_email or settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email.to_email],
                fail_silently=False,
            )
            
            # Update email status to 'sent'
            email.status = 'sent'
            email.sent_at = timezone.now()
            email.save()
            
            return Response({
                'status': 'success',
                'message': 'Email sent successfully'
            })
        except Exception as e:
            # Log failure
            email.status = 'failed'
            email.save()
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def mark_opened(self, request, pk=None):
        """
        Mark email as opened.
        Called by tracking pixel in the email body.
        """
        email = self.get_object()
        if not email.opened_at:
            email.opened_at = timezone.now()
            email.status = 'opened'
        email.open_count += 1
        email.save()
        return Response({'status': 'success'})
    
    @action(detail=True, methods=['post'])
    def mark_clicked(self, request, pk=None):
        """
        Mark email link as clicked.
        Called by tracking redirector.
        """
        email = self.get_object()
        if not email.clicked_at:
            email.clicked_at = timezone.now()
            email.status = 'clicked'
        email.click_count += 1
        email.save()
        return Response({'status': 'success'})
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get aggregate email statistics for dashboard.
        """
        total_emails = Email.objects.count()
        sent_emails = Email.objects.filter(status='sent').count()
        opened_emails = Email.objects.filter(status__in=['opened', 'clicked', 'replied']).count()
        
        open_rate = (opened_emails / sent_emails * 100) if sent_emails > 0 else 0
        
        return Response({
            'total_emails': total_emails,
            'sent_emails': sent_emails,
            'opened_emails': opened_emails,
            'open_rate': round(open_rate, 2),
        })


class EmailCampaignViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Email Campaigns.
    """
    queryset = EmailCampaign.objects.all()
    serializer_class = EmailCampaignSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['name', 'subject']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def send_campaign(self, request, pk=None):
        """
        Trigger sending of an email campaign.
        """
        campaign = self.get_object()
        
        # This would typically be handled by a background task (Celery)
        # For now, just update status to indicate it's processing
        campaign.status = 'sending'
        campaign.save()
        
        return Response({
            'status': 'success',
            'message': 'Campaign is being sent'
        })
