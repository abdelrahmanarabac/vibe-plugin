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
    return (
        <button
            className={`figma-icon-btn ${active ? 'figma-icon-btn-active' : ''} ${className}`}
            title={tooltip}
            {...props}
        >
            {icon}
        </button>
    );
};

export default IconButton;
