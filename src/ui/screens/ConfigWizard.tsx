import { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { VibeColorPicker } from '../components/ColorPicker';
import { TypeHierarchyPreview } from '../components/preview/TypeHierarchyPreview';

interface ConfigWizardProps {
    onComplete: () => void;
}

export const ConfigWizard = ({ onComplete }: ConfigWizardProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const { config, updateConfig } = useConfig();

    const totalSteps = 3;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return 'Define Your Brand';
            case 2: return 'Typography System';
            case 3: return 'Review & Generate';
            default: return '';
        }
    };

    return (
        <div className="vibe-wizard-container">
            {/* Header */}
            <div className="vibe-wizard-header">
                <h2 className="vibe-wizard-title">{getStepTitle()}</h2>
                <div className="vibe-wizard-step-indicator">
                    {Array.from({ length: totalSteps }, (_, i) => (
                        <div key={i} className="vibe-wizard-step-container">
                            <div
                                className={`vibe-wizard-step ${i + 1 <= currentStep ? 'active' : ''}`}
                            >
                                {i + 1}
                            </div>
                            {i < totalSteps - 1 && (
                                <div className={`vibe-wizard-connector ${i + 1 < currentStep ? 'active' : ''}`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="vibe-wizard-content">
                {currentStep === 1 && (
                    <div className="vibe-wizard-step-content">
                        <div className="vibe-input-group">
                            <label className="vibe-label">System Name</label>
                            <input
                                type="text"
                                className="vibe-input"
                                value={config.metadata.name}
                                onChange={(e) => updateConfig({
                                    metadata: { ...config.metadata, name: e.target.value }
                                })}
                                placeholder="e.g., Acme Design System"
                            />
                        </div>

                        <div className="vibe-input-group" style={{ marginTop: '20px' }}>
                            <VibeColorPicker
                                value={config.brand.primaryColor}
                                onChange={(color) => updateConfig({
                                    brand: { ...config.brand, primaryColor: color }
                                })}
                            />
                            <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '8px' }}>
                                This will generate a full 50-950 color scale
                            </p>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="vibe-wizard-step-content">
                        <div className="vibe-input-group">
                            <label className="vibe-label">Font Family</label>
                            <select
                                className="vibe-input"
                                value={config.typography.fontFamily}
                                onChange={(e) => updateConfig({
                                    typography: { ...config.typography, fontFamily: e.target.value }
                                })}
                            >
                                <option value="Inter">Inter</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Poppins">Poppins</option>
                                <option value="Outfit">Outfit</option>
                            </select>
                        </div>

                        <div className="vibe-input-group" style={{ marginTop: '20px' }}>
                            <label className="vibe-label">Type Scale Ratio</label>
                            <input
                                type="range"
                                min="1.125"
                                max="1.5"
                                step="0.025"
                                value={config.typography.scaleRatio}
                                onChange={(e) => updateConfig({
                                    typography: { ...config.typography, scaleRatio: parseFloat(e.target.value) }
                                })}
                                style={{ width: '100%' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Compact</span>
                                <span style={{ fontSize: '11px', color: 'var(--primary)' }}>{config.typography.scaleRatio.toFixed(3)}</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Spacious</span>
                            </div>
                        </div>

                        <div className="vibe-input-group" style={{ marginTop: '20px' }}>
                            <label className="vibe-label">Base Size (px)</label>
                            <input
                                type="number"
                                className="vibe-input"
                                value={config.typography.baseSize}
                                onChange={(e) => updateConfig({
                                    typography: { ...config.typography, baseSize: parseInt(e.target.value) || 16 }
                                })}
                                min="12"
                                max="20"
                            />
                        </div>

                        <TypeHierarchyPreview
                            fontFamily={config.typography.fontFamily}
                            scaleRatio={config.typography.scaleRatio}
                            baseSize={config.typography.baseSize}
                        />
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="vibe-wizard-step-content">
                        <div className="vibe-panel" style={{ padding: '16px' }}>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600 }}>
                                Ready to Generate
                            </h3>
                            <div style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                                <p style={{ margin: '0 0 8px 0' }}>
                                    <strong style={{ color: 'var(--text-bright)' }}>System:</strong> {config.metadata.name}
                                </p>
                                <p style={{ margin: '0 0 8px 0' }}>
                                    <strong style={{ color: 'var(--text-bright)' }}>Primary Color:</strong>{' '}
                                    <span style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>
                                        {config.brand.primaryColor}
                                    </span>
                                </p>
                                <p style={{ margin: '0 0 8px 0' }}>
                                    <strong style={{ color: 'var(--text-bright)' }}>Font:</strong> {config.typography.fontFamily}
                                </p>
                                <p style={{ margin: '0' }}>
                                    <strong style={{ color: 'var(--text-bright)' }}>Scale:</strong> {config.typography.scaleRatio} ({config.typography.baseSize}px base)
                                </p>
                            </div>
                        </div>

                        <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '16px', textAlign: 'center' }}>
                            This will create ~95 variables and 9 text styles
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="vibe-wizard-footer">
                {currentStep > 1 && (
                    <button
                        className="vibe-btn"
                        onClick={handleBack}
                        style={{ background: 'var(--bg-card)' }}
                    >
                        ← Back
                    </button>
                )}
                <button
                    className="vibe-btn vibe-btn-primary"
                    onClick={handleNext}
                    style={currentStep > 1 ? {} : { marginLeft: 'auto' }}
                >
                    {currentStep < totalSteps ? 'Next →' : 'Generate System ⚡'}
                </button>
            </div>

            <style>{`
        .vibe-wizard-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 20px;
          gap: 20px;
        }

        .vibe-wizard-header {
          flex-shrink: 0;
        }

        .vibe-wizard-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .vibe-wizard-step-indicator {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .vibe-wizard-step-container {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .vibe-wizard-step {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-card);
          border: 2px solid var(--border-subtle);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-dim);
          transition: all 0.3s;
          flex-shrink: 0;
        }

        .vibe-wizard-step.active {
          background: var(--aurora-gradient);
          border-color: transparent;
          color: white;
          box-shadow: 0 0 16px var(--glow-primary);
        }

        .vibe-wizard-connector {
          flex: 1;
          height: 2px;
          background: var(--border-subtle);
          transition: all 0.3s;
        }

        .vibe-wizard-connector.active {
          background: var(--primary);
        }

        .vibe-wizard-content {
          flex: 1;
          overflow-y: auto;
          padding-right: 4px;
        }

        .vibe-wizard-step-content {
          animation: fadeIn 0.3s ease-out;
        }

        .vibe-wizard-footer {
          flex-shrink: 0;
          display: flex;
          gap: 12px;
        }
      `}</style>
        </div>
    );
};
