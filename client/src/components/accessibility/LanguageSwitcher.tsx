"use client";

import { useState, useEffect } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

// Langues disponibles
const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true }
];

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('fr');

    // Charger la langue au démarrage
    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) {
            setCurrentLang(savedLang);
            applyLanguage(savedLang);
        }
    }, []);

    // Appliquer la langue
    const applyLanguage = (langCode: string) => {
        const lang = languages.find(l => l.code === langCode);
        if (lang) {
            // Définir la direction du texte (RTL pour l'arabe)
            if (lang.rtl) {
                document.documentElement.dir = 'rtl';
                document.documentElement.classList.add('rtl');
            } else {
                document.documentElement.dir = 'ltr';
                document.documentElement.classList.remove('rtl');
            }

            // Définir l'attribut lang du HTML
            document.documentElement.lang = langCode;

            // Dans une application réelle, vous chargeriez ici les traductions
            // et mettriez à jour l'interface utilisateur
        }
    };

    // Changer la langue
    const changeLanguage = (langCode: string) => {
        setCurrentLang(langCode);
        localStorage.setItem('app_language', langCode);
        applyLanguage(langCode);
        setIsOpen(false);
    };

    // Obtenir la langue actuelle
    const getCurrentLanguage = () => {
        return languages.find(l => l.code === currentLang) || languages[0];
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Changer de langue"
            >
                <GlobeAltIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm">{getCurrentLanguage().flag}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`flex items-center w-full px-4 py-2 text-sm ${currentLang === lang.code ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="mr-2">{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 