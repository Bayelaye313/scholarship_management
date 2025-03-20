import { UserGroupIcon, AcademicCapIcon, BanknotesIcon } from "@heroicons/react/24/outline";

interface Stats {
    scholarshipsCount: number;
    applicationsCount: number;
    successRate: number;
    loading: boolean;
}

interface StatsSectionProps {
    stats: Stats;
}

export default function StatsSection({ stats }: StatsSectionProps) {
    if (stats.loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <BanknotesIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Bourses Disponibles</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.scholarshipsCount}</p>
            </div>

            <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <UserGroupIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Candidatures</h3>
                <p className="text-3xl font-bold text-green-600">{stats.applicationsCount}</p>
            </div>

            <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <AcademicCapIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Taux de Réussite</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.successRate}%</p>
            </div>
        </div>
    );
} 