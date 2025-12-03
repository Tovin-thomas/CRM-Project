"""
Main URL configuration for CRM project.
Routes all API endpoints to their respective apps.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/leads/', include('leads.urls')),
    path('api/contacts/', include('contacts.urls')),
    path('api/deals/', include('deals.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/notes/', include('notes.urls')),
    path('api/activities/', include('activities.urls')),
    path('api/ai/', include('ai_features.urls')),
    path('api/', include('clients.urls')),
    path('api/emails/', include('emails.urls')),
    path('api/calendar/', include('calendar_events.urls')),
    path('api/documents/', include('documents.urls')),
]
