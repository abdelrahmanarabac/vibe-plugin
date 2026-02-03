import React from 'react';
import { cn } from '../../../../ui/utils/cn';

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
    level?: 0 | 1 | 2 | 3;
    glass?: boolean;
    border?: boolean;
}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(({
    className,
    level = 1,
    glass = false,
    border = true,
    children,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'rounded-2xl transition-all duration-300',
                {
                    'bg-surface-0': level === 0,
                    'bg-surface-1': level === 1,
                    'bg-surface-2': level === 2,
                    'bg-surface-3': level === 3,
                    'backdrop-blur-xl bg-opacity-80': glass,
                    'border border-white/5': border,
                },
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Surface.displayName = 'Surface';
