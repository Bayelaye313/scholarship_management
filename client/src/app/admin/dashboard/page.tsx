"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    DocumentTextIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    ChartBarIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import applicationService, { Application } from '../../../services/applicationService';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Statistiques
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        under_review: 0,
        accepted: 0,
        rejected: 0,
        waiting_list: 0,
        aiEvaluated: 0,
        averageAiScore: 0
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated' && session?.user && !session.user.isAdmin) {
            router.push('/dashboard');
            return;
        }

        if (status === 'authenticated') {
            fetchApplications();
        }
    }, [status, session]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const filters = statusFilter ? { status: statusFilter } : {};
            const data = await applicationService.getAll(filters);
            setApplications(data);
            calculateStats(data);
        } catch (error) {
            toast.error("Erreur lors du chargement des candidatures");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (apps: Application[]) => {
        const newStats = {
            total: apps.length,
            pending: 0,
            under_review: 0,
            accepted: 0,
            rejected: 0,
            waiting_list: 0,
            aiEvaluated: 0,
            averageAiScore: 0
        };

        let totalAiScore = 0;
        let aiEvaluatedCount = 0;

        apps.forEach(app => {
            // Compter par statut
            if (app.status === 'pending') newStats.pending++;
            if (app.status === 'under_review') newStats.under_review++;
            if (app.status === 'accepted') newStats.accepted++;
            if (app.status === 'rejected') newStats.rejected++;
            if (app.status === 'waiting_list') newStats.waiting_list++;

            // Statistiques IA
            if (app.ai_score !== undefined && app.ai_score !== null) {
                aiEvaluatedCount++;
                totalAiScore += app.ai_score;
            }
        });

        newStats.aiEvaluated = aiEvaluatedCount;
        newStats.averageAiScore = aiEvaluatedCount > 0
            ? Math.round((totalAiScore / aiEvaluatedCount) * 10) / 10
            : 0;

        setStats(newStats);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchApplications();
    };

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status);
        setTimeout(() => {
            fetchApplications();
        }, 100);
    };

    const filteredApplications = applications.filter(app =>
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.current_institution.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        // Créer les en-têtes CSV
        const headers = [
            'ID', 'Nom complet', 'Email', 'Institution', 'Année', 'Statut',
            'Score IA', 'Date de création'
        ].join(',');

        // Créer les lignes de données
        const rows = filteredApplications.map(app => [
            app.id,
            `"${app.full_name}"`,
            `"${app.email}"`,
            `"${app.current_institution}"`,
            `"${app.current_year}"`,
            `"${getStatusLabel(app.status)}"`,
            app.ai_score || 'N/A',
            new Date(app.created_at).toLocaleDateString()
        ].join(','));

        // Combiner les en-têtes et les lignes
        const csvContent = [headers, ...rows].join('\n');

        // Créer un blob et un lien de téléchargement
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `candidatures_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'under_review': return 'En cours d\'examen';
            case 'accepted': return 'Acceptée';
            case 'rejected': return 'Rejetée';
            case 'waiting_list': return 'Liste d\'attente';
            default: return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case 'under_review': return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
            case 'accepted': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'rejected': return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case 'waiting_list': return <ClockIcon className="h-5 w-5 text-purple-500" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Total des candidatures</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                        <ChartBarIcon className="h-10 w-10 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">En attente</p>
                            <p className="text-2xl font-bold">{stats.pending}</p>
                        </div>
                        <ClockIcon className="h-10 w-10 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">En cours d'examen</p>
                            <p className="text-2xl font-bold">{stats.under_review}</p>
                        </div>
                        <DocumentTextIcon className="h-10 w-10 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Acceptées</p>
                            <p className="text-2xl font-bold">{stats.accepted}</p>
                        </div>
                        <CheckCircleIcon className="h-10 w-10 text-green-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Rejetées</p>
                            <p className="text-2xl font-bold">{stats.rejected}</p>
                        </div>
                        <XCircleIcon className="h-10 w-10 text-red-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Liste d'attente</p>
                            <p className="text-2xl font-bold">{stats.waiting_list}</p>
                        </div>
                        <ClockIcon className="h-10 w-10 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Évaluées par IA</p>
                            <p className="text-2xl font-bold">{stats.aiEvaluated}</p>
                        </div>
                        <SparklesIcon className="h-10 w-10 text-purple-600" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Score IA moyen</p>
                            <p className="text-2xl font-bold">{stats.averageAiScore}/100</p>
                        </div>
                        <SparklesIcon className="h-10 w-10 text-purple-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-xl font-semibold mb-4 md:mb-0">Liste des candidatures</h2>

                    <div className="flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex">
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                            >
                                <MagnifyingGlassIcon className="h-5 w-5" />
                            </button>
                        </form>

                        <button
                            onClick={exportToCSV}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                            Exporter CSV
                        </button>
                    </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => handleStatusFilterChange('')}
                        className={`px-3 py-1 rounded-md ${statusFilter === '' ? 'bg-gray-200 font-medium' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        Tous
                    </button>
                    <button
                        onClick={() => handleStatusFilterChange('pending')}
                        className={`px-3 py-1 rounded-md flex items-center ${statusFilter === 'pending' ? 'bg-yellow-200 text-yellow-800 font-medium' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }`}
                    >
                        <ClockIcon className="h-4 w-4 mr-1" />
                        En attente
                    </button>
                    <button
                        onClick={() => handleStatusFilterChange('under_review')}
                        className={`px-3 py-1 rounded-md flex items-center ${statusFilter === 'under_review' ? 'bg-blue-200 text-blue-800 font-medium' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                    >
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        En cours d'examen
                    </button>
                    <button
                        onClick={() => handleStatusFilterChange('accepted')}
                        className={`px-3 py-1 rounded-md flex items-center ${statusFilter === 'accepted' ? 'bg-green-200 text-green-800 font-medium' : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                    >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Acceptées
                    </button>
                    <button
                        onClick={() => handleStatusFilterChange('rejected')}
                        className={`px-3 py-1 rounded-md flex items-center ${statusFilter === 'rejected' ? 'bg-red-200 text-red-800 font-medium' : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                    >
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Rejetées
                    </button>
                    <button
                        onClick={() => handleStatusFilterChange('waiting_list')}
                        className={`px-3 py-1 rounded-md flex items-center ${statusFilter === 'waiting_list' ? 'bg-purple-200 text-purple-800 font-medium' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                            }`}
                    >
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Liste d'attente
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Candidat
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Institution
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Score IA
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        Aucune candidature trouvée
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((application) => (
                                    <tr key={application.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{application.full_name}</div>
                                            <div className="text-sm text-gray-500">{application.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{application.current_institution}</div>
                                            <div className="text-sm text-gray-500">{application.current_year}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getStatusIcon(application.status)}
                                                <span className="ml-1 text-sm text-gray-900">
                                                    {getStatusLabel(application.status)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {application.ai_score !== undefined && application.ai_score !== null ? (
                                                <div className="flex items-center">
                                                    <SparklesIcon className="h-4 w-4 text-purple-600 mr-1" />
                                                    <span className="text-sm text-gray-900">{application.ai_score}/100</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">Non évalué</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(application.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/candidatures/${application.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Voir détails
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 