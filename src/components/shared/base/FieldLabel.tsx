import React, { type PropsWithChildren } from 'react';

interface FieldLabelProps extends PropsWithChildren {
    htmlFor?: string;
    className?: string;
}

/**
 * Standardized field label component
 * Eliminates duplicate label pattern across Select wrappers
 */
export const FieldLabel: React.FC<FieldLabelProps> = ({
    children,
    htmlFor,
    className = ''
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`text-xxs font-bold text-text-dim uppercase tracking-wider block mb-1.5 ${className}`}
        >
            {children}
        </label>
    );
};

export default FieldLabel;
