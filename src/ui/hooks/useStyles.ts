import { useCallback } from 'react';

export interface StylesViewModel {
    createStyle: (data: { name: string; type: string; value: string | number | { r: number; g: number; b: number; a?: number } }) => void;
}

/**
 * ViewModel for managing Figma Style state and actions.
 */
export function useStyles(): StylesViewModel {
    const createStyle = useCallback((data: { name: string; type: string; value: string | number | { r: number; g: number; b: number; a?: number } }) => {
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
