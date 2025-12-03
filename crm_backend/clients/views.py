from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Sum, Q
from datetime import datetime, timedelta
from .models import Client, ClientProject, ClientInteraction
from .serializers import (
    ClientSerializer, ClientListSerializer,
    ClientProjectSerializer, ClientInteractionSerializer
)


class ClientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Client CRUD operations
    """
    queryset = Client.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'industry_type', 'account_manager']
    search_fields = ['company_name', 'contact_person', 'email', 'city', 'country']
    ordering_fields = ['company_name', 'created_at', 'contract_value', 'contract_start_date']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ClientListSerializer
        return ClientSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get client statistics"""
        total_clients = Client.objects.count()
        active_clients = Client.objects.filter(status='active').count()
        past_clients = Client.objects.filter(status='past').count()
        inactive_clients = Client.objects.filter(status='inactive').count()
        
        # Industry breakdown
        industry_breakdown = Client.objects.values('industry_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Top clients by contract value
        top_clients = Client.objects.filter(
            contract_value__isnull=False
        ).order_by('-contract_value')[:5].values(
            'id', 'company_name', 'contract_value', 'status'
        )
        
        # Contract expiring soon (next 30 days)
        today = datetime.now().date()
        expiring_soon = Client.objects.filter(
            contract_end_date__gte=today,
            contract_end_date__lte=today + timedelta(days=30),
            status='active'
        ).count()
        
        # Total contract value
        total_contract_value = Client.objects.filter(
            contract_value__isnull=False
        ).aggregate(total=Sum('contract_value'))['total'] or 0
        
        return Response({
            'total_clients': total_clients,
            'active_clients': active_clients,
            'past_clients': past_clients,
            'inactive_clients': inactive_clients,
            'industry_breakdown': list(industry_breakdown),
            'top_clients': list(top_clients),
            'contracts_expiring_soon': expiring_soon,
            'total_contract_value': float(total_contract_value),
        })
    
    @action(detail=True, methods=['get'])
    def projects(self, request, pk=None):
        """Get all projects for a client"""
        client = self.get_object()
        projects = client.projects.all()
        serializer = ClientProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def interactions(self, request, pk=None):
        """Get all interactions for a client"""
        client = self.get_object()
        interactions = client.interactions.all()
        serializer = ClientInteractionSerializer(interactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def high_value(self, request):
        """Get high-value clients (top 20% by contract value)"""
        clients = Client.objects.filter(
            contract_value__isnull=False,
            status='active'
        ).order_by('-contract_value')[:10]
        serializer = self.get_serializer(clients, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def long_term(self, request):
        """Get long-term clients (contract duration > 1 year)"""
        one_year_ago = datetime.now().date() - timedelta(days=365)
        clients = Client.objects.filter(
            contract_start_date__lte=one_year_ago,
            status='active'
        )
        serializer = self.get_serializer(clients, many=True)
        return Response(serializer.data)


class ClientProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ClientProject CRUD operations
    """
    queryset = ClientProject.objects.all()
    serializer_class = ClientProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['client', 'status', 'project_manager']
    search_fields = ['project_name', 'description']
    ordering_fields = ['start_date', 'budget']
    ordering = ['-start_date']


class ClientInteractionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ClientInteraction CRUD operations
    """
    queryset = ClientInteraction.objects.all()
    serializer_class = ClientInteractionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['client', 'interaction_type', 'user']
    search_fields = ['subject', 'notes']
    ordering_fields = ['interaction_date']
    ordering = ['-interaction_date']
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
