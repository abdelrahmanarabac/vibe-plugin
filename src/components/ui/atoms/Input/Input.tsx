import React from 'react';
import { cn } from '../../../../ui/utils/cn';


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'ghost' | 'glass';
    error?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    className,
    variant = 'default',
    error,
    leftIcon,
    rightIcon,
    ...props
}, ref) => {
    return (
        <div className="relative flex items-center w-full group">
            {leftIcon && (
                <div className="absolute left-3 text-text-muted transition-colors group-focus-within:text-primary pointer-events-none">
                    {leftIcon}
                </div>
            )}

            <input
                ref={ref}
                className={cn(
                    'w-full h-[42px] px-3 py-2 rounded-xl text-sm font-medium outline-none transition-all duration-200',
                    'placeholder:text-text-muted/50 font-sans',
                    {
                        'pl-9': !!leftIcon,
                        'pr-9': !!rightIcon,

                        // Default Variant
                        'bg-surface-1 border border-transparent focus:bg-surface-2 focus:border-primary/50 focus:shadow-[0_0_0_3px_var(--color-primary-glow)]': variant === 'default',

                        // Ghost Variant
                        'bg-transparent hover:bg-surface-2 focus:bg-surface-2': variant === 'ghost',

                        // Glass Variant
                        'bg-surface-1/50 backdrop-blur-md border border-white/5 focus:bg-surface-1 focus:border-primary/50': variant === 'glass',

                        // Error State
                        'border-error/50 focus:border-error focus:shadow-[0_0_0_3px_var(--color-error-bg)]': error,
                    },
                    className
                )}
                {...props}
            />

            {rightIcon && (
                <div className="absolute right-3 text-text-muted">
                    {rightIcon}
                </div>
            )}
        </div>
    );
});

Input.displayName = 'Input';
