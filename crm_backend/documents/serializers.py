from rest_framework import serializers
from .models import Document, DocumentCategory, DocumentAccess, DocumentComment, Folder


class DocumentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentCategory
        fields = '__all__'


class DocumentCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = DocumentComment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    file_size_mb = serializers.FloatField(read_only=True)
    file_extension = serializers.CharField(read_only=True)
    comments = DocumentCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ['uploaded_at', 'updated_at', 'file_size', 'file_type', 
                           'download_count', 'view_count']


class FolderSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    full_path = serializers.CharField(read_only=True)
    subfolder_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Folder
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_subfolder_count(self, obj):
        return obj.subfolders.count()


class DocumentAccessSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    document_title = serializers.CharField(source='document.title', read_only=True)
    
    class Meta:
        model = DocumentAccess
        fields = '__all__'
        read_only_fields = ['accessed_at']
