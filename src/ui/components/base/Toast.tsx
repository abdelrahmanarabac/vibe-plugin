import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

export const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setTimeout(() => setIsVisible(true), 10);

        // Auto-close
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade-out
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'info': return 'i';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return 'var(--success)';
            case 'error': return 'var(--error)';
            case 'info': return 'var(--primary)';
        }
    };

    return (
        <div
            className="vibe-toast"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-8px)',
                borderLeftColor: getColor()
            }}
        >
            <div
                className="vibe-toast-icon"
                style={{ background: getColor() }}
            >
                {getIcon()}
            </div>
            <div className="vibe-toast-message">{message}</div>
            <button
                className="vibe-toast-close"
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
            >
                ✕
            </button>

            <style>{`
        .vibe-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-left: 3px solid;
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
          max-width: 400px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .vibe-toast-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: bold;
          flex-shrink: 0;
        }

        .vibe-toast-message {
          flex: 1;
          font-size: 13px;
          color: var(--text-bright);
          line-height: 1.4;
        }

        .vibe-toast-close {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .vibe-toast-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-bright);
        }
      `}</style>
        </div>
    );
};

// Toast Manager Hook
import { useToasts } from './ToastManager';



export const ToastContainer = () => {
    const { toasts, removeToast } = useToasts();


    return (
        <>
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );
};
