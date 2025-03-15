from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings

User = get_user_model()

class ScholarshipType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    requirements = models.TextField()
    duration = models.PositiveIntegerField(help_text="Durée en mois")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Type de bourse"
        verbose_name_plural = "Types de bourses"

class ScholarshipApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('under_review', 'En cours d\'examen'),
        ('accepted', 'Acceptée'),
        ('rejected', 'Rejetée'),
        ('waiting_list', 'Liste d\'attente'),
    )

    GENDER_CHOICES = [
        ('M', 'Masculin'),
        ('F', 'Féminin'),
        ('O', 'Autre'),
    ]

    BACCALAUREATE_CHOICES = (
        ('passable', 'Passable'),
        ('assez_bien', 'Assez Bien'),
        ('bien', 'Bien'),
        ('tres_bien', 'Très Bien'),
    )

    # Informations personnelles
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    full_name = models.CharField(max_length=255, verbose_name="Nom complet")
    email = models.EmailField(verbose_name="Email")
    date_of_birth = models.DateField(verbose_name="Date de naissance", null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name="Genre", null=True, blank=True)
    phone = models.CharField(max_length=20, verbose_name="Numéro de téléphone", null=True, blank=True)
    address = models.TextField(verbose_name="Adresse", null=True, blank=True)

    # Informations académiques
    scholarship_type = models.ForeignKey(ScholarshipType, on_delete=models.CASCADE, related_name='applications')
    current_institution = models.CharField(max_length=255, verbose_name="Établissement actuel", null=True, blank=True)
    current_year = models.CharField(max_length=100, verbose_name="Année d'études actuelle", null=True, blank=True)
    average_grade = models.DecimalField(max_digits=4, decimal_places=2, verbose_name="Moyenne générale", null=True, blank=True)
    baccalaureate_mention = models.CharField(max_length=20, choices=BACCALAUREATE_CHOICES, verbose_name="Mention au bac", null=True, blank=True)

    # Informations socio-économiques
    family_income = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Revenus familiaux annuels", null=True, blank=True)
    number_of_dependents = models.PositiveIntegerField(verbose_name="Nombre de personnes à charge", null=True, blank=True)
    has_disability = models.BooleanField(default=False, verbose_name="Situation de handicap")
    
    # Documents et motivation
    motivation_letter = models.TextField(verbose_name="Lettre de motivation", null=True, blank=True)
    cv_file = models.FileField(upload_to='applications/cv/', verbose_name="CV", null=True, blank=True)
    transcript_file = models.FileField(upload_to='applications/transcripts/', verbose_name="Relevés de notes", null=True, blank=True)
    recommendation_letter_file = models.FileField(upload_to='applications/recommendations/', verbose_name="Lettre de recommandation", null=True, blank=True)
    other_documents_file = models.FileField(upload_to='applications/others/', verbose_name="Documents supplémentaires", null=True, blank=True)

    # Statut et évaluation
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Statut")
    admin_notes = models.TextField(null=True, blank=True, verbose_name="Notes administratives")
    
    # Champs d'évaluation IA
    ai_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name="Score IA")
    ai_recommendations = models.TextField(blank=True, null=True, verbose_name="Recommandations IA")
    ai_academic_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name="Score académique IA")
    ai_socioeconomic_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name="Score socio-économique IA")
    ai_motivation_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name="Score de motivation IA")
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Dernière modification")

    class Meta:
        verbose_name = "Candidature"
        verbose_name_plural = "Candidatures"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.scholarship_type.name} ({self.get_status_display()})"

class ApplicationComment(models.Model):
    application = models.ForeignKey(ScholarshipApplication, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Commentaire"
        verbose_name_plural = "Commentaires"
        ordering = ['-created_at']

    def __str__(self):
        return f"Commentaire de {self.user.username} sur {self.application}"
