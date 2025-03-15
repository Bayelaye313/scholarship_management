from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ScholarshipType, ScholarshipApplication, ApplicationComment
from .serializers import (
    ScholarshipTypeSerializer,
    ScholarshipApplicationListSerializer,
    ScholarshipApplicationDetailSerializer,
    ApplicationCommentSerializer
)
from .ai_evaluation import evaluate_application

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class ScholarshipTypeViewSet(viewsets.ModelViewSet):
    queryset = ScholarshipType.objects.all()
    serializer_class = ScholarshipTypeSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']
    filterset_fields = ['is_active', 'duration']

class ScholarshipApplicationViewSet(viewsets.ModelViewSet):
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['full_name', 'email', 'current_institution']
    filterset_fields = ['status', 'scholarship_type', 'current_year']
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ScholarshipApplication.objects.all()
        return ScholarshipApplication.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return ScholarshipApplicationListSerializer
        return ScholarshipApplicationDetailSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        application = self.get_object()
        serializer = ApplicationCommentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                application=application,
                user=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {"detail": "Seuls les administrateurs peuvent modifier le statut"},
                status=status.HTTP_403_FORBIDDEN
            )

        application = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(ScholarshipApplication.STATUS_CHOICES):
            return Response(
                {"detail": "Statut invalide"},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = new_status
        application.save()
        
        serializer = self.get_serializer(application)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        application = self.get_object()
        comments = application.comments.all()
        serializer = ApplicationCommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def evaluate(self, request, pk=None):
        """
        Évalue une candidature avec l'IA et retourne le score et les recommandations.
        """
        if not request.user.is_staff:
            return Response(
                {"detail": "Seuls les administrateurs peuvent lancer une évaluation"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        application = self.get_object()
        score, recommendations = evaluate_application(application.id)
        
        if score is None:
            return Response(
                {"detail": recommendations},
                status=status.HTTP_404_NOT_FOUND
            )
            
        serializer = self.get_serializer(application)
        return Response(serializer.data)

    def perform_create(self, serializer):
        # Sauvegarder la candidature
        application = serializer.save(user=self.request.user)
        
        # Évaluer automatiquement la candidature avec l'IA
        evaluate_application(application.id)
