"""
Views for Contact management.
Handles CRUD operations for contacts linked to leads.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Contact
from .serializers import ContactSerializer


class ContactViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for contacts.
    
    Endpoints:
    - GET /api/contacts/ - List all contacts
    - POST /api/contacts/ - Create new contact
    - GET /api/contacts/{id}/ - Get contact details
    - PUT /api/contacts/{id}/ - Update contact
    - DELETE /api/contacts/{id}/ - Delete contact
    
    Filtering:
    - GET /api/contacts/?lead_id=123 - Get contacts for specific lead
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Custom queryset to allow filtering by lead_id.
        Useful for showing "Contacts" tab on a Lead detail page.
        """
        queryset = Contact.objects.all()
        
        # Check for 'lead_id' query parameter
        lead_id = self.request.query_params.get('lead_id', None)
        if lead_id:
            queryset = queryset.filter(lead_id=lead_id)
            
        return queryset
