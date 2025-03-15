"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRightIcon, ArrowLeftIcon, UserGroupIcon, AcademicCapIcon, BanknotesIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.isAdmin;

  // État pour les statistiques
  const [stats, setStats] = useState({
    scholarshipsCount: 0,
    applicationsCount: 0,
    successRate: 0,
    loading: true
  });

  // État pour le carrousel de témoignages
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Témoignages
  const testimonials = [
    {
      quote: "Grâce à cette plateforme, j'ai pu obtenir une bourse qui a changé ma vie. Le processus était simple et transparent.",
      name: "Fatou Diop",
      role: "Étudiante en Médecine",
      avatar: "/avatars/avatar-1.jpg" // Vous pouvez ajouter des images d'avatar réelles
    },
    {
      quote: "La plateforme m'a permis de trouver rapidement une bourse adaptée à mon profil. Je recommande vivement !",
      name: "Amadou Sow",
      role: "Étudiant en Informatique",
      avatar: "/avatars/avatar-2.jpg"
    },
    {
      quote: "J'ai obtenu une bourse internationale grâce à cette plateforme. L'interface est intuitive et les informations sont claires.",
      name: "Mariama Bâ",
      role: "Étudiante en Droit",
      avatar: "/avatars/avatar-3.jpg"
    }
  ];

  // Fonction pour passer au témoignage suivant
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  // Fonction pour passer au témoignage précédent
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Charger les statistiques
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simuler le chargement des statistiques depuis une API
        // Dans une implémentation réelle, vous feriez un appel API ici
        setTimeout(() => {
          setStats({
            scholarshipsCount: 15,
            applicationsCount: 250,
            successRate: 68,
            loading: false
          });
        }, 1000);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  // Changer automatiquement de témoignage toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-sky-800 text-white rounded-xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Plateforme de Gestion des Bourses d'Études
          </h1>
          <p className="text-xl mb-8">
            Trouvez la bourse qui correspond à votre profil et soumettez votre candidature en quelques clics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bourses"
              className="bg-white text-blue-800 hover:bg-sky-100 px-6 py-3 rounded-md font-medium transition-colors duration-300"
            >
              Voir les bourses disponibles
            </Link>

            {!isAuthenticated ? (
              <Link
                href="/auth/register"
                className="bg-sky-700 hover:bg-sky-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 border border-blue-600"
              >
                Créer un compte
              </Link>
            ) : isAdmin ? (
              <Link
                href="/admin/dashboard"
                className="bg-sky-700 hover:bg-sky-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 border border-blue-600"
              >
                Tableau de bord admin
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="bg-sky-700 hover:bg-sky-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 border border-blue-600"
              >
                Mon espace candidat
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Statistiques - Nouvelle section */}
      <section className="py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Notre impact</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nous aidons les étudiants à réaliser leurs rêves académiques grâce à notre plateforme de bourses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 text-blue-800 w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <AcademicCapIcon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {stats.loading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats.scholarshipsCount
              )}
            </h3>
            <p className="text-gray-600">Bourses disponibles</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-green-100 text-green-800 w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <UserGroupIcon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {stats.loading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats.applicationsCount
              )}
            </h3>
            <p className="text-gray-600">Candidatures soumises</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-yellow-100 text-yellow-800 w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <BanknotesIcon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {stats.loading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                `${stats.successRate}%`
              )}
            </h3>
            <p className="text-gray-600">Taux de réussite</p>
          </div>
        </div>
      </section>

      {/* Comment ça marche - Affiché uniquement pour les utilisateurs non connectés */}
      {!isAuthenticated && (
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre plateforme simplifie le processus de candidature aux bourses d'études en quelques étapes simples.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-sky-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Créez un compte</h3>
              <p className="text-gray-600">
                Inscrivez-vous sur notre plateforme pour accéder à toutes les fonctionnalités.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-sky-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Trouvez une bourse</h3>
              <p className="text-gray-600">
                Parcourez les bourses disponibles et trouvez celle qui correspond à votre profil.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-sky-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Soumettez votre candidature</h3>
              <p className="text-gray-600">
                Remplissez le formulaire et téléchargez les documents requis pour postuler.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Bourses populaires */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Bourses populaires</h2>
          <Link
            href="/bourses"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            Voir toutes les bourses
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Exemple de bourse 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Bourse d'Excellence Académique</h3>
              <p className="text-gray-600 mb-4">
                Pour les étudiants ayant obtenu d'excellents résultats académiques.
              </p>
              <div className="flex justify-between text-sm mb-4">
                <span className="bg-sky-100 text-blue-800 px-3 py-1 rounded-full">
                  Durée: 12 mois
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Montant: 5 000 000 FCFA
                </span>
              </div>
              <Link
                href="/bourses/1"
                className="block text-center bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md transition-colors duration-300"
              >
                Voir les détails
              </Link>
            </div>
          </div>

          {/* Exemple de bourse 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Bourse de Mobilité Internationale</h3>
              <p className="text-gray-600 mb-4">
                Pour les étudiants souhaitant poursuivre leurs études à l'étranger.
              </p>
              <div className="flex justify-between text-sm mb-4">
                <span className="bg-sky-100 text-blue-800 px-3 py-1 rounded-full">
                  Durée: 24 mois
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Montant: 10 000 000 FCFA
                </span>
              </div>
              <Link
                href="/bourses/2"
                className="block text-center bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md transition-colors duration-300"
              >
                Voir les détails
              </Link>
            </div>
          </div>

          {/* Exemple de bourse 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Bourse Sociale</h3>
              <p className="text-gray-600 mb-4">
                Pour les étudiants issus de milieux défavorisés.
              </p>
              <div className="flex justify-between text-sm mb-4">
                <span className="bg-sky-100 text-blue-800 px-3 py-1 rounded-full">
                  Durée: 36 mois
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Montant: 3 000 000 FCFA
                </span>
              </div>
              <Link
                href="/bourses/3"
                className="block text-center bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md transition-colors duration-300"
              >
                Voir les détails
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages - Transformé en carrousel */}
      <section className="bg-gray-50 p-8 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-10">Témoignages</h2>

        <div className="max-w-3xl mx-auto relative">
          {/* Contrôles du carrousel */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors duration-300"
            aria-label="Témoignage précédent"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>

          <div className="overflow-hidden">
            <div
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              <div className="flex">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 px-4"
                    style={{ width: '100%' }}
                  >
                    <div className="bg-white p-8 rounded-lg shadow-md">
                      <p className="text-gray-600 italic mb-6 text-lg">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-sky-200 rounded-full mr-4 overflow-hidden">
                          {/* Si l'avatar est disponible, l'afficher, sinon utiliser un placeholder */}
                          <div className="w-full h-full bg-sky-200 flex items-center justify-center text-sky-800 font-bold">
                            {testimonial.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-gray-500 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors duration-300"
            aria-label="Témoignage suivant"
          >
            <ArrowRightIcon className="h-5 w-5 text-gray-600" />
          </button>

          {/* Indicateurs de position */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full ${currentTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Affiché uniquement pour les utilisateurs non connectés */}
      {!isAuthenticated && (
        <section className="bg-sky-700 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à postuler ?</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Ne manquez pas cette opportunité de financer vos études. Créez un compte dès maintenant et commencez votre candidature.
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-white text-blue-700 hover:bg-sky-50 px-8 py-3 rounded-md font-medium transition-colors duration-300"
          >
            Commencer maintenant
          </Link>
        </section>
      )}
    </div>
  );
}
