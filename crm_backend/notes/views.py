"""
Views for Note management.
Handles CRUD operations and triggers AI sentiment analysis.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Notes.
    
    Endpoints:
    - GET /api/notes/ - List all notes
    - POST /api/notes/ - Create new note (triggers AI analysis)
    - GET /api/notes/{id}/ - Get note details
    - PUT /api/notes/{id}/ - Update note
    - DELETE /api/notes/{id}/ - Delete note
    """
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        """
        Save note and analyze sentiment using AI.
        """
        # Save note with current user as creator
        note = serializer.save(created_by=self.request.user)
        
        # Analyze sentiment using AI with detailed analysis
        # This runs synchronously - for high volume, consider moving to Celery task
        from ai_features.sentiment_analysis import analyze_sentiment_detailed
        result = analyze_sentiment_detailed(note.content)
        
        # Update note with AI results
        note.sentiment = result['sentiment']
        note.sentiment_score = result['polarity']
        note.polarity = result['polarity']
        note.subjectivity = result['subjectivity']
        note.save()
