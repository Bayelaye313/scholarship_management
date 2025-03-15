import { getAllScholarships } from "../../services/serverApi";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { ScholarshipType } from "../../services/api";
import Link from "next/link";
import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    XMarkIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from "@heroicons/react/24/outline";

// Identifiants uniques pour les toasts
const TOAST_IDS = {
    LOADING_ERROR: 'loading-scholarships-error',
};

export default async function BoursesPage() {
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken as string | undefined;
    const scholarships = await getAllScholarships(token);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Bourses Disponibles</h1>
                <p className="text-gray-600 mb-6">
                    Découvrez toutes les bourses disponibles et trouvez celle qui correspond à votre profil.
                </p>

                {/* Liste des bourses */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scholarships.map((scholarship: ScholarshipType) => (
                        <div
                            key={scholarship.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                        {scholarship.name}
                                    </h2>
                                    {scholarship.is_active ? (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {scholarship.description}
                                </p>
                                <div className="flex justify-between text-sm text-gray-500 mb-4">
                                    <div>Durée: {scholarship.duration} mois</div>
                                    <div>Montant: {scholarship.amount.toLocaleString()} FCFA</div>
                                </div>
                                <Link
                                    href={`/bourses/${scholarship.id}`}
                                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-300"
                                >
                                    Voir les détails
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {scholarships.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">Aucune bourse disponible pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
} 