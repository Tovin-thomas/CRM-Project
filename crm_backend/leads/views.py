"""
Views for Lead management.
Provides CRUD operations for leads and AI integration points.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Lead
from .serializers import LeadSerializer, LeadListSerializer


class LeadViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Lead CRUD operations.
    
    Standard Actions:
    - list: GET /api/leads/
    - create: POST /api/leads/
    - retrieve: GET /api/leads/{id}/
    - update: PUT /api/leads/{id}/
    - destroy: DELETE /api/leads/{id}/
    
    Custom Actions:
    - update_ai: POST /api/leads/{id}/update_ai/ (Recalculate score)
    - statistics: GET /api/leads/statistics/ (Dashboard stats)
    """
    queryset = Lead.objects.all()
    # Require authentication for all lead operations
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """
        Dynamic serializer selection.
        Use lighter LeadListSerializer for list view to improve performance.
        Use full LeadSerializer for detail views to show all fields.
        """
        if self.action == 'list':
            return LeadListSerializer
        return LeadSerializer
    
    def perform_create(self, serializer):
        """
        Override create to trigger AI processing immediately after saving.
        """
        # Save the initial lead data
        lead = serializer.save()
        
        # Import AI functions here to avoid circular imports
        # (AI module might import Lead model)
        from ai_features.lead_scoring import calculate_lead_score
        from ai_features.categorization import categorize_lead
        
        # Calculate and update AI fields
        lead.score = calculate_lead_score(lead)
        lead.category = categorize_lead(lead)
        lead.save()
    
    @action(detail=True, methods=['post'])
    def update_ai(self, request, pk=None):
        """
        Manually trigger AI score and category update.
        Useful if lead details change significantly.
        
        Endpoint: POST /api/leads/{id}/update_ai/
        """
        lead = self.get_object()
        
        # Import AI functions
        from ai_features.lead_scoring import calculate_lead_score
        from ai_features.categorization import categorize_lead
        
        # Recalculate AI fields
        lead.score = calculate_lead_score(lead)
        lead.category = categorize_lead(lead)
        lead.save()
        
        serializer = self.get_serializer(lead)
        return Response({
            'message': 'AI fields updated successfully',
            'lead': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get aggregated lead statistics for the dashboard.
        Optimized to use database counting instead of loading objects.
        
        Endpoint: GET /api/leads/statistics/
        """
        # Status counts
        total_leads = Lead.objects.count()
        new_leads = Lead.objects.filter(status='new').count()
        contacted_leads = Lead.objects.filter(status='contacted').count()
        qualified_leads = Lead.objects.filter(status='qualified').count()
        lost_leads = Lead.objects.filter(status='lost').count()
        converted_leads = Lead.objects.filter(status='converted').count()
        
        # Category breakdown (AI segments)
        hot_leads = Lead.objects.filter(category='hot').count()
        warm_leads = Lead.objects.filter(category='warm').count()
        cold_leads = Lead.objects.filter(category='cold').count()
        
        return Response({
            'total': total_leads,
            'new': new_leads,
            'contacted': contacted_leads,
            'qualified': qualified_leads,
            'lost': lost_leads,
            'converted': converted_leads,
            'hot': hot_leads,
            'warm': warm_leads,
            'cold': cold_leads,
        })
