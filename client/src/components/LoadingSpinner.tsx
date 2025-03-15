import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-4'
    };

    return (
        <div
            className={`animate-spin rounded-full border-t-transparent border-blue-600 ${sizeClasses[size]} ${className}`}
            aria-label="Chargement..."
        ></div>
    );
};

export default LoadingSpinner; 