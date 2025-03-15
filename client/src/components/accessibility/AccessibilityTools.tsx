"use client";

import { useState, useEffect } from 'react';
import { EyeIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function AccessibilityTools() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [highContrast, setHighContrast] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Charger les préférences d'accessibilité au démarrage
    useEffect(() => {
        const savedFontSize = localStorage.getItem('accessibility_fontSize');
        const savedHighContrast = localStorage.getItem('accessibility_highContrast');
        const savedDarkMode = localStorage.getItem('accessibility_darkMode');

        if (savedFontSize) setFontSize(parseInt(savedFontSize));
        if (savedHighContrast) setHighContrast(savedHighContrast === 'true');
        if (savedDarkMode) setDarkMode(savedDarkMode === 'true');

        // Appliquer les préférences
        applyAccessibilitySettings(
            savedFontSize ? parseInt(savedFontSize) : 100,
            savedHighContrast === 'true',
            savedDarkMode === 'true'
        );
    }, []);

    // Appliquer les paramètres d'accessibilité
    const applyAccessibilitySettings = (size: number, contrast: boolean, dark: boolean) => {
        // Taille de police
        document.documentElement.style.fontSize = `${size}%`;

        if (contrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }

        // Mode sombre
        if (dark) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    };

    // Changer la taille de police
    const changeFontSize = (size: number) => {
        const newSize = Math.max(80, Math.min(150, size));
        setFontSize(newSize);
        localStorage.setItem('accessibility_fontSize', newSize.toString());
        applyAccessibilitySettings(newSize, highContrast, darkMode);
    };

    // Activer/désactiver le contraste élevé
    const toggleHighContrast = () => {
        const newValue = !highContrast;
        setHighContrast(newValue);
        localStorage.setItem('accessibility_highContrast', newValue.toString());
        applyAccessibilitySettings(fontSize, newValue, darkMode);
    };

    // Activer/désactiver le mode sombre
    const toggleDarkMode = () => {
        const newValue = !darkMode;
        setDarkMode(newValue);
        localStorage.setItem('accessibility_darkMode', newValue.toString());
        applyAccessibilitySettings(fontSize, highContrast, newValue);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Options d'accessibilité"
            >
                <EyeIcon className="h-6 w-6" />
            </button>

            {isOpen && (
                <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-64">
                    <h3 className="text-lg font-semibold mb-3">Accessibilité</h3>

                    <div className="space-y-4">
                        {/* Taille de police */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Taille du texte
                            </label>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => changeFontSize(fontSize - 10)}
                                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                                    aria-label="Réduire la taille du texte"
                                >
                                    A-
                                </button>
                                <div className="flex-1 text-center">
                                    {fontSize}%
                                </div>
                                <button
                                    onClick={() => changeFontSize(fontSize + 10)}
                                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                                    aria-label="Augmenter la taille du texte"
                                >
                                    A+
                                </button>
                            </div>
                        </div>

                        {/* Contraste élevé */}
                        <div>
                            <button
                                onClick={toggleHighContrast}
                                className={`flex items-center space-x-2 w-full px-3 py-2 rounded ${highContrast ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                <SunIcon className="h-5 w-5" />
                                <span>Contraste élevé</span>
                                <div className={`ml-auto w-10 h-5 rounded-full ${highContrast ? 'bg-blue-600' : 'bg-gray-300'
                                    } relative`}>
                                    <div className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all ${highContrast ? 'right-0.5' : 'left-0.5'
                                        }`}></div>
                                </div>
                            </button>
                        </div>

                        {/* Mode sombre */}
                        <div>
                            <button
                                onClick={toggleDarkMode}
                                className={`flex items-center space-x-2 w-full px-3 py-2 rounded ${darkMode ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                <MoonIcon className="h-5 w-5" />
                                <span>Mode sombre</span>
                                <div className={`ml-auto w-10 h-5 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-gray-300'
                                    } relative`}>
                                    <div className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all ${darkMode ? 'right-0.5' : 'left-0.5'
                                        }`}></div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 