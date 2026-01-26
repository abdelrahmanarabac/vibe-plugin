import { useState, useRef, useEffect, useMemo } from 'react';
import { Folder, ChevronRight, CornerDownRight, ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface VibePathPickerProps {
    value: string;
    onChange: (value: string) => void;
    size?: 'sm' | 'md' | 'lg';
    placeholder?: string;
    className?: string;
    existingTokens?: string[]; // Array of full token names (e.g. "brand/colors/primary")
}

// Utility to build tree from paths
function buildFolderTree(paths: string[] = []) {
    const tree: any = {};

    paths.forEach(path => {
        // Fix: Ensure we handle paths that start with '/' or have empty parts
        const parts = path.split('/').filter(p => p.trim().length > 0);

        // If path has no parts (empty string), skip
        if (parts.length === 0) return;

        // In Figma, the "collection" is often implicit or the first part if exported that way.
        // We treat the inputs as "Collection/Group/TokenName".
        // The last part is the Token Name, so we only use the parts BEFORE it as folders.
        const folders = parts.slice(0, -1);

        // If no folders (top level token), optionally we could add it to a "Root" bucket?
        // For now, only building folder structure.

        let current = tree;
        folders.forEach(folder => {
            if (!current[folder]) {
                current[folder] = {};
            }
            current = current[folder];
        });
    });

    return tree;
}

export function VibePathPicker({ value, onChange, size = 'md', placeholder = 'Select path...', className = '', existingTokens = [] }: VibePathPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentViewPath, setCurrentViewPath] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Build tree from props
    const folderTree = useMemo(() => buildFolderTree(existingTokens), [existingTokens]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get folders at current view path
    const currentFolders = useMemo(() => {
        let current: any = folderTree;
        for (const p of currentViewPath) {
            if (current[p]) {
                current = current[p];
            } else {
                return [];
            }
        }
        return Object.keys(current);
    }, [currentViewPath, folderTree]);

    // Update view path if user manually types "Brand/"
    useEffect(() => {
        if (!isOpen) return;
    }, [value, isOpen]);

    const handleSelectFolder = (folderName: string) => {
        const newPath = [...currentViewPath, folderName];
        setCurrentViewPath(newPath);

        // Update input value to reflect selection (e.g. "Brand/Colors/")
        const pathString = newPath.join('/');
        onChange(pathString + '/');

        // Keep open to allow deeper selection
        // If leaf? (Empty object). We assume folders can always have children or be the destination.
    };

    const handleBack = () => {
        setCurrentViewPath((prev: string[]) => prev.slice(0, -1));
    };

    const sizeClasses = {
        sm: 'h-8 text-xs',
        md: 'h-11 text-sm', // 44px
        lg: 'h-12 text-base'
    };

    return (
        <div ref={containerRef} className={`relative group ${className}`}>
            <div className={`relative flex items-center bg-surface-1 border border-white/5 rounded-xl transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 hover:border-white/10 ${sizeClasses[size]}`}>

                {/* Prefix / Icon */}
                <div className="pl-3 pr-2 text-text-dim">
                    <Folder size={size === 'sm' ? 12 : 14} />
                </div>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-text-dim/50 font-mono w-full"
                    placeholder={placeholder}
                />

                {/* Right Actions */}
                <div className="pr-3 flex items-center gap-1">
                    {value && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange('');
                                setCurrentViewPath([]);
                            }}
                            className="p-1 hover:text-white text-text-dim transition-colors"
                        >
                            {/* Clear Icon */}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Dropdown / Genius Picker */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-glass overflow-hidden z-[100] flex flex-col max-h-[240px]"
                    >
                        {/* Header / Breadcrumb */}
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 bg-surface-2/30 text-xs">
                            {currentViewPath.length > 0 ? (
                                <>
                                    <button
                                        onClick={handleBack}
                                        className="p-1 -ml-1 hover:bg-white/10 rounded-md transition-colors text-text-dim hover:text-white"
                                    >
                                        <ChevronLeft size={12} />
                                    </button>
                                    <div className="flex items-center gap-1 overflow-hidden">
                                        <span className="text-text-dim cursor-pointer hover:text-white transition-colors" onClick={() => setCurrentViewPath([])}>Root</span>
                                        {currentViewPath.map((p, i) => (
                                            <div key={i} className="flex items-center gap-1 shrink-0">
                                                <ChevronRight size={10} className="text-text-dim/50" />
                                                <span
                                                    className={`cursor-pointer transition-colors ${i === currentViewPath.length - 1 ? 'text-white font-bold' : 'text-text-dim hover:text-white'}`}
                                                    onClick={() => setCurrentViewPath(currentViewPath.slice(0, i + 1))}
                                                >
                                                    {p}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <span className="text-text-dim font-bold tracking-wide text-[10px] uppercase">Path Browser</span>
                            )}
                        </div>

                        {/* Folder List */}
                        <div className="overflow-y-auto p-1 custom-scrollbar flex-1">
                            {currentFolders.length > 0 ? (
                                currentFolders.map(folder => (
                                    <button
                                        key={folder}
                                        type="button"
                                        onClick={() => handleSelectFolder(folder)}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 group transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-2 text-sm text-text-dim group-hover:text-white transition-colors">
                                            <Folder size={14} className="text-primary/70 group-hover:text-primary transition-colors" />
                                            <span>{folder}</span>
                                        </div>
                                        <ChevronRight size={12} className="text-text-dim/30 group-hover:text-white/50" />
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center text-text-dim text-xs flex flex-col items-center gap-2 opacity-50">
                                    <CornerDownRight size={16} />
                                    <span>Empty Folder</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
