# Système de Gestion des Bourses d'Études

Ce projet est une application web complète pour la gestion des bourses d'études, permettant aux étudiants de postuler à des bourses et aux administrateurs de gérer les candidatures.

## Fonctionnalités

### Pour les étudiants
- Inscription et authentification
- Consultation des types de bourses disponibles
- Soumission de candidatures avec upload de documents
- Suivi de l'état des candidatures
- Réception de notifications sur l'avancement des candidatures

### Pour les administrateurs
- Tableau de bord avec statistiques
- Gestion des types de bourses
- Évaluation des candidatures
- Évaluation automatique par IA des candidatures
- Communication avec les candidats
- Génération de rapports

## Évaluation IA des candidatures

Le système intègre un module d'évaluation automatique des candidatures par IA qui analyse :

1. **Performance académique (40%)** - Évalue les résultats scolaires et la mention au baccalauréat
2. **Situation socio-économique (30%)** - Analyse les revenus familiaux, le nombre de personnes à charge et les situations de handicap
3. **Motivation (30%)** - Évalue la lettre de motivation du candidat

L'IA génère un score global sur 100 points et fournit des recommandations détaillées pour aider les administrateurs dans leur prise de décision.

### Implémentation de l'évaluation IA

L'évaluation IA est implémentée à travers plusieurs composants :

1. **Backend (Django)**
   - Modèle de données avec champs d'évaluation IA (`ai_score`, `ai_recommendations`, etc.)
   - Service d'évaluation IA (`AIEvaluator`) qui analyse les candidatures
   - API REST pour déclencher l'évaluation et récupérer les résultats

2. **Frontend (Next.js)**
   - Interface utilisateur pour visualiser les scores et recommandations
   - Composant `AIEvaluationCard` pour afficher les résultats d'évaluation
   - Intégration dans le tableau de bord administrateur et les pages de détail

3. **Algorithme d'évaluation**
   - Évaluation académique basée sur les notes et mentions
   - Évaluation socio-économique basée sur les revenus et la situation familiale
   - Analyse de la lettre de motivation (longueur et contenu)
   - Génération de recommandations personnalisées

Cette fonctionnalité permet d'automatiser une partie du processus de sélection tout en laissant la décision finale aux administrateurs.

## Technologies utilisées

### Backend
- Django (Python)
- Django REST Framework
- PostgreSQL
- JWT pour l'authentification

### Frontend
- Next.js (React)
- TypeScript
- Tailwind CSS
- NextAuth.js pour l'authentification

## Installation

### Prérequis
- Python 3.8+
- Node.js 14+
- PostgreSQL

### Backend
```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/scholarship-management.git
cd scholarship-management

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer la base de données
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

### Frontend
```bash
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT. 