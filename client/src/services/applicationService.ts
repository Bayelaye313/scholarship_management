import axios from 'axios';
import { API_URL } from '../config/constants';

export interface Application {
    id: number;
    user: number;
    full_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    address: string;
    scholarship_type: number;
    scholarship_type_name?: string;
    current_institution: string;
    current_year: string;
    average_grade: number;
    baccalaureate_mention: string;
    family_income: number;
    number_of_dependents: number;
    has_disability: boolean;
    motivation_letter: string;
    cv_file: string;
    transcript_file: string;
    recommendation_letter_file: string;
    other_documents_file: string;
    status: string;
    created_at: string;
    updated_at: string;
    admin_notes?: string;
    ai_score?: number;
    ai_recommendations?: string;
    ai_academic_score?: number;
    ai_socioeconomic_score?: number;
    ai_motivation_score?: number;
}

export interface Comment {
    id: number;
    user: number;
    user_name?: string;
    application: number;
    content: string;
    created_at: string;
}

export interface ApplicationFilter {
    status?: string;
    scholarship_type?: number;
    search?: string;
}

const applicationService = {
    getAll: async (filters: ApplicationFilter = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.status) {
                params.append('status', filters.status);
            }

            if (filters.scholarship_type) {
                params.append('scholarship_type', filters.scholarship_type.toString());
            }

            if (filters.search) {
                params.append('search', filters.search);
            }

            const response = await axios.get(`${API_URL}/applications/?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des candidatures:', error);
            throw error;
        }
    },

    getById: async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/applications/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la candidature ${id}:`, error);
            throw error;
        }
    },

    create: async (applicationData: Partial<Application>) => {
        try {
            const response = await axios.post(`${API_URL}/applications/`, applicationData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la candidature:', error);
            throw error;
        }
    },

    update: async (id: number, applicationData: Partial<Application>) => {
        try {
            const response = await axios.patch(`${API_URL}/applications/${id}/`, applicationData);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de la candidature ${id}:`, error);
            throw error;
        }
    },

    updateStatus: async (id: number, status: string) => {
        try {
            const response = await axios.post(`${API_URL}/applications/${id}/update_status/`, { status });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du statut de la candidature ${id}:`, error);
            throw error;
        }
    },

    updateAdminNotes: async (id: number, admin_notes: string) => {
        try {
            const response = await axios.patch(`${API_URL}/applications/${id}/`, { admin_notes });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour des notes administratives de la candidature ${id}:`, error);
            throw error;
        }
    },

    getComments: async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/applications/${id}/comments/`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des commentaires pour la candidature ${id}:`, error);
            throw error;
        }
    },

    addComment: async (id: number, content: string) => {
        try {
            const response = await axios.post(`${API_URL}/applications/${id}/add_comment/`, { content });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de l'ajout d'un commentaire à la candidature ${id}:`, error);
            throw error;
        }
    },

    evaluateWithAI: async (id: number) => {
        try {
            const response = await axios.post(`${API_URL}/applications/${id}/evaluate/`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de l'évaluation IA de la candidature ${id}:`, error);
            throw error;
        }
    },

    deleteApplication: async (id: number) => {
        try {
            await axios.delete(`${API_URL}/applications/${id}/`);
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression de la candidature ${id}:`, error);
            throw error;
        }
    }
};

export default applicationService; 