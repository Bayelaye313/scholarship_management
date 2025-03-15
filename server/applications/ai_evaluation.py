import random
from .models import ScholarshipApplication
import math

class AIEvaluator:
    """
    Service d'évaluation IA pour les candidatures de bourses.
    Évalue les candidatures selon trois critères principaux :
    1. Performance académique
    2. Situation socio-économique
    3. Motivation et projet
    """
    
    def __init__(self, application):
        """Initialise l'évaluateur avec une candidature"""
        self.application = application
    
    def evaluate(self):
        """
        Évalue la candidature et retourne un score global et des recommandations
        
        Returns:
            tuple: (score_total, recommandations)
        """
        # Évaluation académique (40% du score total)
        academic_score = self._evaluate_academic()
        
        # Évaluation socio-économique (30% du score total)
        socioeconomic_score = self._evaluate_socioeconomic()
        
        # Évaluation de la motivation (30% du score total)
        motivation_score = self._evaluate_motivation()
        
        # Calcul du score total pondéré
        total_score = (
            academic_score * 0.4 +
            socioeconomic_score * 0.3 +
            motivation_score * 0.3
        )
        
        # Arrondir à deux décimales
        total_score = round(total_score, 2)
        academic_score = round(academic_score, 2)
        socioeconomic_score = round(socioeconomic_score, 2)
        motivation_score = round(motivation_score, 2)
        
        # Générer des recommandations basées sur les scores
        recommendations = self._generate_recommendations(
            academic_score, socioeconomic_score, motivation_score, total_score
        )
        
        return total_score, recommendations, academic_score, socioeconomic_score, motivation_score
    
    def _evaluate_academic(self):
        """
        Évalue les performances académiques du candidat
        
        Returns:
            float: Score académique sur 100
        """
        score = 0
        
        # Évaluation de la moyenne générale (0-20 points → 0-60 points)
        if self.application.average_grade:
            # Convertir la note sur 20 en note sur 60
            grade_score = (self.application.average_grade / 20) * 60
            score += grade_score
        
        # Évaluation de la mention au baccalauréat (0-40 points)
        if self.application.baccalaureate_mention:
            if self.application.baccalaureate_mention == 'tres_bien':
                score += 40
            elif self.application.baccalaureate_mention == 'bien':
                score += 30
            elif self.application.baccalaureate_mention == 'assez_bien':
                score += 20
            elif self.application.baccalaureate_mention == 'passable':
                score += 10
        
        return score
    
    def _evaluate_socioeconomic(self):
        """
        Évalue la situation socio-économique du candidat
        
        Returns:
            float: Score socio-économique sur 100
        """
        score = 0
        
        # Évaluation des revenus familiaux (0-50 points)
        # Plus les revenus sont bas, plus le score est élevé
        if self.application.family_income:
            # Seuils de revenus (en FCFA)
            low_income = 1000000  # 1 million FCFA
            medium_income = 3000000  # 3 millions FCFA
            high_income = 5000000  # 5 millions FCFA
            
            if self.application.family_income <= low_income:
                score += 50
            elif self.application.family_income <= medium_income:
                # Interpolation linéaire entre 50 et 25 points
                score += 50 - ((self.application.family_income - low_income) / (medium_income - low_income)) * 25
            elif self.application.family_income <= high_income:
                # Interpolation linéaire entre 25 et 10 points
                score += 25 - ((self.application.family_income - medium_income) / (high_income - medium_income)) * 15
            else:
                score += 10
        
        # Évaluation du nombre de personnes à charge (0-30 points)
        if self.application.number_of_dependents:
            if self.application.number_of_dependents >= 5:
                score += 30
            elif self.application.number_of_dependents >= 3:
                score += 20
            elif self.application.number_of_dependents >= 1:
                score += 10
        
        # Bonus pour situation de handicap (20 points)
        if self.application.has_disability:
            score += 20
        
        return min(score, 100)  # Plafonner à 100 points
    
    def _evaluate_motivation(self):
        """
        Évalue la motivation du candidat basée sur sa lettre de motivation
        
        Returns:
            float: Score de motivation sur 100
        """
        score = 0
        
        # Évaluation de la longueur de la lettre de motivation (0-30 points)
        if self.application.motivation_letter:
            letter_length = len(self.application.motivation_letter)
            
            if letter_length >= 2000:
                score += 30
            elif letter_length >= 1000:
                score += 20
            elif letter_length >= 500:
                score += 10
        
        # Simulation d'analyse de contenu (0-70 points)
        # Dans une implémentation réelle, cela serait remplacé par une analyse NLP
        if self.application.motivation_letter:
            # Simuler une analyse de contenu avec une valeur aléatoire pondérée
            # Pour la démonstration, nous utilisons un score aléatoire entre 40 et 70
            content_score = random.uniform(40, 70)
            score += content_score
        
        return min(score, 100)  # Plafonner à 100 points
    
    def _generate_recommendations(self, academic_score, socioeconomic_score, motivation_score, total_score):
        """
        Génère des recommandations basées sur les scores d'évaluation
        
        Args:
            academic_score (float): Score académique
            socioeconomic_score (float): Score socio-économique
            motivation_score (float): Score de motivation
            total_score (float): Score total
            
        Returns:
            str: Recommandations textuelles
        """
        recommendations = []
        
        # Recommandation générale basée sur le score total
        if total_score >= 80:
            recommendations.append(
                "Candidature exceptionnelle. Le candidat présente un excellent profil académique "
                "et une situation socio-économique justifiant l'attribution d'une bourse. "
                "Recommandation: Acceptation prioritaire."
            )
        elif total_score >= 70:
            recommendations.append(
                "Très bonne candidature. Le candidat présente un bon profil global. "
                "Recommandation: Acceptation."
            )
        elif total_score >= 60:
            recommendations.append(
                "Candidature satisfaisante. Le candidat présente un profil intéressant. "
                "Recommandation: Acceptation sous réserve de places disponibles."
            )
        elif total_score >= 50:
            recommendations.append(
                "Candidature moyenne. Le candidat pourrait bénéficier d'une bourse, mais n'est pas prioritaire. "
                "Recommandation: Liste d'attente."
            )
        else:
            recommendations.append(
                "Candidature insuffisante selon nos critères d'évaluation. "
                "Recommandation: Refus avec possibilité de recandidature l'année prochaine."
            )
        
        # Recommandations spécifiques basées sur les scores individuels
        if academic_score < 50:
            recommendations.append(
                "Le profil académique est en dessous de nos attentes. "
                "Nous recommandons au candidat d'améliorer ses résultats scolaires."
            )
        
        if socioeconomic_score >= 80:
            recommendations.append(
                "La situation socio-économique du candidat justifie pleinement l'attribution d'une bourse."
            )
        
        if motivation_score < 60:
            recommendations.append(
                "La lettre de motivation pourrait être améliorée. "
                "Nous recommandons au candidat de mieux expliciter son projet d'études et ses ambitions."
            )
        
        return "\n\n".join(recommendations)

def evaluate_application(application_id):
    """
    Évalue une candidature avec l'IA et met à jour les champs d'évaluation
    
    Args:
        application_id (int): ID de la candidature à évaluer
        
    Returns:
        tuple: (score, recommendations) ou (None, message d'erreur)
    """
    try:
        application = ScholarshipApplication.objects.get(id=application_id)
    except ScholarshipApplication.DoesNotExist:
        return None, "Candidature non trouvée"
    
    # Vérifier que les données nécessaires sont présentes
    if not application.average_grade or not application.motivation_letter:
        return None, "Données insuffisantes pour l'évaluation"
    
    # Évaluer la candidature
    evaluator = AIEvaluator(application)
    total_score, recommendations, academic_score, socioeconomic_score, motivation_score = evaluator.evaluate()
    
    # Mettre à jour les champs d'évaluation
    application.ai_score = total_score
    application.ai_recommendations = recommendations
    application.ai_academic_score = academic_score
    application.ai_socioeconomic_score = socioeconomic_score
    application.ai_motivation_score = motivation_score
    application.save()
    
    return total_score, recommendations 