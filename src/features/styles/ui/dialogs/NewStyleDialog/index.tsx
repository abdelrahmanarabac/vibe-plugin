import React from 'react';
import { motion } from 'framer-motion';
import { X, Layers, Paintbrush } from 'lucide-react';
import { useStyleCreation } from '../../hooks/useStyleCreation';
import { StyleNameInput } from '../../components/StyleNameInput';
import { StyleTypeSelect } from '../../components/StyleTypeSelect';
import { StyleDetailsInput } from '../../components/StyleDetailsInput';
import type { NewStyleDialogProps } from '../../../domain/types';

export function NewStyleDialog({ isOpen, onClose, onSubmit }: NewStyleDialogProps) {
    const { formState, setters, actions } = useStyleCreation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formState.name.trim()) {
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
                        <div className="p-1 rounded-md bg-secondary/10 text-secondary">
                            <Layers size={14} />
                        </div>
                        Create Style
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* 2. Style Name Input */}
                    <StyleNameInput
                        name={formState.name}
                        onNameChange={setters.setName}
                    />

                    {/* 3. Classification */}
                    <StyleTypeSelect
                        type={formState.type}
                        onTypeChange={setters.setType}
                    />

                    {/* 4. Description / Value Input */}
                    <StyleDetailsInput
                        description={formState.description}
                        onDescriptionChange={setters.setDescription}
                    />

                    {/* 5. Footer Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3 rounded-xl bg-white hover:bg-gray-200 text-xs font-bold text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center gap-2"
                        >
                            <Paintbrush size={14} />
                            Create Style
                        </button>
                    </div>

                </form>
            </motion.div>
        </div >
    );
}
