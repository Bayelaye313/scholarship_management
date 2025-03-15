"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { applicationService, ScholarshipApplication } from "../../services/api";
import { toast } from "react-toastify";
import {
    ClipboardDocumentListIcon,
    BellIcon,
    ChartBarIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchApplications = async () => {
            if (status === "authenticated") {
                try {
                    // Utiliser getAll pour obtenir toutes les candidatures, puis filtrer celles de l'utilisateur actuel
                    const data = await applicationService.getAll();
                    // Filtrer les candidatures de l'utilisateur actuel
                    const userApplications = data.filter(app => app.user.id === session?.user?.id);
                    setApplications(userApplications);
                } catch (error) {
                    toast.error("Erreur lors du chargement des candidatures");
                    console.error("Erreur:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchApplications();
    }, [status, session?.user?.id]);

    if (status === "loading" || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null; // Ne rien afficher pendant la redirection
    }

    // Statistiques des candidatures
    const pendingCount = applications.filter(app => app.status === "pending").length;
    const approvedCount = applications.filter(app => app.status === "approved").length;
    const rejectedCount = applications.filter(app => app.status === "rejected").length;

    // Obtenir les 3 candidatures les plus récentes
    const recentApplications = [...applications]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
                    <p className="text-gray-600">
                        Bienvenue, {session?.user?.name || "Utilisateur"} ! Gérez vos candidatures et suivez leur statut.
                    </p>
                </div>
                <Link
                    href="/candidatures/nouvelle"
                    className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
                >
                    Nouvelle candidature
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold">Candidatures</h2>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
                            <p className="text-sm text-gray-500">Total</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
                            <p className="text-sm text-gray-500">En attente</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                            <p className="text-sm text-gray-500">Approuvées</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        <div className="bg-yellow-100 p-3 rounded-full mr-4">
                            <BellIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h2 className="text-xl font-semibold">Notifications</h2>
                    </div>
                    <div className="space-y-2">
                        {applications.length > 0 ? (
                            <>
                                <p className="text-sm text-gray-600">
                                    Vous avez {pendingCount} candidature(s) en attente de décision.
                                </p>
                                {approvedCount > 0 && (
                                    <p className="text-sm text-green-600">
                                        Félicitations ! {approvedCount} de vos candidatures ont été approuvées.
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-gray-600">
                                Vous n'avez pas encore soumis de candidature. Commencez dès maintenant !
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        <div className="bg-green-100 p-3 rounded-full mr-4">
                            <ChartBarIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold">Activité</h2>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            Dernière connexion: {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                            Candidatures ce mois-ci: {applications.filter(app => {
                                const appDate = new Date(app.created_at);
                                const currentDate = new Date();
                                return appDate.getMonth() === currentDate.getMonth() &&
                                    appDate.getFullYear() === currentDate.getFullYear();
                            }).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Candidatures récentes */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Candidatures récentes</h2>
                    <Link
                        href="/candidatures"
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                        Voir toutes
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                {recentApplications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bourse
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date de soumission
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentApplications.map((application) => (
                                    <tr key={application.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {application.scholarship_type.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {new Date(application.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${application.status === "approved"
                                                    ? "bg-green-100 text-green-800"
                                                    : application.status === "rejected"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {application.status === "approved"
                                                    ? "Approuvée"
                                                    : application.status === "rejected"
                                                        ? "Rejetée"
                                                        : "En attente"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Link
                                                href={`/candidatures/${application.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Détails
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">Vous n'avez pas encore soumis de candidature.</p>
                        <Link
                            href="/bourses"
                            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                        >
                            Parcourir les bourses disponibles
                        </Link>
                    </div>
                )}
            </div>

            {/* Bourses recommandées */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-6">Bourses recommandées pour vous</h2>
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                        Nous préparons des recommandations personnalisées basées sur votre profil.
                    </p>
                    <Link
                        href="/bourses"
                        className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                    >
                        Voir toutes les bourses disponibles
                    </Link>
                </div>
            </div>
        </div>
    );
} 