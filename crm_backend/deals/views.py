"""
Views for Deal management.
Handles CRUD operations for sales opportunities.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Deal
from .serializers import DealSerializer


class DealViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Deals.
    
    Endpoints:
    - GET /api/deals/ - List all deals
    - POST /api/deals/ - Create new deal
    - GET /api/deals/{id}/ - Get deal details
    - PUT /api/deals/{id}/ - Update deal
    - DELETE /api/deals/{id}/ - Delete deal
    """
    queryset = Deal.objects.all()
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        """
        Automatically assign the creator of the deal.
        """
        serializer.save(created_by=self.request.user)
