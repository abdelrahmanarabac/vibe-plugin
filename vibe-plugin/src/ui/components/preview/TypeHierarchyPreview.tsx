interface TypeHierarchyPreviewProps {
    fontFamily: string;
    scaleRatio: number;
    baseSize: number;
}

export const TypeHierarchyPreview = ({
    fontFamily,
    scaleRatio,
    baseSize
}: TypeHierarchyPreviewProps) => {

    const calculateSize = (level: number) => {
        return Math.round(baseSize * Math.pow(scaleRatio, level));
    };

    const hierarchy = [
        { name: 'Display', level: 6, weight: 700 },
        { name: 'H1', level: 5, weight: 700 },
        { name: 'H2', level: 4, weight: 700 },
        { name: 'H3', level: 3, weight: 600 },
        { name: 'H4', level: 2, weight: 600 },
        { name: 'H5', level: 1, weight: 600 },
        { name: 'Body', level: 0, weight: 400 },
    ];

    return (
        <div className="vibe-type-preview">
            <div className="vibe-type-preview-header">
                <span className="vibe-label">Live Preview</span>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                    Ratio: {scaleRatio} | Base: {baseSize}px
                </span>
            </div>

            <div className="vibe-type-stack">
                {hierarchy.map((item) => {
                    const size = calculateSize(item.level);
                    return (
                        <div key={item.name} className="vibe-type-item">
                            <div className="vibe-type-meta">
                                <span className="vibe-type-name">{item.name}</span>
                                <span className="vibe-type-size">{size}px</span>
                            </div>
                            <div
                                className="vibe-type-sample"
                                style={{
                                    fontFamily: fontFamily,
                                    fontSize: `${size}px`,
                                    fontWeight: item.weight,
                                    lineHeight: 1.2
                                }}
                            >
                                The quick brown fox
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
        .vibe-type-preview {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-top: 16px;
        }

        .vibe-type-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .vibe-type-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 300px;
          overflow-y: auto;
        }

        .vibe-type-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .vibe-type-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .vibe-type-name {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .vibe-type-size {
          font-size: 10px;
          font-family: monospace;
          color: var(--primary);
        }

        .vibe-type-sample {
          color: var(--text-bright);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
        </div>
    );
};
