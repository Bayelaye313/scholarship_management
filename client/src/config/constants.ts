// URL de l'API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Constantes pour les statuts de candidature
export const APPLICATION_STATUS = {
    PENDING: 'pending',
    UNDER_REVIEW: 'under_review',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    WAITING_LIST: 'waiting_list'
};

// Constantes pour les mentions au baccalauréat
export const BAC_MENTIONS = {
    PASSABLE: 'passable',
    ASSEZ_BIEN: 'assez_bien',
    BIEN: 'bien',
    TRES_BIEN: 'tres_bien'
};

// Seuils de score IA
export const AI_SCORE_THRESHOLDS = {
    EXCELLENT: 80,
    GOOD: 70,
    AVERAGE: 60,
    POOR: 50
}; 