"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { applicationService, ScholarshipApplication, ApplicationComment } from "../../../services/api";
import { toast } from "react-toastify";
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    DocumentTextIcon,
    UserIcon,
    AcademicCapIcon,
    CurrencyDollarIcon,
    HomeIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarIcon,
    PaperClipIcon,
} from "@heroicons/react/24/outline";

export default function ApplicationDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [application, setApplication] = useState<ScholarshipApplication | null>(null);
    const [comments, setComments] = useState<ApplicationComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
            return;
        }

        if (status === "authenticated") {
            fetchApplication();
        }
    }, [status, router, params.id]);

    const fetchApplication = async () => {
        try {
            const data = await applicationService.getById(parseInt(params.id));
            setApplication(data);

            // Charger les commentaires
            const commentsData = await applicationService.getComments(parseInt(params.id));
            setComments(commentsData);
        } catch (error) {
            toast.error("Erreur lors du chargement de la candidature");
            console.error("Erreur:", error);
            router.push("/candidatures");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast.error("Le commentaire ne peut pas être vide");
            return;
        }

        setIsSubmittingComment(true);
        try {
            const comment = await applicationService.addComment(parseInt(params.id), newComment);
            setComments([...comments, comment]);
            setNewComment("");
            toast.success("Commentaire ajouté avec succès");
        } catch (error) {
            toast.error("Erreur lors de l'ajout du commentaire");
            console.error("Erreur:", error);
        } finally {
            setIsSubmittingComment(false);
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

    if (!application) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-700">
                    Candidature non trouvée
                </h2>
                <p className="mt-4 text-gray-600">
                    La candidature que vous recherchez n'existe pas ou a été supprimée.
                </p>
                <Link
                    href="/candidatures"
                    className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                    Retour aux candidatures
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <Link
                    href="/candidatures"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    ← Retour aux candidatures
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h1 className="text-3xl font-bold">
                            Candidature pour {application.scholarship_type.name}
                        </h1>
                        <div
                            className={`mt-2 md:mt-0 px-4 py-1 rounded-full text-sm font-medium flex items-center ${getStatusClass(
                                application.status
                            )}`}
                        >
                            {getStatusIcon(application.status)}
                            <span className="ml-2">{application.status_display}</span>
                        </div>
                    </div>

                    {/* Informations générales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="flex items-center">
                            <CalendarIcon className="h-6 w-6 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Date de soumission</p>
                                <p className="font-medium">
                                    {new Date(application.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <CurrencyDollarIcon className="h-6 w-6 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Montant de la bourse</p>
                                <p className="font-medium">
                                    {application.scholarship_type.amount.toLocaleString()} FCFA
                                </p>
                            </div>
                        </div>
                        {application.score && (
                            <div className="flex items-center">
                                <AcademicCapIcon className="h-6 w-6 text-purple-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Score</p>
                                    <p className="font-medium">{application.score}/100</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sections détaillées */}
                    <div className="space-y-8">
                        {/* Informations personnelles */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                                Informations personnelles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start">
                                    <UserIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Nom complet</p>
                                        <p className="font-medium">{application.full_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{application.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <CalendarIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date de naissance</p>
                                        <p className="font-medium">
                                            {application.date_of_birth && new Date(application.date_of_birth).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <UserIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Genre</p>
                                        <p className="font-medium">{application.gender_display}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <PhoneIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Téléphone</p>
                                        <p className="font-medium">{application.phone_number}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <HomeIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Adresse</p>
                                        <p className="font-medium">{application.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informations académiques */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                                Informations académiques
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Établissement actuel</p>
                                    <p className="font-medium">{application.current_institution}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Domaine d'études</p>
                                    <p className="font-medium">{application.field_of_study}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Année d'études</p>
                                    <p className="font-medium">{application.current_year}ème année</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Moyenne générale</p>
                                    <p className="font-medium">{application.average_grade}/20</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Mention au bac</p>
                                    <p className="font-medium">{application.bac_mention_display}</p>
                                </div>
                            </div>
                        </div>

                        {/* Informations socio-économiques */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                                Informations socio-économiques
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Revenus familiaux annuels</p>
                                    <p className="font-medium">{application.family_income?.toLocaleString()} FCFA</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nombre de personnes à charge</p>
                                    <p className="font-medium">{application.number_of_dependents}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Situation de handicap</p>
                                    <p className="font-medium">{application.is_handicapped ? "Oui" : "Non"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                                Documents
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {application.cv && (
                                    <a
                                        href={application.cv}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                                    >
                                        <PaperClipIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <span>CV</span>
                                    </a>
                                )}
                                {application.transcripts && (
                                    <a
                                        href={application.transcripts}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                                    >
                                        <PaperClipIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <span>Relevés de notes</span>
                                    </a>
                                )}
                                {application.recommendation_letter && (
                                    <a
                                        href={application.recommendation_letter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                                    >
                                        <PaperClipIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <span>Lettre de recommandation</span>
                                    </a>
                                )}
                                {application.additional_documents && (
                                    <a
                                        href={application.additional_documents}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                                    >
                                        <PaperClipIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <span>Documents supplémentaires</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Lettre de motivation */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                                Lettre de motivation
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-gray-700 whitespace-pre-line">
                                    {application.motivation}
                                </p>
                            </div>
                        </div>

                        {/* Évaluation IA */}
                        {application.recommendations && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                                    Évaluation IA
                                </h2>
                                <div className="bg-blue-50 p-4 rounded-md">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                            Score: {application.score}/100
                                        </div>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {application.recommendations}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section commentaires */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 md:p-8">
                    <h2 className="text-xl font-semibold mb-4">Commentaires</h2>

                    {/* Liste des commentaires */}
                    <div className="space-y-4 mb-6">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 italic">Aucun commentaire pour le moment.</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="border-b pb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-semibold">
                                                {comment.user.first_name?.[0] || comment.user.username[0]}
                                            </div>
                                            <div className="ml-2">
                                                <p className="font-medium">
                                                    {comment.user.first_name
                                                        ? `${comment.user.first_name} ${comment.user.last_name}`
                                                        : comment.user.username}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="text-gray-700">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Formulaire d'ajout de commentaire */}
                    <div>
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Ajouter un commentaire
                        </label>
                        <textarea
                            id="comment"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Votre commentaire..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <div className="mt-2 flex justify-end">
                            <button
                                onClick={handleAddComment}
                                disabled={isSubmittingComment || !newComment.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 disabled:opacity-50"
                            >
                                {isSubmittingComment ? "Envoi..." : "Ajouter"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 