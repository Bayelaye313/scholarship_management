"use client";

import { useState } from 'react';
import AccessibilityTools from './AccessibilityTools';
import LanguageSwitcher from './LanguageSwitcher';
import { UserIcon, AdjustmentsHorizontalIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

export default function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleWidget = () => {
        setIsOpen(!isOpen);
    };

    // Fonction pour activer le mode lecture vocale
    const activateScreenReader = () => {
        // Cette fonction est un exemple et ne fait rien de réel
        // Dans une implémentation réelle, vous pourriez intégrer une bibliothèque de synthèse vocale
        alert("Mode lecture vocale activé. Cette fonctionnalité nécessite une implémentation spécifique.");
    };

    // Fonction pour activer le mode navigation au clavier
    const activateKeyboardNavigation = () => {
        // Cette fonction est un exemple et ne fait rien de réel
        document.body.classList.toggle('keyboard-navigation-mode');
        alert("Mode navigation au clavier activé. Utilisez Tab pour naviguer et Entrée pour sélectionner.");
    };

    return (
        <>
            <button
                onClick={toggleWidget}
                className="fixed bottom-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Options d'accessibilité"
            >
                <UserIcon className="h-6 w-6" />
            </button>

            {isOpen && (
                <div className="fixed bottom-20 left-4 bg-white rounded-lg shadow-xl p-4 w-72 z-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Accessibilité</h3>
                        <button
                            onClick={toggleWidget}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Fermer"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Outils d'accessibilité intégrés */}
                        <div className="border-b pb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Affichage</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => document.documentElement.style.fontSize = '120%'}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm flex items-center justify-center"
                                >
                                    <span className="mr-1">A</span>+
                                </button>
                                <button
                                    onClick={() => document.documentElement.style.fontSize = '100%'}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm flex items-center justify-center"
                                >
                                    <span className="mr-1">A</span>-
                                </button>
                            </div>
                        </div>

                        {/* Outils d'assistance */}
                        <div className="border-b pb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Assistance</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={activateScreenReader}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm flex items-center"
                                >
                                    <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                                    Lecture vocale
                                </button>
                                <button
                                    onClick={activateKeyboardNavigation}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm flex items-center"
                                >
                                    <ArrowsPointingOutIcon className="h-4 w-4 mr-2" />
                                    Navigation au clavier
                                </button>
                            </div>
                        </div>

                        {/* Sélecteur de langue */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Langue</h4>
                            <div className="bg-gray-50 rounded p-2">
                                <LanguageSwitcher />
                            </div>
                        </div>

                        {/* Lien vers la page d'accessibilité */}
                        <div className="text-center">
                            <a
                                href="/accessibilite"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                Politique d'accessibilité
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Composant AccessibilityTools séparé pour les paramètres avancés */}
            <AccessibilityTools />
        </>
    );
} 