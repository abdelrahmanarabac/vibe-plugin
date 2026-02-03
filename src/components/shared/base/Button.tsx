import React from 'react';
import { cn } from '../../../ui/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Figma-native Button Component
 * Matches Figma's plugin UI style guidelines
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    className = '',
    disabled,
    ...props
}) => {

    // Base Vibe Styles (Glassy, Interactive, Smooth)
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-vibe focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    // Variants
    const variants = {
        primary: "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:shadow-primary/50 border border-transparent",
        secondary: "bg-surface-2 text-text-primary border border-white/10 hover:bg-surface-3 hover:border-white/20 hover:shadow-card",
        ghost: "bg-transparent text-text-muted hover:text-text-primary hover:bg-white/5",
        danger: "bg-error/10 text-error hover:bg-error/20 border border-error/20"
    };

    // Sizes
    const sizes = {
        sm: "px-2.5 py-1.5 text-xs rounded-md gap-1.5",
        md: "px-4 py-2.5 text-sm rounded-lg gap-2",
        lg: "px-6 py-3 text-base rounded-xl gap-2.5"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant] || variants.primary, sizes[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            ) : icon ? (
                <span className="flex-shrink-0">{icon}</span>
            ) : null}
            <span>{children}</span>
        </button>
    );
};

export default Button;
