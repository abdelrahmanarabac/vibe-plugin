
import React from 'react';
import { VibeSelect } from '../../../../ui/components/base/VibeSelect';
import type { TokenType } from '../../domain/ui-types';

interface TokenTypeSelectProps {
    type: TokenType;
    onTypeChange: (val: string) => void;
    className?: string;
}

export const TokenTypeSelect: React.FC<TokenTypeSelectProps> = ({
    type,
    onTypeChange,
    className
}) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider h-4 flex items-center">Type</label>
            <div className="">
                <VibeSelect
                    value={type}
                    onChange={onTypeChange}
                    options={[
                        { label: 'Color', value: 'color' },
                        { label: 'Spacing', value: 'spacing' },
                        { label: 'Sizing', value: 'sizing' },
                        { label: 'Radius', value: 'radius' },
                        { label: 'Number', value: 'number' },
                        { label: 'String', value: 'string' },
                    ]}
                    className="w-full"
                />
            </div>
        </div>
    );
};
