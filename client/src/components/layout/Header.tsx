"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NotificationDropdown from "../notifications/NotificationDropdown";

export default function Header() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const isAdmin = session?.user?.isAdmin;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-sky-800 shadow-md" : "bg-sky-900"
                }`}
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-white text-xl font-bold">
                        Bourses d'Études
                    </Link>

                    {/* Navigation desktop */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/bourses"
                            className="text-white hover:text-blue-200 transition duration-300"
                        >
                            Bourses
                        </Link>

                        {isAuthenticated && (
                            <Link
                                href="/candidatures"
                                className="text-white hover:text-blue-200 transition duration-300"
                            >
                                Mes Candidatures
                            </Link>
                        )}

                        {isAdmin && (
                            <Link
                                href="/admin/dashboard"
                                className="text-white hover:text-blue-200 transition duration-300"
                            >
                                Administration
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {/* Composant de notifications */}
                                <NotificationDropdown />

                                <div className="relative group">
                                    <button className="flex items-center text-white hover:text-blue-200 transition duration-300">
                                        <span className="mr-1">{session?.user?.name || "Utilisateur"}</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            Tableau de bord
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            Mon profil
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/auth/login"
                                    className="text-white hover:text-blue-200 transition duration-300"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-sky-100 transition duration-300"
                                >
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Bouton menu mobile */}
                    <button
                        className="md:hidden text-white"
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    >
                        {isMenuOpen ? (
                            <XMarkIcon className="h-6 w-6" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" />
                        )}
                    </button>

                    {/* Menu mobile */}
                    {isMenuOpen && (
                        <div className="absolute top-full left-0 right-0 bg-blue-800 md:hidden">
                            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                                <Link
                                    href="/bourses"
                                    className="text-white hover:text-blue-200 transition duration-300"
                                    onClick={toggleMenu}
                                >
                                    Bourses
                                </Link>

                                {isAuthenticated && (
                                    <Link
                                        href="/candidatures"
                                        className="text-white hover:text-blue-200 transition duration-300"
                                        onClick={toggleMenu}
                                    >
                                        Mes Candidatures
                                    </Link>
                                )}

                                {isAdmin && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="text-white hover:text-blue-200 transition duration-300"
                                        onClick={toggleMenu}
                                    >
                                        Administration
                                    </Link>
                                )}

                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            className="text-white hover:text-blue-200 transition duration-300"
                                            onClick={toggleMenu}
                                        >
                                            Tableau de bord
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="text-white hover:text-blue-200 transition duration-300"
                                            onClick={toggleMenu}
                                        >
                                            Mon profil
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="block w-full text-left hover:text-blue-200 transition duration-300"
                                        >
                                            Déconnexion
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/auth/login"
                                            className="block hover:text-blue-200 transition duration-300"
                                            onClick={toggleMenu}
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href="/auth/register"
                                            className="block bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-sky-100 transition duration-300 inline-block"
                                            onClick={toggleMenu}
                                        >
                                            Inscription
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
} 