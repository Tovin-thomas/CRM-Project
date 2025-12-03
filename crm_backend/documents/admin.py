from django.contrib import admin
from .models import Document, DocumentCategory, DocumentAccess, DocumentComment, Folder


@admin.register(DocumentCategory)
class DocumentCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'color', 'created_at']
    search_fields = ['name', 'description']


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'document_type', 'category', 'file_size_mb', 'uploaded_by', 'uploaded_at', 'download_count', 'view_count']
    list_filter = ['document_type', 'category', 'uploaded_at']
    search_fields = ['title', 'description', 'tags']
    filter_horizontal = ['shared_with']
    readonly_fields = ['uploaded_at', 'updated_at', 'file_size', 'file_type', 'download_count', 'view_count']
    
    fieldsets = (
        ('Document Details', {
            'fields': ('title', 'description', 'file', 'document_type')
        }),
        ('Organization', {
            'fields': ('category', 'tags')
        }),
        ('Access Control', {
            'fields': ('is_public', 'shared_with')
        }),
        ('Version Control', {
            'fields': ('version', 'previous_version'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('uploaded_by', 'uploaded_at', 'updated_at', 'file_size', 'file_type', 'download_count', 'view_count'),
            'classes': ('collapse',)
        }),
    )


@admin.register(DocumentAccess)
class DocumentAccessAdmin(admin.ModelAdmin):
    list_display = ['document', 'user', 'action', 'accessed_at', 'ip_address']
    list_filter = ['action', 'accessed_at']
    search_fields = ['document__title', 'user__username']
    readonly_fields = ['accessed_at']


@admin.register(DocumentComment)
class DocumentCommentAdmin(admin.ModelAdmin):
    list_display = ['document', 'user', 'comment', 'created_at']
    list_filter = ['created_at']
    search_fields = ['document__title', 'user__username', 'comment']


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'owner', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    filter_horizontal = ['shared_with']
