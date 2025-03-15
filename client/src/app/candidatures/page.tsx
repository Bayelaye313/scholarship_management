"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { applicationService, ScholarshipApplication } from "../../services/api";
import { toast } from "react-toastify";
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    DocumentTextIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

export default function CandidaturesPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
            return;
        }

        if (status === "authenticated") {
            fetchApplications();
        }
    }, [status, router]);

    const fetchApplications = async () => {
        try {
            const data = await applicationService.getAll();
            setApplications(data);
        } catch (error) {
            toast.error("Erreur lors du chargement des candidatures");
            console.error("Erreur:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "accepted":
                return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
            case "rejected":
                return <XCircleIcon className="h-6 w-6 text-red-500" />;
            case "under_review":
                return <DocumentTextIcon className="h-6 w-6 text-blue-500" />;
            default:
                return <ClockIcon className="h-6 w-6 text-yellow-500" />;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "accepted":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            case "under_review":
                return "bg-blue-100 text-blue-800";
            case "waiting_list":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Mes Candidatures</h1>
                <Link
                    href="/candidatures/nouvelle"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-300"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nouvelle candidature
                </Link>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Aucune candidature</h2>
                    <p className="text-gray-600 mb-6">
                        Vous n'avez pas encore soumis de candidature pour une bourse.
                    </p>
                    <Link
                        href="/bourses"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-300"
                    >
                        Découvrir les bourses disponibles
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {applications.map((application) => (
                        <div
                            key={application.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                    <h2 className="text-xl font-semibold">
                                        {application.scholarship_type.name}
                                    </h2>
                                    <div
                                        className={`mt-2 md:mt-0 px-4 py-1 rounded-full text-sm font-medium flex items-center ${getStatusClass(
                                            application.status
                                        )}`}
                                    >
                                        {getStatusIcon(application.status)}
                                        <span className="ml-2">{application.status_display}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Date de soumission</p>
                                        <p className="font-medium">
                                            {new Date(application.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Montant</p>
                                        <p className="font-medium">
                                            {application.scholarship_type.amount.toLocaleString()} FCFA
                                        </p>
                                    </div>
                                    {application.score && (
                                        <div>
                                            <p className="text-sm text-gray-500">Score</p>
                                            <p className="font-medium">{application.score}/100</p>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={`/candidatures/${application.id}`}
                                    className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-300"
                                >
                                    Voir les détails
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 