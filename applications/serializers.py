from rest_framework import serializers
from .models import ScholarshipType, ScholarshipApplication, ApplicationComment
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ScholarshipTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScholarshipType
        fields = '__all__'

class ApplicationCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = ApplicationComment
        fields = ['id', 'user', 'user_name', 'application', 'content', 'created_at']
        read_only_fields = ['user', 'application']

    def get_user_name(self, obj):
        return obj.user.username

class ScholarshipApplicationListSerializer(serializers.ModelSerializer):
    scholarship_type = ScholarshipTypeSerializer(read_only=True)
    scholarship_type_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = ScholarshipApplication
        fields = [
            'id', 'user', 'full_name', 'email', 'scholarship_type', 'scholarship_type_name',
            'current_institution', 'current_year', 'status', 'created_at', 'updated_at',
            'ai_score'
        ]

    def get_scholarship_type_name(self, obj):
        return obj.scholarship_type.name

class ScholarshipApplicationDetailSerializer(serializers.ModelSerializer):
    scholarship_type = ScholarshipTypeSerializer(read_only=True)
    scholarship_type_id = serializers.PrimaryKeyRelatedField(
        queryset=ScholarshipType.objects.all(),
        write_only=True,
        source='scholarship_type'
    )
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    user = UserSerializer(read_only=True)
    comments = ApplicationCommentSerializer(many=True, read_only=True)
    bac_mention_display = serializers.CharField(source='get_bac_mention_display', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    scholarship_type_name = serializers.SerializerMethodField()

    class Meta:
        model = ScholarshipApplication
        fields = '__all__'
        read_only_fields = ['user', 'score', 'recommendations', 'admin_notes']
        extra_kwargs = {
            'cv': {'required': True},
            'transcripts': {'required': True},
            'recommendation_letter': {'required': False},
            'additional_documents': {'required': False},
        }

    def validate_average_grade(self, value):
        if value < 0 or value > 20:
            raise serializers.ValidationError("La moyenne doit être comprise entre 0 et 20")
        return value

    def validate(self, data):
        if data.get('family_income', 0) < 0:
            raise serializers.ValidationError("Les revenus familiaux ne peuvent pas être négatifs")
        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def get_scholarship_type_name(self, obj):
        return obj.scholarship_type.name
