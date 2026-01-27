import React, { forwardRef, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

/**
 * Figma-native Input Component
 * Matches Figma's plugin UI style guidelines
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    hint,
    className = '',
    id,
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className="figma-input-group">
            {label && (
                <label htmlFor={inputId} className="figma-label">{label}</label>
            )}
            <input
                id={inputId}
                ref={ref}
                className={`figma-input ${error ? 'figma-input-error' : ''} ${className}`}
                {...props}
            />
            {error && (
                <span className="figma-error-text">{error}</span>
            )}
            {hint && !error && (
                <span className="figma-hint-text">{hint}</span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
