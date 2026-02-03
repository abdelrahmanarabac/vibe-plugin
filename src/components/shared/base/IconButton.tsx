import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    tooltip?: string;
    active?: boolean;
}

/**
 * Figma-native Icon Button Component
 * For toolbar actions and compact controls
 */
export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    tooltip,
    active = false,
    className = '',
    ...props
}) => {
    // Accessibility: Use tooltip as aria-label if aria-label is missing
    const ariaLabel = props['aria-label'] || tooltip;

    return (
        <button
            className={`figma-icon-btn ${active ? 'figma-icon-btn-active' : ''} ${className}`}
            title={tooltip}
            aria-label={ariaLabel}
            {...props}
        >
            {icon}
        </button>
    );
};

export default IconButton;
