from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, DocumentCategoryViewSet, FolderViewSet

router = DefaultRouter()
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'categories', DocumentCategoryViewSet, basename='document-category')
router.register(r'folders', FolderViewSet, basename='folder')

urlpatterns = [
    path('', include(router.urls)),
]
