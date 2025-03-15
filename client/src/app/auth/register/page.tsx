"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axios from "axios";
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
            .max(150, "Le nom d'utilisateur ne peut pas dépasser 150 caractères"),
        email: z.string().email("Veuillez entrer une adresse email valide"),
        first_name: z.string().min(1, "Le prénom est requis"),
        last_name: z.string().min(1, "Le nom est requis"),
        password: z
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères")
            .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
            .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
            .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
        password_confirm: z.string(),
    })
    .refine((data) => data.password === data.password_confirm, {
        message: "Les mots de passe ne correspondent pas",
        path: ["password_confirm"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordValue, setPasswordValue] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    // Observer la valeur du mot de passe
    const password = watch("password");

    // Calculer la force du mot de passe
    useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            setPasswordValue("");
            return;
        }

        setPasswordValue(password);
        let strength = 0;

        // Longueur minimale
        if (password.length >= 8) strength += 1;

        // Contient un chiffre
        if (/[0-9]/.test(password)) strength += 1;

        // Contient une majuscule
        if (/[A-Z]/.test(password)) strength += 1;

        // Contient un caractère spécial
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

        setPasswordStrength(strength);
    }, [password]);

    // Rediriger si l'utilisateur est déjà connecté
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/auth/register/`, {
                username: data.username,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                password: data.password,
                password_confirm: data.password_confirm,
            });

            toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            router.push("/auth/login");
        } catch (error: any) {
            if (error.response?.data) {
                // Afficher les erreurs spécifiques du serveur
                const serverErrors = error.response.data;
                Object.keys(serverErrors).forEach((key) => {
                    // Si l'erreur est un tableau, afficher chaque message
                    if (Array.isArray(serverErrors[key])) {
                        serverErrors[key].forEach((message: string) => {
                            toast.error(`${key}: ${message}`);
                        });
                    } else {
                        toast.error(`${key}: ${serverErrors[key]}`);
                    }
                });
            } else {
                toast.error("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Afficher un message de chargement pendant la vérification de l'authentification
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Ne pas afficher le formulaire si l'utilisateur est déjà connecté
    if (status === "authenticated") {
        return null;
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nom d'utilisateur
                        </label>
                        <input
                            id="username"
                            type="text"
                            {...register("username")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Choisissez un nom d'utilisateur"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre adresse email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="first_name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Prénom
                            </label>
                            <input
                                id="first_name"
                                type="text"
                                {...register("first_name")}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Prénom"
                            />
                            {errors.first_name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.first_name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="last_name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nom
                            </label>
                            <input
                                id="last_name"
                                type="text"
                                {...register("last_name")}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nom"
                            />
                            {errors.last_name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.last_name.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Choisissez un mot de passe"
                        />
                        {passwordValue && (
                            <div className="mt-2">
                                <div className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${passwordStrength === 0 ? 'bg-red-500 w-1/4' :
                                                passwordStrength === 1 ? 'bg-orange-500 w-2/4' :
                                                    passwordStrength === 2 ? 'bg-yellow-500 w-3/4' :
                                                        'bg-green-500 w-full'
                                                }`}
                                        ></div>
                                    </div>
                                    <span className="ml-2 text-xs text-gray-500">
                                        {passwordStrength === 0 ? 'Très faible' :
                                            passwordStrength === 1 ? 'Faible' :
                                                passwordStrength === 2 ? 'Moyen' :
                                                    passwordStrength === 3 ? 'Fort' : 'Très fort'}
                                    </span>
                                </div>
                            </div>
                        )}
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password_confirm"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Confirmer le mot de passe
                        </label>
                        <input
                            id="password_confirm"
                            type="password"
                            {...register("password_confirm")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirmez votre mot de passe"
                        />
                        {errors.password_confirm && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password_confirm.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-50"
                    >
                        {isLoading ? "Inscription en cours..." : "S'inscrire"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Vous avez déjà un compte ?{" "}
                        <Link
                            href="/auth/login"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
} 