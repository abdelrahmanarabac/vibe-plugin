interface SuccessScreenProps {
    onCreateAnother: () => void;
}

export const SuccessScreen = ({ onCreateAnother }: SuccessScreenProps) => {
    return (
        <div className="vibe-success-container">
            <div className="vibe-success-content">
                {/* Success Icon */}
                <div className="vibe-success-icon">
                    <div className="vibe-success-checkmark">✓</div>
                </div>

                {/* Title */}
                <h1 className="vibe-success-title">
                    System Generated Successfully!
                </h1>

                {/* Stats */}
                <div className="vibe-success-stats">
                    <div className="vibe-stat-card">
                        <div className="vibe-stat-value">95</div>
                        <div className="vibe-stat-label">Variables</div>
                    </div>
                    <div className="vibe-stat-card">
                        <div className="vibe-stat-value">9</div>
                        <div className="vibe-stat-label">Text Styles</div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="vibe-success-instructions">
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
                        Next Steps:
                    </h3>
                    <div className="vibe-instruction-step">
                        <span className="vibe-instruction-number">1</span>
                        <span>Open Variables panel (⌘ + /)</span>
                    </div>
                    <div className="vibe-instruction-step">
                        <span className="vibe-instruction-number">2</span>
                        <span>Find "Vibe Tokens" collection</span>
                    </div>
                    <div className="vibe-instruction-step">
                        <span className="vibe-instruction-number">3</span>
                        <span>Start designing!</span>
                    </div>
                </div>

                {/* Actions */}
                <button
                    className="vibe-btn vibe-btn-primary"
                    onClick={onCreateAnother}
                    style={{ marginTop: '24px' }}
                >
                    Create Another System
                </button>
            </div>

            <style>{`
        .vibe-success-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 32px 24px;
        }

        .vibe-success-content {
          text-align: center;
          max-width: 400px;
        }

        .vibe-success-icon {
          margin-bottom: 24px;
        }

        .vibe-success-checkmark {
          width: 80px;
          height: 80px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          background: var(--success);
          border-radius: 50%;
          color: white;
          box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
          animation: success-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes success-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .vibe-success-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 24px 0;
        }

        .vibe-success-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          justify-content: center;
        }

        .vibe-stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px 24px;
          min-width: 120px;
        }

        .vibe-stat-value {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          background: var(--aurora-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .vibe-stat-label {
          font-size: 12px;
          color: var(--text-dim);
          margin-top: 4px;
        }

        .vibe-success-instructions {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 20px;
          text-align: left;
        }

        .vibe-instruction-step {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 13px;
        }

        .vibe-instruction-step:last-child {
          margin-bottom: 0;
        }

        .vibe-instruction-number {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 600;
          flex-shrink: 0;
        }
      `}</style>
        </div>
    );
};
