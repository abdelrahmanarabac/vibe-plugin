import React, { useId } from 'react';

export interface VibeInputProps {
    value: string | number;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    size?: 'sm' | 'md' | 'lg';
    type?: 'text' | 'number';
    disabled?: boolean;
    className?: string;
    autoFocus?: boolean;
    action?: React.ReactNode;
    id?: string;
}

/**
 * 🎯 Unified Input Component
 * Standardizes all input fields with consistent styling, size variants, and icon support.
 * 
 * Size Mapping:
 * - sm: 36px height (px-3 py-2 text-xs)
 * - md: 44px height (px-4 py-3 text-sm) ← DEFAULT
 * - lg: 52px height (px-4 py-3.5 text-base)
 */
export function VibeInput({
    value,
    onChange,
    label,
    placeholder,
    icon,
    iconPosition = 'right',
    size = 'md',
    type = 'text',
    disabled = false,
    className = '',
    autoFocus = false,
    action,
    id,
}: VibeInputProps) {
    const generatedId = useId();
    const inputId = id || generatedId;

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-3 text-sm',
        lg: 'px-4 py-3.5 text-base',
    };

    // Icon padding adjustments
    const iconPaddingClasses = icon
        ? iconPosition === 'left'
            ? 'pl-10'
            : 'pr-10'
        : '';

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label htmlFor={inputId} className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && !action && (
                    <div
                        className={`absolute ${iconPosition === 'left' ? 'left-3' : 'right-3'
                            } top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors pointer-events-none`}
                    >
                        {icon}
                    </div>
                )}
                {/* Custom Action Element (Interactive) */}
                {action && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                        {action}
                    </div>
                )}
                <input
                    id={inputId}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    className={`
                        w-full bg-void/50 border border-white/10 rounded-xl
                        ${sizeClasses[size]}
                        ${iconPaddingClasses}
                        text-white font-mono
                        focus:border-primary/50 focus:ring-1 focus:ring-primary/50
                        outline-none transition-all
                        placeholder:text-text-muted/50
                        shadow-inner
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                />
            </div>
        </div>
    );
}
