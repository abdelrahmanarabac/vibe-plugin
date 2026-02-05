import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Paintbrush } from 'lucide-react';

import { useTokenCreation } from '../hooks/useTokenCreation';
import { TokenNameInput } from '../components/TokenNameInput';
import { VibeSelect } from '../../../../components/shared/base/VibeSelect';
import { FieldLabel } from '../../../../components/shared/base/FieldLabel';
import { TokenScopeConfig } from '../components/TokenScopeConfig';
import { TokenValueInput } from '../components/TokenValueInput';
import { VibePathPicker } from '../../../../components/shared/base/VibePathPicker';
import { useTokens } from '../../../../ui/hooks/useTokens';
import type { TokenFormData } from '../../domain/ui-types';
import { omnibox } from '../../../../ui/managers/OmniboxManager';

interface CreateTokenPageProps {
    onBack: () => void;
    onSubmit: (token: TokenFormData) => Promise<boolean>;
}

export function CreateTokenPage({ onBack, onSubmit }: CreateTokenPageProps) {
    const { tokens, stats, createCollection, renameCollection, deleteCollection } = useTokens();

    // Transform TokenEntity -> TokenPickerItem
    const tokenItems = tokens.map(t => ({
        name: t.name,
        path: t.path,
        fullPath: t.path && t.path.length > 0 ? [...t.path, t.name].join('/') : t.name,
        type: t.$type,
        value: t.$value
    }));

    const { formState, setters, actions } = useTokenCreation(true);

    const [place, setPlace] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formState.name.trim()) return;

        // ✅ VALIDATION: Require Collection Path
        if (!place || place.trim() === '') {
            omnibox.show('Please select a collection path', { type: 'error' });
            return;
        }

        const baseData = actions.getSubmissionData();
        const cleanPath = place.endsWith('/') ? place : `${place}/`;
        const fullName = `${cleanPath}${baseData.name}`;

        const finalData = {
            ...baseData,
            name: fullName
        };

        const success = await onSubmit(finalData);

        if (success) {
            // Visible feedback via Omnibox as requested
            omnibox.show(`Token "${finalData.name}" created`, { type: 'success' });

            // Only reset the name to allow sequential creation in the same context
            setters.setName('');
            setters.setNamingResult(null);
            // We keep: type, value, path (place), scope, etc.
        }
    };

    return (
        <div className="w-full h-full relative flex flex-col bg-void">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-2xl mx-auto px-6 py-6 pb-28 flex flex-col relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full relative"
                    >
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                <div className="flex-1 w-full">
                                    <TokenNameInput
                                        name={formState.name}
                                        onNameChange={setters.setName}
                                        onAutoName={actions.handleAutoName}
                                        isAutoNaming={formState.isAutoNaming}
                                        namingResult={formState.namingResult}
                                    />
                                </div>

                                <div className="space-y-1.5 w-full md:w-1/3">
                                    <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1 flex items-center gap-1 h-4">
                                        Path
                                    </label>
                                    <VibePathPicker
                                        value={place}
                                        onChange={setPlace}
                                        placeholder="e.g. Brand/Colors"
                                        size="md"
                                        existingTokens={tokenItems}
                                        existingCollections={stats.collectionNames}
                                        onCreateCollection={createCollection}
                                        onRenameCollection={renameCollection}
                                        onDeleteCollection={deleteCollection}
                                    />
                                </div>
                            </div>

                            {/* 3. Classification, Scope & Value (Auto Layout) */}
                            {/* 3. Classification, Scope & Value (2 Rows) */}
                            <div className="space-y-4">
                                {/* Row 1: Type & Scope */}
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    <div className="space-y-1.5 w-full md:w-[140px] flex-shrink-0">
                                        <FieldLabel>Type</FieldLabel>
                                        <VibeSelect
                                            value={formState.type}
                                            onChange={setters.setType}
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

                                    {!['number', 'string'].includes(formState.type) && (
                                        <TokenScopeConfig
                                            type={formState.type}
                                            colorScope={formState.colorScope}
                                            onColorScopeChange={setters.setColorScope}
                                            customRange={formState.customRange}
                                            onCustomRangeChange={setters.setCustomRange}
                                            activeModes={formState.activeModes}
                                            onActiveModesChange={setters.setActiveModes}
                                            ratio={formState.ratio}
                                            onRatioChange={setters.setRatio}
                                            className="flex-1 w-full"
                                        />
                                    )}
                                </div>

                                {/* Row 2: Value */}
                                <div className="w-full">
                                    <TokenValueInput
                                        type={formState.type}
                                        value={formState.value}
                                        onValueChange={setters.setValue}
                                        colorScope={formState.colorScope}
                                        customRange={formState.customRange}
                                        activeModes={formState.activeModes}
                                    />
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>

            <div className="w-full absolute bottom-0 left-0 p-6 bg-gradient-to-t from-void via-void to-transparent z-50 pointer-events-none flex justify-center">
                <div className="w-full max-w-2xl flex gap-4 pointer-events-auto">

                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 py-3.5 rounded-xl bg-surface-2/80 hover:bg-surface-2 backdrop-blur-md text-sm font-bold text-text-dim hover:text-white transition-colors border border-surface-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-[2] py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-sm font-bold text-white shadow-[0_4px_20px_rgba(110,98,229,0.3)] hover:shadow-[0_4px_25px_rgba(110,98,229,0.5)] transition-all flex items-center justify-center gap-2 border border-white/10 group"
                    >
                        <Paintbrush size={16} />
                        <span>Create Token</span>
                        {formState.type === 'color' && formState.colorScope.startsWith('scale') && (
                            <span className="ml-1 px-2 py-0.5 rounded-md bg-white text-primary text-[10px] font-extrabold shadow-sm group-hover:scale-105 transition-transform">
                                {formState.colorScope === 'scale-custom'
                                    ? `${formState.customRange[0]} - ${formState.customRange[1]}`
                                    : '50 - 950'}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div >
    );
}
