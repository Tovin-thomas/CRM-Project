from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ClientProjectViewSet, ClientInteractionViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'projects', ClientProjectViewSet, basename='client-project')
router.register(r'interactions', ClientInteractionViewSet, basename='client-interaction')

urlpatterns = [
    path('', include(router.urls)),
]
