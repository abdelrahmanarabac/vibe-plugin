import { useState, useRef, useEffect, useMemo } from 'react';
import { Folder, ChevronRight, CornerDownRight, ChevronLeft, Plus, Box } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface VibePathPickerProps {
    value: string;
    onChange: (value: string) => void;
    size?: 'sm' | 'md' | 'lg';
    placeholder?: string;
    className?: string;
    existingTokens?: string[]; // Array of full token names (e.g. "brand/colors/primary")
    onCreateCollection?: (name: string) => void;
}

// Utility to build tree from paths
interface FolderNode {
    subFrame: Record<string, FolderNode>;
    tokens: string[]; // Names of tokens in this specific folder
}

function buildFolderTree(paths: string[] = []): FolderNode {
    // Root node
    const tree: FolderNode = { subFrame: {}, tokens: [] };

    paths.forEach(path => {
        // Fix: Ensure we handle paths that start with '/' or have empty parts
        const parts = path.split('/').filter(p => p.trim().length > 0);

        // If path has no parts (empty string), skip
        if (parts.length === 0) return;

        // The last part is the Token Name
        const tokenName = parts[parts.length - 1];
        const folders = parts.slice(0, -1);

        let current = tree;
        folders.forEach(folder => {
            if (!current.subFrame[folder]) {
                current.subFrame[folder] = { subFrame: {}, tokens: [] };
            }
            current = current.subFrame[folder];
        });

        // Add token to the leaf folder
        current.tokens.push(tokenName);
    });

    return tree;
}

export function VibePathPicker({ value, onChange, size = 'md', placeholder = 'Select path...', className = '', existingTokens = [], onCreateCollection }: VibePathPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentViewPath, setCurrentViewPath] = useState<string[]>([]);
    const [customPaths, setCustomPaths] = useState<string[]>([]);
    const [editingFolder, setEditingFolder] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Build tree from fully qualified token names
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

    // Get contents (folders and tokens) at current view path
    const currentContents = useMemo(() => {
        let current: FolderNode = folderTree;

        // Traverse to current depth
        for (const p of currentViewPath) {
            if (current.subFrame[p]) {
                current = current.subFrame[p];
            } else {
                // If path doesn't exist in tree (might be new custom path), we effectively start blank
                // But we need to check if there are custom paths that branch from here
                current = { subFrame: {}, tokens: [] };
                break;
            }
        }

        const baseFolders = Object.keys(current.subFrame);
        const baseTokens = current.tokens;

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

        // Merge folders (base + custom)
        const allFolders = Array.from(new Set([...baseFolders, ...relevantCustom])).sort();
        const allTokens = [...baseTokens].sort();

        return { folders: allFolders, tokens: allTokens };
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

    const isRoot = currentViewPath.length === 0;
    const actionLabel = isRoot ? "New Collection" : "Add Group";

    const handleCreateCollection = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Generate default name
        let name = actionLabel;
        let counter = 1;

        const isNameTaken = (n: string) => currentContents.folders.includes(n);

        while (isNameTaken(name)) {
            counter++;
            name = `${actionLabel} (${counter})`;
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

        // Trigger Sync if Root Level
        if (onCreateCollection && currentViewPath.length === 0) {
            onCreateCollection(newFolderName);
        }

        setEditingFolder(null);
    };

    const sizeClasses = {
        sm: 'h-8 text-xs',
        md: 'h-10 text-xs',
        lg: 'h-12 text-base'
    };

    const currentFolderName = isRoot ? 'Collections' : currentViewPath[currentViewPath.length - 1];

    return (
        <div ref={containerRef} className={`relative group ${className}`}>
            {/* Main Input Container */}
            <div
                onClick={() => setIsOpen(true)}
                className={`cursor-text relative flex items-center bg-surface-1 border border-surface-2/50 rounded-lg transition-all 
                ${isOpen ? 'border-primary/50 ring-1 ring-primary/20' : 'hover:border-surface-3'} 
                ${sizeClasses[size]}`}
            >
                {/* Prefix / Icon */}
                <div className="pl-3 pr-2 text-text-dim">
                    <Folder size={14} className={value ? "text-primary/70" : "text-text-dim"} />
                </div>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-dim/50 font-mono w-full text-[11px]"
                    placeholder={placeholder}
                />

                {/* Right Actions */}
                <div className="pr-2 flex items-center gap-1">
                    {value && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('');
                                setCurrentViewPath([]);
                            }}
                            className="p-1 hover:text-text-bright text-text-dim transition-colors"
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
                        className="absolute top-full text-left left-0 right-0 mt-2 bg-surface-0 border border-surface-2 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-[100] flex flex-col max-h-[320px]"
                    >
                        {/* Header Area */}
                        <div className="bg-surface-1/50 border-b border-surface-2 flex flex-col">
                            {/* Navigation Top Bar - Sits above the action */}
                            <div className="flex items-center gap-2 px-3 py-2 text-xs text-text-dim min-h-[36px]">
                                {!isRoot ? (
                                    <>
                                        <button
                                            onClick={handleBack}
                                            className="p-1 -ml-1 hover:bg-surface-2 rounded-md transition-colors text-text-dim hover:text-text-bright flex-shrink-0"
                                        >
                                            <ChevronLeft size={12} />
                                        </button>
                                        <span className="font-medium text-text-primary truncate">{currentFolderName}</span>
                                    </>
                                ) : (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted pl-1">
                                        Collections
                                    </span>
                                )}
                            </div>

                            {/* Primary Action Button - Centered and Prominent */}
                            <div className="px-3 pb-3 pt-0 w-full">
                                <button
                                    onClick={handleCreateCollection}
                                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-[11px] font-bold uppercase tracking-wide py-2 rounded-lg transition-all shadow-md shadow-primary/10 border border-white/10"
                                >
                                    <Plus size={12} strokeWidth={3} />
                                    <span>{actionLabel}</span>
                                </button>
                            </div>
                        </div>

                        {/* List Content */}
                        <div className="overflow-y-auto p-1 custom-scrollbar flex-1 min-h-[60px]">
                            {/* Folders Section */}
                            {currentContents.folders.map(folder => (
                                <div key={folder} className="relative group/folder">
                                    {editingFolder === folder ? (
                                        <div className="w-full flex items-center px-3 py-2 bg-surface-2 rounded-lg border border-primary/30 mx-px mb-0.5">
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
                                                className="bg-transparent border-none outline-none text-text-primary text-xs w-full font-medium"
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
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-2 group transition-colors text-left mb-0.5"
                                        >
                                            <div className="flex items-center gap-2.5 text-xs text-text-dim group-hover:text-text-primary transition-colors">
                                                <Folder size={14} className="text-primary/60 group-hover:text-primary transition-colors fill-primary/10" />
                                                <span className="truncate">{folder}</span>
                                            </div>
                                            <ChevronRight size={12} className="text-text-dim/30 group-hover:text-text-bright/50" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Tokens Section - Visual Only for Context */}
                            {currentContents.tokens.map(token => (
                                <div key={token} className="w-full flex items-center px-3 py-2 rounded-lg opacity-60 hover:opacity-100 transition-opacity mb-0.5 select-none pointer-events-none">
                                    <div className="flex items-center gap-2.5 text-xs text-text-muted">
                                        <Box size={14} className="text-text-dim/50" />
                                        <span className="truncate">{token}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Empty State */}
                            {currentContents.folders.length === 0 && currentContents.tokens.length === 0 && (
                                <div className="px-4 py-8 text-center text-text-muted text-xs flex flex-col items-center gap-2 opacity-60">
                                    <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center mb-1">
                                        <CornerDownRight size={14} className="text-text-dim" />
                                    </div>
                                    <span className="font-medium text-text-dim">Empty {isRoot ? 'Collection' : 'Folder'}</span>
                                    <span className="text-[10px] text-text-muted">Add a group or item</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
