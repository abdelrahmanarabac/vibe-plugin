import React from 'react';
import { cn } from '../../../../ui/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/40 border border-white/10',
        secondary: 'bg-surface-2 text-text-primary hover:bg-surface-3 border border-surface-3',
        ghost: 'bg-transparent text-text-dim hover:text-text-primary hover:bg-surface-2',
        danger: 'bg-error text-white hover:bg-error/90 shadow-lg shadow-error/20',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-[42px] px-5 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-[42px] w-[42px] p-0 flex items-center justify-center',
    };

    return (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={cn(
                'relative inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 active:scale-[0.98]',
                'disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {leftIcon}
                    {children}
                    {rightIcon}
                </>
            )}
        </button>
    );
});

Button.displayName = 'Button';
