import { generateUUID } from '../../shared/lib/uuid';

export type OmniboxType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface OmniboxMessage {
    id: string;
    message: string;
    type: OmniboxType;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

type OmniboxListener = (message: OmniboxMessage | null) => void;

/**
 * OmniboxManager (Singleton)
 * 
 * Centralized state management for the system Omnibox.
 * Decoupled from React to allow usage from non-UI capabilities (like logic layers).
 * 
 * Design: "One omnibox component only" - strict singleton state.
 */
class OmniboxManager {
    private currentMessage: OmniboxMessage | null = null;
    private listeners: Set<OmniboxListener> = new Set();
    private defaultDuration = 4000;
    private timer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Shows a message in the Omnibox.
     * Replaces any existing message immediately.
     */
    public show(message: string, options: {
        type?: OmniboxType;
        duration?: number;
        action?: { label: string; onClick: () => void }
    } = {}) {
        this.clearTimer();

        this.currentMessage = {
            id: generateUUID(),
            message,
            type: options.type || 'info',
            duration: options.duration || this.defaultDuration,
            action: options.action
        };

        this.notifyListeners();

        // Safety Mechanism: If loading, set a "Dead Man's Switch" to prevent hanging UI
        if (this.currentMessage.type === 'loading') {
            this.timer = setTimeout(() => {
                // If still loading after 8 seconds, assume failure/deadlock
                if (this.currentMessage?.type === 'loading') {
                    this.show('Operation likely timed out', { type: 'error' });
                }
            }, 8000); // 8 seconds max wait
        }
        // Normal auto-dismiss for non-loading messages
        else if ((this.currentMessage.duration || 0) > 0) {
            this.timer = setTimeout(() => {
                this.hide();
            }, this.currentMessage.duration);
        }
    }

    /**
     * Hides the current message.
     */
    public hide() {
        this.clearTimer();
        this.currentMessage = null;
        this.notifyListeners();
    }

    /**
     * Subscribes to state changes.
     * Returns an unsubscribe function.
     */
    public subscribe(listener: OmniboxListener): () => void {
        this.listeners.add(listener);
        // Initial state
        listener(this.currentMessage);

        return () => {
            this.listeners.delete(listener);
        };
    }

    public getCurrent(): OmniboxMessage | null {
        return this.currentMessage;
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.currentMessage));
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}

export const omnibox = new OmniboxManager();
