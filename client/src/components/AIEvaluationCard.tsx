import React from 'react';
import { SparklesIcon, AcademicCapIcon, HomeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Application } from '../services/applicationService';

interface AIEvaluationCardProps {
    application: Application;
    onEvaluate?: () => void;
    isEvaluating?: boolean;
}

const AIEvaluationCard: React.FC<AIEvaluationCardProps> = ({
    application,
    onEvaluate,
    isEvaluating = false
}) => {
    const hasEvaluation = application.ai_score !== undefined && application.ai_score !== null;

    // Fonction pour déterminer la couleur du score
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 70) return 'text-green-500';
        if (score >= 60) return 'text-yellow-600';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    // Fonction pour déterminer la couleur de fond du score
    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-100';
        if (score >= 70) return 'bg-green-50';
        if (score >= 60) return 'bg-yellow-100';
        if (score >= 50) return 'bg-yellow-50';
        return 'bg-red-50';
    };

    if (!hasEvaluation && !onEvaluate) {
        return null;
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
                    Évaluation IA
                </h2>

                {hasEvaluation ? (
                    <div className="space-y-6">
                        {/* Score global */}
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-medium">Score global</div>
                            <div className={`text-2xl font-bold ${getScoreColor(application.ai_score!)}`}>
                                {application.ai_score}/100
                            </div>
                        </div>

                        {/* Scores détaillés */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Score académique */}
                            {application.ai_academic_score !== undefined && (
                                <div className={`p-4 rounded-lg ${getScoreBgColor(application.ai_academic_score)}`}>
                                    <div className="flex items-center mb-2">
                                        <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                                        <span className="font-medium">Académique</span>
                                    </div>
                                    <div className={`text-xl font-bold ${getScoreColor(application.ai_academic_score)}`}>
                                        {application.ai_academic_score}/100
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">40% du score total</div>
                                </div>
                            )}

                            {/* Score socio-économique */}
                            {application.ai_socioeconomic_score !== undefined && (
                                <div className={`p-4 rounded-lg ${getScoreBgColor(application.ai_socioeconomic_score)}`}>
                                    <div className="flex items-center mb-2">
                                        <HomeIcon className="h-5 w-5 text-green-600 mr-2" />
                                        <span className="font-medium">Socio-économique</span>
                                    </div>
                                    <div className={`text-xl font-bold ${getScoreColor(application.ai_socioeconomic_score)}`}>
                                        {application.ai_socioeconomic_score}/100
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">30% du score total</div>
                                </div>
                            )}

                            {/* Score de motivation */}
                            {application.ai_motivation_score !== undefined && (
                                <div className={`p-4 rounded-lg ${getScoreBgColor(application.ai_motivation_score)}`}>
                                    <div className="flex items-center mb-2">
                                        <DocumentTextIcon className="h-5 w-5 text-purple-600 mr-2" />
                                        <span className="font-medium">Motivation</span>
                                    </div>
                                    <div className={`text-xl font-bold ${getScoreColor(application.ai_motivation_score)}`}>
                                        {application.ai_motivation_score}/100
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">30% du score total</div>
                                </div>
                            )}
                        </div>

                        {/* Recommandations */}
                        {application.ai_recommendations && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-2">Recommandations</h3>
                                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700">
                                    {application.ai_recommendations}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-gray-600 mb-4">
                            Cette candidature n'a pas encore été évaluée par notre système d'IA.
                        </p>
                        {onEvaluate && (
                            <button
                                onClick={onEvaluate}
                                disabled={isEvaluating}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center justify-center mx-auto disabled:opacity-50"
                            >
                                {isEvaluating ? (
                                    <>
                                        <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                        Évaluation en cours...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="h-5 w-5 mr-2" />
                                        Lancer l'évaluation IA
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIEvaluationCard; 