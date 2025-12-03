"""
URL routes for AI features endpoints.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('score-lead/', views.score_lead_view, name='score_lead'),
    path('generate-email/', views.generate_email_view, name='generate_email'),
    path('analyze-sentiment/', views.analyze_sentiment_view, name='analyze_sentiment'),
    path('categorize-lead/', views.categorize_lead_view, name='categorize_lead'),
    path('update-all/', views.update_all_ai_fields, name='update_all_ai_fields'),
]
