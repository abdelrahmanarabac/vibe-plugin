import React from 'react';
import { VibeSelect } from '../../../../ui/components/base/VibeSelect';

interface StyleTypeSelectProps {
    type: string;
    onTypeChange: (val: string) => void;
}

export const StyleTypeSelect: React.FC<StyleTypeSelectProps> = ({ type, onTypeChange }) => {
    return (
        <div className="space-y-1.5 my-4">
            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider h-4 flex items-center">Type</label>
            <div className="">
                <VibeSelect
                    value={type}
                    onChange={onTypeChange}
                    options={[
                        { label: 'Typography', value: 'typography' },
                        { label: 'Effect', value: 'effect' },
                        { label: 'Layout Grid', value: 'grid' },
                    ]}
                    className="w-full"
                />
            </div>
        </div>
    );
};
