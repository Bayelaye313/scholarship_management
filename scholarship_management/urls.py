from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from applications.views import ScholarshipApplicationViewSet, ScholarshipTypeViewSet
from users.views import UserViewSet

router = DefaultRouter()
router.register(r'applications', ScholarshipApplicationViewSet, basename='application')
router.register(r'scholarship-types', ScholarshipTypeViewSet, basename='scholarship-type')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include('applications.urls')),
    path('api/', include('users.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
