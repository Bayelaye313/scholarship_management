"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
    scholarshipTypeService,
    applicationService,
    ScholarshipType,
} from "../../../services/api";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon, ArrowRightIcon, DocumentCheckIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

const applicationSchema = z.object({
    full_name: z.string().min(1, "Le nom complet est requis"),
    email: z.string().email("Veuillez entrer une adresse email valide"),
    date_of_birth: z.string().min(1, "La date de naissance est requise"),
    gender: z.string().min(1, "Le genre est requis"),
    phone_number: z.string().min(1, "Le numéro de téléphone est requis"),
    address: z.string().min(1, "L'adresse est requise"),
    scholarship_type_id: z.string().min(1, "Le type de bourse est requis"),
    current_institution: z.string().min(1, "L'établissement actuel est requis"),
    field_of_study: z.string().min(1, "Le domaine d'études est requis"),
    current_year: z.string().min(1, "L'année d'études actuelle est requise"),
    average_grade: z
        .string()
        .min(1, "La moyenne générale est requise")
        .refine((val) => !isNaN(parseFloat(val)), "Doit être un nombre")
        .refine(
            (val) => parseFloat(val) >= 0 && parseFloat(val) <= 20,
            "La moyenne doit être comprise entre 0 et 20"
        ),
    bac_mention: z.string().min(1, "La mention au bac est requise"),
    family_income: z
        .string()
        .min(1, "Les revenus familiaux sont requis")
        .refine((val) => !isNaN(parseInt(val)), "Doit être un nombre"),
    number_of_dependents: z
        .string()
        .min(1, "Le nombre de personnes à charge est requis")
        .refine((val) => !isNaN(parseInt(val)), "Doit être un nombre"),
    is_handicapped: z.boolean().optional(),
    motivation: z.string().min(50, "La lettre de motivation doit contenir au moins 50 caractères"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function NouvelleCandiaturePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const [scholarshipTypes, setScholarshipTypes] = useState<ScholarshipType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [transcriptsFile, setTranscriptsFile] = useState<File | null>(null);
    const [recommendationFile, setRecommendationFile] = useState<File | null>(null);
    const [additionalFile, setAdditionalFile] = useState<File | null>(null);

    // État pour la progression du formulaire
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    // État pour le brouillon
    const [draftSaved, setDraftSaved] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        trigger,
        formState: { errors, isValid },
    } = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        mode: "onChange"
    });

    // Observer les valeurs du formulaire pour la sauvegarde automatique
    const formValues = watch();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
            return;
        }

        const fetchScholarshipTypes = async () => {
            try {
                const data = await scholarshipTypeService.getAll();
                setScholarshipTypes(data.filter((type) => type.is_active));
                setIsLoading(false);

                // Pré-remplir le type de bourse si spécifié dans l'URL
                const typeId = searchParams.get("type");
                if (typeId) {
                    setValue("scholarship_type_id", typeId);
                }

                // Pré-remplir les informations de l'utilisateur connecté
                if (session?.user) {
                    setValue("email", session.user.email || "");
                    // Si l'utilisateur a un nom complet, le pré-remplir
                    if (session.user.name) {
                        setValue("full_name", session.user.name);
                    }
                }

                // Charger le brouillon s'il existe
                loadDraft();
            } catch (error) {
                toast.error("Erreur lors du chargement des types de bourses");
                console.error("Erreur:", error);
                setIsLoading(false);
            }
        };

        fetchScholarshipTypes();
    }, [status, router, searchParams, session, setValue]);

    // Charger le brouillon depuis le localStorage
    const loadDraft = () => {
        try {
            const savedDraft = localStorage.getItem('applicationDraft');
            if (savedDraft) {
                const draftData = JSON.parse(savedDraft);

                // Remplir le formulaire avec les données du brouillon
                Object.keys(draftData.formData).forEach(key => {
                    setValue(key as keyof ApplicationFormData, draftData.formData[key]);
                });

                // Mettre à jour la date de dernière sauvegarde
                setLastSaved(draftData.timestamp);
                setDraftSaved(true);

                toast.info("Brouillon chargé avec succès");
            }
        } catch (error) {
            console.error("Erreur lors du chargement du brouillon:", error);
        }
    };

    // Sauvegarder le brouillon dans le localStorage
    const saveDraft = async () => {
        setIsSavingDraft(true);

        try {
            const timestamp = new Date().toLocaleString();
            const draftData = {
                formData: formValues,
                timestamp
            };

            localStorage.setItem('applicationDraft', JSON.stringify(draftData));
            setLastSaved(timestamp);
            setDraftSaved(true);
            toast.success("Brouillon sauvegardé");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du brouillon:", error);
            toast.error("Erreur lors de la sauvegarde du brouillon");
        } finally {
            setIsSavingDraft(false);
        }
    };

    // Supprimer le brouillon
    const deleteDraft = () => {
        try {
            localStorage.removeItem('applicationDraft');
            setDraftSaved(false);
            setLastSaved(null);
            toast.info("Brouillon supprimé");
        } catch (error) {
            console.error("Erreur lors de la suppression du brouillon:", error);
        }
    };

    // Sauvegarde automatique toutes les 2 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            if (Object.keys(formValues).length > 0) {
                saveDraft();
            }
        }, 120000); // 2 minutes

        return () => clearInterval(interval);
    }, [formValues]);

    // Gérer le changement d'étape
    const goToNextStep = async () => {
        // Valider les champs de l'étape actuelle avant de passer à la suivante
        let fieldsToValidate: (keyof ApplicationFormData)[] = [];

        switch (currentStep) {
            case 1:
                fieldsToValidate = ['full_name', 'email', 'date_of_birth', 'gender', 'phone_number', 'address'];
                break;
            case 2:
                fieldsToValidate = ['scholarship_type_id', 'current_institution', 'field_of_study', 'current_year'];
                break;
            case 3:
                fieldsToValidate = ['average_grade', 'bac_mention', 'family_income', 'number_of_dependents', 'is_handicapped'];
                break;
            case 4:
                fieldsToValidate = ['motivation'];
                break;
        }

        const isStepValid = await trigger(fieldsToValidate);

        if (isStepValid) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
            window.scrollTo(0, 0);
            saveDraft();
        } else {
            toast.error("Veuillez corriger les erreurs avant de continuer");
        }
    };

    const goToPreviousStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const onSubmit = async (data: ApplicationFormData) => {
        if (!cvFile) {
            toast.error("Veuillez télécharger votre CV");
            return;
        }

        if (!transcriptsFile) {
            toast.error("Veuillez télécharger vos relevés de notes");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Ajouter les champs textuels
            Object.keys(data).forEach((key) => {
                if (key === "is_handicapped") {
                    formData.append(key, data[key as keyof ApplicationFormData] ? "true" : "false");
                } else {
                    formData.append(key, String(data[key as keyof ApplicationFormData]));
                }
            });

            // Ajouter les fichiers
            formData.append("cv", cvFile);
            formData.append("transcripts", transcriptsFile);

            if (recommendationFile) {
                formData.append("recommendation_letter", recommendationFile);
            }

            if (additionalFile) {
                formData.append("additional_documents", additionalFile);
            }

            await applicationService.create(formData);

            toast.success("Candidature soumise avec succès !");
            // Supprimer le brouillon après soumission réussie
            deleteDraft();
            router.push("/candidatures");
        } catch (error: any) {
            if (error.response?.data) {
                // Afficher les erreurs spécifiques du serveur
                const serverErrors = error.response.data;
                Object.keys(serverErrors).forEach((key) => {
                    toast.error(`${key}: ${serverErrors[key]}`);
                });
            } else {
                toast.error("Une erreur est survenue lors de la soumission de votre candidature");
            }
            console.error("Erreur:", error);
        } finally {
            setIsSubmitting(false);
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
            <div className="mb-6">
                <Link
                    href="/candidatures"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    ← Retour aux candidatures
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h1 className="text-3xl font-bold">Nouvelle Candidature</h1>

                        {/* Indicateur de brouillon */}
                        {draftSaved && (
                            <div className="mt-2 md:mt-0 text-sm text-gray-600">
                                Dernière sauvegarde: {lastSaved}
                                <button
                                    onClick={deleteDraft}
                                    className="ml-2 text-red-600 hover:text-red-800"
                                >
                                    Supprimer le brouillon
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Barre de progression */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {Array.from({ length: totalSteps }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep > index + 1
                                            ? 'bg-green-500 text-white'
                                            : currentStep === index + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {currentStep > index + 1 ? (
                                        <CheckCircleIcon className="w-6 h-6" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                <div
                                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                                ></div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                            <div>Informations personnelles</div>
                            <div>Informations académiques</div>
                            <div>Situation socio-économique</div>
                            <div>Documents et motivation</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Étape 1: Informations personnelles */}
                        {currentStep === 1 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                                    Informations personnelles
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="full_name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Nom complet *
                                        </label>
                                        <input
                                            id="full_name"
                                            type="text"
                                            {...register("full_name")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.full_name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.full_name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Email *
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="date_of_birth"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Date de naissance *
                                        </label>
                                        <input
                                            id="date_of_birth"
                                            type="date"
                                            {...register("date_of_birth")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.date_of_birth && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.date_of_birth.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="gender"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Genre *
                                        </label>
                                        <select
                                            id="gender"
                                            {...register("gender")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionnez votre genre</option>
                                            <option value="M">Masculin</option>
                                            <option value="F">Féminin</option>
                                            <option value="O">Autre</option>
                                        </select>
                                        {errors.gender && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.gender.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone_number"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Numéro de téléphone *
                                        </label>
                                        <input
                                            id="phone_number"
                                            type="tel"
                                            {...register("phone_number")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.phone_number && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.phone_number.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="address"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Adresse *
                                        </label>
                                        <textarea
                                            id="address"
                                            {...register("address")}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        ></textarea>
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Étape 2: Informations académiques */}
                        {currentStep === 2 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                                    Informations académiques
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="scholarship_type_id"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Type de bourse *
                                        </label>
                                        <select
                                            id="scholarship_type_id"
                                            {...register("scholarship_type_id")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionnez un type de bourse</option>
                                            {scholarshipTypes.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.scholarship_type_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.scholarship_type_id.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="current_institution"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Établissement actuel *
                                        </label>
                                        <input
                                            id="current_institution"
                                            type="text"
                                            {...register("current_institution")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.current_institution && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.current_institution.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="field_of_study"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Domaine d'études *
                                        </label>
                                        <input
                                            id="field_of_study"
                                            type="text"
                                            {...register("field_of_study")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.field_of_study && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.field_of_study.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="current_year"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Année d'études actuelle *
                                        </label>
                                        <select
                                            id="current_year"
                                            {...register("current_year")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionnez votre année d'études</option>
                                            <option value="1">1ère année</option>
                                            <option value="2">2ème année</option>
                                            <option value="3">3ème année</option>
                                            <option value="4">4ème année</option>
                                            <option value="5">5ème année</option>
                                            <option value="6">6ème année et plus</option>
                                        </select>
                                        {errors.current_year && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.current_year.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Étape 3: Situation socio-économique */}
                        {currentStep === 3 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                                    Situation socio-économique
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="average_grade"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Moyenne générale (sur 20) *
                                        </label>
                                        <input
                                            id="average_grade"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="20"
                                            {...register("average_grade")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.average_grade && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.average_grade.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="bac_mention"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Mention au bac *
                                        </label>
                                        <select
                                            id="bac_mention"
                                            {...register("bac_mention")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionnez votre mention</option>
                                            <option value="P">Passable</option>
                                            <option value="AB">Assez Bien</option>
                                            <option value="B">Bien</option>
                                            <option value="TB">Très Bien</option>
                                        </select>
                                        {errors.bac_mention && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.bac_mention.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="family_income"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Revenus familiaux annuels (FCFA) *
                                        </label>
                                        <input
                                            id="family_income"
                                            type="number"
                                            min="0"
                                            {...register("family_income")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.family_income && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.family_income.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="number_of_dependents"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Nombre de personnes à charge *
                                        </label>
                                        <input
                                            id="number_of_dependents"
                                            type="number"
                                            min="0"
                                            {...register("number_of_dependents")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.number_of_dependents && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.number_of_dependents.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center">
                                            <input
                                                id="is_handicapped"
                                                type="checkbox"
                                                {...register("is_handicapped")}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label
                                                htmlFor="is_handicapped"
                                                className="ml-2 block text-sm text-gray-700"
                                            >
                                                Je suis en situation de handicap
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Étape 4: Documents et motivation */}
                        {currentStep === 4 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                                    Documents et motivation
                                </h2>

                                <div className="mb-6">
                                    <label
                                        htmlFor="motivation"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Lettre de motivation *
                                    </label>
                                    <textarea
                                        id="motivation"
                                        rows={6}
                                        {...register("motivation")}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Expliquez pourquoi vous méritez cette bourse..."
                                    ></textarea>
                                    {errors.motivation && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.motivation.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CV (PDF) *
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                                className="hidden"
                                                id="cv-upload"
                                            />
                                            <label
                                                htmlFor="cv-upload"
                                                className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                                            >
                                                <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-gray-500" />
                                                {cvFile ? "Changer de fichier" : "Télécharger un fichier"}
                                            </label>
                                            {cvFile && (
                                                <span className="ml-2 text-sm text-gray-600">
                                                    {cvFile.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Relevés de notes (PDF) *
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => setTranscriptsFile(e.target.files?.[0] || null)}
                                                className="hidden"
                                                id="transcripts-upload"
                                            />
                                            <label
                                                htmlFor="transcripts-upload"
                                                className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                                            >
                                                <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-gray-500" />
                                                {transcriptsFile ? "Changer de fichier" : "Télécharger un fichier"}
                                            </label>
                                            {transcriptsFile && (
                                                <span className="ml-2 text-sm text-gray-600">
                                                    {transcriptsFile.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="recommendation_letter"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Lettre de recommandation (PDF, optionnel)
                                        </label>
                                        <input
                                            id="recommendation_letter"
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setRecommendationFile(e.target.files?.[0] || null)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="additional_documents"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Documents supplémentaires (PDF, optionnel)
                                        </label>
                                        <input
                                            id="additional_documents"
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setAdditionalFile(e.target.files?.[0] || null)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Boutons de navigation et soumission */}
                        <div className="flex justify-between pt-4 border-t">
                            <div>
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={goToPreviousStep}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300 flex items-center"
                                    >
                                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                        Précédent
                                    </button>
                                )}
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={saveDraft}
                                    disabled={isSavingDraft}
                                    className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-300 flex items-center"
                                >
                                    <DocumentCheckIcon className="h-4 w-4 mr-2" />
                                    {isSavingDraft ? "Sauvegarde..." : "Sauvegarder le brouillon"}
                                </button>

                                {currentStep < totalSteps ? (
                                    <button
                                        type="button"
                                        onClick={goToNextStep}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center"
                                    >
                                        Suivant
                                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
                                    >
                                        {isSubmitting ? "Soumission en cours..." : "Soumettre la candidature"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 