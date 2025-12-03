from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalendarEventViewSet, AvailabilityViewSet

router = DefaultRouter()
router.register(r'events', CalendarEventViewSet, basename='calendar-event')
router.register(r'availability', AvailabilityViewSet, basename='availability')

urlpatterns = [
    path('', include(router.urls)),
]
