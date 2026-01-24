// src/ui/components/ErrorConsole.tsx
import { useState } from 'react';

interface ErrorConsoleProps {
    error: Error | null;
    onClear: () => void;
}

export const ErrorConsole = ({ error, onClear }: ErrorConsoleProps) => {
    const [copied, setCopied] = useState(false);

    if (!error) return null;

    const errorLog = JSON.stringify({
        message: error.message,
        stack: error.stack,
        time: new Date().toISOString(),
        userAgent: navigator.userAgent
    }, null, 2);

    const handleCopy = () => {
        // Hidden textarea hack for Figma plugin environment where navigator.clipboard might be restricted
        const textArea = document.createElement("textarea");
        textArea.value = errorLog;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="vibe-panel" style={{
            borderColor: 'var(--error)',
            background: 'rgba(239, 68, 68, 0.1)',
            marginTop: '12px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="vibe-label" style={{ color: 'var(--error)' }}>SYSTEM_CRITICAL_FAILURE</label>
                <button
                    onClick={onClear}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
                >
                    ✕
                </button>
            </div>

            <div style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#f87171',
                maxHeight: '80px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                marginBottom: '8px'
            }}>
                {error.message}
            </div>

            <button onClick={handleCopy} className="vibe-btn" style={{
                background: copied ? 'var(--success)' : 'var(--bg-surface)',
                border: '1px solid var(--error)',
                color: copied ? '#fff' : 'var(--error)'
            }}>
                {copied ? "COPIED_TO_CLIPBOARD ✅" : "COPY_DEBUG_LOG 📋"}
            </button>
        </div>
    );
};
