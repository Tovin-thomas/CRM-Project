from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmailTemplateViewSet, EmailViewSet, EmailCampaignViewSet

router = DefaultRouter()
router.register(r'templates', EmailTemplateViewSet, basename='email-template')
router.register(r'emails', EmailViewSet, basename='email')
router.register(r'campaigns', EmailCampaignViewSet, basename='email-campaign')

urlpatterns = [
    path('', include(router.urls)),
]
