import React, { forwardRef, useId } from 'react';
import { cn } from '../../../shared/lib/classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
}

/**
 * Figma-native Input Component
 * Matches Figma's plugin UI style guidelines
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    hint,
    icon,
    className = '',
    id,
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-text-muted ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/50 group-focus-within:text-primary transition-colors duration-200 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    ref={ref}
                    className={cn(
                        "w-full bg-surface-2 border border-white/5 text-text-primary placeholder:text-text-muted/50 rounded-lg py-2.5 text-sm transition-all duration-200",
                        icon ? "pl-10 pr-3" : "px-3",
                        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                        "hover:border-white/10 hover:bg-surface-3",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error && "border-error/50 focus:ring-error/30 focus:border-error",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-error font-medium flex items-center gap-1.5 ml-1 animate-in slide-in-from-top-1 fade-in duration-200">
                    <span>⚠️</span> {error}
                </p>
            )}
            {hint && !error && (
                <p className="text-xs text-text-muted ml-1">{hint}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
