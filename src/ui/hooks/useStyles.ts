import { useCallback } from 'react';

export interface StylesViewModel {
    createStyle: (data: { name: string; type: string; value: any }) => void;
}

/**
 * ViewModel for managing Figma Style state and actions.
 */
export function useStyles(): StylesViewModel {
    const createStyle = useCallback((data: { name: string; type: string; value: any }) => {
        parent.postMessage({
            pluginMessage: {
                type: 'CREATE_STYLE',
                payload: data
            }
        }, '*');
    }, []);

    return {
        createStyle
    };
}
