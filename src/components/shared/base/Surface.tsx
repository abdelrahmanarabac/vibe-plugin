import React from 'react';

interface SurfaceProps {
    level?: 0 | 1 | 2 | 3;
    children: React.ReactNode;
    className?: string;
}

/**
 * Simple Surface component for layered UI backgrounds
 * Provides semantic background levels for depth hierarchy
 */
export const Surface: React.FC<SurfaceProps> = ({ level = 0, children, className = '' }) => {
    const levelClasses = {
        0: 'bg-surface-0',
        1: 'bg-surface-1',
        2: 'bg-surface-2',
        3: 'bg-surface-3'
    };

    return (
        <div className={`${levelClasses[level]} rounded-xl ${className}`}>
            {children}
        </div>
    );
};
