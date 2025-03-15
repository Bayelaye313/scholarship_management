import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        if (session?.user?.accessToken) {
            config.headers.Authorization = `Bearer ${session.user.accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Types pour les modèles
export interface ScholarshipType {
    id: number;
    name: string;
    description: string;
    requirements: string;
    duration: number;
    amount: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ScholarshipApplication {
    id: number;
    user: {
        id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    full_name: string;
    email: string;
    date_of_birth?: string;
    gender?: string;
    gender_display?: string;
    phone_number?: string;
    address?: string;
    scholarship_type: ScholarshipType;
    current_institution?: string;
    field_of_study?: string;
    current_year?: number;
    average_grade?: number;
    bac_mention?: string;
    bac_mention_display?: string;
    family_income?: number;
    number_of_dependents?: number;
    is_handicapped: boolean;
    motivation?: string;
    cv?: string;
    transcripts?: string;
    recommendation_letter?: string;
    additional_documents?: string;
    status: string;
    status_display: string;
    score?: number;
    recommendations?: string;
    admin_notes?: string;
    created_at: string;
    updated_at: string;
}

export interface ApplicationComment {
    id: number;
    application: number;
    user: {
        id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    content: string;
    created_at: string;
    updated_at: string;
}

// Services API
export const scholarshipTypeService = {
    getAll: async () => {
        try {
            const response = await api.get<ScholarshipType[]>("/scholarship-types/");
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des bourses:", error);
            // Retourner des données de démonstration en cas d'erreur
            return [
                {
                    id: 1,
                    name: "Bourse d'Excellence Académique",
                    description: "Pour les étudiants ayant obtenu d'excellents résultats académiques.",
                    requirements: "Moyenne générale supérieure à 16/20. Lettre de recommandation d'un professeur.",
                    duration: 12,
                    amount: 5000000,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Bourse de Mobilité Internationale",
                    description: "Pour les étudiants souhaitant poursuivre leurs études à l'étranger.",
                    requirements: "Niveau B2 minimum en langue étrangère. Lettre d'acceptation d'une université étrangère.",
                    duration: 24,
                    amount: 10000000,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Bourse Sociale",
                    description: "Pour les étudiants issus de milieux défavorisés.",
                    requirements: "Revenu familial inférieur à 3 SMIC. Attestation de situation familiale.",
                    duration: 36,
                    amount: 3000000,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ];
        }
    },
    getById: async (id: number) => {
        try {
            const response = await api.get<ScholarshipType>(`/scholarship-types/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la bourse ${id}:`, error);
            // Retourner des données de démonstration en cas d'erreur
            const demoData = {
                id: id,
                name: id === 1 ? "Bourse d'Excellence Académique" :
                    id === 2 ? "Bourse de Mobilité Internationale" : "Bourse Sociale",
                description: "Description détaillée de la bourse.",
                requirements: "Conditions d'éligibilité détaillées.",
                duration: id === 1 ? 12 : id === 2 ? 24 : 36,
                amount: id === 1 ? 5000000 : id === 2 ? 10000000 : 3000000,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            return demoData;
        }
    },
    create: async (data: Partial<ScholarshipType>) => {
        const response = await api.post<ScholarshipType>("/types/", data);
        return response.data;
    },
    update: async (id: number, data: Partial<ScholarshipType>) => {
        const response = await api.put<ScholarshipType>(`/types/${id}/`, data);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/types/${id}/`);
    },
};

export const applicationService = {
    getAll: async () => {
        const response = await api.get<ScholarshipApplication[]>("/applications/");
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<ScholarshipApplication>(`/applications/${id}/`);
        return response.data;
    },
    create: async (data: FormData) => {
        const response = await api.post<ScholarshipApplication>("/applications/", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    update: async (id: number, data: FormData) => {
        const response = await api.put<ScholarshipApplication>(`/applications/${id}/`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/applications/${id}/`);
    },
    updateStatus: async (id: number, status: string) => {
        const response = await api.post<ScholarshipApplication>(`/applications/${id}/update_status/`, { status });
        return response.data;
    },
    getComments: async (id: number) => {
        const response = await api.get<ApplicationComment[]>(`/applications/${id}/comments/`);
        return response.data;
    },
    addComment: async (id: number, content: string) => {
        const response = await api.post<ApplicationComment>(`/applications/${id}/add_comment/`, { content });
        return response.data;
    },
};

export default api; 