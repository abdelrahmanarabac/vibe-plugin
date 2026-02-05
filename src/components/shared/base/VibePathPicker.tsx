import { useState, useRef, useEffect, useMemo } from 'react';
import { Folder, ChevronRight, CornerDownRight, ChevronLeft, Plus, Box, Hash, Type, Info } from 'lucide-react';
import { CollectionContextMenu } from '../CollectionContextMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from './Input';
import { TokenInspector } from '../business/TokenInspector';

// Exported for usage in parent components
export interface TokenPickerItem {
    name: string;
    path: string[];
    fullPath: string;
    type: string;
    value: string | number | { r: number; g: number; b: number; a?: number } | boolean;
}

interface VibePathPickerProps {
    value: string;
    onChange: (value: string) => void;
    size?: 'sm' | 'md' | 'lg';
    placeholder?: string;
    className?: string;
    existingTokens?: TokenPickerItem[];
    existingCollections?: string[]; // Array of collection names (e.g. "Brand", "System")
    onCreateCollection?: (name: string) => Promise<string | null>;
    onRenameCollection?: (oldName: string, newName: string) => void;
    onDeleteCollection?: (name: string) => void;
}

// Utility to build tree from paths
interface FolderNode {
    subFrame: Record<string, FolderNode>;
    tokens: TokenPickerItem[];
}

function buildFolderTree(items: TokenPickerItem[] = [], collections: string[] = []): FolderNode {
    const tree: FolderNode = { subFrame: {}, tokens: [] };
    collections.forEach(col => {
        if (!tree.subFrame[col]) {
            tree.subFrame[col] = { subFrame: {}, tokens: [] };
        }
    });

    items.forEach(item => {
        const parts = item.fullPath.split('/').filter(p => p.trim().length > 0);
        if (parts.length === 0) return;
        const folders = parts.slice(0, -1);
        let current = tree;
        folders.forEach(folder => {
            if (!current.subFrame[folder]) {
                current.subFrame[folder] = { subFrame: {}, tokens: [] };
            }
            current = current.subFrame[folder];
        });
        current.tokens.push(item);
    });
    return tree;
}

const TokenTypeIcon = ({ type, value }: { type: string, value: string | number | { r: number; g: number; b: number; a?: number } | boolean }) => {
    if (type === 'color' || type === 'COLOR') {
        let colorStyle = {};
        if (typeof value === 'string') {
            colorStyle = { backgroundColor: value };
        } else if (typeof value === 'object' && value !== null && 'r' in value) {
            const { r, g, b, a = 1 } = value as { r: number, g: number, b: number, a?: number };
            const to255 = (n: number) => Math.round(n * 255);
            const rVal = r <= 1 ? to255(r) : r;
            const gVal = g <= 1 ? to255(g) : g;
            const bVal = b <= 1 ? to255(b) : b;
            colorStyle = { backgroundColor: `rgba(${rVal}, ${gVal}, ${bVal}, ${a})` };
        }
        return <div className="w-3.5 h-3.5 rounded-full border border-surface-3 shadow-sm flex-shrink-0" style={colorStyle} />;
    }
    if (type === 'number' || type === 'FLOAT' || type === 'dimension') return <Hash size={13} className="text-text-dim flex-shrink-0" />;
    if (type === 'string' || type === 'STRING') return <Type size={13} className="text-text-dim flex-shrink-0" />;
    return <Box size={13} className="text-text-dim flex-shrink-0" />;
};

export function VibePathPicker({ value, onChange, size = 'md', placeholder = 'Select path...', className = '', existingTokens = [], existingCollections = [], onCreateCollection, onRenameCollection, onDeleteCollection }: VibePathPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentViewPath, setCurrentViewPath] = useState<string[]>([]);
    const [customPaths, setCustomPaths] = useState<string[]>([]);
    const [editingFolder, setEditingFolder] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: string } | null>(null);

    // Optimistic UI State
    const [optimisticRenames, setOptimisticRenames] = useState<Record<string, string>>({});
    const [optimisticDeletes, setOptimisticDeletes] = useState<Set<string>>(new Set());

    // Clear optimistic state when source of truth updates (Sync Complete)
    useEffect(() => {
        setOptimisticRenames({});
        setOptimisticDeletes(new Set());
    }, [existingCollections, existingTokens]);

    // Search & Inspection State
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredToken, setHoveredToken] = useState<TokenPickerItem | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Derive Effective Data (Optimistic)
    const effectiveCollections = useMemo(() => {
        return existingCollections
            .filter(c => !optimisticDeletes.has(c) && !optimisticDeletes.has(optimisticRenames[c] || c))
            .map(c => optimisticRenames[c] || c);
    }, [existingCollections, optimisticRenames, optimisticDeletes]);

    const effectiveTokens = useMemo(() => {
        return existingTokens
            .filter(t => {
                const root = t.path[0];
                const actualRoot = optimisticRenames[root] || root;
                return !optimisticDeletes.has(root) && !optimisticDeletes.has(actualRoot);
            })
            .map(t => {
                const root = t.path[0];
                if (optimisticRenames[root]) {
                    const newRoot = optimisticRenames[root];
                    const newPath = [newRoot, ...t.path.slice(1)];
                    return {
                        ...t,
                        path: newPath,
                        fullPath: [newRoot, ...t.path.slice(1), t.name].join('/')
                    };
                }
                return t;
            });
    }, [existingTokens, optimisticRenames, optimisticDeletes]);

    const folderTree = useMemo(() => buildFolderTree(effectiveTokens, effectiveCollections), [effectiveTokens, effectiveCollections]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setEditingFolder(null);
                setContextMenu(null);
                setSearchQuery(''); // Reset search on close
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Derived State: Current View or Search Results
    const viewContent = useMemo(() => {
        // If searching, return flat list of matches
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matches = existingTokens.filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.fullPath.toLowerCase().includes(query)
            );
            return { folders: [], tokens: matches, isSearch: true };
        }

        // Standard Folder Traversal
        let current: FolderNode = folderTree;
        for (const p of currentViewPath) {
            if (current.subFrame[p]) {
                current = current.subFrame[p];
            } else {
                current = { subFrame: {}, tokens: [] };
                break;
            }
        }

        const baseFolders = Object.keys(current.subFrame);
        const baseTokens = current.tokens;
        const currentPathStr = currentViewPath.join('/');
        const relevantCustom = customPaths.filter(p => {
            const parts = p.split('/').filter(Boolean);
            const parentPath = parts.slice(0, -1).join('/');
            if (!currentPathStr) return parts.length === 1;
            return parentPath === currentPathStr;
        }).map(p => {
            const parts = p.split('/').filter(Boolean);
            return parts[parts.length - 1];
        });

        const allFolders = Array.from(new Set([...baseFolders, ...relevantCustom])).sort();
        const allTokens = [...baseTokens].sort((a, b) => a.name.localeCompare(b.name));

        return { folders: allFolders, tokens: allTokens, isSearch: false };
    }, [currentViewPath, folderTree, customPaths, searchQuery, existingTokens]);

    const handleSelectFolder = (folderName: string) => {
        if (editingFolder) return;
        const newPath = [...currentViewPath, folderName];
        setCurrentViewPath(newPath);
        const pathString = newPath.join('/');
        onChange(pathString + '/');
    };

    const handleBack = () => {
        if (editingFolder) return;
        setCurrentViewPath((prev) => prev.slice(0, -1));
    };

    const isRoot = currentViewPath.length === 0;
    const actionLabel = isRoot ? "New Collection" : "Add Group";
    const currentFolderName = isRoot ? 'Collections' : currentViewPath[currentViewPath.length - 1];

    // Optimistic Handlers
    // Optimistic Handlers
    const handleRenameSubmitInternal = async () => {
        if (!editingFolder || !editValue.trim()) { setEditingFolder(null); return; }
        const oldFolderName = editingFolder;
        const newFolderName = editValue.trim();

        // If we are renaming a ROOT collection (Creation or Rename)
        if (currentViewPath.length === 0) {
            const isExisting = existingCollections.includes(oldFolderName) || optimisticRenames[oldFolderName];

            if (isExisting) {
                // RENAME EXISTING
                if (oldFolderName !== newFolderName) {
                    onRenameCollection?.(oldFolderName, newFolderName);
                    setOptimisticRenames(prev => ({ ...prev, [oldFolderName]: newFolderName }));

                    if (value.startsWith(oldFolderName + '/')) {
                        onChange(value.replace(oldFolderName + '/', newFolderName + '/'));
                    }
                }
            } else {
                // CREATE NEW
                // It was a temporary folder (e.g. "New Collection"), now being "named".
                // Trigger Creation.
                if (onCreateCollection) {
                    // Remove the temporary folder from customPaths to avoid duplicates
                    // The backend will send the real collection list via Sync
                    setCustomPaths(prev => prev.filter(p => p !== oldFolderName)); // Clear temp

                    // Call Backend - PURE NAME ONLY (Context Detached)
                    await onCreateCollection(newFolderName);

                    // We rely on the backend Sync to repopulate the list. 
                    // But for immediate feedback, we can add it to optmistic? 
                    // Actually, CreateCollectionCapability now returns the full list quickly.
                    // But to be safe for UI flicker, we can temporarily assume it exists?
                    // Let's rely on the Aggressive Sync of the Capability. 
                    // Just clear the temp folder.
                }
            }
            setEditingFolder(null);
            return;
        }

        // Just a local folder (Group) rename
        if (oldFolderName === newFolderName) { setEditingFolder(null); return; }

        const parentPathStr = currentViewPath.join('/');
        const oldPathFull = parentPathStr ? `${parentPathStr}/${oldFolderName}` : oldFolderName;
        const newPathFull = parentPathStr ? `${parentPathStr}/${newFolderName}` : newFolderName;

        setCustomPaths(prev => prev.map(p => {
            if (p === oldPathFull) return newPathFull;
            if (p.startsWith(`${oldPathFull}/`)) return p.replace(oldPathFull, newPathFull);
            return p;
        }));

        // Update value if selected
        if (value.startsWith(oldPathFull + '/')) {
            onChange(value.replace(oldPathFull, newPathFull));
        }

        setEditingFolder(null);
    };

    const handleDeleteCollectionInternal = (name: string) => {
        // Confirmation dialog
        const confirmed = confirm(`Are you sure you want to delete "${name}" collection?\n\nThis will remove the collection and all its tokens.`);

        if (!confirmed) return;

        if (onDeleteCollection) {
            onDeleteCollection(name);
            setOptimisticDeletes(prev => new Set(prev).add(name));

            // If we are currently inside this collection or selected a token in it, clear selection?
            if (value.startsWith(name + '/')) {
                onChange('');
            }
        }
    };

    // ... (Keep existing handlers: handleCreateCollection, handleRenameStart, handleRenameSubmit, handleContextMenu)
    // I will abbreviate them for brevity in this replace, but in real code they MUST be present.
    // Since I'm using write_to_file, I MUST include them fully.

    const handleCreateCollection = (e: React.MouseEvent) => {
        e.stopPropagation();
        let name = actionLabel;
        let counter = 1;
        const isNameTaken = (n: string) => viewContent.folders.includes(n);
        while (isNameTaken(name)) { counter++; name = `${actionLabel} (${counter})`; }
        const newFolderPath = [...currentViewPath, name].join('/');
        setCustomPaths(prev => [...prev, newFolderPath]);
        setEditingFolder(name);
        setEditValue(name);
    };

    const handleRenameStart = (folder: string) => { setEditingFolder(folder); setEditValue(folder); };


    const handleContextMenu = (e: React.MouseEvent, folder: string) => {
        if (!isRoot) return;
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, target: folder });
    };

    const sizeClasses = { sm: 'h-8 text-xs', md: 'h-11 text-sm', lg: 'h-14 text-base' };

    return (
        <div ref={containerRef} className={`relative group ${className}`}>
            {contextMenu && (
                <CollectionContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onRename={() => { if (contextMenu.target) handleRenameStart(contextMenu.target); setContextMenu(null); }}

                    onDelete={() => { if (contextMenu.target) handleDeleteCollectionInternal(contextMenu.target); setContextMenu(null); }}
                    onClose={() => setContextMenu(null)}
                />
            )}

            {/* Trigger Input */}
            <div
                onClick={() => setIsOpen(true)}
                className={`cursor-text relative flex items-center bg-surface-1 border border-surface-2 rounded-xl transition-all 
                ${isOpen ? 'border-primary/50 ring-1 ring-primary/20' : 'hover:border-surface-3'} 
                ${sizeClasses[size]}`}
            >
                <div className="pl-3 pr-2 text-text-dim">
                    <Folder size={14} className={value ? "text-primary/70" : "text-text-dim"} />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-dim/50 font-mono w-full text-xs"
                    placeholder={placeholder}
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full text-left left-0 right-0 mt-2 bg-surface-0 border border-surface-2 rounded-xl shadow-2xl shadow-black/50 overflow-visible z-[100] flex flex-col max-h-[400px]"
                    >
                        {/* 1. Internal Search Bar */}
                        <div className="p-2 border-b border-white/5 space-y-2">
                            <Input
                                placeholder="Search tokens..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="h-9 text-xs"
                            />
                        </div>

                        {/* 2. Navigation Header (Only if not searching) */}
                        {!searchQuery && (
                            <div className="bg-surface-1/50 border-b border-surface-2 flex flex-col">
                                <div className="flex items-center gap-2 px-3 py-2 text-xs text-text-dim min-h-[36px]">
                                    {!isRoot ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="p-1 -ml-1 hover:bg-surface-2 rounded-md transition-colors text-text-dim hover:text-text-bright flex-shrink-0"
                                            >
                                                <ChevronLeft size={12} />
                                            </button>
                                            <span className="font-medium text-text-primary truncate">{currentFolderName}</span>
                                        </>
                                    ) : (
                                        <span className="text-xxs font-bold uppercase tracking-wider text-text-muted pl-1">Collections</span>
                                    )}
                                </div>
                                <div className="px-3 pb-3 pt-0 w-full">
                                    <button type="button" onClick={handleCreateCollection} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-xxs font-bold uppercase tracking-wide py-2 rounded-lg transition-all shadow-md shadow-primary/10 border border-white/10">
                                        <Plus size={12} strokeWidth={3} />
                                        <span>{actionLabel}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 3. List Content */}
                        <div className="overflow-y-auto p-1 custom-scrollbar flex-1 min-h-[60px]" onMouseLeave={() => setHoveredToken(null)}>
                            {/* Folders */}
                            {viewContent.folders.map(folder => (
                                <div key={folder} className="relative group/folder">
                                    {editingFolder === folder ? (
                                        <div className="w-full flex items-center px-3 py-2 bg-surface-2 rounded-lg border border-primary/30 mx-px mb-0.5">
                                            <Folder size={14} className="text-primary mr-2 flex-shrink-0" />
                                            <input autoFocus type="text" value={editValue} onFocus={(e) => e.target.select()} onChange={(e) => setEditValue(e.target.value)} onBlur={handleRenameSubmitInternal} onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmitInternal(); if (e.key === 'Escape') setEditingFolder(null); }} className="bg-transparent border-none outline-none text-text-primary text-xs w-full font-medium" />
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleSelectFolder(folder)}
                                            onContextMenu={(e) => handleContextMenu(e, folder)}
                                            onDoubleClick={(e) => { e.stopPropagation(); if (isRoot) handleRenameStart(folder); }}
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

                            {/* Tokens */}
                            {viewContent.tokens.map(token => (
                                <div
                                    key={token.fullPath}
                                    onMouseEnter={() => setHoveredToken(token)}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-2 transition-colors mb-0.5 group cursor-default"
                                >
                                    <div className="flex items-center gap-2.5 text-xs text-text-primary">
                                        <TokenTypeIcon type={token.type} value={token.value} />
                                        <span className="truncate font-medium">{token.name}</span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Info size={12} className="text-primary" />
                                    </div>
                                </div>
                            ))}

                            {/* Empty State */}
                            {viewContent.folders.length === 0 && viewContent.tokens.length === 0 && (
                                <div className="px-4 py-8 text-center text-text-muted text-xs flex flex-col items-center gap-2 opacity-60">
                                    <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center mb-1">
                                        <CornerDownRight size={14} className="text-text-dim" />
                                    </div>
                                    <span className="font-medium text-text-dim">No results</span>
                                </div>
                            )}
                        </div>

                        {/* 4. Token Inspector Portal/Panel */}
                        <AnimatePresence>
                            {hoveredToken && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="absolute right-full top-0 mr-2 z-50 pointer-events-none"
                                >
                                    <TokenInspector token={hoveredToken} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
