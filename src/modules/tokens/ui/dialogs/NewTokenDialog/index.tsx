import React from 'react';
import { motion } from 'framer-motion';
import { X, Palette, Paintbrush } from 'lucide-react';

import { useTokenCreation } from '../../hooks/useTokenCreation';
import { TokenNameInput } from '../../components/TokenNameInput';
import { TokenTypeSelect } from '../../components/TokenTypeSelect';
import { TokenScopeConfig } from '../../components/TokenScopeConfig';
import { TokenValueInput } from '../../components/TokenValueInput';
import type { NewTokenDialogProps } from '../../../domain/ui-types';

export function NewTokenDialog({ isOpen, onClose, onSubmit }: NewTokenDialogProps) {
    const { formState, setters, actions } = useTokenCreation(isOpen);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formState.name.trim() && formState.value) {
            const data = actions.getSubmissionData();
            onSubmit(data);
            actions.resetForm();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-[#080808] border border-white/5 rounded-2xl w-[440px] shadow-2xl"
            >
                {/* 1. Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display tracking-tight">
                        <div className="p-1 rounded-md bg-primary/10 text-primary">
                            <Palette size={14} />
                        </div>
                        Create Token
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* 2. Magic Name Input */}
                    <TokenNameInput
                        name={formState.name}
                        onNameChange={setters.setName}
                        onAutoName={actions.handleAutoName}
                        isAutoNaming={formState.isAutoNaming}
                        namingResult={formState.namingResult}
                    />

                    {/* 3. Classification & Scope */}
                    {/* 3. Classification, Scope & Value (2 Rows) */}
                    <div className="space-y-4">
                        {/* Row 1: Type & Scope */}
                        <div className="flex gap-4 items-start">
                            <TokenTypeSelect
                                type={formState.type}
                                onTypeChange={setters.setType}
                                className="w-[120px] flex-shrink-0"
                            />

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
                                    className="flex-1"
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

                    {/* 5. Footer Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3 rounded-xl bg-primary hover:bg-primary-hover text-xs font-bold text-white shadow-[0_4px_20px_rgba(110,98,229,0.3)] transition-all flex items-center justify-center gap-2"
                        >
                            <Paintbrush size={14} />
                            Create Token
                        </button>
                    </div>

                </form>
            </motion.div>
        </div >
    );
}
