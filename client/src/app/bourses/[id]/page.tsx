import React from "react";
import Link from "next/link";
import { ScholarshipType } from "../../../services/api";
import { getScholarshipById } from "../../../services/serverApi";
import {
    CalendarIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";

// Identifiants uniques pour les toasts
const TOAST_IDS = {
    LOADING_ERROR: 'loading-scholarship-error',
};

async function getScholarship(id: string): Promise<ScholarshipType> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.user?.accessToken as string | undefined;
        return await getScholarshipById(parseInt(id), token);
    } catch (error) {
        console.error(`Erreur lors de la récupération de la bourse ${id}:`, error);
        // Retourner des données de démonstration en cas d'erreur
        return {
            id: parseInt(id),
            name: parseInt(id) === 1 ? "Bourse d'Excellence Académique" :
                parseInt(id) === 2 ? "Bourse de Mobilité Internationale" : "Bourse Sociale",
            description: "Description détaillée de la bourse.",
            requirements: "Conditions d'éligibilité détaillées.",
            duration: parseInt(id) === 1 ? 12 : parseInt(id) === 2 ? 24 : 36,
            amount: parseInt(id) === 1 ? 5000000 : parseInt(id) === 2 ? 10000000 : 3000000,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
}

export default async function ScholarshipDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);
    const scholarship = await getScholarship(params.id);

    if (!scholarship) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-700">
                    Bourse non trouvée
                </h2>
                <p className="mt-4 text-gray-600">
                    La bourse que vous recherchez n'existe pas ou a été supprimée.
                </p>
                <Link
                    href="/bourses"
                    className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                    Retour aux bourses
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <Link
                    href="/bourses"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    ← Retour aux bourses
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h1 className="text-3xl font-bold">{scholarship.name}</h1>
                        <div className="mt-2 md:mt-0">
                            {scholarship.is_active ? (
                                <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
                                    Active
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-medium">
                                    Inactive
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="flex items-center">
                            <CalendarIcon className="h-6 w-6 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Durée</p>
                                <p className="font-medium">{scholarship.duration} mois</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <CurrencyDollarIcon className="h-6 w-6 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Montant</p>
                                <p className="font-medium">
                                    {scholarship.amount.toLocaleString()} FCFA
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <ClockIcon className="h-6 w-6 text-orange-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Date de création</p>
                                <p className="font-medium">
                                    {new Date(scholarship.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <DocumentTextIcon className="h-6 w-6 text-purple-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Dernière mise à jour</p>
                                <p className="font-medium">
                                    {new Date(scholarship.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Description</h2>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-gray-700 whitespace-pre-line">
                                {scholarship.description}
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Conditions d'éligibilité</h2>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-gray-700 whitespace-pre-line">
                                {scholarship.requirements}
                            </p>
                        </div>
                    </div>

                    {scholarship.is_active ? (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            {session ? (
                                <Link
                                    href={`/candidatures/nouvelle?type=${scholarship.id}`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 text-center"
                                >
                                    Postuler à cette bourse
                                </Link>
                            ) : (
                                <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                                    <Link
                                        href="/auth/login"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 text-center"
                                    >
                                        Se connecter pour postuler
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors duration-300 text-center"
                                    >
                                        Créer un compte
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-8 text-center">
                            <p className="text-red-700">
                                Cette bourse n'est actuellement pas disponible pour les candidatures.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 