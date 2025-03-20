import { useState, useEffect } from 'react';

interface Stats {
    scholarshipsCount: number;
    applicationsCount: number;
    successRate: number;
    loading: boolean;
}

export function useStats() {
    const [stats, setStats] = useState<Stats>({
        scholarshipsCount: 0,
        applicationsCount: 0,
        successRate: 0,
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats');
                const data = await response.json();
                setStats({
                    ...data,
                    loading: false
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques:', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, []);

    return stats;
} 