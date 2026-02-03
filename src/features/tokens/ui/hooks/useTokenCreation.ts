import { useState, useEffect } from 'react';
import { vibeColor, type NamingResult } from '../../../../features/perception/capabilities/naming/ColorNamer';
import type { TokenType, ColorScope } from '../../domain/ui-types';

export function useTokenCreation(isOpen: boolean) {
    // Core State
    const [name, setName] = useState('');
    const [type, setType] = useState<TokenType>('color');
    const [value, setValue] = useState<string | { mobile: string, tablet: string, desktop: string }>('#6E62E5');
    const [activeModes, setActiveModes] = useState<('mobile' | 'tablet' | 'desktop')[]>(['mobile', 'tablet', 'desktop']);
    const [ratio, setRatio] = useState('1.5');

    // Namer State
    const [isAutoNaming, setIsAutoNaming] = useState(false);
    const [namingResult, setNamingResult] = useState<NamingResult | null>(null);

    // Color Context
    const [colorScope, setColorScope] = useState<ColorScope>('single');
    const [customRange, setCustomRange] = useState<[number, number]>([100, 400]);

    // Initialize Color Engine
    useEffect(() => {
        if (isOpen) vibeColor.init();
    }, [isOpen]);

    // Logic: Auto-Naming using Perception Module
    const handleAutoName = async () => {
        setIsAutoNaming(true);

        if (type === 'color' && !vibeColor.isReady()) {
            await vibeColor.init();
        }

        setTimeout(() => {
            if (type === 'color' && typeof value === 'string') {
                const result = vibeColor.fullResult(value);
                setName(result.name === 'unknown' ? 'custom-color' : result.name.replace('~', ''));
                setNamingResult(result);
            } else if (['spacing', 'sizing', 'radius'].includes(type)) {
                setName(`${type}-responsive`);
            }
            setIsAutoNaming(false);
        }, 300);
    };

    // Logic: Type Switching Defaults
    const handleTypeChange = (newType: string) => {
        const t = newType as TokenType;
        setType(t);

        if (t === 'color') {
            setValue('#6E62E5');
        } else if (['spacing', 'sizing', 'radius'].includes(t)) {
            setValue({ mobile: '4', tablet: '8', desktop: '12' });
        } else {
            setValue('');
        }
    };

    // Logic: Prepare Submission Data
    const getSubmissionData = () => {
        let finalName = name;

        // Clean scale names (e.g., "blue-500" -> "blue" for scales)
        if (type === 'color' && colorScope.startsWith('scale')) {
            finalName = finalName.replace(/[-_ ]?\d+$/, '');
        }

        return {
            name: finalName,
            type,
            value,
            extensions: {
                scope: type === 'color' ? colorScope : undefined,
                range: (type === 'color' && colorScope === 'scale-custom') ? customRange : undefined,
                ratio: ['spacing', 'sizing', 'radius'].includes(type) ? ratio : undefined
            }
        };
    };

    const resetForm = () => {
        setName('');
        setValue('#6E62E5');
        setType('color');
        setNamingResult(null);
    };

    return {
        formState: {
            name,
            type,
            value,
            activeModes,
            ratio,
            colorScope,
            customRange,
            namingResult,
            isAutoNaming
        },
        setters: {
            setName,
            setType: handleTypeChange, // Use wrapper
            setValue,
            setActiveModes,
            setRatio,
            setColorScope,
            setCustomRange,
            setNamingResult
        },
        actions: {
            handleAutoName,
            getSubmissionData,
            resetForm
        }
    };
}
