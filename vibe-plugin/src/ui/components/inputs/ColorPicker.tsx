import { useState } from 'react';
import { ColorPalette } from '../../../features/color/ColorPalette';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    label?: string;
}

export const ColorPicker = ({ value, onChange, label }: ColorPickerProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    const handleInputChange = (newValue: string) => {
        setLocalValue(newValue);
        // Only propagate if valid HEX
        if (/^#[0-9A-F]{6}$/i.test(newValue)) {
            onChange(newValue);
        }
    };

    const handleBlur = () => {
        // Revert to valid value if invalid
        if (!/^#[0-9A-F]{6}$/i.test(localValue)) {
            setLocalValue(value);
        }
    };

    // Generate scale preview
    const scale = ColorPalette.generateScale(value);
    const scaleEntries = Object.entries(scale);

    return (
        <div className="vibe-color-picker">
            {label && <label className="vibe-label">{label}</label>}

            {/* Input Row */}
            <div className="vibe-color-input-row">
                <div
                    className="vibe-color-swatch"
                    style={{ background: value }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    title="Click to expand preview"
                />
                <input
                    type="text"
                    className="vibe-input"
                    value={localValue}
                    onChange={(e) => handleInputChange(e.target.value.toUpperCase())}
                    onBlur={handleBlur}
                    placeholder="#00E5FF"
                    style={{ fontFamily: 'monospace', flex: 1 }}
                    maxLength={7}
                />
                <button
                    className="vibe-btn-icon"
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={isExpanded ? "Collapse" : "Expand preview"}
                >
                    {isExpanded ? '▲' : '▼'}
                </button>
            </div>

            {/* Live Scale Preview */}
            {isExpanded && (
                <div className="vibe-color-scale-preview">
                    <div className="vibe-scale-grid">
                        {scaleEntries.map(([step, hex]) => (
                            <div
                                key={step}
                                className="vibe-scale-item"
                                onClick={() => {
                                    onChange(hex);
                                    setLocalValue(hex);
                                }}
                                title={`${step}: ${hex}`}
                            >
                                <div
                                    className="vibe-scale-swatch"
                                    style={{ background: hex }}
                                />
                                <div className="vibe-scale-label">{step}</div>
                            </div>
                        ))}
                    </div>
                    <p className="vibe-color-hint">
                        Click any shade to use it as your primary color
                    </p>
                </div>
            )}

            <style>{`
        .vibe-color-picker {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .vibe-color-input-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .vibe-color-swatch {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .vibe-color-swatch:hover {
          transform: scale(1.05);
        }

        .vibe-btn-icon {
          width: 48px;
          height: 48px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .vibe-btn-icon:hover {
          background: var(--bg-nebula);
          color: var(--primary);
          border-color: var(--primary);
        }

        .vibe-color-scale-preview {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
          animation: fadeIn 0.3s ease-out;
        }

        .vibe-scale-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
          gap: 8px;
          margin-bottom: 12px;
        }

        .vibe-scale-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
          transition: background 0.2s;
        }

        .vibe-scale-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .vibe-scale-swatch {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .vibe-scale-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-dim);
        }

        .vibe-color-hint {
          font-size: 11px;
          color: var(--text-dim);
          text-align: center;
          margin: 0;
        }
      `}</style>
        </div>
    );
};
