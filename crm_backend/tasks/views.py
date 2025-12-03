"""
Views for Task management.
Handles CRUD operations for tasks and filtering by user.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Tasks.
    
    Endpoints:
    - GET /api/tasks/ - List all tasks
    - POST /api/tasks/ - Create new task
    - GET /api/tasks/{id}/ - Get task details
    - PUT /api/tasks/{id}/ - Update task
    - DELETE /api/tasks/{id}/ - Delete task
    
    Filtering:
    - GET /api/tasks/?user_id=123 - Get tasks assigned to specific user
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Optionally filter tasks by assigned user.
        Useful for "My Tasks" view.
        """
        queryset = Task.objects.all()
        
        # Check for 'user_id' query parameter
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            queryset = queryset.filter(assigned_to_id=user_id)
            
        return queryset
