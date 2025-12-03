from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.http import FileResponse
from .models import Document, DocumentCategory, DocumentAccess, DocumentComment, Folder
from .serializers import (
    DocumentSerializer, DocumentCategorySerializer,
    DocumentAccessSerializer, DocumentCommentSerializer, FolderSerializer
)


class DocumentCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Document Categories"""
    queryset = DocumentCategory.objects.all()
    serializer_class = DocumentCategorySerializer
    permission_classes = [IsAuthenticated]


class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for Documents"""
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['document_type', 'category', 'uploaded_by']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['uploaded_at', 'title', 'file_size']
    ordering = ['-uploaded_at']
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download a document"""
        document = self.get_object()
        
        # Log access
        DocumentAccess.objects.create(
            document=document,
            user=request.user,
            action='download',
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        # Increment download count
        document.download_count += 1
        document.save()
        
        # Return file
        return FileResponse(document.file.open('rb'), as_attachment=True, filename=document.title)
    
    @action(detail=True, methods=['post'])
    def mark_viewed(self, request, pk=None):
        """Mark document as viewed"""
        document = self.get_object()
        
        # Log access
        DocumentAccess.objects.create(
            document=document,
            user=request.user,
            action='view',
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        # Increment view count
        document.view_count += 1
        document.save()
        
        return Response({'status': 'success'})
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Add a comment to a document"""
        document = self.get_object()
        comment_text = request.data.get('comment')
        
        if not comment_text:
            return Response(
                {'error': 'Comment text is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        comment = DocumentComment.objects.create(
            document=document,
            user=request.user,
            comment=comment_text
        )
        
        serializer = DocumentCommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def my_documents(self, request):
        """Get current user's documents"""
        documents = Document.objects.filter(uploaded_by=request.user)
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def shared_with_me(self, request):
        """Get documents shared with current user"""
        documents = Document.objects.filter(shared_with=request.user)
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)


class FolderViewSet(viewsets.ModelViewSet):
    """ViewSet for Folders"""
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['owner', 'parent']
    search_fields = ['name', 'description']
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_folders(self, request):
        """Get current user's folders"""
        folders = Folder.objects.filter(owner=request.user, parent=None)
        serializer = self.get_serializer(folders, many=True)
        return Response(serializer.data)
