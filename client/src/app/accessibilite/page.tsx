"use client";

import Link from 'next/link';

export default function AccessibilityPage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Politique d'accessibilité</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <p className="mb-4">
                    Notre plateforme de gestion des bourses d'études s'engage à être accessible à tous les utilisateurs,
                    quelles que soient leurs capacités ou leur situation. Nous nous efforçons de respecter les normes
                    WCAG 2.1 niveau AA et de fournir une expérience utilisateur inclusive.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">Fonctionnalités d'accessibilité</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Affichage</h3>
                        <ul className="list-disc pl-6 mt-2">
                            <li>Ajustement de la taille du texte</li>
                            <li>Mode contraste élevé pour une meilleure lisibilité</li>
                            <li>Mode sombre pour réduire la fatigue oculaire</li>
                            <li>Mise en page responsive adaptée à tous les appareils</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium">Navigation</h3>
                        <ul className="list-disc pl-6 mt-2">
                            <li>Navigation au clavier complète</li>
                            <li>Raccourcis clavier pour les actions principales</li>
                            <li>Structure sémantique avec des repères ARIA</li>
                            <li>Liens d'évitement pour accéder directement au contenu principal</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium">Assistance</h3>
                        <ul className="list-disc pl-6 mt-2">
                            <li>Compatibilité avec les lecteurs d'écran</li>
                            <li>Descriptions alternatives pour les images</li>
                            <li>Formulaires accessibles avec étiquettes et instructions claires</li>
                            <li>Messages d'erreur explicites et suggestions de correction</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium">Langue</h3>
                        <ul className="list-disc pl-6 mt-2">
                            <li>Support multilingue (français, anglais, espagnol, arabe)</li>
                            <li>Prise en charge des langues de droite à gauche (RTL)</li>
                            <li>Contenu rédigé dans un langage clair et simple</li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mt-8 mb-3">Comment utiliser les fonctionnalités d'accessibilité</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Widget d'accessibilité</h3>
                        <p className="mt-2">
                            Notre widget d'accessibilité est disponible en bas à gauche de chaque page.
                            Cliquez sur l'icône pour accéder aux options d'accessibilité suivantes :
                        </p>
                        <ul className="list-disc pl-6 mt-2">
                            <li>Augmenter ou diminuer la taille du texte</li>
                            <li>Activer le mode contraste élevé</li>
                            <li>Activer le mode sombre</li>
                            <li>Changer la langue de l'interface</li>
                            <li>Activer la navigation au clavier</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium">Navigation au clavier</h3>
                        <p className="mt-2">
                            Vous pouvez naviguer sur notre site en utilisant uniquement le clavier :
                        </p>
                        <ul className="list-disc pl-6 mt-2">
                            <li><strong>Tab</strong> : Naviguer vers l'élément suivant</li>
                            <li><strong>Shift + Tab</strong> : Naviguer vers l'élément précédent</li>
                            <li><strong>Entrée</strong> : Activer un lien ou un bouton</li>
                            <li><strong>Espace</strong> : Activer une case à cocher ou un bouton</li>
                            <li><strong>Flèches</strong> : Naviguer dans les menus et les listes déroulantes</li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mt-8 mb-3">Nous contacter</h2>

                <p className="mb-4">
                    Si vous rencontrez des difficultés d'accessibilité sur notre site ou si vous avez des suggestions
                    pour améliorer notre accessibilité, veuillez nous contacter à l'adresse suivante :
                    <a href="mailto:accessibilite@bourses.example.com" className="text-blue-600 hover:underline ml-1">
                        accessibilite@bourses.example.com
                    </a>
                </p>

                <p>
                    Nous nous engageons à répondre à vos préoccupations et à améliorer continuellement
                    l'accessibilité de notre plateforme.
                </p>
            </div>

            <div className="text-center">
                <Link
                    href="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-300"
                >
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
} 