from django.contrib import admin
from .models import Deal


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ['title', 'lead', 'value', 'stage', 'probability', 'expected_close_date', 'created_at']
    list_filter = ['stage', 'created_at']
    search_fields = ['title', 'lead__name']
