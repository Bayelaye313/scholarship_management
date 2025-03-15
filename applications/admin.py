from django.contrib import admin
from .models import ScholarshipType, ScholarshipApplication, ApplicationComment

@admin.register(ScholarshipType)
class ScholarshipTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'duration', 'amount', 'is_active')
    list_filter = ('is_active', 'duration')
    search_fields = ('name', 'description')

class ApplicationCommentInline(admin.TabularInline):
    model = ApplicationComment
    extra = 0

@admin.register(ScholarshipApplication)
class ScholarshipApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'scholarship_type', 'status', 'ai_score', 'created_at')
    list_filter = ('status', 'scholarship_type', 'current_year', 'baccalaureate_mention')
    search_fields = ('full_name', 'email', 'current_institution')
    readonly_fields = ('created_at', 'updated_at', 'ai_score', 'ai_recommendations', 
                      'ai_academic_score', 'ai_socioeconomic_score', 'ai_motivation_score')
    inlines = [ApplicationCommentInline]
    fieldsets = (
        ('Informations personnelles', {
            'fields': (
                'user', 'full_name', 'email', 'date_of_birth', 
                'gender', 'phone', 'address'
            )
        }),
        ('Informations académiques', {
            'fields': (
                'scholarship_type', 'current_institution', 
                'current_year', 'average_grade', 'baccalaureate_mention'
            )
        }),
        ('Informations socio-économiques', {
            'fields': (
                'family_income', 'number_of_dependents', 
                'has_disability'
            )
        }),
        ('Documents', {
            'fields': (
                'motivation_letter', 'cv_file', 'transcript_file',
                'recommendation_letter_file', 'other_documents_file'
            )
        }),
        ('Évaluation', {
            'fields': (
                'status', 'ai_score', 'ai_recommendations', 
                'ai_academic_score', 'ai_socioeconomic_score', 
                'ai_motivation_score', 'admin_notes'
            )
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ApplicationComment)
class ApplicationCommentAdmin(admin.ModelAdmin):
    list_display = ('application', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'application__full_name', 'user__username')
