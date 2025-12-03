"""
Custom permissions for admin-only views.
"""
from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permission check: Only users with role='admin' can access.
    """
    message = "You must be an admin to access this resource."
    
    def has_permission(self, request, view):
        # Check if user is authenticated and has admin role
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )
