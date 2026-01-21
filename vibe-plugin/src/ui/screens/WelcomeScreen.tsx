import { useState, useEffect } from 'react';

interface WelcomeScreenProps {
    onContinue: () => void;
    onSkipForever: () => void;
}

export const WelcomeScreen = ({ onContinue, onSkipForever }: WelcomeScreenProps) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger fade-in animation
        setTimeout(() => setIsVisible(true), 50);
    }, []);

    const handleContinue = () => {
        if (dontShowAgain) {
            onSkipForever();
        } else {
            onContinue();
        }
    };

    return (
        <div
            className="vibe-welcome-screen"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <div className="vibe-welcome-content">
                {/* Logo/Icon */}
                <div className="vibe-welcome-icon">
                    <div className="vibe-welcome-icon-inner">⚡</div>
                </div>

                {/* Heading */}
                <h1 className="vibe-welcome-heading">
                    Welcome to <span className="vibe-gradient-text">Vibe Tokens</span>
                </h1>

                {/* Subtitle */}
                <p className="vibe-welcome-subtitle">
                    Professional Design Systems in Minutes
                </p>

                {/* Features */}
                <div className="vibe-welcome-features">
                    <div className="vibe-welcome-feature">
                        <span className="vibe-feature-icon">✓</span>
                        <span>Auto-generate Design Tokens</span>
                    </div>
                    <div className="vibe-welcome-feature">
                        <span className="vibe-feature-icon">✓</span>
                        <span>Live preview before apply</span>
                    </div>
                    <div className="vibe-welcome-feature">
                        <span className="vibe-feature-icon">✓</span>
                        <span>Compatible with Figma Variables</span>
                    </div>
                </div>

                {/* CTA */}
                <button
                    className="vibe-btn vibe-btn-primary"
                    onClick={handleContinue}
                    style={{ marginTop: '24px' }}
                >
                    Get Started →
                </button>

                {/* Checkbox */}
                <label className="vibe-welcome-checkbox">
                    <input
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                    />
                    <span>Don't show this again</span>
                </label>
            </div>

            <style>{`
        .vibe-welcome-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 32px 24px;
          background: radial-gradient(circle at top center, rgba(0, 229, 255, 0.1), transparent 60%);
        }

        .vibe-welcome-content {
          text-align: center;
          max-width: 360px;
        }

        .vibe-welcome-icon {
          margin-bottom: 24px;
        }

        .vibe-welcome-icon-inner {
          width: 72px;
          height: 72px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          background: var(--aurora-gradient);
          border-radius: 50%;
          box-shadow: 0 8px 24px var(--glow-primary);
          animation: pulse-ring 3s infinite;
        }

        .vibe-welcome-heading {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .vibe-gradient-text {
          background: var(--aurora-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .vibe-welcome-subtitle {
          color: var(--text-dim);
          font-size: 14px;
          margin-bottom: 32px;
        }

        .vibe-welcome-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
          margin-bottom: 8px;
        }

        .vibe-welcome-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: var(--text-bright);
        }

        .vibe-feature-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 229, 255, 0.1);
          border-radius: 4px;
          color: var(--primary);
          font-weight: 600;
          font-size: 12px;
        }

        .vibe-welcome-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          font-size: 12px;
          color: var(--text-dim);
          cursor: pointer;
          user-select: none;
        }

        .vibe-welcome-checkbox input[type="checkbox"] {
          cursor: pointer;
        }
      `}</style>
        </div>
    );
};
