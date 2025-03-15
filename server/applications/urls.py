from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ScholarshipTypeViewSet, ScholarshipApplicationViewSet

router = DefaultRouter()
router.register(r'scholarship-types', ScholarshipTypeViewSet)
router.register(r'applications', ScholarshipApplicationViewSet, basename='application')

urlpatterns = [
    path('', include(router.urls)),
]
