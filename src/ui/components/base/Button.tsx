import React from 'react';

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
    const baseClass = 'figma-btn';
    const variantClass = `figma-btn-${variant}`;

    const sizeStyles: Record<ButtonSize, string> = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeStyles[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="animate-spin">⏳</span>
            ) : icon ? (
                <span className="figma-btn-icon">{icon}</span>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
