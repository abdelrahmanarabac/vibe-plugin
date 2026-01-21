import { useState, useEffect, useRef } from 'react';
import { Search, Command, Zap, AlertCircle } from 'lucide-react';

interface OmniboxProps {
    onSearch: (query: string) => void;
    onCommand: (query: string) => void;
    isLoading?: boolean;
}

export const Omnibox = ({ onSearch, onCommand, isLoading }: OmniboxProps) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Global Shortcut Handler: Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        onSearch(val);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            onCommand(query);
            setQuery(''); // Reset after command
        }
    };

    return (
        <div className={`relative w-full max-w-md transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
            <div className={`
                absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors
                ${isFocused ? 'text-primary' : 'text-text-muted'}
            `}>
                {isLoading ? (
                    <Zap size={14} className="animate-pulse text-warning" />
                ) : (
                    <Search size={14} />
                )}
            </div>

            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search tokens or 'Make it soft'..."
                className={`
                    w-full bg-surface-1 border-2 py-1.5 pl-9 pr-12 rounded-lg text-xs outline-none transition-all
                    placeholder:text-text-muted text-text-primary
                    ${isFocused
                        ? 'border-primary/50 bg-surface-active shadow-glow-primary'
                        : 'border-transparent bg-surface-1 hover:bg-surface-active'}
                `}
            />

            <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
                {query.length > 0 && !isLoading && (
                    <button
                        onClick={() => { setQuery(''); onSearch(''); }}
                        className="p-0.5 hover:bg-surface-0 rounded text-text-muted"
                    >
                        <AlertCircle size={10} />
                    </button>
                )}
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-0 border border-surface-active">
                    <Command size={10} className="text-text-muted" />
                    <span className="text-[10px] font-bold text-text-muted">K</span>
                </div>
            </div>
        </div>
    );
};
