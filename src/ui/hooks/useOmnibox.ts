import { useState, useEffect } from 'react';
import { omnibox, type OmniboxMessage } from '../managers/OmniboxManager';

/**
 * useOmnibox Hook
 * 
 * React adapter for the OmniboxManager singleton.
 */
export const useOmnibox = () => {
    const [message, setMessage] = useState<OmniboxMessage | null>(omnibox.getCurrent());

    useEffect(() => {
        const unsubscribe = omnibox.subscribe((newMessage) => {
            setMessage(newMessage);
        });
        return unsubscribe;
    }, []);

    return {
        message,
        dismiss: () => omnibox.hide()
    };
};
