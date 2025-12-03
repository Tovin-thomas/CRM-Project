"""
URL routes for leads endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for viewset
router = DefaultRouter()
router.register(r'', views.LeadViewSet, basename='lead')

urlpatterns = [
    path('', include(router.urls)),
]
