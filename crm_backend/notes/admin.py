from django.contrib import admin
from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_by', 'sentiment', 'sentiment_score', 'created_at']
    list_filter = ['sentiment', 'created_at']
    search_fields = ['content', 'created_by__email']
    readonly_fields = ['sentiment', 'sentiment_score']
