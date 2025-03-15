"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
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
    ArrowPathIcon,
    ChatBubbleLeftRightIcon,
    SparklesIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import AIEvaluationCard from '../../../../components/AIEvaluationCard';
import applicationService, { Application, Comment } from '../../../../services/applicationService';

export default function AdminApplicationDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [application, setApplication] = useState<Application | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [adminNotes, setAdminNotes] = useState("");
    const [aiEvaluating, setAiEvaluating] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated" && session?.user && !session.user.isAdmin) {
            router.push("/dashboard");
            return;
        }

        if (status === "authenticated") {
            fetchApplicationDetails();
        }
    }, [status, session, params.id]);

    const fetchApplicationDetails = async () => {
        try {
            setLoading(true);
            const applicationData = await applicationService.getById(parseInt(params.id));
            setApplication(applicationData);
            setAdminNotes(applicationData.admin_notes || "");

            const commentsData = await applicationService.getComments(parseInt(params.id));
            setComments(commentsData);
        } catch (error) {
            toast.error("Erreur lors du chargement des détails de la candidature");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            setCommentLoading(true);
            const comment = await applicationService.addComment(parseInt(params.id), newComment);
            setComments([...comments, comment]);
            setNewComment("");
            toast.success("Commentaire ajouté avec succès");
        } catch (error) {
            toast.error("Erreur lors de l'ajout du commentaire");
            console.error(error);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleStatusUpdate = async (status: string) => {
        try {
            setLoading(true);
            const updatedApplication = await applicationService.updateStatus(parseInt(params.id), status);
            setApplication(updatedApplication);
            toast.success(`Statut mis à jour: ${getStatusLabel(status)}`);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du statut");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminNotesUpdate = async () => {
        try {
            setLoading(true);
            const updatedApplication = await applicationService.updateAdminNotes(parseInt(params.id), adminNotes);
            setApplication(updatedApplication);
            toast.success("Notes administratives mises à jour");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour des notes");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAIEvaluation = async () => {
        if (!application) return;

        try {
            setAiEvaluating(true);
            const updatedApplication = await applicationService.evaluateWithAI(application.id);
            setApplication(updatedApplication);
            toast.success("Évaluation IA terminée avec succès");
        } catch (error) {
            toast.error("Erreur lors de l'évaluation IA");
            console.error(error);
        } finally {
            setAiEvaluating(false);
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "pending":
                return "En attente";
            case "under_review":
                return "En cours d'examen";
            case "accepted":
                return "Acceptée";
            case "rejected":
                return "Rejetée";
            case "waiting_list":
                return "Liste d'attente";
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case "under_review":
                return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
            case "accepted":
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case "rejected":
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case "waiting_list":
                return <ClockIcon className="h-5 w-5 text-purple-500" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!application) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    Candidature non trouvée
                </div>
                <div className="mt-4">
                    <Link href="/admin/dashboard" className="text-blue-600 hover:underline flex items-center">
                        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Retour au tableau de bord
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/dashboard" className="text-blue-600 hover:underline flex items-center">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" /> Retour au tableau de bord
                </Link>
                <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <span className="font-medium">{getStatusLabel(application.status)}</span>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Candidature de {application.full_name}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h2 className="text-lg font-semibold mb-3 flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-gray-600" />
                                Informations personnelles
                            </h2>
                            <div className="space-y-2">
                                <p><span className="font-medium">Nom complet:</span> {application.full_name}</p>
                                <p><span className="font-medium">Email:</span> {application.email}</p>
                                <p><span className="font-medium">Téléphone:</span> {application.phone}</p>
                                <p><span className="font-medium">Date de naissance:</span> {application.date_of_birth ? new Date(application.date_of_birth).toLocaleDateString() : 'Non spécifiée'}</p>
                                <p><span className="font-medium">Adresse:</span> {application.address}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h2 className="text-lg font-semibold mb-3 flex items-center">
                                <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-600" />
                                Informations académiques
                            </h2>
                            <div className="space-y-2">
                                <p><span className="font-medium">Type de bourse:</span> {application.scholarship_type_name}</p>
                                <p><span className="font-medium">Institution actuelle:</span> {application.current_institution}</p>
                                <p><span className="font-medium">Année d'études:</span> {application.current_year}</p>
                                <p><span className="font-medium">Moyenne générale:</span> {application.average_grade}</p>
                                <p><span className="font-medium">Mention au baccalauréat:</span> {application.baccalaureate_mention}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h2 className="text-lg font-semibold mb-3 flex items-center">
                                <HomeIcon className="h-5 w-5 mr-2 text-gray-600" />
                                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-600" />
                                Informations socio-économiques
                            </h2>
                            <div className="space-y-2">
                                <p><span className="font-medium">Revenu familial:</span> {application.family_income} FCFA</p>
                                <p><span className="font-medium">Nombre de personnes à charge:</span> {application.number_of_dependents}</p>
                                <p><span className="font-medium">Situation de handicap:</span> {application.has_disability ? 'Oui' : 'Non'}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h2 className="text-lg font-semibold mb-3 flex items-center">
                                <PaperClipIcon className="h-5 w-5 mr-2 text-gray-600" />
                                Documents
                            </h2>
                            <div className="space-y-2">
                                {application.cv_file && (
                                    <p>
                                        <a
                                            href={application.cv_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            CV
                                        </a>
                                    </p>
                                )}
                                {application.transcript_file && (
                                    <p>
                                        <a
                                            href={application.transcript_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Relevé de notes
                                        </a>
                                    </p>
                                )}
                                {application.recommendation_letter_file && (
                                    <p>
                                        <a
                                            href={application.recommendation_letter_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Lettre de recommandation
                                        </a>
                                    </p>
                                )}
                                {application.other_documents_file && (
                                    <p>
                                        <a
                                            href={application.other_documents_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Autres documents
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">Lettre de motivation</h2>
                        <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                            {application.motivation_letter}
                        </div>
                    </div>

                    <div className="mb-6">
                        <AIEvaluationCard
                            application={application}
                            onEvaluate={handleAIEvaluation}
                            isEvaluating={aiEvaluating}
                        />
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">Notes administratives</h2>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md"
                            rows={4}
                            placeholder="Ajouter des notes administratives (visibles uniquement par les administrateurs)"
                        ></textarea>
                        <button
                            onClick={handleAdminNotesUpdate}
                            className="mt-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                        >
                            Enregistrer les notes
                        </button>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">Changer le statut</h2>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleStatusUpdate("pending")}
                                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 flex items-center"
                                disabled={application.status === "pending"}
                            >
                                <ClockIcon className="h-5 w-5 mr-1" />
                                En attente
                            </button>
                            <button
                                onClick={() => handleStatusUpdate("under_review")}
                                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 flex items-center"
                                disabled={application.status === "under_review"}
                            >
                                <DocumentTextIcon className="h-5 w-5 mr-1" />
                                En cours d'examen
                            </button>
                            <button
                                onClick={() => handleStatusUpdate("accepted")}
                                className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 flex items-center"
                                disabled={application.status === "accepted"}
                            >
                                <CheckCircleIcon className="h-5 w-5 mr-1" />
                                Acceptée
                            </button>
                            <button
                                onClick={() => handleStatusUpdate("rejected")}
                                className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 flex items-center"
                                disabled={application.status === "rejected"}
                            >
                                <XCircleIcon className="h-5 w-5 mr-1" />
                                Rejetée
                            </button>
                            <button
                                onClick={() => handleStatusUpdate("waiting_list")}
                                className="px-4 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 flex items-center"
                                disabled={application.status === "waiting_list"}
                            >
                                <ClockIcon className="h-5 w-5 mr-1" />
                                Liste d'attente
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-gray-600" />
                        Commentaires ({comments.length})
                    </h2>

                    <div className="mb-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md"
                            rows={3}
                            placeholder="Ajouter un commentaire..."
                        ></textarea>
                        <button
                            onClick={handleAddComment}
                            disabled={commentLoading || !newComment.trim()}
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                        >
                            {commentLoading ? 'Envoi...' : 'Ajouter un commentaire'}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 italic">Aucun commentaire pour le moment</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="border-b border-gray-200 pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="font-medium">{comment.user_name || 'Utilisateur'}</div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(comment.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="mt-1">{comment.content}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 