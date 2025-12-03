"""
Admin configuration for AI features.
Since AI features don't have their own models, we don't register anything here.
The AI functionality is accessed through other models (Leads, Notes, etc.)
"""
from django.contrib import admin

# No models to register for AI features
# AI functions are utility functions used by other apps
