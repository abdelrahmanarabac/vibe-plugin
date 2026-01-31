import { useState, useRef, useEffect, useMemo } from 'react';
import { Folder, ChevronRight, CornerDownRight, ChevronLeft, Plus } from 'lucide-react';
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
interface FolderNode {
    [key: string]: FolderNode;
}

function buildFolderTree(paths: string[] = []): FolderNode {
    const tree: FolderNode = {};

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
    const [customPaths, setCustomPaths] = useState<string[]>([]);
    const [editingFolder, setEditingFolder] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Build tree from props
    const folderTree = useMemo(() => buildFolderTree(existingTokens), [existingTokens]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setEditingFolder(null); // Reset editing on close
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update view path if user manually types "Brand/"
    useEffect(() => {
        if (!isOpen) return;
    }, [value, isOpen]);

    // Get folders at current view path
    const currentFolders = useMemo(() => {
        let current: FolderNode = folderTree;
        for (const p of currentViewPath) {
            if (current[p]) {
                current = current[p];
            } else {
                current = {};
                break;
            }
        }

        // Base folders from tokens
        const baseFolders = Object.keys(current);

        // Filter custom paths that belong to this level
        const currentPathStr = currentViewPath.join('/');
        const relevantCustom = customPaths.filter(p => {
            const parts = p.split('/').filter(Boolean);
            const parentPath = parts.slice(0, -1).join('/');

            // If we are at root (currentPathStr is empty)
            if (!currentPathStr) return parts.length === 1;

            // If we are deep
            return parentPath === currentPathStr;
        }).map(p => {
            const parts = p.split('/').filter(Boolean);
            return parts[parts.length - 1];
        });

        // Merge and deduplicate
        return Array.from(new Set([...baseFolders, ...relevantCustom])).sort();
    }, [currentViewPath, folderTree, customPaths]);

    const handleSelectFolder = (folderName: string) => {
        if (editingFolder) return; // Disable navigation while editing

        const newPath = [...currentViewPath, folderName];
        setCurrentViewPath(newPath);

        // Update input value (e.g. "Brand/Colors/")
        const pathString = newPath.join('/');
        onChange(pathString + '/');
    };

    const handleBack = () => {
        if (editingFolder) return;
        setCurrentViewPath((prev: string[]) => prev.slice(0, -1));
    };

    const handleCreateCollection = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Generate default name
        let name = "New Collection";
        let counter = 1;

        const isNameTaken = (n: string) => currentFolders.includes(n);

        while (isNameTaken(name)) {
            counter++;
            name = `New Collection (${counter})`;
        }

        const newFolderPath = [...currentViewPath, name].join('/');
        setCustomPaths(prev => [...prev, newFolderPath]);

        // Auto enter edit mode
        setEditingFolder(name);
        setEditValue(name);
    };

    const handleRenameStart = (folder: string) => {
        setEditingFolder(folder);
        setEditValue(folder);
    };

    const handleRenameSubmit = () => {
        if (!editingFolder || !editValue.trim()) {
            setEditingFolder(null);
            return;
        }

        const oldFolderName = editingFolder;
        const newFolderName = editValue.trim();

        if (oldFolderName === newFolderName) {
            setEditingFolder(null);
            return;
        }

        const parentPathStr = currentViewPath.join('/');
        const oldPathFull = parentPathStr ? `${parentPathStr}/${oldFolderName}` : oldFolderName;
        const newPathFull = parentPathStr ? `${parentPathStr}/${newFolderName}` : newFolderName;

        setCustomPaths(prev => prev.map(p => {
            if (p === oldPathFull) return newPathFull;
            // Recursive rename for sub-folders
            if (p.startsWith(`${oldPathFull}/`)) {
                return p.replace(oldPathFull, newPathFull);
            }
            return p;
        }));

        setEditingFolder(null);
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
                        className="absolute top-full text-left left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-glass overflow-hidden z-[100] flex flex-col max-h-[280px]"
                    >
                        {/* Header / Breadcrumb */}
                        <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-surface-2/30 text-xs">
                            <div className="flex items-center gap-2 overflow-hidden flex-1">
                                {currentViewPath.length > 0 ? (
                                    <>
                                        <button
                                            onClick={handleBack}
                                            className="p-1 -ml-1 hover:bg-white/10 rounded-md transition-colors text-text-dim hover:text-white flex-shrink-0"
                                        >
                                            <ChevronLeft size={12} />
                                        </button>
                                        <div className="flex items-center gap-1 overflow-hidden">
                                            <span className="text-text-dim cursor-pointer hover:text-white transition-colors flex-shrink-0" onClick={() => setCurrentViewPath([])}>Root</span>
                                            {currentViewPath.map((p, i) => (
                                                <div key={i} className="flex items-center gap-1 shrink-0">
                                                    <ChevronRight size={10} className="text-text-dim/50" />
                                                    <span
                                                        className={`cursor-pointer transition-colors whitespace-nowrap ${i === currentViewPath.length - 1 ? 'text-white font-bold' : 'text-text-dim hover:text-white'}`}
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

                            {/* New Collection Button */}
                            <button
                                onClick={handleCreateCollection}
                                className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wide bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1.5 rounded-md border border-emerald-500/20 shadow-sm"
                            >
                                <Plus size={10} strokeWidth={3} />
                                New Collection
                            </button>
                        </div>

                        {/* Folder List */}
                        <div className="overflow-y-auto p-1 custom-scrollbar flex-1 min-h-[40px]">
                            {currentFolders.length > 0 ? (
                                currentFolders.map(folder => (
                                    <div key={folder} className="relative group/folder">
                                        {editingFolder === folder ? (
                                            <div className="w-full flex items-center px-3 py-2 bg-white/5 rounded-lg border border-primary/30 mx-px">
                                                <Folder size={14} className="text-primary mr-2 flex-shrink-0" />
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={editValue}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleRenameSubmit}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleRenameSubmit();
                                                        if (e.key === 'Escape') setEditingFolder(null);
                                                    }}
                                                    className="bg-transparent border-none outline-none text-white text-sm w-full font-medium"
                                                />
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSelectFolder(folder)}
                                                onDoubleClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRenameStart(folder);
                                                }}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 group transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-2 text-sm text-text-dim group-hover:text-white transition-colors">
                                                    <Folder size={14} className="text-primary/70 group-hover:text-primary transition-colors" />
                                                    <span className="truncate">{folder}</span>
                                                </div>
                                                <ChevronRight size={12} className="text-text-dim/30 group-hover:text-white/50" />
                                            </button>
                                        )}
                                    </div>
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
