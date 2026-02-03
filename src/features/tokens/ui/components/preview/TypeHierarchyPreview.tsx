import React from 'react';

interface TypeHierarchyPreviewProps {
    fontFamily: string;
    scaleRatio: number;
    baseSize: number;
}

/**
 * 🖋️ TypeHierarchyPreview
 * Premium typography visualization for the Config Wizard.
 * Demonstrates the scale ratio in action across standard labels.
 */
export const TypeHierarchyPreview: React.FC<TypeHierarchyPreviewProps> = ({
    fontFamily,
    scaleRatio,
    baseSize
}) => {
    const stops = [
        { label: 'H1 / Display', scale: Math.pow(scaleRatio, 4) },
        { label: 'H2 / Headline', scale: Math.pow(scaleRatio, 3) },
        { label: 'H3 / Title', scale: Math.pow(scaleRatio, 2) },
        { label: 'H4 / Subtitle', scale: scaleRatio },
        { label: 'Body / Base', scale: 1 },
        { label: 'Caption / Nano', scale: 1 / scaleRatio },
    ];

    return (
        <div className="mt-8 space-y-6 bg-void/30 p-6 rounded-[24px] border border-white/5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80">Typography System</span>
                <span className="text-[10px] font-mono text-text-dim">{fontFamily} @ {scaleRatio.toFixed(3)}x</span>
            </header>

            <div className="space-y-4">
                {stops.map((stop, i) => {
                    const fontSize = Math.round(baseSize * stop.scale);
                    return (
                        <div key={i} className="group relative">
                            <div className="flex items-baseline justify-between mb-1">
                                <span className="text-[9px] font-bold text-text-dim uppercase tracking-tighter opacity-50 group-hover:opacity-100 transition-opacity">
                                    {stop.label}
                                </span>
                                <span className="text-[9px] font-mono text-text-dim opacity-30 group-hover:opacity-80">
                                    {fontSize}px
                                </span>
                            </div>
                            <div
                                style={{
                                    fontFamily: `'${fontFamily}', sans-serif`,
                                    fontSize: `${fontSize}px`,
                                    lineHeight: '1.2'
                                }}
                                className="text-white truncate transition-all duration-300 group-hover:text-primary"
                            >
                                The quick brown fox jumps...
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
