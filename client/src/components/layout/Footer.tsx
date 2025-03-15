export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Gestion des Bourses</h3>
                        <p className="text-gray-300">
                            Plateforme de gestion des candidatures pour bourses d'études.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Liens Rapides</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-300 hover:text-white">
                                    Accueil
                                </a>
                            </li>
                            <li>
                                <a href="/bourses" className="text-gray-300 hover:text-white">
                                    Bourses Disponibles
                                </a>
                            </li>
                            <li>
                                <a href="/candidatures" className="text-gray-300 hover:text-white">
                                    Mes Candidatures
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-300 hover:text-white">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact</h3>
                        <p className="text-gray-300 mb-2">Email: contact@bourses.com</p>
                        <p className="text-gray-300 mb-2">Téléphone: +221 33 123 45 67</p>
                        <p className="text-gray-300">Adresse: Dakar, Sénégal</p>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                    <p>&copy; {currentYear} Plateforme de Gestion des Bourses. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
} 