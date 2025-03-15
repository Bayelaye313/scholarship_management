"use server";

import axios from "axios";
import { ScholarshipType } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Créer une instance d'API pour les appels côté serveur
export const createServerApi = async (token?: string) => {
    console.log("Creating server API with token:", token ? "Token présent" : "Pas de token");

    const serverApi = axios.create({
        baseURL: API_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (token) {
        serverApi.defaults.headers.common.Authorization = `Bearer ${token}`;
        console.log("Authorization header set:", `Bearer ${token.substring(0, 10)}...`);
    } else {
        console.log("No token provided for server API");
    }

    return serverApi;
};

// Service pour récupérer une bourse par ID
export async function getScholarshipById(id: number, token?: string): Promise<ScholarshipType> {
    try {
        console.log(`Fetching scholarship with ID ${id} from server`);
        const serverApi = await createServerApi(token);
        const response = await serverApi.get<ScholarshipType>(`/scholarship-types/${id}/`);
        console.log(`Successfully fetched scholarship with ID ${id}`);
        return response.data;
    } catch (error: any) {
        console.error(`Erreur lors de la récupération de la bourse ${id} (serveur):`, error);

        // Gestion des erreurs Axios
        if (axios.isAxiosError(error)) {
            console.error("Status:", error.response?.status);
            console.error("Response data:", error.response?.data);
        }

        // Retourner des données de démonstration en cas d'erreur
        console.log(`Returning demo data for scholarship with ID ${id}`);
        return {
            id: id,
            name: "Bourse de démonstration",
            description: "Description détaillée de la bourse.",
            requirements: "Conditions d'éligibilité détaillées.",
            duration: 12,
            amount: 5000000,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
}

// Service pour récupérer toutes les bourses
export async function getAllScholarships(token?: string): Promise<ScholarshipType[]> {
    try {
        console.log("Fetching all scholarships from server");
        const serverApi = await createServerApi(token);
        const response = await serverApi.get<ScholarshipType[]>("/scholarship-types/");
        console.log(`Successfully fetched ${response.data.length} scholarships`);
        return response.data;
    } catch (error: any) {
        console.error("Erreur lors de la récupération des bourses (serveur):", error);

        // Gestion des erreurs Axios
        if (axios.isAxiosError(error)) {
            console.error("Status:", error.response?.status);
            console.error("Response data:", error.response?.data);
        }

        // Retourner des données de démonstration en cas d'erreur
        console.log("Returning demo data for all scholarships");
        return [
            {
                id: 1,
                name: "Bourse d'Excellence Académique",
                description: "Pour les étudiants ayant obtenu d'excellents résultats académiques.",
                requirements: "Moyenne générale supérieure à 16/20.",
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
                requirements: "Niveau B2 minimum en langue étrangère.",
                duration: 24,
                amount: 10000000,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];
    }
}
